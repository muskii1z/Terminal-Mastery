import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Shell, toText } from '../src/lib/shell/shell';

/**
 * The practice terminal should behave like bash on Linux for everything the
 * course teaches: same output, same error messages, same quirks.
 */

function makeShell() {
  return new Shell({
    seed: {
      home: {
        you: {
          'notes.txt': 'apple\nbanana\napple\ncherry\nbanana\napple\n',
          '.hidden': 'secret\n',
          docs: { 'a.md': '# A\nTODO: write\n', 'b.md': 'done\n' },
          'run.sh': '#!/bin/bash\n# say hi\necho "Hello from $USER"\ncd /tmp\npwd\n',
        },
      },
      etc: { hosts: '127.0.0.1 localhost\n' },
      tmp: {},
    },
    procs: [
      { pid: 1, user: 'root', command: '/sbin/init', cpu: 0, mem: 0.1, tty: '?', stat: 'Ss' },
      { pid: 1201, user: 'you', command: '-bash', cpu: 0, mem: 0.1, tty: 'pts/0', stat: 'Ss' },
      { pid: 2045, user: 'you', command: 'python3 runaway.py', cpu: 99.1, mem: 4.2, tty: '?', stat: 'R', ignoresTerm: true },
    ],
  });
}

const output = (sh: Shell, line: string) => sh.run(line).lines.map(toText).join('\n');

test('navigation', () => {
  const sh = makeShell();
  assert.equal(output(sh, 'pwd'), '/home/you');
  assert.equal(output(sh, 'ls'), 'docs  notes.txt  run.sh');
  assert.equal(output(sh, 'ls -a'), '.  ..  .hidden  docs  notes.txt  run.sh');
  assert.equal(output(sh, 'cd docs'), '');
  assert.equal(output(sh, 'cd -'), '/home/you');
  assert.equal(output(sh, 'cd Docs'), 'bash: cd: Docs: No such file or directory');
  assert.equal(output(sh, 'cd notes.txt'), 'bash: cd: notes.txt: Not a directory');
  assert.equal(output(sh, 'ls nope'), "ls: cannot access 'nope': No such file or directory");
  assert.equal(output(sh, 'ls -z'), "ls: invalid option -- 'z'\nTry 'ls --help' for more information.");
});

test('pipes and filters', () => {
  const sh = makeShell();
  assert.equal(output(sh, 'sort notes.txt | uniq'), 'apple\nbanana\ncherry');
  assert.equal(output(sh, 'sort notes.txt | uniq -c | sort -rn | head -n 1'), '      3 apple');
  assert.equal(output(sh, 'cat notes.txt | wc -l'), '6');
  assert.equal(output(sh, 'wc -l notes.txt'), '6 notes.txt');
  assert.equal(output(sh, 'ls | wc -l'), '3', 'ls prints one name per line into a pipe');
  assert.equal(output(sh, 'head -n 2 notes.txt'), 'apple\nbanana');
  assert.equal(output(sh, 'tail -2 notes.txt'), 'banana\napple');
  assert.equal(output(sh, 'grep -c apple notes.txt'), '3');
  assert.equal(output(sh, 'grep -n cherry notes.txt'), '4:cherry');
  assert.equal(output(sh, 'grep -r TODO docs'), 'docs/a.md:TODO: write');
  assert.equal(output(sh, 'grep -v apple notes.txt | sort -u'), 'banana\ncherry');
});

test('quoting, variables and wildcards', () => {
  const sh = makeShell();
  assert.equal(output(sh, 'echo docs/*.md'), 'docs/a.md docs/b.md');
  assert.equal(output(sh, 'echo "docs/*.md"'), 'docs/*.md');
  assert.equal(output(sh, "echo '$HOME'"), '$HOME');
  assert.equal(output(sh, 'echo \\$HOME'), '$HOME');
  assert.equal(output(sh, 'echo $HOME'), '/home/you');
  assert.equal(output(sh, 'echo "$HOME/*"'), '/home/you/*');
  assert.equal(output(sh, 'echo *'), 'docs notes.txt run.sh', 'hidden files are not matched by *');
  assert.equal(output(sh, 'ls *.gif'), "ls: cannot access '*.gif': No such file or directory");
  assert.equal(output(sh, 'NAME=Sam && echo "Hi $NAME"'), 'Hi Sam', 'variables expand as each command runs');
});

