import type { Lesson } from './types';

const lesson: Lesson = {
  id: '7',
  number: 7,
  title: 'Connect commands',
  promise: 'Chain small commands into pipelines that answer real questions.',
  minutes: 14,
  part: 'Power tools',
  commands: [
    { name: '|', does: 'Send one command’s output into the next' },
    { name: '>', does: 'Save output to a file, replacing it' },
    { name: 'sort', does: 'Put lines in order (-r reverse, -n by number)' },
    { name: 'uniq', does: 'Drop repeated lines that sit together (-c counts them)' },
  ],

  fs: {
    home: {
      you: {
        data: {
          'names.txt': 'sam\nalex\nsam\njordan\nalex\nsam\ntaylor\njordan\nsam\nalex\n',
          'visitors.txt':
            'priya\nomar\npriya\nlee\nmia\npriya\nomar\nnoah\npriya\nlee\nomar\npriya\nmia\nlee\nomar\npriya\n',
          'scores.txt': '42\n7\n19\n100\n3\n',
        },
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'save',
      label: '>',
      title: 'Save what a command prints',
      blocks: [
        {
          type: 'p',
          text: 'You’ve used `>` with `echo`. It works with any command: whatever would have appeared on screen goes into the file instead.',
        },
        { type: 'example', command: 'ls data > data/contents.txt' },
        {
          type: 'p',
          text: 'Now `data/contents.txt` holds the list of files. Commands that print things to the screen can always save them like this.',
        },
      ],
      tasks: [
        {
          id: 'save',
          prompt: 'Save the list of files in data into data/contents.txt',
          hint: 'ls data > data/contents.txt',
          check: { kind: 'file', path: '~/data/contents.txt', includes: 'names.txt' },
        },
      ],
    },

    {
      id: 'pipe',
      label: '|',
      title: 'Pipe one command into another',
      blocks: [
        {
          type: 'p',
          text: 'The pipe, `|`, is the terminal’s superpower. It takes what the command on the left prints and feeds it straight into the command on the right, without saving anything in between.',
        },
        { type: 'example', command: 'ls data | wc -l', output: '3' },
        {
          type: 'p',
          text: '`ls` lists the files, one per line, and `wc -l` counts the lines. Neither command knows about the other. Small tools that each do one job, joined with pipes, is how most terminal work gets done.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'The `|` key is usually above [[Enter]], typed with [[Shift]] + [[\\\\]].',
        },
      ],
      tasks: [
        {
          id: 'pipe',
          prompt: 'Count the files in data with ls, a pipe and wc -l',
          hint: 'ls data | wc -l',
          check: { kind: 'ran', pipeline: ['ls', 'wc'] },
        },
      ],
    },

    {
      id: 'sort',
      label: 'sort',
      title: 'Put lines in order',
      blocks: [
        {
          type: 'p',
          text: '`sort` puts lines in alphabetical order. `-r` reverses it, and `-n` sorts by number:',
        },
        { type: 'example', command: 'sort -n data/scores.txt', output: '3\n7\n19\n42\n100' },
        {
          type: 'p',
          text: 'Without `-n`, `sort` compares numbers as text, so `100` lands before `19`, just as “apple” lands before “apples”.',
        },
      ],
      tasks: [
        {
          id: 'sort',
          prompt: 'Sort the names in data/names.txt',
          hint: 'sort data/names.txt',
          check: { kind: 'output', command: 'sort', includes: ['alex\nalex\nalex\njordan'] },
        },
      ],
    },

    {
      id: 'uniq',
      label: 'uniq',
      title: 'Remove repeats',
      blocks: [
        {
          type: 'p',
          text: '`uniq` drops a line when it’s the same as the one directly above it. Only next-door repeats count, so on its own it misses most duplicates.',
        },
        {
          type: 'p',
          text: 'That’s why it nearly always comes after `sort`, which puts identical lines next to each other:',
        },
        { type: 'example', command: 'sort data/names.txt | uniq', output: 'alex\njordan\nsam\ntaylor' },
      ],
      tasks: [
        {
          id: 'uniq',
          prompt: 'List each name in data/names.txt only once',
          hint: 'sort data/names.txt | uniq',
          check: {
            kind: 'all',
            checks: [
              { kind: 'ran', pipeline: ['sort', 'uniq'] },
              { kind: 'output', includes: ['alex\njordan\nsam\ntaylor'], excludes: ['sam\nsam'] },
            ],
          },
        },
      ],
    },

    {
      id: 'count',
      label: 'uniq -c',
      title: 'Count and rank',
      blocks: [
        {
          type: 'p',
          text: 'Add `-c` and `uniq` counts how many times each line appeared:',
        },
        {
          type: 'example',
          command: 'sort data/names.txt | uniq -c',
          output: '      3 alex\n      2 jordan\n      4 sam\n      1 taylor',
        },
        {
          type: 'p',
          text: 'Pipe that into `sort -rn` and the biggest count rises to the top. Add `head -n 1` and you have the winner. Four small commands answering a real question.',
        },
      ],
      tasks: [
        {
          id: 'count',
          prompt: 'Show how many times each name appears',
          hint: 'sort data/names.txt | uniq -c',
          check: { kind: 'ran', command: 'uniq', flags: 'c', pipeline: ['sort', 'uniq'] },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Who visits most?',
      blocks: [
        {
          type: 'p',
          text: '`data/visitors.txt` has a name for every visit to a website. Find out who visits most, then save just that top line to `data/top-visitor.txt`.',
        },
        {
          type: 'p',
          text: 'Build the pipeline a piece at a time. Run it after each new `|` to see what the next command will receive.',
        },
      ],
      tasks: [
        {
          id: 'top-visitor',
          prompt: 'Find the visitor with the most visits, with their count',
          hint: 'sort data/visitors.txt | uniq -c | sort -rn',
          check: { kind: 'output', includes: ['6 priya'] },
        },
        {
          id: 'save-top',
          prompt: 'Save only the top line to data/top-visitor.txt',
          hint: 'Add | head -n 1 > data/top-visitor.txt to the end of your pipeline',
          check: { kind: 'file', path: '~/data/top-visitor.txt', includes: 'priya', excludes: ['omar', 'lee'] },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q7-1',
      question: 'What does | do in ls | wc -l?',
      options: [
        'Runs both commands at the same time, separately',
        'Sends what ls prints into wc -l',
        'Saves ls’s output to a file called wc',
        'Runs wc only if ls worked',
      ],
      correctAnswer: 1,
      explanation: 'The pipe connects the output of the left command to the input of the right one.',
    },
    {
      id: 'q7-2',
      question: 'Why does uniq usually come after sort?',
      options: [
        'uniq only removes repeats that sit next to each other',
        'uniq only works on sorted files',
        'sort makes uniq faster',
        'It doesn’t matter which comes first',
      ],
      correctAnswer: 0,
      explanation: 'Sorting puts identical lines together, so uniq can catch every duplicate.',
    },
    {
      id: 'q7-3',
      question: 'What’s the difference between cmd > file and cmd | other?',
      options: [
        'None, they do the same thing',
        '> saves output to a file; | feeds it to another command',
        '> feeds another command; | saves to a file',
        '| only works with text files',
      ],
      correctAnswer: 1,
      explanation: '> ends the line of work in a file. | passes the work on to the next command.',
    },
    {
      id: 'q7-4',
      question: 'Which pipeline shows the 3 most common lines in log.txt?',
      options: [
        'uniq -c log.txt | head -n 3',
        'sort log.txt | uniq -c | sort -rn | head -n 3',
        'head -n 3 log.txt | sort',
        'sort -rn log.txt | uniq | head -n 3',
      ],
      correctAnswer: 1,
      explanation: 'Sort to group, uniq -c to count, sort -rn to rank by count, head to keep the top three.',
    },
  ],

  next: { id: '8', title: 'Find anything' },
};

export default lesson;
