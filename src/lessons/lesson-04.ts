import type { Lesson } from './types';

const lesson: Lesson = {
  id: '4',
  number: 4,
  title: 'Copy, move and delete',
  promise: 'Rearrange your files with confidence, and delete them without regret.',
  minutes: 12,
  part: 'Working with files',
  commands: [
    { name: 'cp', does: 'Copy a file (-r copies a folder)' },
    { name: 'mv', does: 'Move or rename a file or folder' },
    { name: 'rm', does: 'Delete a file (-r deletes a folder). There is no undo.' },
    { name: 'rmdir', does: 'Delete a folder, only if it’s empty' },
  ],

  fs: {
    home: {
      you: {
        downloads: {
          'photo.jpg': '(image data)\n',
          'report-draft.pdf': '(PDF data)\n',
          'report-final.pdf': '(PDF data)\n',
          'setup.tmp': 'temporary file\n',
        },
        documents: {
          'resume.pdf': '(PDF data)\n',
        },
        projects: {
          site: {
            'index.html': '<h1>My site</h1>\n',
            'style.css': 'body { margin: 0; }\n',
          },
        },
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'cp',
      label: 'cp',
      title: 'Copy a file',
      blocks: [
        {
          type: 'p',
          text: '`cp` copies a file. Give it the file to copy, then where the copy should go:',
        },
        { type: 'example', command: 'cp downloads/report-final.pdf documents' },
        {
          type: 'p',
          text: 'When the destination is a folder, the copy keeps its name and goes inside. When it’s a new name, the copy gets that name: `cp notes.txt notes-backup.txt` makes a second file called `notes-backup.txt`.',
        },
      ],
      tasks: [
        {
          id: 'cp',
          prompt: 'Copy report-final.pdf from downloads into documents',
          hint: 'cp downloads/report-final.pdf documents',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/documents/report-final.pdf', type: 'file' },
              { kind: 'exists', path: '~/downloads/report-final.pdf', type: 'file' },
            ],
          },
        },
      ],
    },

    {
      id: 'cp-r',
      label: 'cp -r',
      title: 'Copy a folder',
      blocks: [
        { type: 'p', text: '`cp` won’t copy a folder on its own:' },
        {
          type: 'example',
          command: 'cp projects/site projects/site-backup',
          output: "cp: -r not specified; omitting directory 'projects/site'",
        },
        {
          type: 'p',
          text: 'Add `-r` (for “recursive”) to copy the folder and everything inside it:',
        },
        { type: 'example', command: 'cp -r projects/site projects/site-backup' },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac the error reads `cp: projects/site is a directory (not copied).` It means the same thing.',
        },
      ],
      tasks: [
        {
          id: 'cp-r',
          prompt: 'Back up projects/site to projects/site-backup',
          hint: 'cp -r projects/site projects/site-backup',
          check: { kind: 'exists', path: '~/projects/site-backup/index.html', type: 'file' },
        },
      ],
    },

    {
      id: 'mv',
      label: 'mv',
      title: 'Move and rename',
      blocks: [
        {
          type: 'p',
          text: '`mv` moves a file somewhere else. Unlike `cp`, nothing is left behind:',
        },
        { type: 'example', command: 'mv downloads/photo.jpg documents' },
        {
          type: 'p',
          text: '`mv` is also how you rename. Moving a file to a new name in the same folder renames it:',
        },
        { type: 'example', command: 'mv documents/resume.pdf documents/cv.pdf' },
      ],
      tasks: [
        {
          id: 'mv',
          prompt: 'Move photo.jpg from downloads into documents',
          hint: 'mv downloads/photo.jpg documents',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/documents/photo.jpg', type: 'file' },
              { kind: 'exists', path: '~/downloads/photo.jpg', not: true },
            ],
          },
        },
        {
          id: 'rename',
          prompt: 'Rename documents/resume.pdf to cv.pdf',
          hint: 'mv documents/resume.pdf documents/cv.pdf',
          check: {
            kind: 'all',
            checks: [
              { kind: 'exists', path: '~/documents/cv.pdf', type: 'file' },
              { kind: 'exists', path: '~/documents/resume.pdf', not: true },
            ],
          },
        },
      ],
    },

    {
      id: 'rm',
      label: 'rm',
      title: 'Delete a file',
      blocks: [
        { type: 'p', text: '`rm` (remove) deletes a file:' },
        { type: 'example', command: 'rm downloads/report-draft.pdf' },
        {
          type: 'p',
          text: 'There’s no Trash and no undo. A file deleted with `rm` is gone for good, so read the command twice before you press [[Enter]].',
        },
        {
          type: 'note',
          tone: 'tip',
          text: '`rm -i` asks before deleting each file. Some people make it their default for exactly this reason.',
        },
      ],
      tasks: [
        {
          id: 'rm',
          prompt: 'Delete report-draft.pdf from downloads',
          hint: 'rm downloads/report-draft.pdf',
          check: { kind: 'exists', path: '~/downloads/report-draft.pdf', not: true },
        },
      ],
    },

    {
      id: 'rm-r',
      label: 'rm -r',
      title: 'Delete a folder',
      blocks: [
        { type: 'p', text: 'Like `cp`, `rm` won’t touch a folder unless you add `-r`:' },
        { type: 'example', command: 'rm -r projects/site-backup', context: true },
        {
          type: 'p',
          text: '`rmdir` deletes a folder only if it’s empty. It’s the safer choice when you think a folder is empty and want to be sure.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'You’ll see `rm -rf` online. The `f` (force) skips every warning, so be very sure of the path before you use it.',
        },
      ],
      tasks: [
        {
          id: 'rm-r',
          prompt: 'Delete the projects/site-backup folder',
          hint: 'rm -r projects/site-backup',
          check: {
            kind: 'all',
            checks: [
              { kind: 'ran', command: 'rm', flags: 'r' },
              { kind: 'exists', path: '~/projects/site-backup', not: true },
            ],
          },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Empty your downloads',
      blocks: [
        {
          type: 'p',
          text: 'Your downloads folder still has things in it. Run `ls downloads` to see what’s left, then leave it completely empty:',
        },
        {
          type: 'list',
          items: [
            '`documents` already has a copy of `report-final.pdf`, so the one in downloads can go',
            'Anything ending in `.tmp` is a temporary file you don’t need',
          ],
        },
      ],
      tasks: [
        {
          id: 'empty-downloads',
          prompt: 'Leave downloads completely empty',
          hint: 'Check with ls downloads, then delete each file with rm.',
          check: { kind: 'exists', path: '~/downloads', type: 'dir', empty: true },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q4-1',
      question: 'backup is an existing folder. Where does cp notes.txt backup put the copy?',
      options: ['In a new file called backup', 'At backup/notes.txt', 'Nowhere, it’s an error', 'In the Trash'],
      correctAnswer: 1,
      explanation: 'When the destination is a folder, the copy goes inside it and keeps its name.',
    },
    {
      id: 'q4-2',
      question: 'How do you rename draft.txt to final.txt?',
      options: ['rename draft.txt final.txt', 'cp draft.txt final.txt', 'mv draft.txt final.txt', 'rm draft.txt final.txt'],
      correctAnswer: 2,
      explanation: 'Renaming is moving a file to a new name. cp would leave two files.',
    },
    {
      id: 'q4-3',
      question: 'You deleted the wrong file with rm. How do you get it back?',
      options: ['Restore it from the Trash', 'Run rm --undo', 'You can’t, rm doesn’t use the Trash', 'Press Ctrl+Z'],
      correctAnswer: 2,
      explanation: 'rm deletes immediately and permanently. Backups are the only way back, which is why rm -i exists.',
    },
    {
      id: 'q4-4',
      question: 'Why does rm projects fail with “Is a directory”?',
      options: [
        'Folders can’t be deleted',
        'rm needs -r to delete a folder',
        'You need to be an administrator',
        'The folder is hidden',
      ],
      correctAnswer: 1,
      explanation: 'rm refuses folders unless you add -r, as a guard against deleting more than you meant to.',
    },
  ],

  next: { id: '5', title: 'Read files' },
};

export default lesson;
