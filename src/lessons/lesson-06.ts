import type { FsSeed } from '@/lib/shell/fs';
import type { Lesson } from './types';

const photos: FsSeed = {};
for (let i = 1; i <= 12; i++) photos[`IMG_${String(i).padStart(3, '0')}.jpg`] = '(image data)\n';
Object.assign(photos, {
  'screenshot-1.png': '(image data)\n',
  'screenshot-2.png': '(image data)\n',
  'screenshot-3.png': '(image data)\n',
  'vacation.png': '(image data)\n',
  'notes.txt': 'Which photos to keep?\n',
});

const lesson: Lesson = {
  id: '6',
  number: 6,
  title: 'Match many files at once',
  promise: 'Use wildcards to work with whole groups of files in a single command.',
  minutes: 12,
  part: 'Working with files',
  commands: [
    { name: '*', does: 'Matches any run of characters: *.png' },
    { name: '?', does: 'Matches exactly one character: IMG_00?.jpg' },
    { name: '[ ]', does: 'Matches one of a set: screenshot-[13].png' },
  ],

  fs: {
    home: {
      you: {
        photos,
        downloads: {
          'invoice-march.pdf': '(PDF data)\n',
          'invoice-april.pdf': '(PDF data)\n',
          'setup.tmp': 'temporary\n',
          'cache.tmp': 'temporary\n',
          'debug.tmp': 'temporary\n',
          'song.mp3': '(audio data)\n',
        },
        documents: {},
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'star',
      label: '*',
      title: 'Any characters',
      blocks: [
        {
          type: 'p',
          text: 'Typing file names one by one gets old fast. A **wildcard** describes a whole group of names at once. The most useful is `*`, which matches any run of characters:',
        },
        {
          type: 'example',
          command: 'ls photos/*.png',
          output: 'photos/screenshot-1.png  photos/screenshot-2.png  photos/screenshot-3.png  photos/vacation.png',
        },
        {
          type: 'p',
          text: '`*.png` means “anything that ends in .png”. `report*` would mean “anything that starts with report”.',
        },
      ],
      tasks: [
        {
          id: 'star',
          prompt: 'List only the .png files in photos',
          hint: 'ls photos/*.png',
          check: {
            kind: 'output',
            command: 'ls',
            includes: ['vacation.png', 'screenshot-1.png'],
            excludes: ['IMG_001.jpg', 'notes.txt'],
          },
        },
      ],
    },

    {
      id: 'shell',
      label: 'echo *',
      title: 'The shell does the matching',
      blocks: [
        {
          type: 'p',
          text: 'Here’s the important part: `ls` never sees the `*`. Before running anything, the shell swaps the pattern for the list of matching names. `echo` shows you exactly what it became:',
        },
        { type: 'example', command: 'echo photos/screenshot*', output: 'photos/screenshot-1.png photos/screenshot-2.png photos/screenshot-3.png' },
        {
          type: 'list',
          items: [
            'Hidden files are never matched, because `*` won’t match a leading dot.',
            'Quotes switch matching off: `echo "*.png"` prints `*.png` as written.',
            'If nothing matches, the pattern is passed along as typed, and the command usually complains it can’t find a file called `*.gif`.',
          ],
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac, zsh stops before running the command when nothing matches, and says `zsh: no matches found: *.gif` instead.',
        },
      ],
      tasks: [
        {
          id: 'echo-glob',
          prompt: 'Use echo to see what photos/*.jpg turns into',
          hint: 'echo photos/*.jpg',
          check: { kind: 'output', command: 'echo', includes: ['IMG_001.jpg', 'IMG_012.jpg'] },
        },
      ],
    },

    {
      id: 'question',
      label: '?',
      title: 'Exactly one character',
      blocks: [
        {
          type: 'p',
          text: '`?` matches exactly one character, no more and no fewer. `IMG_00?.jpg` matches `IMG_001.jpg` to `IMG_009.jpg`, but not `IMG_010.jpg`, because that needs two characters where the `?` is.',
        },
        {
          type: 'example',
          command: 'ls photos/IMG_01?.jpg',
          output: 'photos/IMG_010.jpg  photos/IMG_011.jpg  photos/IMG_012.jpg',
        },
      ],
      tasks: [
        {
          id: 'question',
          prompt: 'List IMG_001.jpg to IMG_009.jpg, but not 010 to 012',
          hint: 'ls photos/IMG_00?.jpg',
          check: {
            kind: 'output',
            command: 'ls',
            includes: ['IMG_001.jpg', 'IMG_009.jpg'],
            excludes: ['IMG_010.jpg', 'IMG_012.jpg'],
          },
        },
      ],
    },

    {
      id: 'brackets',
      label: '[ ]',
      title: 'One of these',
      blocks: [
        {
          type: 'p',
          text: 'Square brackets match one character from a set. `screenshot-[12].png` matches screenshots 1 and 2. A dash makes a range, so `[1-3]` means 1, 2 or 3.',
        },
        { type: 'example', command: 'echo photos/screenshot-[12].png', output: 'photos/screenshot-1.png photos/screenshot-2.png' },
      ],
      tasks: [
        {
          id: 'brackets',
          prompt: 'List screenshot-1.png and screenshot-3.png, but not screenshot-2.png',
          hint: 'ls photos/screenshot-[13].png',
          check: {
            kind: 'output',
            command: 'ls',
            includes: ['screenshot-1.png', 'screenshot-3.png'],
            excludes: ['screenshot-2.png'],
          },
        },
      ],
    },

    {
      id: 'everywhere',
      label: 'mv *',
      title: 'Wildcards work everywhere',
      blocks: [
        {
          type: 'p',
          text: 'Because the shell does the matching, wildcards work with every command, not only `ls`. That’s where they pay off:',
        },
        { type: 'example', command: 'rm downloads/*.tmp' },
        {
          type: 'p',
          text: 'That deletes every `.tmp` file in one go. Before you `rm` with a wildcard, run `ls` with the same pattern first to see exactly what it will match.',
        },
      ],
      tasks: [
        {
          id: 'move-png',
          prompt: 'Make a folder photos/png and move every .png into it',
          hint: 'mkdir photos/png, then mv photos/*.png photos/png',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/photos/png/vacation.png', type: 'file' },
              { kind: 'exists', path: '~/photos/png/screenshot-3.png', type: 'file' },
              { kind: 'exists', path: '~/photos/vacation.png', not: true },
            ],
          },
        },
        {
          id: 'rm-tmp',
          prompt: 'Delete every .tmp file in downloads',
          hint: 'Check first with ls downloads/*.tmp, then rm downloads/*.tmp',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/downloads/setup.tmp', not: true },
              { kind: 'exists', path: '~/downloads/cache.tmp', not: true },
              { kind: 'exists', path: '~/downloads/debug.tmp', not: true },
              { kind: 'exists', path: '~/downloads/song.mp3', type: 'file' },
            ],
          },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'File the invoices',
      blocks: [
        {
          type: 'p',
          text: 'Move both invoices from downloads into documents with a single command. Leave the song where it is.',
        },
      ],
      tasks: [
        {
          id: 'invoices',
          prompt: 'Move every invoice into documents in one command',
          hint: 'All the invoices start with invoice-: mv downloads/invoice-* documents',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/documents/invoice-march.pdf', type: 'file' },
              { kind: 'exists', path: '~/documents/invoice-april.pdf', type: 'file' },
              { kind: 'exists', path: '~/downloads/song.mp3', type: 'file' },
            ],
          },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q6-1',
      question: 'Which pattern matches report1.txt and report2.txt but not report10.txt?',
      options: ['report*.txt', 'report?.txt', 'report[10].txt', '*.txt'],
      correctAnswer: 1,
      explanation: '? matches exactly one character. report10.txt has two characters in that spot, so it doesn’t match.',
    },
    {
      id: 'q6-2',
      question: 'Which files does * match in a folder containing notes.txt, .hidden and photo.jpg?',
      options: ['All three', 'notes.txt and photo.jpg', 'Only .hidden', 'None of them'],
      correctAnswer: 1,
      explanation: 'Wildcards never match a leading dot, so hidden files stay out of it.',
    },
    {
      id: 'q6-3',
      question: 'In rm *.log, who turns *.log into a list of files?',
      options: ['rm', 'The shell, before rm runs', 'The file system', 'Nobody, rm deletes a file called *.log'],
      correctAnswer: 1,
      explanation: 'The shell expands wildcards first. rm only ever receives the finished list of names.',
    },
    {
      id: 'q6-4',
      question: 'How do you stop the shell expanding a wildcard?',
      options: ['Put it in quotes', 'Add -n', 'Use two stars', 'You can’t'],
      correctAnswer: 0,
      explanation: '"*.png" in quotes reaches the command exactly as typed.',
    },
  ],

  next: { id: '7', title: 'Connect commands' },
};

export default lesson;
