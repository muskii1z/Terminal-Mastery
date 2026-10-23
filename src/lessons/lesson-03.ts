import type { Lesson } from './types';

const lesson: Lesson = {
  id: '3',
  number: 3,
  title: 'Make files and folders',
  promise: 'Create folders and files, and put words in them, without leaving the terminal.',
  minutes: 12,
  part: 'Working with files',
  commands: [
    { name: 'mkdir', does: 'Make a folder (-p makes the folders above it too)' },
    { name: 'touch', does: 'Make an empty file' },
    { name: 'cat', does: 'Print everything in a file' },
    { name: '>', does: 'Send output into a file, replacing what was there' },
    { name: '>>', does: 'Add output to the end of a file' },
  ],

  fs: {
    home: {
      you: {
        documents: {
          'todo.txt': '- buy milk\n- finish lesson 3\n- water the plants\n',
        },
        downloads: {},
        projects: {},
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'mkdir',
      label: 'mkdir',
      title: 'Make a folder',
      blocks: [
        {
          type: 'p',
          text: '`mkdir` (make directory) creates a new folder. Give it the name you want:',
        },
        { type: 'example', command: 'mkdir notes' },
        {
          type: 'p',
          text: 'Like `cd`, it prints nothing when it works. Run `ls` to see the new folder, and watch it appear on the map.',
        },
      ],
      tasks: [
        {
          id: 'mkdir-notes',
          prompt: 'Make a folder called notes in your home folder',
          hint: 'From your home folder: mkdir notes',
          check: { kind: 'exists', path: '~/notes', type: 'dir' },
        },
      ],
    },

    {
      id: 'parents',
      label: 'mkdir -p',
      title: 'Make several levels at once',
      blocks: [
        {
          type: 'p',
          text: '`mkdir` makes one folder, and the folder it goes in must already exist. Ask for a folder two levels deep and it refuses:',
        },
        {
          type: 'example',
          command: 'mkdir projects/blog/posts',
          output: "mkdir: cannot create directory 'projects/blog/posts': No such file or directory",
        },
        {
          type: 'p',
          text: 'The `-p` option (for “parents”) makes every missing folder along the way:',
        },
        { type: 'example', command: 'mkdir -p projects/blog/posts' },
        {
          type: 'note',
          tone: 'tip',
          text: '`-p` also stops `mkdir` complaining when a folder already exists, which is handy in scripts.',
        },
      ],
      tasks: [
        {
          id: 'mkdir-p',
          prompt: 'Make projects/blog/posts in one command',
          hint: 'mkdir -p projects/blog/posts',
          check: {
            kind: 'all',
            checks: [
              { kind: 'ran', command: 'mkdir', flags: 'p' },
              { kind: 'exists', path: '~/projects/blog/posts', type: 'dir' },
            ],
          },
        },
      ],
    },

    {
      id: 'touch',
      label: 'touch',
      title: 'Make an empty file',
      blocks: [
        {
          type: 'p',
          text: '`touch` creates an empty file:',
        },
        { type: 'example', command: 'touch notes/ideas.txt', context: true },
        {
          type: 'p',
          text: 'If the file already exists, `touch` leaves what’s in it alone and only updates its “last modified” time. That’s where the odd name comes from.',
        },
        {
          type: 'p',
          text: 'Files don’t need an extension like `.txt`, but one tells you, and other programs, what’s inside.',
        },
      ],
      tasks: [
        {
          id: 'touch',
          prompt: 'Create an empty file called ideas.txt inside notes',
          hint: 'touch notes/ideas.txt',
          check: { kind: 'exists', path: '~/notes/ideas.txt', type: 'file' },
        },
      ],
    },

    {
      id: 'cat',
      label: 'cat',
      title: 'Look inside a file',
      blocks: [
        {
          type: 'p',
          text: '`cat` prints everything in a file. The name is short for “concatenate”, because it can join several files together.',
        },
        {
          type: 'example',
          command: 'cat documents/todo.txt',
          output: '- buy milk\n- finish lesson 3\n- water the plants',
        },
        {
          type: 'p',
          text: 'Run `cat` on an empty file and you get nothing back. That isn’t an error; there’s just nothing in it.',
        },
      ],
      tasks: [
        {
          id: 'cat',
          prompt: 'Show what’s in documents/todo.txt',
          hint: 'cat documents/todo.txt',
          check: { kind: 'read', path: '~/documents/todo.txt' },
        },
      ],
    },

    {
      id: 'redirect',
      label: '>  >>',
      title: 'Put words into a file',
      blocks: [
        {
          type: 'p',
          text: 'Normally a command’s output appears on screen. Add `>` and a file name, and the output goes into the file instead:',
        },
        { type: 'example', command: 'echo "Learn the terminal" > notes/ideas.txt', context: true },
        {
          type: 'p',
          text: 'Nothing prints, because the words went into the file. Check with `cat notes/ideas.txt`.',
        },
        {
          type: 'p',
          text: 'Be careful: `>` replaces whatever was in the file. To add to the end instead, use `>>`:',
        },
        { type: 'example', command: 'echo "Build something" >> notes/ideas.txt', context: true },
        {
          type: 'note',
          tone: 'tip',
          text: '`>` creates the file if it doesn’t exist, so `echo hello > new.txt` is another way to make a file.',
        },
      ],
      tasks: [
        {
          id: 'write',
          prompt: 'Write a line into notes/ideas.txt using echo and >',
          hint: 'echo "Learn the terminal" > notes/ideas.txt',
          check: { kind: 'file', path: '~/notes/ideas.txt', nonEmpty: true },
        },
        {
          id: 'append',
          prompt: 'Add a second line to it with >>',
          hint: 'echo "Build something" >> notes/ideas.txt, then cat it to check',
          check: { kind: 'file', path: '~/notes/ideas.txt', minLines: 2 },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Set up a project',
      blocks: [
        {
          type: 'p',
          text: 'Put it together. Inside `projects`, build this, then check it with `ls`:',
        },
        {
          type: 'list',
          items: [
            'A folder called `portfolio`, with an empty `images` folder inside it',
            '`index.html` and `about.html` inside `portfolio`',
            'At least one line of text in `index.html`. Anything works, for example `<h1>Hello</h1>`.',
          ],
        },
      ],
      tasks: [
        {
          id: 'portfolio-dirs',
          prompt: 'Make projects/portfolio with an images folder inside it',
          hint: 'mkdir -p makes both at once: mkdir -p projects/portfolio/images',
          check: { kind: 'exists', path: '~/projects/portfolio/images', type: 'dir' },
        },
        {
          id: 'portfolio-files',
          prompt: 'Create index.html and about.html inside portfolio',
          hint: 'touch can make two files at once: touch projects/portfolio/index.html projects/portfolio/about.html',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/projects/portfolio/index.html', type: 'file' },
              { kind: 'exists', path: '~/projects/portfolio/about.html', type: 'file' },
            ],
          },
        },
        {
          id: 'portfolio-content',
          prompt: 'Put a line of text in index.html',
          hint: 'echo "<h1>Hello</h1>" > projects/portfolio/index.html',
          check: { kind: 'file', path: '~/projects/portfolio/index.html', nonEmpty: true },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q3-1',
      question: 'None of the folders a, b or c exist. What does mkdir -p a/b/c do?',
      options: ['Shows an error', 'Creates all three folders', 'Creates only c', 'Creates a file called c'],
      correctAnswer: 1,
      explanation: '-p makes every missing folder along the way. Without it, mkdir would refuse because a/b doesn’t exist.',
    },
    {
      id: 'q3-2',
      question: 'You run touch report.txt, and report.txt already has text in it. What happens?',
      options: [
        'The file is emptied',
        'The file is deleted',
        'The text stays; only its “last modified” time changes',
        'The file is printed on screen',
      ],
      correctAnswer: 2,
      explanation: 'touch never changes what’s inside a file. On an existing file it only updates the timestamp.',
    },
    {
      id: 'q3-3',
      question: 'What’s the difference between > and >>?',
      options: [
        'There is no difference',
        '> replaces what’s in the file; >> adds to the end',
        '> adds to the end; >> replaces what’s in the file',
        '>> only works on empty files',
      ],
      correctAnswer: 1,
      explanation: 'One arrow replaces, two arrows append. Mixing them up is a classic way to lose a file’s contents.',
    },
    {
      id: 'q3-4',
      question: 'You run echo hi > notes.txt and nothing appears on screen. Why?',
      options: [
        'echo is broken',
        'The output went into notes.txt instead',
        'You need to press Enter twice',
        'notes.txt is hidden',
      ],
      correctAnswer: 1,
      explanation: '> sends the output into the file. Run cat notes.txt and you’ll see hi.',
    },
  ],

  next: { id: '4', title: 'Copy, move and delete' },
};

export default lesson;
