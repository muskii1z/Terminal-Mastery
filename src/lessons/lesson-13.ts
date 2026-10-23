import type { Lesson } from './types';

const lesson: Lesson = {
  id: '13',
  number: 13,
  title: 'Final project: clean up a handoff',
  promise: 'Take over a messy project folder and leave it organised, safe and ready to ship, using everything from the course.',
  minutes: 20,
  part: 'Final project',
  commands: [
    { name: 'ls -la', does: 'See everything in a folder, hidden files included' },
    { name: 'mkdir / mv *', does: 'Make folders and sort files into them with wildcards' },
    { name: 'grep -r | wc -l', does: 'Search a whole project and count the results' },
    { name: 'nano', does: 'Fix a config file' },
    { name: 'chmod +x', does: 'Make a script runnable' },
  ],

  fs: {
    home: {
      you: {
        handoff: {
          'app.js': 'const server = require("./server");\n// TODO: add a health check\nserver.start();\n',
          'server.js':
            'const DB_PASSWORD = "hunter2";\n// TODO: read the password from an environment variable\nfunction start() {\n  connect(DB_PASSWORD);\n}\nmodule.exports = { start };\n',
          'utils.js': '// TODO: write tests\nfunction slugify(text) {\n  return text.toLowerCase().replace(/ /g, "-");\n}\n',
          'notes.md': '# Notes\nThe server reads config.conf when it starts.\n',
          'changelog.md': '# Changelog\n0.1 First version\n',
          'logo.png': '(image data)\n',
          'banner.png': '(image data)\n',
          'cache.tmp': 'temporary\n',
          'build.tmp': 'temporary\n',
          '.DS_Store': '(Mac folder settings)\n',
          'config.conf': 'debug=true\nport=3000\n',
          'deploy.sh':
            '#!/bin/bash\n# Pretend to deploy the app\necho "Checking the code..."\nls ~/handoff/src\necho "Deployed!"\n',
        },
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'explore',
      label: 'explore',
      title: 'Look around',
      blocks: [
        {
          type: 'p',
          text: 'A teammate has moved to another project and handed theirs over to you. It’s all in `~/handoff`, in one big pile. Your job: organise it, clean it up, check it for problems and ship it.',
        },
        {
          type: 'p',
          text: 'Start the way you would with any unfamiliar folder: go in and look at **everything**, hidden files included.',
        },
      ],
      tasks: [
        {
          id: 'explore',
          prompt: 'Go into handoff and list everything, hidden files included',
          hint: 'cd handoff, then ls -la',
          check: { kind: 'listed', path: '~/handoff', hidden: true },
        },
      ],
    },

    {
      id: 'organise',
      label: 'organise',
      title: 'Sort the files',
      blocks: [
        {
          type: 'p',
          text: 'Make three folders and move the files into them. Use wildcards: one `mv` per kind of file.',
        },
        {
          type: 'list',
          items: ['`src` for the code (`.js`)', '`docs` for the documents (`.md`)', '`assets` for the images (`.png`)'],
        },
      ],
      tasks: [
        {
          id: 'src',
          prompt: 'Move every .js file into src',
          hint: 'mkdir src docs assets, then mv *.js src',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/handoff/src/app.js', type: 'file' },
              { kind: 'exists', path: '~/handoff/src/server.js', type: 'file' },
              { kind: 'exists', path: '~/handoff/src/utils.js', type: 'file' },
            ],
          },
        },
        {
          id: 'docs',
          prompt: 'Move every .md file into docs',
          hint: 'mv *.md docs',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/handoff/docs/notes.md', type: 'file' },
              { kind: 'exists', path: '~/handoff/docs/changelog.md', type: 'file' },
            ],
          },
        },
        {
          id: 'assets',
          prompt: 'Move every .png file into assets',
          hint: 'mv *.png assets',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/handoff/assets/logo.png', type: 'file' },
              { kind: 'exists', path: '~/handoff/assets/banner.png', type: 'file' },
            ],
          },
        },
      ],
    },

    {
      id: 'clean',
      label: 'clean',
      title: 'Throw out the junk',
      blocks: [
        {
          type: 'p',
          text: 'Delete the temporary `.tmp` files, and the `.DS_Store` file a Mac left behind. Nobody needs them in a shared project.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Remember: `*` never matches a name that starts with a dot.',
        },
      ],
      tasks: [
        {
          id: 'clean',
          prompt: 'Delete both .tmp files and .DS_Store',
          hint: 'rm *.tmp, then rm .DS_Store',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/handoff/cache.tmp', not: true },
              { kind: 'exists', path: '~/handoff/build.tmp', not: true },
              { kind: 'exists', path: '~/handoff/.DS_Store', not: true },
            ],
          },
        },
      ],
    },

    {
      id: 'investigate',
      label: 'investigate',
      title: 'Check the code',
      blocks: [
        {
          type: 'p',
          text: 'Before you ship someone else’s code, find out what they left unfinished, and whether anything is in there that shouldn’t be.',
        },
        {
          type: 'list',
          items: [
            'Count the `TODO` notes in `src`, using a pipe to count the lines',
            'Search `src` for a password, in any case',
          ],
        },
      ],
      tasks: [
        {
          id: 'count-todos',
          prompt: 'Count the TODOs in src',
          hint: 'grep -r TODO src | wc -l',
          check: { kind: 'all', checks: [{ kind: 'ran', pipeline: ['grep', 'wc'] }, { kind: 'output', command: 'wc', includes: ['3'] }] },
        },
        {
          id: 'find-password',
          prompt: 'Find the file with a password in it',
          hint: 'grep -ri password src',
          check: { kind: 'output', command: 'grep', includes: ['server.js', 'hunter2'] },
        },
      ],
    },

    {
      id: 'config',
      label: 'nano',
      title: 'Fix the config',
      blocks: [
        {
          type: 'p',
          text: '`config.conf` still has debug mode on. Open it in nano, set `debug=false`, and save. Leave the port as it is.',
        },
      ],
      tasks: [
        {
          id: 'config',
          prompt: 'Set debug=false in config.conf',
          hint: 'nano config.conf, change true to false, then Ctrl+O, Enter, Ctrl+X',
          check: { kind: 'file', path: '~/handoff/config.conf', includes: ['debug=false', 'port=3000'], excludes: 'debug=true' },
        },
      ],
    },

    {
      id: 'ship',
      label: 'ship',
      title: 'Ship it',
      blocks: [
        {
          type: 'p',
          text: '`deploy.sh` ships the project. Read it first, then make it runnable and run it.',
        },
      ],
      tasks: [
        {
          id: 'deploy',
          prompt: 'Run deploy.sh',
          hint: 'chmod +x deploy.sh, then ./deploy.sh',
          check: { kind: 'exec', path: '~/handoff/deploy.sh', ok: true },
        },
      ],
    },

    {
      id: 'writeup',
      label: 'write up',
      title: 'Leave a note',
      blocks: [
        {
          type: 'p',
          text: 'Good engineers leave a record. Write `docs/CLEANUP.md` with at least three lines saying what you changed and what you found. Use `echo` with `>` and `>>`, or nano.',
        },
        {
          type: 'p',
          text: 'Mention the password in `server.js`. The next person needs to know it should be moved out of the code.',
        },
      ],
      tasks: [
        {
          id: 'writeup',
          prompt: 'Write docs/CLEANUP.md with at least three lines',
          hint: 'nano docs/CLEANUP.md, or echo "Sorted files into src, docs and assets" > docs/CLEANUP.md, then >> for more lines',
          check: { kind: 'file', path: '~/handoff/docs/CLEANUP.md', minLines: 3 },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q13-1',
      question: 'Which command shows .DS_Store in a folder listing?',
      options: ['ls', 'ls -l', 'ls -a', 'ls *'],
      correctAnswer: 2,
      explanation: '-a includes hidden files, the ones whose names start with a dot.',
    },
    {
      id: 'q13-2',
      question: 'You ran rm * in a folder. Which file survives?',
      options: ['notes.txt', '.env', 'app.js', 'None of them'],
      correctAnswer: 1,
      explanation: '* doesn’t match names that start with a dot, so .env is left alone.',
    },
    {
      id: 'q13-3',
      question: 'How do you count how many lines in a project mention TODO?',
      options: ['grep -r TODO . | wc -l', 'find TODO | wc', 'cat TODO | sort', 'wc -l TODO'],
      correctAnswer: 0,
      explanation: 'grep -r finds every matching line, and wc -l counts them.',
    },
    {
      id: 'q13-4',
      question: 'deploy.sh gives Permission denied. What do you check and change?',
      options: [
        'Its size, with du',
        'Its permissions, with ls -l, then chmod +x',
        'Its contents, with grep',
        'Your disk space, with df',
      ],
      correctAnswer: 1,
      explanation: 'Permission denied on a script means it has no x. ls -l shows it and chmod +x fixes it.',
    },
    {
      id: 'q13-5',
      question: 'You find a password written into the code. What’s the right next step?',
      options: [
        'Delete the file',
        'Ignore it, it works',
        'Record it and get it moved out of the code',
        'Post it in the team chat',
      ],
      correctAnswer: 2,
      explanation: 'Secrets belong in settings that aren’t shared with the code. Flag it so it gets fixed and changed.',
    },
  ],
};

export default lesson;