test('creating, copying, moving, deleting', () => {
  const sh = makeShell();
  assert.equal(output(sh, 'mkdir a/b/c'), "mkdir: cannot create directory 'a/b/c': No such file or directory");
  assert.equal(output(sh, 'mkdir -p a/b/c && ls a/b'), 'c');
  assert.equal(output(sh, 'mkdir docs'), "mkdir: cannot create directory 'docs': File exists");
  assert.equal(output(sh, 'echo first > f.txt && echo second >> f.txt && cat f.txt'), 'first\nsecond');
  assert.equal(output(sh, 'cp docs backup'), "cp: -r not specified; omitting directory 'docs'");
  assert.equal(output(sh, 'cp -r docs backup && ls backup'), 'a.md  b.md');
  assert.equal(output(sh, 'mv backup/a.md backup/c.md && ls backup'), 'b.md  c.md');
  assert.equal(output(sh, 'rm backup'), "rm: cannot remove 'backup': Is a directory");
  assert.equal(output(sh, 'rmdir a'), "rmdir: failed to remove 'a': Directory not empty");
  assert.equal(output(sh, 'rm -r backup a && ls'), 'docs  f.txt  notes.txt  run.sh');
  assert.equal(output(sh, 'rm /etc/hosts'), "rm: cannot remove '/etc/hosts': Permission denied");
  assert.equal(output(sh, 'touch /etc/new'), "touch: cannot touch '/etc/new': Permission denied");
});

test('permissions and scripts', () => {
  const sh = makeShell();
  assert.equal(output(sh, './run.sh'), 'bash: ./run.sh: Permission denied');
  assert.equal(output(sh, 'bash run.sh'), 'Hello from you\n/tmp');
  assert.equal(sh.cwd, '/home/you', 'a cd inside a script does not move the learner');
  assert.equal(output(sh, 'chmod +x run.sh && ./run.sh'), 'Hello from you\n/tmp');
  assert.match(output(sh, 'ls -l run.sh'), /^-rwxr-xr-x/);
  output(sh, 'chmod 600 notes.txt');
  assert.match(output(sh, 'ls -l notes.txt'), /^-rw-------/);
  assert.equal(output(sh, 'chmod 644 /etc/hosts'), "chmod: changing permissions of '/etc/hosts': Operation not permitted");
});

test('processes', () => {
  const sh = makeShell();
  assert.match(output(sh, 'ps aux'), /python3 runaway\.py/);
  assert.equal(output(sh, 'kill 2045'), '');
  assert.match(output(sh, 'ps aux'), /python3 runaway\.py/, 'a polite kill can be ignored');
  assert.equal(output(sh, 'kill -9 2045'), '');
  assert.doesNotMatch(output(sh, 'ps aux'), /runaway/);
  assert.equal(output(sh, 'kill 1'), 'bash: kill: (1) - Operation not permitted');
  assert.equal(output(sh, 'kill 999'), 'bash: kill: (999) - No such process');
});

test('shell features', () => {
  const sh = makeShell();
  assert.match(output(sh, "alias ll='ls -a' && ll docs"), /ll: command not found/, 'as in bash, an alias cannot be used on the line that defines it');
  assert.equal(output(sh, 'll docs'), '.  ..  a.md  b.md');
  assert.equal(output(sh, 'echo hello'), 'hello');
  assert.equal(output(sh, '!!'), 'echo hello\nhello');
  assert.equal(output(sh, 'which ls'), '/usr/bin/ls');
  assert.equal(output(sh, 'which cd'), '');
  assert.equal(output(sh, 'export GREETING=hi && printenv GREETING'), 'hi');
  assert.equal(output(sh, 'cd nowhere; pwd'), 'bash: cd: nowhere: No such file or directory\n/home/you');
  assert.equal(output(sh, 'cd nowhere && pwd'), 'bash: cd: nowhere: No such file or directory');
  assert.equal(output(sh, 'ls |'), "bash: syntax error near unexpected token `newline'");
  assert.equal(output(sh, 'ls | | wc'), "bash: syntax error near unexpected token `|'");
});

test('honest about what it cannot do', () => {
  const sh = makeShell();
  assert.match(output(sh, 'git status'), /git is a real command, but this practice terminal doesn’t run it/);
  assert.match(output(sh, 'top'), /top is a live/);
  assert.equal(output(sh, 'whomai'), 'bash: whomai: command not found\nDid you mean whoami?');
  assert.equal(output(sh, 'mkdri x'), 'bash: mkdri: command not found\nDid you mean mkdir?');
  assert.equal(output(sh, 'florp'), 'bash: florp: command not found\nType help to see the commands this terminal understands.');
});

test('tab completion', () => {
  const sh = makeShell();
  assert.equal(sh.complete('cat no').value, 'cat notes.txt ');
  assert.equal(sh.complete('cat notes.txt | so').value, 'cat notes.txt | sort ');
  assert.equal(sh.complete('cd d').value, 'cd docs/');
});

test('nano saves files', () => {
  const sh = makeShell();
  const opened = sh.run('nano todo.txt');
  assert.ok(opened.editor?.isNew);
  sh.saveFromEditor(opened.editor!.path, 'buy milk\n');
  assert.equal(output(sh, 'cat todo.txt'), 'buy milk');
});

test('date shows the real current time', () => {
  const sh = makeShell();
  const date = output(sh, 'date');
  assert.match(date, /^[A-Z][a-z]{2} [A-Z][a-z]{2} [ \d]\d \d\d:\d\d:\d\d \S+ \d{4}$/);
  assert.ok(date.endsWith(String(new Date().getFullYear())));
});
