import { DEFAULT_PROCS } from '../lib/shell/shell';
import type { Lesson } from './types';

const GB = 1024 ** 3;

const lesson: Lesson = {
  id: '11',
  number: 11,
  title: 'What’s running on your computer',
  promise: 'See every running program, stop the ones that are stuck, and find what’s filling your disk.',
  minutes: 14,
  part: 'Your system',
  commands: [
    { name: 'ps aux', does: 'List every running program, with its PID' },
    { name: 'kill', does: 'Ask a program to stop, by PID (-9 forces it)' },
    { name: 'top', does: 'Live view of what’s using your CPU and memory (q to quit)' },
    { name: 'df -h', does: 'How full your disks are' },
    { name: 'du -sh', does: 'How much space a folder or file takes' },
  ],

  fs: {
    home: {
      you: {
        videos: {
          'holiday.mp4': '(video data)\n',
          'wedding.mp4': '(video data)\n',
        },
        downloads: {
          'ubuntu-24.04.iso': '(disk image)\n',
          'notes.txt': 'Things to install\n',
        },
        logs: {
          'app.log': 'INFO  app started\n',
          'debug.log': 'DEBUG tick\nDEBUG tick\nDEBUG tick\n(the same line, billions of times)\n',
        },
        app: {
          'server.js': 'require("http").createServer().listen(3000);\n',
        },
      },
    },
    tmp: {},
  },

  fsMeta: {
    sizes: {
      'home/you/videos/holiday.mp4': 1.4 * GB,
      'home/you/videos/wedding.mp4': 2.1 * GB,
      'home/you/downloads/ubuntu-24.04.iso': 5.8 * GB,
      'home/you/logs/debug.log': 6.2 * GB,
    },
  },

  procs: [
    ...DEFAULT_PROCS,
    { pid: 733, user: 'root', command: '/usr/sbin/cron -f', cpu: 0, mem: 0.1, tty: '?', stat: 'Ss' },
    { pid: 1874, user: 'you', command: 'node server.js', cpu: 1.2, mem: 2.1, tty: 'pts/1', stat: 'Sl' },
    { pid: 2046, user: 'you', command: 'python3 resize_photos.py', cpu: 99.3, mem: 6.1, tty: 'pts/2', stat: 'R', ignoresTerm: true },
  ],

  sections: [
    {
      id: 'ps',
      label: 'ps aux',
      title: 'See what’s running',
      blocks: [
        {
          type: 'p',
          text: 'Every program running on a computer is a **process**, and each one has a number, its **PID** (process ID). `ps` on its own lists only the ones started from this terminal:',
        },
        { type: 'example', command: 'ps', output: '    PID TTY          TIME CMD\n   1201 pts/0    00:00:00 bash\n   2301 pts/0    00:00:00 ps' },
        {
          type: 'p',
          text: 'Add `aux` (no dash, an old tradition) to see everything, from every user and every terminal. The columns that matter most:',
        },
        {
          type: 'list',
          items: [
            '`USER`: who started it',
            '`PID`: its number, which you need to stop it',
            '`%CPU` and `%MEM`: how hard it’s working',
            '`COMMAND`: what it actually is',
          ],
        },
      ],
      tasks: [
        {
          id: 'ps-aux',
          prompt: 'List every running process',
          hint: 'ps aux',
          check: { kind: 'output', command: 'ps', includes: ['resize_photos.py', 'cron'] },
        },
      ],
    },

    {
      id: 'grep',
      label: 'ps | grep',
      title: 'Find one process',
      blocks: [
        {
          type: 'p',
          text: 'On a real computer `ps aux` lists hundreds of processes. Pipe it into `grep` to pick out the one you want:',
        },
        {
          type: 'example',
          command: 'ps aux | grep node',
          output: 'you         1874  1.2  2.1 450206 37517 pts/1    Sl   09:12   0:00 node server.js',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'On your own computer you’ll usually see one extra line: the `grep node` you just ran, which matches its own search.',
        },
      ],
      tasks: [
        {
          id: 'ps-grep',
          prompt: 'Find the python process and its PID',
          hint: 'ps aux | grep python',
          check: { kind: 'all', checks: [{ kind: 'ran', pipeline: ['ps', 'grep'] }, { kind: 'output', includes: ['2046'] }] },
        },
      ],
    },

    {
      id: 'kill',
      label: 'kill',
      title: 'Stop a process',
      blocks: [
        {
          type: 'p',
          text: '`kill` stops a process by its PID. Despite the name, a plain `kill` is a polite request: the program gets the chance to save its work and close properly.',
        },
        { type: 'example', command: 'kill 1874', context: true },
        {
          type: 'p',
          text: '`kill` prints nothing when it works. Run `ps aux` again to check the process has gone.',
        },
        {
          type: 'p',
          text: 'A program that’s stuck may ignore the polite request. `kill -9` forces it to stop at once, with no chance to tidy up, so try the plain version first.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'For a program running in the terminal in front of you, [[Ctrl]] + [[C]] is the same polite stop, without needing the PID.',
        },
      ],
      tasks: [
        {
          id: 'kill-node',
          prompt: 'Stop the node server',
          hint: 'Its PID is 1874: kill 1874',
          check: { kind: 'procGone', match: 'server.js' },
        },
        {
          id: 'kill-python',
          prompt: 'Stop resize_photos.py, which is stuck at 99% CPU',
          hint: 'Try kill 2046 and check with ps aux. If it’s still there: kill -9 2046',
          check: { kind: 'procGone', match: 'resize_photos.py' },
        },
      ],
    },

    {
      id: 'top',
      label: 'top',
      title: 'Watch it live',
      blocks: [
        {
          type: 'p',
          text: '`ps` is a snapshot. `top` is the live version: a full-screen list that refreshes every few seconds, with the busiest processes at the top. It’s the first thing to open when a computer suddenly gets slow.',
        },
        {
          type: 'p',
          text: 'Like `less`, it takes over the whole window, so try it on your own computer. Press [[q]] to quit.',
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac, `top -o cpu` sorts by CPU like Linux does. Activity Monitor is the app version of the same thing.',
        },
      ],
      tasks: [
        {
          id: 'top',
          prompt: 'On your own computer, run top, look at what’s busiest, then press q',
          hint: 'Open your terminal, type top, then press q to quit.',
          check: { kind: 'manual' },
        },
      ],
    },

    {
      id: 'disk',
      label: 'df du',
      title: 'What’s filling the disk?',
      blocks: [
        {
          type: 'p',
          text: '`df -h` (disk free) shows how full the disk is. The `-h` makes the sizes human-readable, like `50G` instead of `52428800`.',
        },
        {
          type: 'p',
          text: '`du -sh` (disk usage) shows how much space a folder takes. Give it several folders, or `*` for everything here, to compare them:',
        },
        { type: 'example', command: 'du -sh videos', output: '3.6G\tvideos' },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac, `df -h` lists several disks and volumes. The one mounted on `/` is your main disk.',
        },
      ],
      tasks: [
        {
          id: 'df',
          prompt: 'Check how full the disk is',
          hint: 'df -h',
          check: { kind: 'ran', command: 'df', flags: 'h' },
        },
        {
          id: 'du',
          prompt: 'See how much space each folder in your home takes',
          hint: 'du -sh *',
          check: { kind: 'ran', command: 'du', flags: 'sh' },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Free up space',
      blocks: [
        {
          type: 'p',
          text: 'The disk is nearly full. Something in your home folder has grown out of control, and it isn’t the videos or the download, which you want to keep.',
        },
        {
          type: 'p',
          text: 'Find the biggest thing you don’t need, delete it, and check with `df -h` that you got the space back.',
        },
      ],
      tasks: [
        {
          id: 'free-space',
          prompt: 'Find and delete the file that’s filling the disk',
          hint: 'du -sh * points to a folder. du -sh on that folder’s files finds the culprit. Then rm it.',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/logs/debug.log', not: true },
              { kind: 'exists', path: '~/videos/wedding.mp4', type: 'file' },
              { kind: 'exists', path: '~/downloads/ubuntu-24.04.iso', type: 'file' },
            ],
          },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q11-1',
      question: 'What do you need in order to stop a process with kill?',
      options: ['Its name', 'Its PID', 'Its file size', 'Administrator access'],
      correctAnswer: 1,
      explanation: 'kill takes the process ID. ps aux | grep name is how you find it.',
    },
    {
      id: 'q11-2',
      question: 'When should you use kill -9?',
      options: [
        'Always, it’s faster',
        'When a plain kill didn’t stop the process',
        'To stop nine processes at once',
        'Never, it deletes the program',
      ],
      correctAnswer: 1,
      explanation: '-9 forces a stop with no chance to save or tidy up. Try a plain kill first.',
    },
    {
      id: 'q11-3',
      question: 'What’s the difference between df -h and du -sh?',
      options: [
        'They’re the same',
        'df shows how full the disk is; du shows how big a folder is',
        'df deletes files; du lists them',
        'du shows the whole disk; df shows one folder',
      ],
      correctAnswer: 1,
      explanation: 'df is the whole disk’s free space. du adds up what one folder or file uses.',
    },
    {
      id: 'q11-4',
      question: 'Your laptop fan is roaring. Which command shows what’s working hardest right now?',
      options: ['top', 'df -h', 'ls -l', 'history'],
      correctAnswer: 0,
      explanation: 'top lists processes live, busiest first.',
    },
  ],

  next: { id: '12', title: 'Work faster' },
};

export default lesson;
