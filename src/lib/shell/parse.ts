/**
 * Turns a command line into something the shell can run.
 *
 * Follows bash's rules for the parts the course teaches: 'single' and "double"
 * quotes, backslash escapes, $VARIABLES, ~, wildcards, pipes, redirection,
 * `&&` and `;`. Quoting is tracked so `echo "*.txt"` stays literal while
 * `echo *.txt` expands.
 */

/** A run of characters with one kind of quoting. */
export interface WordPart {
  text: string;
  /** 'literal' covers single quotes and backslash-escaped characters: no expansion at all. */
  quote: 'none' | 'double' | 'literal';
}

export interface WordToken {
  type: 'word';
  parts: WordPart[];
  /** Starts with an unquoted `~`. */
  tilde: boolean;
  /** Any part of it was quoted (quoted words are never alias-expanded). */
  quoted: boolean;
}

export type Operator = '|' | '>' | '>>' | '<' | '&&' | ';';
export interface OpToken {
  type: 'op';
  op: Operator;
}
export type Token = WordToken | OpToken;

export interface Redirect {
  op: '>' | '>>' | '<';
  target: WordToken;
}

export interface SimpleCommand {
  words: WordToken[];
  redirects: Redirect[];
}

export interface ListItem {
  pipeline: SimpleCommand[];
  /** How this pipeline connects to the next: run it only on success, or regardless. */
  then: '&&' | ';' | null;
}

export class ParseError extends Error {}

/**
 * Split a line into words and operators. Variables are *not* expanded here:
 * like bash, they're expanded as each command runs, so `NAME=x && echo $NAME`
 * sees the new value.
 */
export function lex(line: string): Token[] {
  const tokens: Token[] = [];
  let word: WordToken | null = null;

  const current = (): WordToken => (word ??= { type: 'word', parts: [], tilde: false, quoted: false });
  const push = (text: string, quote: WordPart['quote']) => {
    const w = current();
    const last = w.parts[w.parts.length - 1];
    if (last && last.quote === quote) last.text += text;
    else w.parts.push({ text, quote });
    if (quote !== 'none') w.quoted = true;
  };
  const endWord = () => {
    if (word) tokens.push(word);
    word = null;
  };

  let i = 0;
  while (i < line.length) {
    const ch = line[i];

    if (ch === ' ' || ch === '\t') {
      endWord();
      i++;
    } else if (ch === '#' && !word) {
      break; // a comment runs to the end of the line
    } else if (ch === "'") {
      const close = line.indexOf("'", i + 1);
      if (close === -1) throw new ParseError("bash: unexpected EOF while looking for matching `''");
      push(line.slice(i + 1, close), 'literal');
      if (close === i + 1) current().quoted = true; // '' is still a word
      i = close + 1;
    } else if (ch === '"') {
      current().quoted = true;
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\' && '"\\$`'.includes(line[i + 1] ?? '')) {
          push(line[i + 1], 'literal');
          i += 2;
        } else {
          push(line[i], 'double');
          i++;
        }
      }
      if (i >= line.length) throw new ParseError('bash: unexpected EOF while looking for matching `"\'');
      i++;
    } else if (ch === '\\') {
      if (i + 1 < line.length) push(line[i + 1], 'literal');
      i += 2;
    } else if (ch === '~' && !word) {
      current().tilde = line[i + 1] === undefined || line[i + 1] === '/' || line[i + 1] === ' ';
      push('~', 'none');
      i++;
    } else if (ch === '&' && line[i + 1] === '&') {
      endWord();
      tokens.push({ type: 'op', op: '&&' });
      i += 2;
    } else if (ch === '|' && line[i + 1] === '|') {
      throw new ParseError('The practice terminal supports && and ; but not ||.');
    } else if (ch === '|' || ch === ';' || ch === '<') {
      endWord();
      tokens.push({ type: 'op', op: ch as Operator });
      i++;
    } else if (ch === '>') {
      endWord();
      if (line[i + 1] === '>') {
        tokens.push({ type: 'op', op: '>>' });
        i += 2;
      } else {
        tokens.push({ type: 'op', op: '>' });
        i++;
      }
    } else if (ch === '&') {
      throw new ParseError('Running commands in the background with & isn’t available in the practice terminal.');
    } else {
      push(ch, 'none');
      i++;
    }
  }
  endWord();
  return tokens;
}

/**
 * Expand $VARIABLES in a word, as the command is about to run. Returns the
 * final text, plus a glob pattern in which only *unquoted* `*`, `?` and `[`
 * are live — quoted ones, and anything that came from a variable, are escaped.
 */
export function expandWord(word: WordToken, lookup: (name: string) => string): { text: string; pattern: string; glob: boolean } {
  let text = '';
  let pattern = '';
  let glob = false;
  const literal = (s: string) => {
    text += s;
    pattern += s.replace(/[*?[\]\\]/g, '\\$&');
  };

  for (const part of word.parts) {
    if (part.quote === 'literal') {
      literal(part.text);
      continue;
    }
    let i = 0;
    while (i < part.text.length) {
      const ch = part.text[i];
      if (ch === '$') {
        const rest = part.text.slice(i + 1);
        const braced = /^\{([^}]*)\}/.exec(rest);
        const named = /^([A-Za-z_][A-Za-z0-9_]*|\?|\$)/.exec(rest);
        if (braced) {
          literal(lookup(braced[1]));
          i += 1 + braced[0].length;
          continue;
        }
        if (named) {
          literal(lookup(named[1]));
          i += 1 + named[0].length;
          continue;
        }
      }
      if (part.quote === 'none' && '*?['.includes(ch)) {
        text += ch;
        pattern += ch;
        glob = true;
      } else if (part.quote === 'none' && ch === ']') {
        text += ch;
        pattern += ch;
      } else {
        literal(ch);
      }
      i++;
    }
  }
  return { text, pattern, glob };
}

/** Group tokens into pipelines and lists, with bash's syntax errors. */
export function parse(tokens: Token[]): ListItem[] {
  const items: ListItem[] = [];
  let pipeline: SimpleCommand[] = [];
  let cmd: SimpleCommand = { words: [], redirects: [] };

  const unexpected = (op: string) => new ParseError(`bash: syntax error near unexpected token \`${op}'`);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'word') {
      cmd.words.push(token);
      continue;
    }
    if (token.op === '>' || token.op === '>>' || token.op === '<') {
      const target = tokens[i + 1];
      if (!target || target.type !== 'word') throw unexpected(target?.type === 'op' ? target.op : 'newline');
      cmd.redirects.push({ op: token.op, target });
      i++;
      continue;
    }
    // | && ;
    if (!cmd.words.length) throw unexpected(token.op);
    pipeline.push(cmd);
    cmd = { words: [], redirects: [] };
    if (token.op !== '|') {
      items.push({ pipeline, then: token.op });
      pipeline = [];
    }
  }

  if (cmd.words.length || cmd.redirects.length) {
    if (!cmd.words.length) throw unexpected('newline');
    pipeline.push(cmd);
  } else if (pipeline.length) {
    throw unexpected('newline'); // line ended with `|`
  }
  if (pipeline.length) items.push({ pipeline, then: null });
  return items;
}
