import type { Lesson } from './types';

const lesson: Lesson = {
  id: '10',
  number: 10,
  title: 'Edit files with nano',
  promise: 'Open, change and save any file without leaving the terminal.',
  minutes: 12,
  part: 'Your system',
  commands: [
    { name: 'nano', does: 'Open a file in a simple text editor (creates it if it’s new)' },
    { name: 'Ctrl+O', does: 'In nano: save (“write out”), then Enter to confirm' },
    { name: 'Ctrl+X', does: 'In nano: exit, asking to save any changes' },
    { name: 'Ctrl+K / Ctrl+U', does: 'In nano: cut a whole line / paste it' },
  ],

  fs: {
    home: {
      you: {
        'notes.txt': 'Things to learn:\n- the terminal\n',
        'shopping.txt': 'milk\nbread\neggs\n',
        config: {
          'settings.conf': 'theme=light\ndebug=true\nport=8080\n',
        },
      },
    },
    tmp: {},
  },

  sections: [
    {
      id: 'open',
      label: 'nano',
      title: 'Open a file',
      blocks: [
        {
          type: 'p',
          text: 'Sooner or later you’ll need to change a file on a computer where all you have is a terminal: a setting on a server, a note, a script. `nano` is the friendliest editor for that. Give it a file name:',
        },
        { type: 'example', command: 'nano notes.txt' },
        {
          type: 'p',
          text: 'The file opens and you can type straight away. Move around with the arrow keys; the mouse doesn’t work.',
        },
        {
          type: 'p',
          text: 'The bottom two lines list the shortcuts. `^` means [[Ctrl]], so `^X Exit` means [[Ctrl]] + [[X]].',
        },
      ],
      tasks: [
        {
          id: 'open',
          prompt: 'Open notes.txt in nano',
          hint: 'nano notes.txt',
          check: { kind: 'opened', path: '~/notes.txt' },
        },
      ],
    },

    {
      id: 'save',
      label: '^O save',
      title: 'Change it and save',
      blocks: [
        {
          type: 'p',
          text: 'Saving takes two keys, because nano asks which file to save to:',
        },
        {
          type: 'list',
          items: [
            '[[Ctrl]] + [[O]] (“write out”) shows the file name at the bottom',
            '[[Enter]] confirms it. nano says how many lines it wrote',
            '[[Ctrl]] + [[X]] exits back to the prompt',
          ],
        },
        {
          type: 'p',
          text: 'If you press [[Ctrl]] + [[X]] with unsaved changes, nano asks `Save modified buffer?`. Press [[Y]] to save, [[N]] to throw the changes away, or [[Ctrl]] + [[C]] to keep editing.',
        },
        {
          type: 'note',
          tone: 'platform',
          text: 'On a Mac, use [[Ctrl]], not [[Cmd]]. Since macOS 12.3, typing `nano` opens pico, nano’s older cousin. It looks a little different, but these shortcuts are the same.',
        },
      ],
      tasks: [
        {
          id: 'save',
          prompt: 'Add a line to notes.txt, like “- nano”, then save it',
          hint: 'nano notes.txt, go to the end with the arrow keys, type your line, then Ctrl+O and Enter',
          check: {
            kind: 'all',
            checks: [
              { kind: 'saved', path: '~/notes.txt' },
              { kind: 'file', path: '~/notes.txt', changed: true, includes: 'the terminal' },
            ],
          },
        },
      ],
    },

    {
      id: 'new',
      label: 'new file',
      title: 'Make a new file',
      blocks: [
        {
          type: 'p',
          text: 'Open a file that doesn’t exist yet and nano starts with an empty page. The file is created the moment you save. It’s the easiest way to write a file longer than one `echo`.',
        },
        { type: 'example', command: 'nano todo.txt' },
        {
          type: 'note',
          tone: 'tip',
          text: 'Exit without saving and nothing is created, so you can’t make a mess by looking.',
        },
      ],
      tasks: [
        {
          id: 'new-file',
          prompt: 'Create todo.txt with nano, with at least two lines in it',
          hint: 'nano todo.txt, type two lines, then Ctrl+O, Enter',
          check: {
            kind: 'all',
            checks: [
              { kind: 'saved', path: '~/todo.txt' },
              { kind: 'file', path: '~/todo.txt', minLines: 2 },
            ],
          },
        },
      ],
    },

    {
      id: 'cut',
      label: '^K ^U',
      title: 'Move whole lines',
      blocks: [
        {
          type: 'p',
          text: 'nano’s cut and paste work on whole lines, which is exactly what you want in config files and lists:',
        },
        {
          type: 'list',
          items: [
            '[[Ctrl]] + [[K]] cuts the line the cursor is on',
            '[[Ctrl]] + [[U]] pastes it where the cursor is',
          ],
        },
        {
          type: 'p',
          text: 'To move a line: cut it, move the cursor to where it should go, and paste.',
        },
      ],
      tasks: [
        {
          id: 'move-line',
          prompt: 'In shopping.txt, move eggs to the top of the list and save',
          hint: 'nano shopping.txt, put the cursor on eggs, Ctrl+K, go to the top with ↑, Ctrl+U, then Ctrl+O and Enter',
          check: { kind: 'file', path: '~/shopping.txt', matches: '^eggs\\n', includes: ['milk', 'bread'] },
        },
      ],
    },

    {
      id: 'challenge',
      label: 'challenge',
      title: 'Turn off debug mode',
      blocks: [
        {
          type: 'p',
          text: 'The app in `config` is about to go live, and it still has debug mode switched on. Change `debug=true` to `debug=false` in `config/settings.conf`, and leave the other settings as they are.',
        },
        {
          type: 'p',
          text: 'Afterwards, check your change with `cat`.',
        },
      ],
      tasks: [
        {
          id: 'debug-off',
          prompt: 'Set debug=false in config/settings.conf',
          hint: 'nano config/settings.conf, change true to false, then Ctrl+O, Enter, Ctrl+X',
          check: {
            kind: 'file',
            path: '~/config/settings.conf',
            includes: ['debug=false', 'theme=light', 'port=8080'],
            excludes: 'debug=true',
          },
        },
      ],
    },
  ],

  quiz: [
    {
      id: 'q10-1',
      question: 'In nano’s shortcut list, what does ^O mean?',
      options: ['Shift + O', 'Ctrl + O', 'Press O twice', 'Option + O'],
      correctAnswer: 1,
      explanation: '^ is shorthand for the Ctrl key. ^O is Ctrl + O, which saves.',
    },
    {
      id: 'q10-2',
      question: 'What happens if you run nano ideas.txt and ideas.txt doesn’t exist?',
      options: [
        'An error',
        'nano opens an empty file and creates it when you save',
        'nano creates an empty file straight away',
        'It opens the last file you edited',
      ],
      correctAnswer: 1,
      explanation: 'You get an empty page. The file only appears if you save.',
    },
    {
      id: 'q10-3',
      question: 'You press Ctrl+X and nano asks “Save modified buffer?”. You want to throw your changes away. What do you press?',
      options: ['Y', 'N', 'Ctrl+O', 'Enter'],
      correctAnswer: 1,
      explanation: 'N exits without saving. Y saves first, and Ctrl+C goes back to editing.',
    },
    {
      id: 'q10-4',
      question: 'How do you move a line to another place in nano?',
      options: [
        'Drag it with the mouse',
        'Ctrl+K to cut it, move the cursor, Ctrl+U to paste',
        'Ctrl+C and Ctrl+V',
        'You have to retype it',
      ],
      correctAnswer: 1,
      explanation: 'Ctrl+K cuts the whole line and Ctrl+U pastes it at the cursor.',
    },
  ],

  next: { id: '11', title: 'What’s running on your computer' },
};

export default lesson;
