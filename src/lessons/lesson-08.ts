import type { Lesson } from './types';

const lesson: Lesson = {
  id: '8',
  number: 8,
  title: 'Find anything',
  promise: 'Search inside files with grep, and find files by name with find.',
  minutes: 14,
  part: 'Power tools',
  commands: [
    { name: 'grep', does: 'Print lines that contain a word (-i any case, -n line numbers, -r every file, -c count)' },
    { name: 'find', does: 'Find files and folders by name (-name) or type (-type f or d)' },
  ],

  fs: {
    home: {
      you: {
        'notes.txt': 'Todo: learn grep\nfinished lesson 7\nTODO: practise pipes\nbuy coffee\ntodo: try find\n',
        logs: {
          'app.log':
            'INFO  app started\n' +
            'INFO  user signed in\n' +
            'WARN  slow response from /search\n' +
            'ERROR payment service timed out\n' +
            'INFO  user signed out\n' +
            'ERROR could not send email\n' +
            'WARN  disk 80% full\n' +
            'ERROR payment service timed out\n' +
            'INFO  backup finished\n' +
            'ERROR disk full\n',
        },
        projects: {
          shop: {
            'README.md': '# Shop\nA small online shop.\n',
            'config.json': '{ "debug": true }\n',
            src: {
              'cart.js': 'function addToCart(item) {\n  // TODO: check stock first\n  cart.push(item);\n}\n',
              'checkout.js':
                'const API_KEY = "demo-9f4c2e81b7a3-not-a-real-key";\n// TODO: move the key out of the code\nfunction pay(total) {\n  return charge(API_KEY, total);\n}\n',
            },
          },
          blog: {
            'config.json': '{ "title": "My blog" }\n',
            posts: {
              'hello.md': '# Hello\nMy first post.\n',
            },
          },
        },
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'grep',
      label: 'grep',
      title: 'Search inside a file',
      blocks: [
        {
          type: 'p',
          text: '`grep` prints every line in a file that contains what you’re looking for. Give it the word, then the file:',
        },
        {
          type: 'example',
          command: 'grep WARN logs/app.log',
          output: 'WARN  slow response from /search\nWARN  disk 80% full',
        },
        {
          type: 'p',
          text: 'Most terminals highlight the matching part. `grep` is case-sensitive, so `warn` and `WARN` are different searches.',
        },
      ],
      tasks: [
        {
          id: 'grep',
          prompt: 'Find every line containing ERROR in logs/app.log',
          hint: 'grep ERROR logs/app.log',
          check: { kind: 'output', command: 'grep', includes: ['ERROR could not send email', 'ERROR disk full'] },
        },
      ],
    },

    {
      id: 'options',
      label: 'grep -in',
      title: 'Any case, with line numbers',
      blocks: [
        {
          type: 'p',
          text: 'Two options you’ll use constantly:',
        },
        {
          type: 'list',
          items: [
            '`-i` ignores case, so `todo` also finds `Todo` and `TODO`',
            '`-n` shows the line number of each match',
          ],
        },
        {
          type: 'example',
          command: 'grep -in todo notes.txt',
          output: '1:Todo: learn grep\n3:TODO: practise pipes\n5:todo: try find',
        },
        {
          type: 'p',
          text: '`-c` counts the matching lines instead of printing them, and `-v` flips the search to show the lines that *don’t* match.',
        },
      ],
      tasks: [
        {
          id: 'grep-in',
          prompt: 'Search notes.txt for todo in any case, with line numbers',
          hint: 'grep -in todo notes.txt',
          check: { kind: 'ran', command: 'grep', flags: 'in' },
        },
        {
          id: 'grep-c',
          prompt: 'Count the ERROR lines in logs/app.log without listing them',
          hint: 'grep -c ERROR logs/app.log',
          check: { kind: 'all', checks: [{ kind: 'ran', command: 'grep', flags: 'c' }, { kind: 'output', command: 'grep', includes: ['4'] }] },
        },
      ],
    },

    {
      id: 'recursive',
      label: 'grep -r',
      title: 'Search a whole folder',
      blocks: [
        {
          type: 'p',
          text: '`-r` (recursive) searches every file in a folder and all the folders inside it. Each match is labelled with the file it came from:',
        },
        {
          type: 'example',
          command: 'grep -r debug projects',
          output: 'projects/shop/config.json:{ "debug": true }',
        },
        {
          type: 'p',
          text: 'This is how developers find where something is used in a big codebase.',
        },
      ],
      tasks: [
        {
          id: 'grep-r',
          prompt: 'Find every TODO in the projects folder',
          hint: 'grep -r TODO projects',
          check: { kind: 'output', command: 'grep', includes: ['shop/src/cart.js', 'shop/src/checkout.js'] },
        },
      ],
    },

    {
      id: 'find',
      label: 'find',
      title: 'Find files by name',
      blocks: [
        {
          type: 'p',
          text: '`grep` looks *inside* files. `find` looks for the files themselves. Tell it where to start, then what to look for:',
        },
        {
          type: 'example',
          command: 'find projects -name "*.md"',
          output: 'projects/blog/posts/hello.md\nprojects/shop/README.md',
        },
        {
          type: 'p',
          text: 'Put the pattern in quotes. Without them, the shell would expand `*.md` itself before `find` ever saw it.',
        },
        {
          type: 'p',
          text: '`-type d` finds only folders, and `-type f` only files.',
        },
      ],
      tasks: [
        {
          id: 'find',
          prompt: 'Find every file called config.json under projects',
          hint: 'find projects -name config.json',
          check: { kind: 'output', command: 'find', includes: ['shop/config.json', 'blog/config.json'] },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Find the leaked key',
      blocks: [
        {
          type: 'p',
          text: 'Somebody pasted a secret API key straight into the code in `projects`. It starts with the text `API_KEY`. Find which file it’s in, then open that file to see the key.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Keys like this belong in settings that never get shared, not in code. Searching for leaked secrets with `grep -r` is a real security habit.',
        },
      ],
      tasks: [
        {
          id: 'find-key',
          prompt: 'Find the file that contains API_KEY',
          hint: 'grep -r API_KEY projects',
          check: { kind: 'output', command: 'grep', includes: ['checkout.js'] },
        },
        {
          id: 'open-key',
          prompt: 'Open that file to see the key',
          hint: 'cat projects/shop/src/checkout.js',
          check: { kind: 'read', path: '~/projects/shop/src/checkout.js' },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q8-1',
      question: 'grep error app.log misses lines that say ERROR. Why?',
      options: ['grep only reads the first line', 'grep is case-sensitive, so add -i', 'The file is too big', 'grep needs -r'],
      correctAnswer: 1,
      explanation: 'error and ERROR are different text to grep. -i makes it ignore case.',
    },
    {
      id: 'q8-2',
      question: 'Which searches every file inside a folder?',
      options: ['grep -n', 'grep -c', 'grep -r', 'grep -v'],
      correctAnswer: 2,
      explanation: '-r is recursive: every file in the folder and the folders inside it.',
    },
    {
      id: 'q8-3',
      question: 'What’s the difference between grep and find?',
      options: [
        'They do the same thing',
        'grep searches inside files; find looks for files by name',
        'find searches inside files; grep looks for files by name',
        'find only works on folders',
      ],
      correctAnswer: 1,
      explanation: 'grep reads contents. find walks folders looking at names and types.',
    },
    {
      id: 'q8-4',
      question: 'Why put "*.md" in quotes in find . -name "*.md"?',
      options: [
        'find needs quotes around everything',
        'So the shell doesn’t expand *.md before find sees it',
        'Quotes make it case-insensitive',
        'They don’t do anything',
      ],
      correctAnswer: 1,
      explanation: 'Unquoted, the shell would replace *.md with matching names in the current folder, and find would get the wrong pattern.',
    },
  ],

  next: { id: '9', title: 'Permissions and scripts' },
};

export default lesson;
