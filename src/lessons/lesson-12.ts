import type { Lesson } from './types';

const lesson: Lesson = {
  id: '12',
  number: 12,
  title: 'Work faster',
  promise: 'Reuse what you’ve typed, make your own shortcuts, and understand how the shell finds commands.',
  minutes: 12,
  part: 'Your system',
  commands: [
    { name: 'history', does: 'List the commands you’ve run' },
    { name: '!!', does: 'Run the last command again' },
    { name: 'alias', does: 'Make a shortcut: alias ll=\'ls -la\'' },
    { name: '$NAME', does: 'Use a variable’s value: echo $HOME' },
    { name: 'which', does: 'Show where a command’s program lives' },
  ],

  fs: {
    home: {
      you: {
        'notes.txt': 'Shortcuts save hours.\n',
        '.bashrc': '# Commands here run every time a terminal opens.\n',
        projects: {
          app: {
            'README.md': '# App\n',
            'index.js': 'console.log("hello");\n',
          },
          blog: {
            'post.md': '# First post\n',
          },
        },
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'history',
      label: 'history',
      title: 'Everything you’ve typed',
      blocks: [
        {
          type: 'p',
          text: 'The shell remembers every command. You already know [[↑]] steps back through them one at a time. `history` lists them all, numbered:',
        },
        {
          type: 'example',
          command: 'history',
          output: '    1  ls\n    2  cat notes.txt\n    3  history',
          context: true,
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'On your own computer, [[Ctrl]] + [[R]] searches your history: start typing any part of an old command and it appears. Press [[Enter]] to run it.',
        },
      ],
      tasks: [
        {
          id: 'history',
          prompt: 'Run a couple of commands, then list your history',
          hint: 'Try ls and cat notes.txt, then history',
          check: { kind: 'ran', command: 'history' },
        },
      ],
    },

    {
      id: 'bang',
      label: '!!',
      title: 'Run it again',
      blocks: [
        {
          type: 'p',
          text: '`!!` means “the last command”. The shell swaps it in and shows you what it ran. `!` followed by a number runs that line from `history`, so `!2` runs command 2 again.',
        },
        {
          type: 'p',
          text: 'Its most famous use is after a `Permission denied`: `sudo !!` reruns the same command as the administrator, without retyping it.',
        },
      ],
      tasks: [
        {
          id: 'bang-bang',
          prompt: 'Run any command, then run it again with !!',
          hint: 'pwd, then !!',
          check: { kind: 'ran', historyExpanded: true },
        },
      ],
    },

    {
      id: 'alias',
      label: 'alias',
      title: 'Make your own shortcuts',
      blocks: [
        {
          type: 'p',
          text: 'An **alias** is a short name for a longer command. Make one, and type the short name from then on:',
        },
        { type: 'example', command: "alias ll='ls -la'" },
        {
          type: 'p',
          text: 'Now `ll` runs `ls -la`. Put the command in single quotes, with no spaces around the `=`. `alias` on its own lists the ones you have.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'An alias lasts until the terminal closes. To keep it, add the same line to `~/.bashrc`, which runs every time a terminal opens. On a Mac the file is `~/.zshrc`.',
        },
      ],
      tasks: [
        {
          id: 'alias-ll',
          prompt: 'Make an alias ll for ls -la',
          hint: "alias ll='ls -la'",
          check: { kind: 'alias', name: 'll' },
        },
        {
          id: 'use-ll',
          prompt: 'Use it',
          hint: 'll',
          check: { kind: 'ran', viaAlias: 'll' },
        },
      ],
    },

    {
      id: 'vars',
      label: '$VAR',
      title: 'Variables',
      blocks: [
        {
          type: 'p',
          text: 'A **variable** is a name that holds a value. Set it with `=` and read it back with `$`:',
        },
        { type: 'example', command: 'CITY=Lisbon && echo "I live in $CITY"', output: 'I live in Lisbon' },
        {
          type: 'p',
          text: 'No spaces around the `=`. With spaces, bash thinks `CITY` is a command and says `CITY: command not found`.',
        },
        {
          type: 'p',
          text: 'Your terminal comes with variables already set. `$HOME` is your home folder and `$USER` is your username. Programs read them to learn about you.',
        },
        { type: 'example', command: 'echo $HOME', output: '/home/you' },
      ],
      tasks: [
        {
          id: 'var',
          prompt: 'Make a variable called NAME holding your name, then print it with echo',
          hint: 'NAME=Sam, then echo $NAME',
          check: { kind: 'all', checks: [{ kind: 'var', name: 'NAME' }, { kind: 'ran', command: 'echo' }] },
        },
      ],
    },

    {
      id: 'path',
      label: '$PATH',
      title: 'Where commands live',
      blocks: [
        {
          type: 'p',
          text: 'Commands like `ls` are programs: files sitting in folders. `$PATH` is the list of folders the shell searches, in order, when you type a command name:',
        },
        {
          type: 'example',
          command: 'echo $PATH',
          output: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        },
        {
          type: 'p',
          text: '`which` tells you which folder a command was found in:',
        },
        { type: 'example', command: 'which ls', output: '/usr/bin/ls' },
        {
          type: 'p',
          text: 'Your current folder isn’t on the list. That’s why a script in it needs `./` in front, and why “command not found” after installing something usually means its folder isn’t on your `PATH` yet.',
        },
      ],
      tasks: [
        {
          id: 'which',
          prompt: 'Find where the grep program lives',
          hint: 'which grep',
          check: { kind: 'output', command: 'which', includes: ['/grep'] },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'A shortcut to your project',
      blocks: [
        {
          type: 'p',
          text: 'You work in `~/projects/app` every day. Make an alias called `proj` that goes there and lists what’s inside, in one go. Then use it from your home folder.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'You joined two commands with `&&` in an earlier lesson. An alias can hold that whole line.',
        },
      ],
      tasks: [
        {
          id: 'proj-alias',
          prompt: 'Make an alias proj that goes to ~/projects/app and lists it',
          hint: "alias proj='cd ~/projects/app && ls'",
          check: { kind: 'alias', name: 'proj' },
        },
        {
          id: 'use-proj',
          prompt: 'Use proj to jump there',
          hint: 'cd ~, then proj',
          check: { kind: 'ran', viaAlias: 'proj', cwdAfter: '~/projects/app' },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q12-1',
      question: 'What does !! do?',
      options: ['Runs the last command again', 'Cancels the last command', 'Shows an error', 'Deletes your history'],
      correctAnswer: 0,
      explanation: 'The shell swaps !! for your previous command and runs it.',
    },
    {
      id: 'q12-2',
      question: 'Why does NAME = Sam fail?',
      options: [
        'Names must be lowercase',
        'The spaces make bash treat NAME as a command',
        'Sam needs quotes',
        'You must use export',
      ],
      correctAnswer: 1,
      explanation: 'Assignments need NAME=Sam with no spaces. Otherwise bash tries to run a command called NAME.',
    },
    {
      id: 'q12-3',
      question: 'You made an alias, closed the terminal, and it’s gone. How do you keep it?',
      options: [
        'Run alias --save',
        'Add the alias line to ~/.bashrc (or ~/.zshrc on a Mac)',
        'Use sudo alias',
        'Aliases can’t be kept',
      ],
      correctAnswer: 1,
      explanation: 'That file runs every time a terminal opens, so anything in it is set up for you.',
    },
    {
      id: 'q12-4',
      question: 'You installed a tool, but typing its name says “command not found”. What’s the likely cause?',
      options: [
        'Its folder isn’t on your PATH',
        'You need to restart your computer',
        'The command is too long',
        'You need chmod 777',
      ],
      correctAnswer: 0,
      explanation: 'The shell only looks in the folders listed in $PATH. Open a new terminal or add the folder to PATH.',
    },
  ],

  next: { id: '13', title: 'Final project: clean up a handoff' },
};

export default lesson;
