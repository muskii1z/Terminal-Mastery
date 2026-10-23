import type { Lesson } from './types';

/** A realistic server log: 40 lines, quiet all day, then a crash at the very end. */
function serverLog(): string {
  const pages = ['/', '/login', '/products', '/cart', '/checkout', '/about'];
  const lines: string[] = [];
  for (let i = 0; i < 37; i++) {
    const minute = String(Math.floor(i * 1.4)).padStart(2, '0');
    const second = String((i * 17) % 60).padStart(2, '0');
    lines.push(`2026-10-21 09:${minute}:${second} INFO  served ${pages[i % pages.length]} in ${20 + ((i * 37) % 90)}ms`);
  }
  lines.push('2026-10-21 17:42:09 ERROR database connection lost');
  lines.push('2026-10-21 17:42:10 INFO  retrying in 5s');
  lines.push('2026-10-21 17:42:15 ERROR giving up after 3 retries');
  return lines.join('\n') + '\n';
}

const lesson: Lesson = {
  id: '5',
  number: 5,
  title: 'Read files',
  promise: 'Look inside files of any size: from the top, from the bottom, or by the numbers.',
  minutes: 10,
  part: 'Working with files',
  commands: [
    { name: 'cat', does: 'Print a whole file (or several, joined)' },
    { name: 'head', does: 'Print the first lines of a file (-n sets how many)' },
    { name: 'tail', does: 'Print the last lines of a file (-n sets how many)' },
    { name: 'wc', does: 'Count lines (-l), words (-w) and bytes (-c)' },
    { name: 'less', does: 'Scroll through a long file (q to quit)' },
  ],

  fs: {
    home: {
      you: {
        'notes.txt': 'Read files with cat.\nThe start with head.\nThe end with tail.\n',
        'speech.txt':
          'We choose to go to the Moon in this decade and do the other things,\nnot because they are easy, but because they are hard.\n',
        logs: {
          'server.log': serverLog(),
        },
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'cat',
      label: 'cat',
      title: 'The whole thing',
      blocks: [
        {
          type: 'p',
          text: 'You’ve met `cat`: it prints a whole file. Give it more than one file and it prints them one after another, which is the “concatenate” it’s named after.',
        },
        { type: 'example', command: 'cat notes.txt', output: 'Read files with cat.\nThe start with head.\nThe end with tail.' },
        {
          type: 'p',
          text: '`cat` is perfect for short files. For a file with thousands of lines, it floods the screen, and that’s where the next three commands come in.',
        },
      ],
      tasks: [
        {
          id: 'cat',
          prompt: 'Read notes.txt',
          hint: 'cat notes.txt',
          check: { kind: 'read', path: '~/notes.txt' },
        },
      ],
    },

    {
      id: 'head',
      label: 'head',
      title: 'Just the start',
      blocks: [
        {
          type: 'p',
          text: '`head` prints the first 10 lines of a file. Use `-n` to choose how many:',
        },
        {
          type: 'example',
          command: 'head -n 3 logs/server.log',
          output:
            '2026-10-21 09:00:00 INFO  served / in 20ms\n2026-10-21 09:01:17 INFO  served /login in 57ms\n2026-10-21 09:02:34 INFO  served /products in 94ms',
        },
        {
          type: 'p',
          text: 'It’s the quickest way to see what a file looks like before deciding what to do with it.',
        },
      ],
      tasks: [
        {
          id: 'head',
          prompt: 'Show the first 5 lines of logs/server.log',
          hint: 'head -n 5 logs/server.log',
          check: { kind: 'all', checks: [{ kind: 'ran', command: 'head', outputLines: 5 }, { kind: 'read', path: '~/logs/server.log' }] },
        },
      ],
    },

    {
      id: 'tail',
      label: 'tail',
      title: 'Just the end',
      blocks: [
        {
          type: 'p',
          text: '`tail` is the opposite: the last 10 lines, or as many as you ask for with `-n`.',
        },
        {
          type: 'p',
          text: 'That matters more than it sounds. Log files grow at the bottom, so the newest, most interesting lines are always at the end.',
        },
        {
          type: 'example',
          command: 'tail -n 2 logs/server.log',
          output: '2026-10-21 17:42:10 INFO  retrying in 5s\n2026-10-21 17:42:15 ERROR giving up after 3 retries',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'On a real server, `tail -f` keeps the file open and prints new lines as they’re written, until you press [[Ctrl]] + [[C]]. It’s how people watch a log live.',
        },
      ],
      tasks: [
        {
          id: 'tail',
          prompt: 'Show the last 3 lines of logs/server.log',
          hint: 'tail -n 3 logs/server.log',
          check: { kind: 'all', checks: [{ kind: 'ran', command: 'tail', outputLines: 3 }, { kind: 'read', path: '~/logs/server.log' }] },
        },
      ],
    },

    {
      id: 'wc',
      label: 'wc',
      title: 'Count it',
      blocks: [
        {
          type: 'p',
          text: '`wc` (word count) counts what’s in a file. On its own it prints lines, words and bytes. The options pick one:',
        },
        {
          type: 'list',
          items: ['`wc -l`: lines', '`wc -w`: words', '`wc -c`: bytes'],
        },
        { type: 'example', command: 'wc -w speech.txt', output: '25 speech.txt' },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac, `wc` pads its numbers with spaces, like `      24 speech.txt`. Same number, more space.',
        },
      ],
      tasks: [
        {
          id: 'wc',
          prompt: 'Count the lines in logs/server.log',
          hint: 'wc -l logs/server.log',
          check: { kind: 'all', checks: [{ kind: 'ran', command: 'wc', flags: 'l' }, { kind: 'output', includes: ['40'], command: 'wc' }] },
        },
      ],
    },

    {
      id: 'less',
      label: 'less',
      title: 'Long files, on your own computer',
      blocks: [
        {
          type: 'p',
          text: 'For reading a long file properly, there’s `less`. It opens the file full screen so you can scroll through it:',
        },
        {
          type: 'list',
          items: [
            '[[↑]] and [[↓]] scroll a line at a time, [[Space]] a whole page',
            '[[/]] then a word searches for it',
            '[[q]] quits back to the prompt',
          ],
        },
        {
          type: 'p',
          text: '`less` takes over the whole terminal window, which the practice terminal can’t do, so try this one on your own computer. Every Mac and Linux system has a file called `/etc/hosts` you can open.',
        },
      ],
      tasks: [
        {
          id: 'less',
          prompt: 'On your own computer, run less /etc/hosts and quit with q',
          hint: 'Open your terminal, type less /etc/hosts, scroll around, then press q.',
          check: { kind: 'manual' },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'What went wrong?',
      blocks: [
        {
          type: 'p',
          text: 'The server in `logs/server.log` stopped working this afternoon. The log has the answer, at the bottom where the newest lines are.',
        },
        {
          type: 'p',
          text: 'Find the last error it recorded.',
        },
      ],
      tasks: [
        {
          id: 'last-error',
          prompt: 'Find the server’s last error message',
          hint: 'The newest lines are at the end: tail logs/server.log',
          check: { kind: 'output', includes: ['ERROR giving up after 3 retries'] },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q5-1',
      question: 'Which command shows the last 20 lines of app.log?',
      options: ['head -n 20 app.log', 'tail -n 20 app.log', 'cat -20 app.log', 'wc -l 20 app.log'],
      correctAnswer: 1,
      explanation: 'tail reads from the end, and -n sets how many lines.',
    },
    {
      id: 'q5-2',
      question: 'How many lines does head show if you don’t give it -n?',
      options: ['1', '5', '10', 'All of them'],
      correctAnswer: 2,
      explanation: 'head and tail both default to 10 lines.',
    },
    {
      id: 'q5-3',
      question: 'What does wc -l report?',
      options: ['The longest line', 'The number of lines', 'The number of letters', 'The file’s size'],
      correctAnswer: 1,
      explanation: '-l is for lines. -w counts words and -c counts bytes.',
    },
    {
      id: 'q5-4',
      question: 'Where are the newest entries in most log files?',
      options: ['At the top', 'In the middle', 'At the bottom', 'In a separate file'],
      correctAnswer: 2,
      explanation: 'Logs are written by adding lines to the end, which is why tail is the go-to for logs.',
    },
  ],

  next: { id: '6', title: 'Match many files at once' },
};

export default lesson;
