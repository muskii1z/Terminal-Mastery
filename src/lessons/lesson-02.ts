import type { Lesson } from './types';

const lesson: Lesson = {
  id: '2',
  number: 2,
  title: 'Moving around',
  promise: 'Find out where you are, see what’s around you, and get anywhere on the system.',
  minutes: 12,

  fs: {
    home: {
      you: {
        '.secret-plans.txt': 'Step 1: learn the terminal.\nStep 2: stop being scared of the terminal.\nStep 3: ship.\n',
        documents: {
          'todo.txt': '- finish lesson 2\n- find the treasure\n',
          'resume.pdf': '(a PDF file — cat shows raw bytes for files like this)\n',
        },
        downloads: {},
        projects: {
          website: {
            'index.html': '<h1>Hello</h1>\n',
            'about.html': '<h1>About</h1>\n',
            css: { 'style.css': 'body { margin: 0; }\n' },
          },
          scripts: {
            'backup.sh': '#!/bin/bash\necho "backing up..."\n',
          },
          game: {
            'README.md': '# Tiny game\nLevels live in the levels folder.\n',
            levels: {
              'level-1.txt': 'Level 1: the beginning.\n',
              'level-2.txt': 'Level 2: getting harder.\n',
              bonus: {
                'treasure.txt':
                  'You found it.\n\n' +
                  'You can now get to any folder on a computer from the terminal.\n' +
                  'You just used cat to read this file. That is lesson 3.\n',
              },
            },
          },
        },
      },
    },
    tmp: {},
    etc: { hosts: '127.0.0.1 localhost\n' },
  },

  sections: [
    {
      id: 'where',
      label: 'pwd',
      title: 'You’re always standing somewhere',
      blocks: [
        {
          type: 'p',
          text: 'Everything on your computer lives in folders inside other folders, all branching out from one folder at the very top. That top folder is called the **root**, and it’s written as a single slash: `/`.',
        },
        {
          type: 'p',
          text: 'In a terminal you’re always standing inside exactly one folder. It’s called your **working directory**, and commands act on it unless you say otherwise. The map above the terminal shows it: the amber marker is where you’re standing.',
        },
        {
          type: 'p',
          text: 'To print where you are, type `pwd` (print working directory) and press [[Enter]].',
        },
        { type: 'example', command: 'pwd', output: '/home/you' },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac your home folder is `/Users/yourname`. On Linux it’s `/home/yourname`. This practice terminal runs Linux, because that’s what servers run. The commands are the same either way.',
        },
      ],
      tasks: [
        {
          id: 'pwd',
          prompt: 'Print your working directory',
          hint: 'Type pwd and press Enter.',
          check: { kind: 'ran', command: 'pwd' },
        },
      ],
    },

    {
      id: 'look',
      label: 'ls',
      title: 'Look around',
      blocks: [
        {
          type: 'p',
          text: '`pwd` tells you where you are. `ls` tells you what’s here: it lists the files and folders inside your working directory.',
        },
        { type: 'example', command: 'ls', output: 'documents  downloads  projects' },
        {
          type: 'p',
          text: 'Most terminals colour folders differently from files. Here, folders are blue. Each time you run `ls`, the map fills in what you found.',
        },
      ],
      tasks: [
        {
          id: 'ls-home',
          prompt: 'List what’s in your home folder',
          hint: 'You start in your home folder. Type ls and press Enter.',
          check: { kind: 'listed', path: '~' },
        },
      ],
    },

    {
      id: 'hidden',
      label: 'ls -a',
      title: 'Hidden files',
      blocks: [
        {
          type: 'p',
          text: 'Some files are hidden. Any name that starts with a dot is left out of a plain `ls`. These are usually settings files you don’t need to see every day.',
        },
        {
          type: 'p',
          text: 'Add the `-a` option (for “all”) to show everything:',
        },
        { type: 'example', command: 'ls -a', output: '.  ..  .secret-plans.txt  documents  downloads  projects' },
        {
          type: 'p',
          text: 'Two odd entries appear as well. `.` means “this folder” and `..` means “the folder above this one”. Remember `..`, because you’ll use it soon.',
        },
      ],
      tasks: [
        {
          id: 'ls-hidden',
          prompt: 'Find the hidden file in your home folder',
          hint: 'Add the -a option: ls -a',
          check: { kind: 'listed', path: '~', hidden: true },
        },
      ],
    },

    {
      id: 'move',
      label: 'cd',
      title: 'Move into a folder',
      blocks: [
        {
          type: 'p',
          text: '`cd` (change directory) moves you into another folder. Type `cd`, a space, then the folder’s name:',
        },
        { type: 'example', command: 'cd projects' },
        {
          type: 'p',
          text: 'Nothing printed, and that’s normal. In the terminal, silence usually means it worked. Your prompt changes to show the new folder, and the marker on the map moves.',
        },
        {
          type: 'p',
          text: 'To go back up to the folder above, use `..`:',
        },
        { type: 'example', command: 'cd ..' },
      ],
      tasks: [
        {
          id: 'cd-projects',
          prompt: 'Go into the projects folder',
          hint: 'From your home folder: cd projects',
          check: { kind: 'cwd', path: '~/projects' },
        },
        {
          id: 'cd-up',
          prompt: 'Go back up to your home folder with ..',
          hint: 'From inside projects: cd ..',
          check: { kind: 'ran', command: 'cd', argIn: ['..', '../'], cwdAfter: '~' },
        },
      ],
    },

    {
      id: 'tab',
      label: 'Tab',
      title: 'Let the terminal type for you',
      blocks: [
        {
          type: 'p',
          text: 'Typing whole folder names is slow, and one wrong letter breaks the command. Your terminal can finish names for you.',
        },
        {
          type: 'p',
          text: 'Type the start of a name and press [[Tab]]. If only one name fits, the terminal completes it: `cd pro` becomes `cd projects/`.',
        },
        {
          type: 'p',
          text: 'If several names fit, the terminal lists them. In some terminals you press [[Tab]] twice to see the list. Type another letter or two and press [[Tab]] again.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: '[[Tab]] also catches mistakes. If it won’t complete a name, that file or folder isn’t where you think it is.',
        },
      ],
      tasks: [
        {
          id: 'tab',
          prompt: 'Use Tab to finish a folder name',
          hint: 'Type cd pro, press Tab, then press Enter.',
          check: { kind: 'usedTab' },
        },
      ],
    },

    {
      id: 'paths',
      label: 'paths',
      title: 'Two ways to say where',
      blocks: [
        {
          type: 'p',
          text: 'When you typed `cd projects`, you gave a **relative path**: directions that start from where you’re standing. It only works if `projects` is inside your current folder.',
        },
        {
          type: 'p',
          text: 'An **absolute path** starts with `/` and spells out the whole route from the root. It works from anywhere, because it doesn’t depend on where you are.',
        },
        {
          type: 'list',
          items: [
            '`projects/website`: relative. From here, into projects, then into website.',
            '`/home/you/projects/website`: absolute. The same folder, described from the top.',
            '`../downloads`: relative. Up one folder, then into downloads.',
          ],
        },
        {
          type: 'p',
          text: 'Slashes let you take several steps at once in either kind. `cd projects/website` goes two folders deep in one move.',
        },
        { type: 'example', command: 'cd /tmp' },
      ],
      tasks: [
        {
          id: 'abs-tmp',
          prompt: 'Jump to /tmp using an absolute path',
          hint: 'Absolute paths start with a slash: cd /tmp',
          check: { kind: 'ran', command: 'cd', argStartsWith: '/', cwdAfter: '/tmp' },
        },
      ],
    },

    {
      id: 'shortcuts',
      label: '~ and -',
      title: 'Shortcuts home and back',
      blocks: [
        {
          type: 'p',
          text: '`~` (tilde) is shorthand for your home folder, so `cd ~/projects` works from anywhere on the system.',
        },
        {
          type: 'p',
          text: 'Shorter still: `cd` with nothing after it takes you straight home.',
        },
        {
          type: 'p',
          text: '`cd -` jumps back to the folder you were in before, like a back button. Unlike most `cd` commands, it prints the folder it took you to.',
        },
        { type: 'example', command: 'cd -', output: '/tmp' },
      ],
      tasks: [
        {
          id: 'cd-home',
          prompt: 'Go home by typing cd on its own',
          hint: 'Just cd, then Enter.',
          check: { kind: 'ran', command: 'cd', noArgs: true, cwdAfter: '~' },
        },
        {
          id: 'cd-back',
          prompt: 'Use cd - to jump back to /tmp',
          hint: 'If you just went home from /tmp, cd - takes you back there.',
          check: { kind: 'ran', command: 'cd', args: ['-'], cwdAfter: '/tmp' },
        },
      ],
    },

    {
      id: 'errors',
      label: 'errors',
      title: 'When the terminal says no',
      blocks: [
        { type: 'p', text: 'Sooner or later you’ll see this:' },
        {
          type: 'example',
          command: 'cd Projects',
          output: 'bash: cd: Projects: No such file or directory',
        },
        {
          type: 'p',
          text: 'The message is precise: there’s no folder called `Projects` where you’re standing. The usual causes are a typo or the wrong capitalisation. On Linux, `Projects` and `projects` are two different names.',
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'macOS usually ignores capitalisation in file names, so `cd Projects` would work on a Mac. Don’t rely on it, because the Linux servers you’ll work on won’t.',
        },
        {
          type: 'p',
          text: 'When you hit this, run `ls` to see what’s really there, or press [[Tab]] and let the terminal spell it for you.',
        },
      ],
      tasks: [
        {
          id: 'error',
          prompt: 'Trigger the error on purpose with cd Projects',
          hint: 'From your home folder, type cd Projects with a capital P.',
          check: { kind: 'ran', command: 'cd', ok: false },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Find the treasure',
      blocks: [
        {
          type: 'p',
          text: 'Somewhere inside `projects` there’s a file called `treasure.txt`. Find the folder it’s in and go there.',
        },
        {
          type: 'p',
          text: 'Use `ls` to look inside folders and `cd` to move. Watch the map fill in as you explore.',
        },
      ],
      tasks: [
        {
          id: 'treasure',
          prompt: 'Stand in the folder that contains treasure.txt',
          hint: 'Run ls inside projects. One of those folders is a game, so look inside it.',
          check: { kind: 'cwd', path: '~/projects/game/levels/bonus' },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q2-1',
      question: 'You’re in /home/you/projects. Where does cd .. take you?',
      options: ['/home/you', '/home', '/', 'It shows an error'],
      correctAnswer: 0,
      explanation: '.. is the folder directly above the one you’re in. The folder above projects is your home folder, /home/you.',
    },
    {
      id: 'q2-2',
      question: 'Which of these is an absolute path?',
      options: ['projects/website', '../downloads', '/etc/hosts', 'website'],
      correctAnswer: 2,
      explanation: 'Absolute paths start with /, so they work from anywhere. The others are relative: they depend on where you’re standing.',
    },
    {
      id: 'q2-3',
      question: 'What happens when you type cd on its own?',
      options: [
        'Nothing happens',
        'It prints the current folder',
        'It takes you to your home folder',
        'It takes you to the root folder, /',
      ],
      correctAnswer: 2,
      explanation: 'cd with no folder name takes you home. It’s the fastest way back from anywhere.',
    },
    {
      id: 'q2-4',
      question: 'You run cd Website and see “No such file or directory”, but ls shows website. What’s wrong?',
      options: [
        'website is a file, not a folder',
        'Names are case-sensitive: it’s website, not Website',
        'You need an absolute path',
        'The folder is hidden',
      ],
      correctAnswer: 1,
      explanation: 'On Linux, Website and website are different names. Tab completion avoids this entirely.',
    },
  ],

  next: { id: '3', title: 'Working with files' },
};

export default lesson;
