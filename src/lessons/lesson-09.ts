import type { Lesson } from './types';

const lesson: Lesson = {
  id: '9',
  number: 9,
  title: 'Permissions and scripts',
  promise: 'Read who can do what to a file, run your own scripts, and keep private files private.',
  minutes: 14,
  part: 'Your system',
  commands: [
    { name: 'ls -l', does: 'List files with their permissions, owner and size' },
    { name: 'chmod', does: 'Change who can read, write or run a file (+x, 600, 755)' },
    { name: './script.sh', does: 'Run a script in the current folder' },
    { name: 'sudo', does: 'Run a command as the administrator (asks for your password)' },
  ],

  fs: {
    home: {
      you: {
        'notes.txt': 'Remember: chmod +x makes a file runnable.\n',
        'diary.txt': 'Dear diary, today I learned about permissions.\n',
        scripts: {
          'hello.sh': '#!/bin/bash\necho "Hello from a script!"\n',
          'backup.sh':
            '#!/bin/bash\n# Copy notes.txt into a backup folder\nmkdir -p ~/backup\ncp ~/notes.txt ~/backup/notes.txt\necho "Backed up notes.txt to ~/backup"\n',
        },
      },
    },
    etc: {
      hosts: '127.0.0.1   localhost\n::1         localhost\n',
    },
    tmp: {},
  },

  sections: [
    {
      id: 'read',
      label: 'ls -l',
      title: 'Read the permissions',
      blocks: [
        {
          type: 'p',
          text: 'Every file has rules about who may read it, change it and run it. `ls -l` (a lowercase L, for “long”) shows them:',
        },
        {
          type: 'example',
          command: 'ls -l scripts',
          output:
            'total 8\n-rw-r--r--  1 you  you    141 Oct 21 09:14 backup.sh\n-rw-r--r--  1 you  you     40 Oct 21 09:14 hello.sh',
        },
        {
          type: 'p',
          text: 'The first column is the one that matters. Skip the first character (`-` for a file, `d` for a folder) and read the rest in three groups of three:',
        },
        {
          type: 'list',
          items: [
            '`rw-` is what **you**, the owner, can do: read and write',
            '`r--` is what your **group** can do: read only',
            '`r--` is what **everyone else** can do: read only',
          ],
        },
        {
          type: 'p',
          text: '`r` is read, `w` is write, `x` is execute (run it as a program), and `-` means no. Then come the owner’s name, the group, the size in bytes, and when it last changed.',
        },
      ],
      tasks: [
        {
          id: 'ls-l',
          prompt: 'Show the permissions of the files in scripts',
          hint: 'ls -l scripts',
          check: { kind: 'all', checks: [{ kind: 'ran', command: 'ls', flags: 'l' }, { kind: 'listed', path: '~/scripts' }] },
        },
      ],
    },

    {
      id: 'run',
      label: './',
      title: 'Try to run a script',
      blocks: [
        {
          type: 'p',
          text: 'A **script** is a text file full of commands, run from top to bottom. `scripts/hello.sh` is one. Let’s look inside:',
        },
        { type: 'example', command: 'cat scripts/hello.sh', output: '#!/bin/bash\necho "Hello from a script!"' },
        {
          type: 'p',
          text: 'The first line tells the computer to run it with bash. To run a script, type its path. A script in the folder you’re in needs `./` in front, meaning “this folder”: `./hello.sh`.',
        },
        {
          type: 'p',
          text: 'Try running it. Look back at its permissions first and see if you can guess what will happen.',
        },
      ],
      tasks: [
        {
          id: 'denied',
          prompt: 'Run scripts/hello.sh',
          hint: 'Type the path: ./scripts/hello.sh',
          check: { kind: 'exec', path: '~/scripts/hello.sh', ok: false },
        },
      ],
    },

    {
      id: 'chmod-x',
      label: 'chmod +x',
      title: 'Make it runnable',
      blocks: [
        {
          type: 'p',
          text: '`Permission denied`, because the script has no `x`. Nobody is allowed to run it yet. `chmod` (change mode) changes permissions, and `+x` adds execute:',
        },
        { type: 'example', command: 'chmod +x scripts/hello.sh', context: true },
        {
          type: 'p',
          text: 'Check with `ls -l` again and you’ll see `-rwxr-xr-x`. Now it runs.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Downloaded a script and it won’t run? This is nearly always why. `chmod +x` is one of the commands developers type most.',
        },
      ],
      tasks: [
        {
          id: 'chmod-x',
          prompt: 'Make scripts/hello.sh executable',
          hint: 'chmod +x scripts/hello.sh',
          check: { kind: 'mode', path: '~/scripts/hello.sh', executable: true },
        },
        {
          id: 'run-hello',
          prompt: 'Run it',
          hint: './scripts/hello.sh',
          check: { kind: 'exec', path: '~/scripts/hello.sh', ok: true },
        },
      ],
    },

    {
      id: 'numbers',
      label: 'chmod 600',
      title: 'Permissions as numbers',
      blocks: [
        {
          type: 'p',
          text: 'You’ll often see permissions written as three digits, like `chmod 755`. Each digit is one group (you, group, everyone), made by adding up:',
        },
        {
          type: 'list',
          items: ['`4` read', '`2` write', '`1` execute'],
        },
        {
          type: 'p',
          text: 'So `7` is 4+2+1, everything. `6` is read and write. `0` is nothing at all. The ones you’ll see most:',
        },
        {
          type: 'list',
          items: [
            '`755` (`rwxr-xr-x`): scripts and programs. You can change it, everyone can run it',
            '`644` (`rw-r--r--`): ordinary files. You can change it, everyone can read it',
            '`600` (`rw-------`): private files. Only you can read or change it',
          ],
        },
      ],
      tasks: [
        {
          id: 'chmod-600',
          prompt: 'Make diary.txt private, so only you can read or change it',
          hint: 'chmod 600 diary.txt',
          check: { kind: 'mode', path: '~/diary.txt', octal: 0o600 },
        },
      ],
    },

    {
      id: 'sudo',
      label: 'sudo',
      title: 'Files that aren’t yours',
      blocks: [
        {
          type: 'p',
          text: 'You can only change the permissions of files you own. The system’s own files belong to **root**, the administrator account. Try changing one:',
        },
        {
          type: 'example',
          command: 'chmod 777 /etc/hosts',
          output: "chmod: changing permissions of '/etc/hosts': Operation not permitted",
        },
        {
          type: 'p',
          text: 'On your own computer, `sudo` (“superuser do”) runs a single command as root, after asking for your password: `sudo chmod 644 /etc/hosts`. It can change anything, including things that break your computer, so only use it when you know why you need it.',
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac the error reads `chmod: Unable to change file mode on /etc/hosts: Operation not permitted`.',
        },
      ],
      tasks: [
        {
          id: 'not-yours',
          prompt: 'Try to change the permissions of /etc/hosts',
          hint: 'chmod 777 /etc/hosts',
          check: { kind: 'ran', command: 'chmod', ok: false },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Run the backup',
      blocks: [
        {
          type: 'p',
          text: '`scripts/backup.sh` copies your notes into a backup folder. Read it to see what it does, then get it running.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Reading a script before you run it is a good habit, especially one you downloaded.',
        },
      ],
      tasks: [
        {
          id: 'backup',
          prompt: 'Run scripts/backup.sh so it makes ~/backup/notes.txt',
          hint: 'chmod +x scripts/backup.sh, then ./scripts/backup.sh',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exec', path: '~/scripts/backup.sh', ok: true },
              { kind: 'exists', path: '~/backup/notes.txt', type: 'file' },
            ],
          },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q9-1',
      question: 'A file shows -rw-r--r--. Who can change it?',
      options: ['Everyone', 'Only the owner', 'The owner and the group', 'Nobody'],
      correctAnswer: 1,
      explanation: 'Only the first group (the owner) has w. The group and everyone else have r-- only.',
    },
    {
      id: 'q9-2',
      question: './deploy.sh says Permission denied. What’s the usual fix?',
      options: ['sudo ./deploy.sh', 'chmod +x deploy.sh', 'rm deploy.sh', 'cat deploy.sh'],
      correctAnswer: 1,
      explanation: 'The script isn’t allowed to run yet. chmod +x adds execute permission. sudo is the wrong tool here.',
    },
    {
      id: 'q9-3',
      question: 'What does chmod 600 secrets.txt do?',
      options: [
        'Lets everyone read it',
        'Makes it runnable',
        'Only you can read or change it',
        'Deletes it after 600 seconds',
      ],
      correctAnswer: 2,
      explanation: '6 is read + write for you, and 0 means nothing for the group and everyone else.',
    },
    {
      id: 'q9-4',
      question: 'What does sudo do?',
      options: [
        'Runs a command as the administrator',
        'Undoes the last command',
        'Shows a command’s permissions',
        'Makes a command run faster',
      ],
      correctAnswer: 0,
      explanation: 'sudo runs one command as root after asking for your password. Use it sparingly.',
    },
  ],

  next: { id: '10', title: 'Edit files with nano' },
};

export default lesson;
