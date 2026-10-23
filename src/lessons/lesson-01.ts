import type { Lesson } from './types';

const lesson: Lesson = {
  id: '1',
  number: 1,
  title: 'Meet the terminal',
  promise: 'Read the prompt, run your first commands, and open the terminal on your own computer.',
  minutes: 10,
  part: 'Getting started',
  commands: [
    { name: 'whoami', does: 'Print the user you’re logged in as' },
    { name: 'date', does: 'Print the date and time' },
    { name: 'echo', does: 'Print its arguments back' },
    { name: 'clear', does: 'Clear the screen (or Ctrl+L)' },
    { name: 'Ctrl+C', does: 'Cancel the current line or stop a running program' },
  ],

  fs: {
    home: {
      you: {
        'notes.txt': 'Your first file. You’ll learn to read files like this in lesson 3.\n',
        documents: {},
        projects: {},
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'what',
      label: 'terminal',
      title: 'What the terminal is',
      blocks: [
        {
          type: 'p',
          text: 'The terminal is a window where you control your computer by typing instead of clicking. You type a command, press [[Enter]], and the computer does it and shows you the result as text.',
        },
        {
          type: 'p',
          text: 'It looks bare, but it’s where most real software work happens: running code, using git, managing servers. If you use AI coding tools, you’ve already watched them type commands into one. Knowing what those commands do is the difference between steering and hoping.',
        },
        {
          type: 'p',
          text: 'Try your first command now. `whoami` prints the name of the user you’re logged in as.',
        },
      ],
      tasks: [
        {
          id: 'whoami',
          prompt: 'Run whoami',
          hint: 'Click the terminal, type whoami and press Enter.',
          check: { kind: 'ran', command: 'whoami' },
        },
      ],
    },

    {
      id: 'prompt',
      label: 'prompt',
      title: 'Reading the prompt',
      blocks: [
        {
          type: 'p',
          text: 'Every line in the terminal starts with a **prompt**. It means the terminal is ready for you, and it tells you who and where you are:',
        },
        { type: 'prompt' },
        {
          type: 'list',
          items: [
            '`you`: the user you’re logged in as. It’s what `whoami` just printed.',
            '`terminal-mastery`: the name of the computer.',
            '`~`: the folder you’re in. `~` is short for your home folder.',
            '`$`: the end of the prompt. You type after it.',
          ],
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac the prompt usually looks like `you@MacBook ~ %`. It ends with `%` instead of `$` because Macs use a shell called zsh, but it works the same way.',
        },
      ],
      tasks: [],
    },

    {
      id: 'commands',
      label: 'date',
      title: 'A command is a word',
      blocks: [
        {
          type: 'p',
          text: 'A command is the name of a program, usually short. Type it, press [[Enter]], and the program runs and prints its result.',
        },
        { type: 'example', command: 'date', output: 'Thu Oct 22 14:03:22 UTC 2026', context: true },
        {
          type: 'p',
          text: '`date` prints today’s date and the current time. Run it and you’ll see the real time right now.',
        },
        {
          type: 'p',
          text: 'Commands are case-sensitive: `date` works and `Date` doesn’t. Almost every command is lowercase.',
        },
      ],
      tasks: [
        {
          id: 'date',
          prompt: 'Run date',
          hint: 'Type date and press Enter.',
          check: { kind: 'ran', command: 'date' },
        },
      ],
    },

    {
      id: 'arguments',
      label: 'echo',
      title: 'Telling a command what to work on',
      blocks: [
        {
          type: 'p',
          text: 'Most commands take extra words that tell them what to work on. These are called **arguments**. `echo` simply prints its arguments back:',
        },
        { type: 'example', command: 'echo Hello there', output: 'Hello there' },
        {
          type: 'p',
          text: 'The command always comes first, then a space, then its arguments. Every command in this course has that shape: `cd projects`, `ls documents`, `cat notes.txt`.',
        },
        {
          type: 'p',
          text: 'Some arguments start with a dash, like `ls -a`. Those are **options**, and they change how a command behaves. You’ll use your first one in the next lesson.',
        },
      ],
      tasks: [
        {
          id: 'echo',
          prompt: 'Make the terminal say your name with echo',
          hint: 'Type echo, a space, then your name. For example: echo Sam',
          check: { kind: 'ran', command: 'echo', hasArgs: true },
        },
      ],
    },

    {
      id: 'mistakes',
      label: 'errors',
      title: 'Mistakes are safe',
      blocks: [
        {
          type: 'p',
          text: 'You will mistype things. Everyone does, all the time. Here’s what happens:',
        },
        { type: 'example', command: 'whomai', output: 'bash: whomai: command not found' },
        {
          type: 'p',
          text: 'Nothing broke. The terminal is telling you exactly what happened: there’s no command called `whomai`. Fix the typo and run it again.',
        },
        {
          type: 'p',
          text: 'Always read the error first. Error messages are short and literal, and they usually tell you the fix.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Press [[↑]] to bring back your last command. You can fix a typo without retyping the whole line.',
        },
      ],
      tasks: [
        {
          id: 'typo',
          prompt: 'Run a command that doesn’t exist, then read the error',
          hint: 'Try a typo on purpose, like whomai.',
          check: { kind: 'ran', ok: false },
        },
      ],
    },

    {
      id: 'escape',
      label: 'Ctrl+C',
      title: 'Two ways out',
      blocks: [
        { type: 'p', text: 'Two keys get you out of almost anything.' },
        {
          type: 'p',
          text: '[[Ctrl]] + [[C]] cancels. If you’ve typed a line you don’t want, it throws it away. If a program is running and won’t stop, it stops it.',
        },
        {
          type: 'p',
          text: '`clear` wipes the screen when it gets cluttered, and [[Ctrl]] + [[L]] does the same. It only tidies the screen. Your files and your command history aren’t touched.',
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac it’s still [[Ctrl]] + [[C]], not [[Cmd]] + [[C]]. In a terminal, [[Cmd]] + [[C]] copies text instead.',
        },
      ],
      tasks: [
        {
          id: 'ctrl-c',
          prompt: 'Type something, then cancel it with Ctrl+C',
          hint: 'Type a few letters without pressing Enter, then hold Ctrl and press C.',
          check: { kind: 'ran', command: '^C' },
        },
        {
          id: 'clear',
          prompt: 'Clear the screen',
          hint: 'Type clear and press Enter, or press Ctrl+L.',
          check: { kind: 'ran', command: 'clear' },
        },
      ],
    },

    {
      id: 'real',
      label: 'your computer',
      title: 'Open your real terminal',
      blocks: [
        {
          type: 'p',
          text: 'The terminal on this page is for practice. It’s safe and always set up the same way. The one on your own computer is the real thing, and that’s where these skills pay off. Open it now:',
        },
        {
          type: 'list',
          items: [
            '**Mac:** press [[Cmd]] + [[Space]], type `Terminal`, then press [[Enter]].',
            '**Windows:** install WSL, which gives you a real Linux terminal. Open PowerShell as administrator, run `wsl --install`, restart, then open **Ubuntu** from the Start menu and follow the setup.',
            '**Linux:** press [[Ctrl]] + [[Alt]] + [[T]] on Ubuntu and many other desktops, or search your apps for Terminal.',
          ],
        },
        {
          type: 'p',
          text: 'Then type `whoami` and press [[Enter]]. You’ll see your own username.',
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'Windows also has PowerShell and Command Prompt, but they use different commands. This course teaches the commands Mac and Linux share, which is why Windows users need WSL.',
        },
      ],
      tasks: [
        {
          id: 'real-terminal',
          prompt: 'Open the terminal on your own computer and run whoami',
          hint: 'Follow the steps for your computer above, then click I did it.',
          check: { kind: 'manual' },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q1-1',
      question: 'Your prompt reads you@laptop:~$. What does the ~ tell you?',
      options: [
        'The terminal is busy',
        'You’re in your home folder',
        'You’re logged in as an administrator',
        'The last command failed',
      ],
      correctAnswer: 1,
      explanation: '~ is short for your home folder. The part of the prompt after the colon always shows the folder you’re in.',
    },
    {
      id: 'q1-2',
      question: 'You type whomai and see “command not found”. What happened?',
      options: [
        'Your account was locked',
        'The terminal crashed and needs restarting',
        'There’s no command with that name, so it’s probably a typo',
        'You need to install whomai',
      ],
      correctAnswer: 2,
      explanation: '“Command not found” means exactly that. Nothing broke. Fix the spelling (whoami) and run it again.',
    },
    {
      id: 'q1-3',
      question: 'You’ve half-typed a long command and want to start over. What do you press?',
      options: ['Ctrl + C', 'Ctrl + Z', 'Escape', 'Cmd + C'],
      correctAnswer: 0,
      explanation: 'Ctrl + C throws away the current line, and stops a running program too. On a Mac, Cmd + C copies text instead.',
    },
    {
      id: 'q1-4',
      question: 'In echo hello world, which part is the command?',
      options: ['echo', 'hello', 'world', 'hello world'],
      correctAnswer: 0,
      explanation: 'The command always comes first. Everything after it, here hello world, is its arguments.',
    },
  ],

  next: { id: '2', title: 'Moving around' },
};

export default lesson;
