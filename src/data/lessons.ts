import { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Getting Started with the Terminal',
    duration: 6,
    description: 'Understand what the terminal is and how to access it confidently.',
    completed: false,
    content: {
      introduction: `
        The terminal (or command line) is a text-based interface that gives you direct access to your computer's operating system. Think of it as chatting with your computer by typing instructions instead of clicking buttons. It might look a bit daunting at first (just a blank window with some text), but it's where efficiency meets precision—every command is purposeful, and every action deliberate.

        Even if you use an AI coding assistant like Claude to help write code or commands, the terminal is the place where those commands actually run.

        When you open it, you'll see a prompt (a line of text) waiting for your input. It usually shows your username, your computer's name, and your current directory, ending with a $ sign (for a normal user). For example, a prompt might look like:

        student@my-computer:~$

        This prompt says: user "student" on machine "my-computer" is currently in the ~ directory (the ~ symbol is shorthand for your home folder). The $ means the terminal is ready for you to type a command. (If you were the administrator or "root" user, you'd see # instead of $, but we won't be doing that here.)
      `,
      commands: [
        {
          name: 'Opening Terminal',
          description: 'How to access the terminal on Mac or Linux systems',
          syntax: 'System-specific methods',
          examples: [
            {
              command: 'On macOS',
              output: 'Terminal application opens',
              explanation: 'Open the Terminal app (found in Applications > Utilities or by searching "Terminal" via Spotlight)'
            },
            {
              command: 'On Linux',
              output: 'Terminal emulator opens',
              explanation: 'Open your distribution\'s terminal application (often called Terminal, Konsole, etc.). In many Linux environments, you can press Ctrl+Alt+T to launch a new terminal window'
            }
          ]
        },
        {
          name: 'whoami',
          description: 'Display your current logged-in username',
          syntax: 'whoami',
          examples: [
            {
              command: 'whoami',
              output: 'student',
              explanation: 'This command prints your current logged-in username. You just asked "Who am I (to the system)?" and the system answered with your username!'
            }
          ]
        },
        {
          name: 'date',
          description: 'Display the current date and time',
          syntax: 'date',
          examples: [
            {
              command: 'date',
              output: 'Tue Sep 21 20:38:31 CDT 2025',
              explanation: 'This command displays the current date and time as reported by your system'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p1-1',
          prompt: 'Open your terminal and run the whoami command',
          expectedCommand: 'whoami',
          hints: [
            'Type whoami and press Enter',
            'This will show your username',
            'No output means something went wrong - try again'
          ],
          completed: false
        },
        {
          id: 'p1-2',
          prompt: 'Run the date command to check the current date and time',
          expectedCommand: 'date',
          hints: [
            'Type date and press Enter',
            'You should see the current date and time',
            'This confirms your terminal is working properly'
          ],
          completed: false
        }
      ],
      summary: `
        🎉 You've run your first commands! Notice that after each command runs, the prompt appears again on the next line, meaning the terminal is ready for your next instruction.

        Key takeaways:
        • The terminal is a text-based interface to your computer
        • The prompt shows your username, computer name, and current directory
        • whoami shows your username
        • date shows the current date and time
        • After running a command, you get a new prompt for the next command

        Tip: If you ever type something and want to cancel it (before pressing Enter), you can backspace to delete, or press Ctrl+C to abort the current line. Pressing Ctrl+C in an empty prompt just gives you a new prompt line (it won't harm anything—think of it as an escape hatch).

        Take a moment to appreciate what you just did: you communicated directly with your OS using text commands! Even if you have AI helpers to suggest commands, knowing how to execute and interpret commands on your own is empowering.
      `
    },
    quiz: {
      id: 'quiz-1',
      questions: [
        {
          id: 'q1-1',
          question: 'What is the terminal, and why would a developer use it instead of a graphical interface?',
          options: [
            'It\'s just for hackers and advanced users',
            'It provides direct, efficient access to the computer with precise control',
            'It\'s required for all programming tasks',
            'It\'s only useful for old computers'
          ],
          correctAnswer: 1,
          explanation: 'The terminal provides direct access to your system and is often more efficient and precise than graphical interfaces, giving you powerful control over your computer.'
        },
        {
          id: 'q1-2',
          question: 'After typing a command in the terminal, which key should you press to execute it?',
          options: [
            'Spacebar',
            'Tab',
            'Enter',
            'Ctrl+C'
          ],
          correctAnswer: 2,
          explanation: 'You press Enter to execute a command after typing it in the terminal.'
        },
        {
          id: 'q1-3',
          question: 'Which command can you use to display the current date and time in the terminal?',
          options: [
            'whoami',
            'date',
            'time',
            'now'
          ],
          correctAnswer: 1,
          explanation: 'The date command displays the current date and time as reported by your system.'
        }
      ]
    }
  },
  
  {
    id: '2',
    title: 'Navigation Basics (pwd, ls, cd)',
    duration: 6,
    description: 'Master the fundamental commands for navigating your file system.',
    completed: false,
    content: {
      introduction: `
        Imagine your computer's file system as a giant building. Directories (folders) are like rooms and hallways, and files are like items in those rooms. To navigate this "building," we use a few key commands:

        pwd – Print Working Directory, i.e. show which "room" you're in currently.
        ls – List the contents of the current directory (what "items" or sub-rooms are here).
        cd – Change Directory, i.e. go to a different room.

        Think of pwd as checking the room number, ls as looking around the room, and cd as walking through a door into another room. These three commands are the foundation of all terminal navigation.
      `,
      commands: [
        {
          name: 'pwd',
          description: 'Print Working Directory - shows your current location',
          syntax: 'pwd',
          examples: [
            {
              command: 'pwd',
              output: '/Users/john',
              explanation: 'Shows you are currently in the /Users/john directory (your home folder)'
            }
          ]
        },
        {
          name: 'ls',
          description: 'List directory contents',
          syntax: 'ls [options] [directory]',
          examples: [
            {
              command: 'ls',
              output: 'Desktop  Documents  Downloads  Pictures',
              explanation: 'Shows all visible files and folders in the current directory'
            },
            {
              command: 'ls -l',
              output: 'drwxr-xr-x  5 john staff   160 Sep 21 20:00 Desktop\n-rw-r--r--  1 john staff    52 Sep 20 15:30 notes.txt',
              explanation: 'Long format with details. Try ls -l and you\'ll see a columnar output including permissions, owner, size, and date for each item. Don\'t worry about all the columns right now (we\'ll explore those in Lesson 5 when we talk about permissions). Just know -l gives you more info per item.'
            },
            {
              command: 'ls -a',
              output: '.  ..  .hidden  Desktop  Documents',
              explanation: 'Shows all files including hidden ones (starting with .). On Unix systems, files/folders starting with . are hidden'
            },
            {
              command: 'ls -la',
              output: 'total 8\ndrwxr-xr-x  6 john  staff   192 Dec 1 10:30 .\ndrwxr-xr-x  3 root  admin    96 Nov 30 15:20 ..\n-rw-r--r--  1 john  staff   256 Dec 1 09:30 .profile',
              explanation: 'You can combine options, e.g. ls -la for a detailed list of all files, including hidden ones'
            }
          ]
        },
        {
          name: 'cd',
          description: 'Change Directory - navigate to different folders',
          syntax: 'cd [directory]',
          examples: [
            {
              command: 'cd Desktop',
              output: '',
              explanation: 'Moves into the Desktop folder'
            },
            {
              command: 'cd ..',
              output: '',
              explanation: 'Moves up one level to the parent directory'
            },
            {
              command: 'cd ~',
              output: '',
              explanation: 'Goes to your home directory'
            },
            {
              command: 'cd /',
              output: '',
              explanation: 'Goes to the root directory (top level of file system)'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p2-1',
          prompt: 'Find out where you currently are in the file system',
          expectedCommand: 'pwd',
          hints: [
            'Use the command that "prints working directory"',
            'It\'s a 3-letter command starting with "p"'
          ],
          completed: false
        },
        {
          id: 'p2-2',
          prompt: 'List all the files and folders in your current directory',
          expectedCommand: 'ls',
          hints: [
            'Use the "list" command',
            'Just two letters'
          ],
          completed: false
        },
        {
          id: 'p2-3',
          prompt: 'Navigate to your Desktop folder',
          expectedCommand: 'cd Desktop',
          hints: [
            'Use the "change directory" command',
            'Follow it with the folder name'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent work! You've mastered the three most essential navigation commands. These form the foundation of everything you'll do in the terminal.

        Remember:
        • pwd - shows where you are
        • ls - shows what's around you
        • cd - moves you to a new location

        Pro tip: You can combine these! Try "ls -la" for a detailed view of everything, including hidden files.
      `
    },
    quiz: {
      id: 'quiz-2',
      questions: [
        {
          id: 'q2-1',
          question: 'Which command shows your current location in the file system?',
          options: ['ls', 'cd', 'pwd', 'dir'],
          correctAnswer: 2,
          explanation: 'pwd (Print Working Directory) shows your current location in the file system.'
        },
        {
          id: 'q2-2',
          question: 'What does "cd .." do?',
          options: [
            'Lists hidden files',
            'Goes to the home directory',
            'Goes up one level to the parent directory',
            'Shows the current directory'
          ],
          correctAnswer: 2,
          explanation: 'The ".." represents the parent directory, so "cd .." moves you up one level.'
        },
        {
          id: 'q2-3',
          question: 'Which ls option shows detailed file information including permissions?',
          options: ['-a', '-l', '-h', '-r'],
          correctAnswer: 1,
          explanation: 'The -l option displays files in "long" format with detailed information.'
        },
        {
          id: 'q2-4',
          question: 'Which ls option shows hidden files (files starting with a dot)?',
          options: ['-l', '-a', '-h', '-r'],
          correctAnswer: 1,
          explanation: 'The -a option shows "all" files, including hidden files that start with a dot (.)'
        }
      ]
    }
  },

  {
    id: '3',
    title: 'Working with Files: touch, cat, less',
    duration: 6,
    description: 'Learn to create and view files safely and efficiently.',
    completed: false,
    content: {
      introduction: `
        Now that you know where you are and can look around, let's start working with files! Think of files as the actual documents, photos, or notes in your filing system. Just as you need to create, read, and organize physical documents, you need the same skills for digital files.

        In this lesson, you'll learn some of the most practical file commands - the ones you'll use every single day:

        1. **touch** - Create new files (but they'll be empty)
        2. **echo >** - Actually put content into files
        3. **cat** - Read what's in a file
        4. **less** - Read longer files page by page

        The cool thing about the terminal is that it's often faster than using a GUI. Need a quick note? \`echo "Buy milk" > shopping.txt\` is faster than opening an app!
      `,
      commands: [
        {
          name: 'touch',
          description: 'Create empty files instantly',
          syntax: 'touch filename',
          examples: [
            {
              command: 'touch myfile.txt',
              output: '',
              explanation: 'Creates an empty file called myfile.txt. No output means it worked!'
            },
            {
              command: 'ls',
              output: 'myfile.txt',
              explanation: 'Always check with ls! You can see your new file is there.'
            },
            {
              command: 'cat myfile.txt',
              output: '',
              explanation: 'The file exists but is empty - no content to show. That\'s normal for touch!'
            },
            {
              command: 'ls -l myfile.txt',
              output: '-rw-r--r--  1 user  staff  0 Dec 1 14:30 myfile.txt',
              explanation: 'ls -l shows details: notice the "0" - that\'s 0 bytes because the file is empty'
            }
          ]
        },
        {
          name: 'echo >',
          description: 'Create files with content in them',
          syntax: 'echo "your text" > filename',
          examples: [
            {
              command: 'echo "Hello World" > greeting.txt',
              output: '',
              explanation: 'Creates greeting.txt and puts "Hello World" inside it. This is super useful!'
            },
            {
              command: 'ls',
              output: 'greeting.txt myfile.txt',
              explanation: 'Check your work! Now you can see both files.'
            },
            {
              command: 'cat greeting.txt',
              output: 'Hello World',
              explanation: 'Read the content back - see how echo > put the text inside the file!'
            },
            {
              command: 'ls -l greeting.txt',
              output: '-rw-r--r--  1 user  staff  11 Dec 1 14:35 greeting.txt',
              explanation: 'Notice the "11" - that\'s 11 bytes for "Hello World". The file has content now!'
            }
          ]
        },
        {
          name: 'cat',
          description: 'Read what\'s inside a file (all at once)',
          syntax: 'cat filename',
          examples: [
            {
              command: 'echo "Buy milk and eggs" > shopping.txt',
              output: '',
              explanation: 'Let\'s create another file with content to practice with'
            },
            {
              command: 'cat shopping.txt',
              output: 'Buy milk and eggs',
              explanation: 'cat shows you what\'s inside any file. Perfect for quick checks!'
            },
            {
              command: 'cat myfile.txt',
              output: '',
              explanation: 'Remember myfile.txt was created with touch? It\'s still empty, so cat shows nothing.'
            },
            {
              command: 'ls -l',
              output: '-rw-r--r--  1 user  staff  11 Dec 1 14:35 greeting.txt\n-rw-r--r--  1 user  staff   0 Dec 1 14:30 myfile.txt\n-rw-r--r--  1 user  staff  16 Dec 1 14:40 shopping.txt',
              explanation: 'Compare file sizes: myfile.txt is 0 bytes (empty), others have content!'
            }
          ]
        },
        {
          name: 'less',
          description: 'Read large files page by page (like a book)',
          syntax: 'less filename',
          examples: [
            {
              command: 'less bigfile.txt',
              output: '[Opens page view - use space to go forward, q to quit]',
              explanation: 'Perfect for reading large files! Space = next page, q = quit. Much better than cat for big files'
            },
            {
              command: 'less /var/log/system.log',
              output: '[Reading a system log file page by page]',
              explanation: 'Great for reading log files that would overwhelm your screen with cat'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p3-1',
          prompt: 'Create a file called "note.txt" with the text "Hello Terminal"',
          expectedCommand: 'echo "Hello Terminal" > note.txt',
          hints: [
            'Use echo with > to create files with content',
            'Type: echo "Hello Terminal" > note.txt',
            'The > symbol redirects the echo output into a file'
          ],
          completed: false
        },
        {
          id: 'p3-2',
          prompt: 'Check that your file exists with ls',
          expectedCommand: 'ls',
          hints: [
            'Always verify your work!',
            'Type: ls',
            'You should see note.txt in the list'
          ],
          completed: false
        },
        {
          id: 'p3-3',
          prompt: 'Read what\'s inside note.txt',
          expectedCommand: 'cat note.txt',
          hints: [
            'Use cat to read file contents',
            'Type: cat note.txt',
            'You should see "Hello Terminal" displayed'
          ],
          completed: false
        },
        {
          id: 'p3-4',
          prompt: 'Create a shopping list file called "shopping.txt" with "Buy milk"',
          expectedCommand: 'echo "Buy milk" > shopping.txt',
          hints: [
            'Use the same echo > technique',
            'Type: echo "Buy milk" > shopping.txt',
            'This creates the file and adds the content in one step'
          ],
          completed: false
        },
        {
          id: 'p3-5',
          prompt: 'Verify your shopping list by reading shopping.txt',
          expectedCommand: 'cat shopping.txt',
          hints: [
            'Use cat to check the file contents',
            'Type: cat shopping.txt',
            'You should see "Buy milk"'
          ],
          completed: false
        },
        {
          id: 'p3-6',
          prompt: 'Create an empty file called "empty.txt" using touch',
          expectedCommand: 'touch empty.txt',
          hints: [
            'Touch creates empty files',
            'Type: touch empty.txt',
            'Then try cat empty.txt to see what an empty file looks like'
          ],
          completed: false
        },
        {
          id: 'p3-7',
          prompt: 'Compare all your files with ls -l to see their sizes',
          expectedCommand: 'ls -l',
          hints: [
            'Use ls -l to see detailed file information',
            'Type: ls -l',
            'Notice which files are 0 bytes (empty) and which have content!'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You now understand the complete file creation and verification workflow. This is the foundation of confident terminal use.

        What you learned:
        • **touch** - Create empty files
        • **echo > filename** - Create files with content instantly
        • **cat** - Read what's in a file
        • **ls** - Always verify your work!
        • **ls -l** - See file sizes and details

        **Key insight**: The pattern is create → verify → read → verify. Always use \`ls\` to check your work and \`ls -l\` to see what's really happening with file sizes.

        Notice how empty files (from touch) show 0 bytes, while files with content show their actual size. This verification habit will save you from confusion later!

        Next up: we'll learn how to create safe practice spaces and organize files properly.
      `
    },
    quiz: {
      id: 'quiz-3',
      questions: [
        {
          id: 'q3-1',
          question: 'How do you create a file with content in one command?',
          options: [
            'touch "content" > filename',
            'echo "content" > filename',
            'cat "content" > filename',
            'less "content" > filename'
          ],
          correctAnswer: 1,
          explanation: 'echo "content" > filename creates a file and puts the content inside it all in one step!'
        },
        {
          id: 'q3-2',
          question: 'What\'s the difference between touch and echo > for creating files?',
          options: [
            'touch is faster',
            'echo > is newer',
            'touch creates empty files, echo > creates files with content',
            'They do exactly the same thing'
          ],
          correctAnswer: 2,
          explanation: 'touch creates empty files, while echo > creates files with content inside them.'
        },
        {
          id: 'q3-3',
          question: 'When should you use less instead of cat?',
          options: [
            'For small files',
            'For large files that would fill your screen',
            'For creating files',
            'For deleting files'
          ],
          correctAnswer: 1,
          explanation: 'Use less for large files so you can read them page by page instead of having everything scroll by too fast.'
        },
        {
          id: 'q3-4',
          question: 'What command reads the contents of a file?',
          options: [
            'touch',
            'echo',
            'cat',
            'mkdir'
          ],
          correctAnswer: 2,
          explanation: 'cat displays the contents of a file on your screen.'
        }
      ]
    }
  },

  {
    id: '4',
    title: 'File Operations: Copy, Move, Delete',
    duration: 6,
    description: 'Master file management with safety-first practices for copying, moving, and deleting.',
    completed: false,
    content: {
      introduction: `
        Great! You just learned the create → verify → read → verify pattern from Lesson 3. Now let's use that same confidence-building approach to organize files and create safe practice spaces.

        Remember how we always used \`ls\` to check our work? We'll keep doing that as we learn to:

        1. **mkdir** - Create directories (like making new drawers)
        2. **cp** - Copy files (like making backups)
        3. **mv** - Move and rename files (reorganizing your space)
        4. **rm** - Delete files (cleaning up - be careful!)

        **The playground concept**: Just like in Lesson 3 where we created individual files, now we'll create a dedicated playground directory where you can experiment safely. If you make a mistake, it's contained and harmless.

        We'll use the same verification pattern: create something → \`ls\` to see it → do operations → \`ls\` to verify changes.
      `,
      commands: [
        {
          name: 'mkdir',
          description: 'Create directories (folders)',
          syntax: 'mkdir dirname',
          examples: [
            {
              command: 'mkdir playground',
              output: '',
              explanation: 'Creates a directory called playground. Your safe space to practice!'
            },
            {
              command: 'ls',
              output: 'playground',
              explanation: 'Always verify! You can see your new playground directory.'
            },
            {
              command: 'ls -l',
              output: 'drwxr-xr-x  2 user  staff  64 Dec 1 14:30 playground',
              explanation: 'The "d" at the start shows it\'s a directory. Notice directories don\'t have file sizes like files do.'
            },
            {
              command: 'ls playground/',
              output: '',
              explanation: 'Check inside your new directory - it\'s empty and ready for practice!'
            }
          ]
        },
        {
          name: 'cp',
          description: 'Copy files (make duplicates)',
          syntax: 'cp source destination',
          examples: [
            {
              command: 'cp important.txt backup.txt',
              output: '',
              explanation: 'Creates a copy of important.txt called backup.txt. Now you have both!'
            },
            {
              command: 'cp note.txt playground/',
              output: '',
              explanation: 'Copies note.txt into the playground directory'
            },
            {
              command: 'cp file.txt file_copy.txt',
              output: '',
              explanation: 'Great for making backups before experimenting with files'
            }
          ]
        },
        {
          name: 'mv',
          description: 'Move or rename files',
          syntax: 'mv source destination',
          examples: [
            {
              command: 'mv old_name.txt new_name.txt',
              output: '',
              explanation: 'Renames old_name.txt to new_name.txt. The original file disappears!'
            },
            {
              command: 'mv file.txt playground/',
              output: '',
              explanation: 'Moves file.txt into the playground directory'
            },
            {
              command: 'mv messy_name.txt clean_name.txt',
              output: '',
              explanation: 'Great for cleaning up file names and organizing projects'
            }
          ]
        },
        {
          name: 'rm',
          description: 'Delete files (be careful!)',
          syntax: 'rm filename',
          examples: [
            {
              command: 'rm junk.txt',
              output: '',
              explanation: 'Deletes junk.txt permanently. No undo button! Make sure you really want to delete it.'
            },
            {
              command: 'rm test1.txt test2.txt',
              output: '',
              explanation: 'Deletes multiple files at once. Good for cleaning up test files in your playground.'
            },
            {
              command: 'rm playground/old_note.txt',
              output: '',
              explanation: 'Deletes a specific file inside the playground directory'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p4-1',
          prompt: 'Create your practice playground directory',
          expectedCommand: 'mkdir playground',
          hints: [
            'Use mkdir to create directories',
            'Type: mkdir playground',
            'This creates a safe space to experiment!'
          ],
          completed: false
        },
        {
          id: 'p4-2',
          prompt: 'Create a test file in your playground',
          expectedCommand: 'echo "Practice file" > playground/test.txt',
          hints: [
            'Use echo > to create a file with content',
            'Put it inside the playground directory',
            'Type: echo "Practice file" > playground/test.txt'
          ],
          completed: false
        },
        {
          id: 'p4-3',
          prompt: 'Make a backup copy of your test file',
          expectedCommand: 'cp playground/test.txt playground/backup.txt',
          hints: [
            'Use cp to copy files',
            'Copy from playground/test.txt to playground/backup.txt',
            'Both files will exist after copying'
          ],
          completed: false
        },
        {
          id: 'p4-4',
          prompt: 'Move (rename) backup.txt to safe_copy.txt',
          expectedCommand: 'mv playground/backup.txt playground/safe_copy.txt',
          hints: [
            'Use mv to rename files',
            'mv playground/backup.txt playground/safe_copy.txt',
            'The original backup.txt will disappear'
          ],
          completed: false
        },
        {
          id: 'p4-5',
          prompt: 'Clean up: delete the safe_copy.txt file',
          expectedCommand: 'rm playground/safe_copy.txt',
          hints: [
            'Use rm to delete files',
            'rm playground/safe_copy.txt',
            'It\'s safe to experiment in your playground!'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You now know how to organize files and create safe practice spaces. The playground concept is really important - always create dedicated directories for experimenting so you don't accidentally mess up important files.

        What you learned:
        • **mkdir** - Create directories (your safe spaces)
        • **cp** - Copy files (make backups)
        • **mv** - Move and rename files (organize your workspace)
        • **rm** - Delete files (clean up, but be careful!)

        **Key insight**: Having a designated playground directory means you can experiment fearlessly. It's like having a sandbox where mistakes don't matter.

        **Safety tip**: Always double-check your file paths when using rm. There's no undo!

        Next up: Understanding file permissions - who can read, write, and run your files.
      `
    },
    quiz: {
      id: 'quiz-4',
      questions: [
        {
          id: 'q4-1',
          question: 'What command creates directories?',
          options: [
            'makedir',
            'mkdir',
            'create',
            'newdir'
          ],
          correctAnswer: 1,
          explanation: 'mkdir stands for "make directory" and is used to create new directories.'
        },
        {
          id: 'q4-2',
          question: 'What\'s the difference between cp and mv?',
          options: [
            'cp copies files, mv moves them',
            'cp is newer than mv',
            'mv is safer than cp',
            'They do the same thing'
          ],
          correctAnswer: 0,
          explanation: 'cp makes a copy (original stays), mv moves the file (original disappears).'
        },
        {
          id: 'q4-3',
          question: 'Why is creating a playground directory a good idea?',
          options: [
            'It\'s required by the system',
            'It gives you a safe place to practice without affecting important files',
            'It makes commands run faster',
            'It\'s only for games'
          ],
          correctAnswer: 1,
          explanation: 'A playground directory gives you a safe space to experiment where mistakes won\'t affect important files.'
        },
        {
          id: 'q4-4',
          question: 'What should you be careful about when using rm?',
          options: [
            'It runs slowly',
            'It permanently deletes files with no undo',
            'It only works on small files',
            'It requires internet connection'
          ],
          correctAnswer: 1,
          explanation: 'rm permanently deletes files - there\'s no undo or trash can. Always double-check before using rm!'
        }
      ]
    }
  },

  {
    id: '5',
    title: 'Understanding File Permissions',
    duration: 6,
    description: 'Master file security with permissions and ownership - the foundation of system safety.',
    completed: false,
    content: {
      introduction: `
        Learning Objectives:
        • Understand the Unix permission system and its security importance
        • Read and interpret permission strings like -rwxr-xr-x
        • Use chmod to modify permissions safely and effectively
        • Recognize common permission patterns and their use cases
        • Apply security best practices for file access control

        Welcome to the security layer of your file system! Think of file permissions as the locks and keys for every file and directory on your computer. Just like you wouldn't give everyone keys to your house, you don't want every user to have access to every file.

        Every file has a security "identity card" that answers three critical questions:
        1. **Who owns this file?** (owner)
        2. **What can different people do with it?** (permissions)
        3. **Who else should have access?** (group)

        This isn't just technical detail - it's the foundation of computer security! Understanding permissions helps you:
        - Keep your files safe from unauthorized access
        - Run scripts and programs properly
        - Collaborate safely in shared environments
        - Troubleshoot access problems

        Let's decode the permission system and make you a security-aware terminal user!
      `,
      commands: [
        {
          name: 'ls -l',
          description: 'Display detailed file information including the complete permission structure',
          syntax: 'ls -l [file_or_directory]',
          examples: [
            {
              command: 'ls -l document.txt',
              output: '-rw-r--r-- 1 sarah staff 2048 Dec 1 14:30 document.txt',
              explanation: 'Permission breakdown: -rw-r--r-- means regular file (-), owner can read/write (rw-), group can read (r--), others can read (r--)'
            },
            {
              command: 'ls -l script.sh',
              output: '-rwxr-xr-x 1 sarah staff 1024 Dec 1 14:25 script.sh',
              explanation: 'Executable file: owner has full access (rwx), group and others can read and execute (r-x) but not modify'
            },
            {
              command: 'ls -ld Projects/',
              output: 'drwxr-xr-x 5 sarah staff 160 Dec 1 14:20 Projects/',
              explanation: 'Directory (d): owner has full access (rwx), others can list contents and enter (r-x) but not create files'
            },
            {
              command: 'ls -l private.txt',
              output: '-rw------- 1 sarah staff 512 Dec 1 14:35 private.txt',
              explanation: 'Private file: only owner can read/write (rw-), group and others have no access (---). Maximum security!'
            }
          ]
        },
        {
          name: 'chmod',
          description: 'Change file permissions using numeric codes or symbolic notation',
          syntax: 'chmod [permissions] file_or_directory',
          examples: [
            {
              command: 'chmod 644 document.txt',
              output: '',
              explanation: 'Sets safe document permissions: owner read/write (6=4+2), group read (4), others read (4). Perfect for shared documents.'
            },
            {
              command: 'chmod 755 script.sh',
              output: '',
              explanation: 'Makes script executable: owner full access (7=4+2+1), others read/execute (5=4+1). Standard for scripts and programs.'
            },
            {
              command: 'chmod 600 secret.txt',
              output: '',
              explanation: 'Private file: only owner read/write (6=4+2), others no access (0). Use for passwords, keys, personal data.'
            },
            {
              command: 'chmod +x script.sh',
              output: '',
              explanation: 'Quick way to make file executable for everyone. The + adds permission, - removes it.'
            },
            {
              command: 'chmod u+w,g-w,o-r file.txt',
              output: '',
              explanation: 'Symbolic notation: add write for user (u+w), remove write for group (g-w), remove read for others (o-r)'
            },
            {
              command: 'chmod -R 755 project/',
              output: '',
              explanation: 'Recursive (-R): applies 755 permissions to project directory AND everything inside it. Powerful but use carefully!'
            }
          ]
        },
        {
          name: 'Permission Numbers',
          description: 'Understanding the numeric permission system (octal notation)',
          syntax: 'Each digit represents: owner, group, others (each 0-7)',
          examples: [
            {
              command: 'Permission number 7',
              output: 'rwx (read + write + execute)',
              explanation: '7 = 4+2+1 = read(4) + write(2) + execute(1). Full access - use for your own scripts and programs.'
            },
            {
              command: 'Permission number 6',
              output: 'rw- (read + write)',
              explanation: '6 = 4+2 = read(4) + write(2). Good for documents you can edit but don\'t need to run.'
            },
            {
              command: 'Permission number 5',
              output: 'r-x (read + execute)',
              explanation: '5 = 4+1 = read(4) + execute(1). Good for programs others can run but not modify.'
            },
            {
              command: 'Permission number 4',
              output: 'r-- (read only)',
              explanation: '4 = read only. Safe for sharing documents that others should not change.'
            },
            {
              command: 'Permission number 0',
              output: '--- (no access)',
              explanation: '0 = no permissions at all. Complete restriction - others cannot read, write, or execute.'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p5-1',
          prompt: 'Examine the permissions of first-file.txt using the detailed listing',
          expectedCommand: 'ls -l first-file.txt',
          hints: [
            'Use ls with the -l flag for detailed output',
            'Look at the permission string on the left',
            'Notice the pattern: -rwxrwxrwx or similar'
          ],
          completed: false
        },
        {
          id: 'p5-2',
          prompt: 'Make first-file.txt readable and writable by owner only (secure it)',
          expectedCommand: 'chmod 600 first-file.txt',
          hints: [
            'Use chmod with numeric permissions',
            '600 means: owner read/write (6), group no access (0), others no access (0)',
            'This is a secure, private file setting'
          ],
          completed: false
        },
        {
          id: 'p5-3',
          prompt: 'Verify the permission change by listing the file details again',
          expectedCommand: 'ls -l first-file.txt',
          hints: [
            'Same command as step 1',
            'You should now see -rw------- which means owner-only access',
            'Compare this to what you saw before - notice the difference?'
          ],
          completed: false
        },
        {
          id: 'p5-4',
          prompt: 'Create a test script and make it executable',
          expectedCommand: 'touch test.sh && chmod +x test.sh',
          hints: [
            'First create the file with touch',
            'Then use chmod +x to make it executable',
            'You can combine commands with && to run them in sequence'
          ],
          completed: false
        },
        {
          id: 'p5-5',
          prompt: 'Check the permissions of your new script to see the execute bit',
          expectedCommand: 'ls -l test.sh',
          hints: [
            'Look for the x in the permission string',
            'An executable file often shows -rwxr-xr-x',
            'The x means it can be run as a program'
          ],
          completed: false
        },
        {
          id: 'p5-6',
          prompt: 'Set test.sh to the standard script permissions (755)',
          expectedCommand: 'chmod 755 test.sh',
          hints: [
            'Use chmod with 755',
            '755 = owner full access (7), group read/execute (5), others read/execute (5)',
            'This is the standard permission for scripts and programs'
          ],
          completed: false
        }
      ],
      summary: `
        Outstanding! You've mastered the Unix permission system - one of the most important security concepts in computing. You can now read, understand, and modify file permissions with confidence.

        🔐 **Permission mastery achieved:**
        • **Reading permissions**: You can decode strings like -rwxr-xr-x instantly
        • **Security awareness**: You understand why permissions matter for safety
        • **Practical application**: You know common patterns like 644, 755, 600
        • **Problem solving**: You can troubleshoot access issues

        📊 **Common permission patterns you now know:**
        • **644 (rw-r--r--)**: Documents - owner can edit, others can read
        • **755 (rwxr-xr-x)**: Scripts/programs - owner can modify, everyone can run
        • **600 (rw-------)**: Private files - owner only, maximum security
        • **777 (rwxrwxrwx)**: Open access - rarely used, potentially dangerous
        • **700 (rwx------)**: Private executable - owner only scripts

        🛡️ **Security principles you've learned:**
        • **Principle of least privilege**: Give minimum access needed
        • **Defense in depth**: Use permissions as part of overall security
        • **Regular auditing**: Check permissions periodically with ls -l
        • **Be cautious with 777**: World-writable files are security risks

        🚀 **Advanced insights:**
        • Directories need execute (x) permission to be entered
        • Scripts need execute permission to run, but not to be edited
        • The -R flag applies permissions recursively to entire directory trees
        • Special permissions (setuid, setgid, sticky bit) exist for advanced use cases

        You've completed the foundation of terminal file management! You can now create, navigate, view, manipulate, and secure files like a professional. These five lessons have given you the core skills that developers and system administrators use daily.

        **What's next?** In future lessons, you'll build on this foundation with advanced topics like text processing, system monitoring, and automation. But first, take a moment to appreciate what you've accomplished - you're now a competent terminal user!
      `
    },
    quiz: {
      id: 'quiz-5',
      questions: [
        {
          id: 'q5-1',
          question: 'What does the permission string "-rw-r--r--" mean?',
          options: [
            'Regular file, owner can read/write, group and others can read',
            'Directory, everyone has read/write access',
            'Executable file, owner has full access',
            'Symbolic link, no permissions set'
          ],
          correctAnswer: 0,
          explanation: 'The - indicates regular file, rw- means owner can read/write, r-- means group can read only, r-- means others can read only.'
        },
        {
          id: 'q5-2',
          question: 'Which permission number would you use for a private document that only you should access?',
          options: [
            '777 (everyone full access)',
            '644 (owner read/write, others read)',
            '755 (executable by all)',
            '600 (owner read/write only)'
          ],
          correctAnswer: 3,
          explanation: '600 gives read/write access to owner only (6=rw-), with no access for group or others (0=---).'
        },
        {
          id: 'q5-3',
          question: 'Why do scripts and programs typically have 755 permissions?',
          options: [
            'It makes them faster to execute',
            'Owner can modify (7=rwx), others can run but not change (5=r-x)',
            'It prevents them from being deleted',
            'It makes them visible in file listings'
          ],
          correctAnswer: 1,
          explanation: '755 allows the owner to read, write, and execute (full control), while group and others can read and execute but not modify. Perfect for shared programs.'
        },
        {
          id: 'q5-4',
          question: 'What happens if a directory doesn\'t have execute (x) permission for you?',
          options: [
            'You can\'t list its contents',
            'You can\'t enter (cd into) the directory',
            'You can\'t delete files inside it',
            'You can\'t see it with ls'
          ],
          correctAnswer: 1,
          explanation: 'Execute permission on directories controls whether you can "enter" them with cd. Without it, you cannot access the directory even if you can see it exists.'
        }
      ]
    }
  },

  {
    id: '6',
    title: 'Viewing Parts of Files (head, tail, more)',
    duration: 6,
    description: 'Learn how to view just the beginning or end of files, and how to scroll through them one screen at a time.',
    completed: false,
    content: {
      introduction: `
        Learning Objective: Learn how to view just the beginning or end of files, and how to scroll through them one screen at a time. These commands are useful when dealing with larger files you don't want to dump all at once.
      `,
      commands: [
        {
          name: 'head',
          description: 'View the Beginning – head',
          syntax: 'head <filename>',
          examples: [
            {
              command: 'head notes.txt',
              output: 'The first 10 lines of notes.txt.',
              explanation: 'Shows the first 10 lines of a file by default.'
            },
            {
              command: 'head -n 5 notes.txt',
              output: 'First 5 lines of notes.txt.',
              explanation: 'show first 5 lines.'
            },
            {
              command: 'head -n 20 notes.txt',
              output: 'First 20 lines of notes.txt.',
              explanation: 'show first 20 lines.'
            }
          ]
        },
        {
          name: 'tail',
          description: 'View the End – tail',
          syntax: 'tail <filename>',
          examples: [
            {
              command: 'tail notes.txt',
              output: 'The final 10 lines.',
              explanation: 'Shows the last 10 lines of a file.'
            },
            {
              command: 'tail -n 5 notes.txt',
              output: 'Last 5 lines of notes.txt.',
              explanation: 'last 5 lines.'
            },
            {
              command: 'tail -f notes.txt',
              output: 'Keeps the file open and shows new lines as they\'re added.',
              explanation: 'follow mode. Keeps the file open and shows new lines as they\'re added (very useful for monitoring logs). Press Ctrl+C to exit.'
            }
          ]
        },
        {
          name: 'more',
          description: 'Scroll Page by Page – more',
          syntax: 'more <filename>',
          examples: [
            {
              command: 'more notes.txt',
              output: 'Opens file content one screen at a time.',
              explanation: 'Opens file content one screen at a time. Controls: Space = next page, Enter = next line, Q = quit. Good for medium-sized files where less might be overkill.'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p6-1',
          prompt: 'Create a file with 20+ lines: for i in {1..20}; do echo "Line $i" >> bigfile.txt; done',
          expectedCommand: 'for i in {1..20}; do echo "Line $i" >> bigfile.txt; done',
          hints: [
            'This writes 20 numbered lines to bigfile.txt.',
            'Copy this command exactly as shown'
          ],
          completed: false
        },
        {
          id: 'p6-2',
          prompt: 'Run head bigfile.txt to see the first 10 lines.',
          expectedCommand: 'head bigfile.txt',
          hints: [
            'Use head command',
            'Default shows first 10 lines'
          ],
          completed: false
        },
        {
          id: 'p6-3',
          prompt: 'Run tail bigfile.txt to see the last 10.',
          expectedCommand: 'tail bigfile.txt',
          hints: [
            'Use tail command',
            'Default shows last 10 lines'
          ],
          completed: false
        },
        {
          id: 'p6-4',
          prompt: 'Try head -n 5 bigfile.txt and tail -n 5 bigfile.txt.',
          expectedCommand: 'head -n 5 bigfile.txt && tail -n 5 bigfile.txt',
          hints: [
            'Use -n option to specify number of lines',
            'You can chain commands with &&'
          ],
          completed: false
        },
        {
          id: 'p6-5',
          prompt: 'Run tail -f bigfile.txt in one terminal window, then in another, append lines: echo "Line 21" >> bigfile.txt',
          expectedCommand: 'tail -f bigfile.txt',
          hints: [
            'Use tail -f to follow the file',
            'Watch how the terminal updates in real time!'
          ],
          completed: false
        }
      ],
      summary: `
        Now that you can peek at beginnings and ends of files, the next logical step is to search inside them. In Lesson 7, we'll learn how to find specific words or patterns using grep and how to locate files themselves with find.
      `
    },
    quiz: {
      id: 'quiz-6',
      questions: [
        {
          id: 'q6-1',
          question: 'Which command shows the first 10 lines of a file?',
          options: [
            'tail',
            'head',
            'more',
            'cat'
          ],
          correctAnswer: 1,
          explanation: 'head shows the first 10 lines of a file by default.'
        },
        {
          id: 'q6-2',
          question: 'What does tail -f logfile.txt do?',
          options: [
            'Shows the first 10 lines',
            'Follows the file and shows new lines in real-time',
            'Shows file permissions',
            'Counts total lines'
          ],
          correctAnswer: 1,
          explanation: 'tail -f follows the file in real-time, showing new lines as they are added - very useful for monitoring logs.'
        },
        {
          id: 'q6-3',
          question: 'How do you quit out of the more pager?',
          options: [
            'Press Ctrl+C',
            'Press Q',
            'Press Escape',
            'Press Enter'
          ],
          correctAnswer: 1,
          explanation: 'Press Q to quit out of the more pager.'
        }
      ]
    }
  },

  {
    id: '7',
    title: 'Searching for Text (grep, find)',
    duration: 6,
    description: 'Search for words inside files with grep and search for files on your system with find.',
    completed: false,
    content: {
      introduction: `
        Learning Objective: Search for words inside files with grep and search for files on your system with find. These commands help you locate exactly what you need in large projects.
      `,
      commands: [
        {
          name: 'grep',
          description: 'Search Inside Files – grep',
          syntax: 'grep <pattern> <file>',
          examples: [
            {
              command: 'grep "error" log.txt',
              output: 'Shows all lines in log.txt that contain the word "error."',
              explanation: 'Finds all lines in <file> containing <pattern>.'
            },
            {
              command: 'grep -i "error" log.txt',
              output: 'Shows all lines with "error", "Error", "ERROR", etc.',
              explanation: 'case-insensitive.'
            },
            {
              command: 'grep -n "error" log.txt',
              output: 'Shows matching lines with line numbers.',
              explanation: 'show line numbers.'
            },
            {
              command: 'grep -r "main()" src/',
              output: 'Searches recursively through src/ directory.',
              explanation: 'search recursively through a directory.'
            }
          ]
        },
        {
          name: 'find',
          description: 'Find Files – find',
          syntax: 'find <path> -name <filename>',
          examples: [
            {
              command: 'find . -name "*.txt"',
              output: 'Finds all .txt files in the current directory (. means "here").',
              explanation: 'Search for files or directories by name.'
            },
            {
              command: 'find / -name "notes.txt"',
              output: 'Searches entire system for notes.txt (slower).',
              explanation: 'search entire system (slower).'
            },
            {
              command: 'find . -type d -name "backup"',
              output: 'Finds directories named "backup."',
              explanation: 'find directories named "backup."'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p7-1',
          prompt: 'Create a file with repeated words: echo -e "apple\\nbanana\\nApple pie\\norange" > fruits.txt',
          expectedCommand: 'echo -e "apple\\nbanana\\nApple pie\\norange" > fruits.txt',
          hints: [
            'Copy this command exactly as shown',
            'This creates a file with test data'
          ],
          completed: false
        },
        {
          id: 'p7-2',
          prompt: 'Run grep "apple" fruits.txt. Then run grep -i "apple" fruits.txt. Compare.',
          expectedCommand: 'grep "apple" fruits.txt && grep -i "apple" fruits.txt',
          hints: [
            'Use grep to search for "apple"',
            'Use -i flag for case-insensitive search',
            'Chain commands with &&'
          ],
          completed: false
        },
        {
          id: 'p7-3',
          prompt: 'Add line numbers: grep -n "apple" fruits.txt',
          expectedCommand: 'grep -n "apple" fruits.txt',
          hints: [
            'Use -n flag to show line numbers'
          ],
          completed: false
        },
        {
          id: 'p7-4',
          prompt: 'Create a couple of test files: touch doc1.txt doc2.txt image.png',
          expectedCommand: 'touch doc1.txt doc2.txt image.png',
          hints: [
            'Use touch to create empty files'
          ],
          completed: false
        },
        {
          id: 'p7-5',
          prompt: 'Run find . -name "*.txt" to find only text files.',
          expectedCommand: 'find . -name "*.txt"',
          hints: [
            'Use find with wildcard pattern',
            'The . means current directory'
          ],
          completed: false
        }
      ],
      summary: `
        Now you can search for words in files and locate files on your system. But sometimes you don't just want to look — you want to count, sort, or process text data. In Lesson 8, we'll dive into simple text processing tools like sort, uniq, and wc.
      `
    },
    quiz: {
      id: 'quiz-7',
      questions: [
        {
          id: 'q7-1',
          question: 'What command shows all lines containing "error" in log.txt?',
          options: [
            'find "error" log.txt',
            'grep "error" log.txt',
            'search "error" log.txt',
            'locate "error" log.txt'
          ],
          correctAnswer: 1,
          explanation: 'grep searches for patterns within files and shows matching lines.'
        },
        {
          id: 'q7-2',
          question: 'Which grep option makes the search case-insensitive?',
          options: [
            '-n',
            '-i',
            '-r',
            '-v'
          ],
          correctAnswer: 1,
          explanation: 'The -i option makes grep ignore case differences when searching.'
        },
        {
          id: 'q7-3',
          question: 'How would you find all .jpg files in the current directory and subdirectories?',
          options: [
            'grep ".jpg" .',
            'find . -name "*.jpg"',
            'search ".jpg" .',
            'locate "*.jpg"'
          ],
          correctAnswer: 1,
          explanation: 'find . -name "*.jpg" searches from current directory (.) for files matching the pattern *.jpg.'
        }
      ],
      bridgeToNext: `Once you can find text, let's edit text files directly from the terminal.`
    }
  },

  {
    id: '8',
    title: 'Text Editing — Nano Basics',
    duration: 6,
    description: 'Create and edit files with nano text editor using essential keyboard shortcuts.',
    completed: false,
    content: {
      introduction: `
        Learning Objective: Create and edit files with nano text editor. Nano is a simple, user-friendly terminal text editor that's perfect for beginners.

        Now that you can search for text inside files, let's learn how to edit text files directly from the terminal. The nano text editor is beginner-friendly and shows its keyboard shortcuts right on screen, making it an ideal first text editor for terminal work.

        Nano displays helpful information at the bottom of the screen. You'll see shortcuts like "^X Exit" (which means Ctrl+X to exit) and other commands. The ^ symbol always means the Ctrl key.
      `,
      commands: [
        {
          name: 'nano',
          description: 'Open nano text editor',
          syntax: 'nano filename.txt',
          examples: [
            {
              command: 'nano myfile.txt',
              output: 'Opens nano editor with myfile.txt (creates the file if it doesn\'t exist)',
              explanation: 'Opens the file in nano. If the file doesn\'t exist, nano creates a new empty file with that name when you save.'
            },
            {
              command: 'nano',
              output: 'Opens nano with an empty buffer',
              explanation: 'Opens nano without specifying a filename. You\'ll need to save with Ctrl+O and provide a filename.'
            }
          ]
        },
        {
          name: 'Ctrl+O',
          description: 'Save file (WriteOut)',
          syntax: 'Press Ctrl+O while in nano',
          examples: [
            {
              command: 'Ctrl+O',
              output: 'File Name to Write: myfile.txt',
              explanation: 'Saves the file. Nano will ask for confirmation of the filename. Press Enter to confirm, or type a different name.'
            }
          ]
        },
        {
          name: 'Ctrl+X',
          description: 'Exit nano',
          syntax: 'Press Ctrl+X while in nano',
          examples: [
            {
              command: 'Ctrl+X',
              output: 'Exits nano (may prompt to save unsaved changes)',
              explanation: 'Exits the editor. If you have unsaved changes, nano will ask if you want to save them first.'
            }
          ]
        },
        {
          name: 'Ctrl+K',
          description: 'Cut/delete current line',
          syntax: 'Press Ctrl+K while in nano',
          examples: [
            {
              command: 'Ctrl+K',
              output: 'Removes the current line and stores it in buffer',
              explanation: 'Cuts (deletes) the entire line where your cursor is located. The line is stored and can be pasted with Ctrl+U.'
            }
          ]
        },
        {
          name: 'Ctrl+U',
          description: 'Paste/uncut line',
          syntax: 'Press Ctrl+U while in nano',
          examples: [
            {
              command: 'Ctrl+U',
              output: 'Pastes the previously cut line',
              explanation: 'Pastes the line that was last cut with Ctrl+K. You can paste the same line multiple times.'
            }
          ]
        },
        {
          name: 'Ctrl+W',
          description: 'Search for text',
          syntax: 'Press Ctrl+W while in nano',
          examples: [
            {
              command: 'Ctrl+W',
              output: 'Search: [cursor for input]',
              explanation: 'Opens search prompt. Type your search term and press Enter to find it in the file.'
            }
          ]
        },
        {
          name: 'Ctrl+G',
          description: 'Show help screen',
          syntax: 'Press Ctrl+G while in nano',
          examples: [
            {
              command: 'Ctrl+G',
              output: 'Displays complete list of keyboard shortcuts',
              explanation: 'Shows the built-in help screen with all available commands. Press Ctrl+X to return to editing.'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p8-1',
          prompt: 'Create a new text file using nano',
          expectedCommand: 'nano practice.txt',
          hints: [
            'Type: nano practice.txt',
            'This will open nano with an empty file',
            'If nano doesn\'t open, check that it\'s installed on your system'
          ],
          explanation: 'Opens nano editor with an empty file named practice.txt'
        },
        {
          id: 'p8-2',
          prompt: 'Type some text and save the file using Ctrl+O',
          expectedCommand: 'Type text then Ctrl+O',
          hints: [
            'Type: Hello World',
            'Press Ctrl+O to save (WriteOut)',
            'Press Enter to confirm the filename',
            'You should see "[ Wrote X lines ]" confirmation'
          ],
          explanation: 'Ctrl+O saves the current file'
        },
        {
          id: 'p8-3',
          prompt: 'Cut a line using Ctrl+K, then paste it with Ctrl+U',
          expectedCommand: 'Ctrl+K then Ctrl+U',
          hints: [
            'Position cursor on a line with text',
            'Press Ctrl+K to cut the entire line',
            'Move cursor to a new position',
            'Press Ctrl+U to paste the line'
          ],
          explanation: 'Ctrl+K cuts lines, Ctrl+U pastes them back'
        },
        {
          id: 'p8-4',
          prompt: 'Search for text using Ctrl+W',
          expectedCommand: 'Ctrl+W then search term',
          hints: [
            'Press Ctrl+W to open search',
            'Type a word that exists in your text',
            'Press Enter to search',
            'The cursor will jump to the found text'
          ],
          explanation: 'Ctrl+W opens the search function in nano'
        },
        {
          id: 'p8-5',
          prompt: 'Exit nano and verify your file was saved',
          expectedCommand: 'Ctrl+X then cat practice.txt',
          hints: [
            'Press Ctrl+X to exit nano',
            'Run: cat practice.txt',
            'You should see the text you typed',
            'If file is empty, the save didn\'t work'
          ],
          explanation: 'Ctrl+X exits nano, cat displays file contents'
        }
      ],
      summary: `
        You can now create and edit files without leaving the terminal. Nano keeps its shortcuts on screen at all times, so there is nothing to memorise — and the ^ symbol always means the Ctrl key.

        Key takeaways: • nano filename opens a file for editing, creating it if it does not exist yet • Ctrl+O saves the file (think "Output"), then Enter confirms the filename • Ctrl+X exits, and offers to save first if you have unsaved changes • Ctrl+K cuts a whole line, Ctrl+U pastes it back • Ctrl+W searches inside the file • Ctrl+G opens the built-in help

        Nano is deliberately simple, and that is its strength. Many developers eventually move on to vim or emacs, but nano is installed almost everywhere and stays the fastest way to make a quick edit on a remote server.
      `,
      bridgeToNext: `Now that you can edit files directly from the terminal, let's learn how to process text data with commands like sort, uniq, and wc.`
    },
    quiz: {
      id: 'quiz-8',
      questions: [
        {
          id: 'q8-1',
          question: 'Nano shows "^X Exit" at the bottom of the screen. What does the ^ symbol mean?',
          options: [
            'Press Shift',
            'Press the Ctrl key',
            'Press the Alt key',
            'Press the up arrow'
          ],
          correctAnswer: 1,
          explanation: 'In nano, ^ always stands for the Ctrl key — so ^X means Ctrl+X.'
        },
        {
          id: 'q8-2',
          question: 'You want to save your changes but keep editing. Which shortcut do you use?',
          options: [
            'Ctrl+X',
            'Ctrl+O',
            'Ctrl+S',
            'Ctrl+W'
          ],
          correctAnswer: 1,
          explanation: 'Ctrl+O writes the file out (saves) and leaves you in the editor. Ctrl+X would exit, and nano does not use Ctrl+S to save.'
        },
        {
          id: 'q8-3',
          question: 'You pressed Ctrl+K three times by accident and deleted three lines. How do you get them back?',
          options: [
            'Ctrl+Z to undo',
            'Ctrl+U to paste them back',
            'Ctrl+R to reload the file',
            'Retype them — cut lines are gone for good'
          ],
          correctAnswer: 1,
          explanation: 'Ctrl+K cuts lines into a buffer and Ctrl+U uncuts (pastes) them back. They are a pair.'
        }
      ]
    }
  },

  {
    id: '9',
    title: 'Text Processing Basics (sort, uniq, wc)',
    duration: 6,
    description: 'Learn how to sort, remove duplicates, and count lines/words in files.',
    completed: false,
    content: {
      introduction: `
        Learning Objective: Learn how to sort, remove duplicates, and count lines/words in files. These commands let you manipulate raw text data easily.
      `,
      commands: [
        {
          name: 'sort',
          description: 'Sorting Lines – sort',
          syntax: 'sort <file>',
          examples: [
            {
              command: 'sort fruits.txt',
              output: 'apple, Apple pie, banana, orange (note uppercase vs lowercase ordering).',
              explanation: 'Sorts lines alphabetically by default.'
            },
            {
              command: 'sort -r',
              output: 'Lines sorted in reverse order.',
              explanation: 'reverse order.'
            },
            {
              command: 'sort -f',
              output: 'Lines sorted ignoring case.',
              explanation: 'ignore case.'
            },
            {
              command: 'sort -n numbers.txt',
              output: 'Numbers sorted numerically.',
              explanation: 'numeric sort.'
            }
          ]
        },
        {
          name: 'uniq',
          description: 'Removing Duplicates – uniq',
          syntax: 'uniq <file>',
          examples: [
            {
              command: 'uniq <file>',
              output: 'Removes duplicate adjacent lines.',
              explanation: 'Removes duplicate adjacent lines. Tip: Usually combine with sort first.'
            },
            {
              command: 'sort fruits.txt | uniq',
              output: 'Removes duplicates from sorted list.',
              explanation: 'Example: Removes duplicates from sorted list.'
            }
          ]
        },
        {
          name: 'wc',
          description: 'Counting – wc',
          syntax: 'wc <file>',
          examples: [
            {
              command: 'wc fruits.txt',
              output: '4  5 32 fruits.txt',
              explanation: 'Prints line count, word count, character count. (That\'s 4 lines, 5 words, 32 characters.)'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p8-1',
          prompt: 'Make a file with duplicates: echo -e "apple\\nbanana\\napple\\nbanana\\norange" > dupes.txt',
          expectedCommand: 'echo -e "apple\\nbanana\\napple\\nbanana\\norange" > dupes.txt',
          hints: [
            'Copy this command exactly as shown',
            'This creates a file with duplicate lines'
          ],
          completed: false
        },
        {
          id: 'p8-2',
          prompt: 'Run sort dupes.txt | uniq.',
          expectedCommand: 'sort dupes.txt | uniq',
          hints: [
            'Use sort first, then pipe to uniq',
            'The | symbol connects the commands'
          ],
          completed: false
        },
        {
          id: 'p8-3',
          prompt: 'Count words: Run wc -w dupes.txt.',
          expectedCommand: 'wc -w dupes.txt',
          hints: [
            'Use wc with -w flag for word count'
          ],
          completed: false
        },
        {
          id: 'p8-4',
          prompt: 'Count lines: Run wc -l dupes.txt.',
          expectedCommand: 'wc -l dupes.txt',
          hints: [
            'Use wc with -l flag for line count'
          ],
          completed: false
        }
      ],
      summary: `
        Now you can sort, filter duplicates, and count text — a big step toward data wrangling. In Lesson 9, we'll look at pattern matching using wildcards and regular expressions, which help you match many files or lines at once.
      `
    },
    quiz: {
      id: 'quiz-8',
      questions: [
        {
          id: 'q8-1',
          question: 'Why is uniq often combined with sort?',
          options: [
            'uniq only works on already sorted files',
            'uniq only removes adjacent duplicate lines',
            'sort makes uniq faster',
            'They must always be used together'
          ],
          correctAnswer: 1,
          explanation: 'uniq only removes adjacent duplicate lines, so sorting first groups all duplicates together.'
        },
        {
          id: 'q8-2',
          question: 'Which option makes sort ignore case?',
          options: [
            '-i',
            '-f',
            '-n',
            '-r'
          ],
          correctAnswer: 1,
          explanation: 'The -f option makes sort ignore case differences.'
        },
        {
          id: 'q8-3',
          question: 'Which command counts the number of lines in a file?',
          options: [
            'wc -w',
            'wc -l',
            'wc -c',
            'count -l'
          ],
          correctAnswer: 1,
          explanation: 'wc -l counts the number of lines in a file.'
        }
      ],
      bridgeToNext: `Next, we'll look at more powerful matching with wildcards and regex.`
    }
  },

  {
    id: '10',
    title: 'Pattern Matching (Wildcards & Regex Basics)',
    duration: 6,
    description: 'Understand how to use wildcards for filenames and basic regular expressions for text searches.',
    completed: false,
    content: {
      introduction: `
        Learning Objective: Understand how to use wildcards for filenames and basic regular expressions for text searches.
      `,
      commands: [
        {
          name: 'Wildcards',
          description: 'Wildcards in File Names',
          syntax: '* ? [] patterns',
          examples: [
            {
              command: 'ls *.txt',
              output: 'file1.txt file2.txt notes.txt',
              explanation: '* matches zero or more characters. * matches any characters - finds all .txt files'
            },
            {
              command: 'ls file?.txt',
              output: 'file1.txt file2.txt',
              explanation: '? matches exactly one character.'
            },
            {
              command: 'ls [abc]*.txt',
              output: 'apple.txt banana.txt cherry.txt',
              explanation: '[abc] matches any one of a, b, or c. [abc] matches any one of the listed characters'
            }
          ]
        },
        {
          name: 'Regex',
          description: 'Regex with grep',
          syntax: 'grep pattern file',
          examples: [
            {
              command: 'grep "a.*e" fruits.txt',
              output: 'Matches lines with a followed later by e (like "apple").',
              explanation: 'Matches lines with a followed later by e (like "apple").'
            },
            {
              command: 'grep "^word" fruits.txt',
              output: 'Lines starting with "word."',
              explanation: '^word → lines starting with "word."'
            },
            {
              command: 'grep "word$" fruits.txt',
              output: 'Lines ending with "word."',
              explanation: 'word$ → lines ending with "word."'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p9-1',
          prompt: 'Create files: touch test1.txt test2.txt testA.txt. Run ls test?.txt.',
          expectedCommand: 'touch test1.txt test2.txt testA.txt && ls test?.txt',
          hints: [
            'Use touch to create files first',
            'Then use ls with wildcard pattern test?.txt',
            'The ? matches exactly one character'
          ],
          completed: false
        },
        {
          id: 'p9-2',
          prompt: 'In fruits.txt, run grep "^a" fruits.txt (lines starting with "a").',
          expectedCommand: 'grep "^a" fruits.txt',
          hints: [
            'Use grep with ^ to match lines starting with "a"',
            'The ^ symbol means "beginning of line"'
          ],
          completed: false
        },
        {
          id: 'p9-3',
          prompt: 'Run grep "e$" fruits.txt (lines ending with "e").',
          expectedCommand: 'grep "e$" fruits.txt',
          hints: [
            'Use grep with $ to match lines ending with "e"',
            'The $ symbol means "end of line"'
          ],
          completed: false
        }
      ],
      summary: `
        You now know how to match patterns — both filenames with wildcards and text with regex. Next, in Lesson 10, we'll move into process management — learning how to see what's running on your system and how to control it.
      `
    },
    quiz: {
      id: 'quiz-9',
      questions: [
        {
          id: 'q9-1',
          question: 'What does ls file?.txt match?',
          options: [
            'Any file with "file" in the name',
            'file1.txt, file2.txt, fileA.txt but not file10.txt',
            'Only file.txt',
            'All .txt files'
          ],
          correctAnswer: 1,
          explanation: 'The ? wildcard matches exactly one character, so file?.txt matches file1.txt, file2.txt, etc.'
        },
        {
          id: 'q9-2',
          question: 'In regex, what does ^ mean when used in a pattern?',
          options: [
            'End of line',
            'Beginning of line',
            'Any character',
            'Not'
          ],
          correctAnswer: 1,
          explanation: 'The ^ symbol in regex means "beginning of line".'
        },
        {
          id: 'q9-3',
          question: 'Which wildcard would match any file ending in .log?',
          options: [
            '?.log',
            '*.log',
            '[a-z].log',
            'file.log'
          ],
          correctAnswer: 1,
          explanation: 'The * wildcard matches zero or more characters, so *.log matches any file ending in .log.'
        }
      ],
      bridgeToNext: `Once you can match patterns, it's time to manage running processes.`
    }
  },


  {
    id: '11',
    title: 'Process Management: ps, top, kill',
    duration: 6,
    description: 'Learn to monitor and control running processes with ps, top, and kill commands.',
    completed: false,
    content: {
      introduction: `
        Your computer runs many programs (processes) simultaneously. Understanding how to monitor and control these processes is essential for system administration and troubleshooting:

        • ps - shows currently running processes
        • top - displays real-time process information
        • kill - terminates processes

        These commands help you identify resource-heavy programs, troubleshoot stuck applications, and manage system performance.

        Essential skills for developers, system administrators, and anyone who needs to manage system resources effectively!
      `,
      commands: [
        {
          name: 'ps',
          description: 'Show running processes',
          syntax: 'ps [options]',
          examples: [
            {
              command: 'ps',
              output: 'PID TTY TIME CMD\\n1234 pts/0 00:00:01 bash',
              explanation: 'Shows processes in current terminal session'
            },
            {
              command: 'ps aux',
              output: 'USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND',
              explanation: 'Shows all processes with detailed information'
            },
            {
              command: 'ps -ef | grep python',
              output: 'user 5678 1 0 10:30 ? 00:00:05 python script.py',
              explanation: 'Find all Python processes'
            }
          ]
        },
        {
          name: 'top',
          description: 'Display and update sorted information about running processes',
          syntax: 'top [options]',
          examples: [
            {
              command: 'top',
              output: '[Interactive display of processes sorted by CPU usage]',
              explanation: 'Shows real-time process information. Press q to quit.'
            },
            {
              command: 'top -n 1',
              output: '[One snapshot of processes, then exit]',
              explanation: 'Takes one snapshot and exits (non-interactive)'
            }
          ]
        },
        {
          name: 'kill',
          description: 'Terminate processes by PID',
          syntax: 'kill [signal] PID',
          examples: [
            {
              command: 'kill 1234',
              output: '',
              explanation: 'Sends TERM signal to process ID 1234 (gentle shutdown)'
            },
            {
              command: 'kill -9 1234',
              output: '',
              explanation: 'Forces immediate termination (use when normal kill fails)'
            },
            {
              command: 'killall firefox',
              output: '',
              explanation: 'Kills all processes named "firefox"'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p11-1',
          prompt: 'Show all running processes with detailed information',
          expectedCommand: 'ps aux',
          hints: [
            'Use ps with aux options',
            'This shows all processes with user, CPU, memory info'
          ],
          completed: false
        },
        {
          id: 'p11-2',
          prompt: 'Find processes containing "bash" in their name',
          expectedCommand: 'ps aux | grep bash',
          hints: [
            'Combine ps aux with grep',
            'Use pipe (|) to connect commands',
            'Search for "bash"'
          ],
          completed: false
        }
      ],
      summary: `
        Great job! You now understand process management basics. These skills are crucial for system maintenance and troubleshooting.
        
        Key concepts:
        • PID = Process ID (unique identifier for each process)
        • %CPU = Percentage of CPU being used
        • %MEM = Percentage of memory being used
        • Process states: Running, Sleeping, Stopped, Zombie
        
        Common ps options:
        • ps aux - all processes with detailed info
        • ps -ef - all processes in full format
        • ps -u username - processes for specific user
        
        Kill signals:
        • kill PID (SIGTERM) - polite shutdown request
        • kill -9 PID (SIGKILL) - immediate forceful termination
        • kill -STOP PID - pause process
        • kill -CONT PID - resume paused process
        
        Safety tips:
        • Always try normal kill before kill -9
        • Be careful with system processes (low PID numbers)
        • Use ps to find PID before killing
      `
    },
    quiz: {
      id: 'quiz-11',
      questions: [
        {
          id: 'q11-1',
          question: 'Which command shows all running processes with detailed information?',
          options: ['ps', 'ps aux', 'ps -l', 'ps --all'],
          correctAnswer: 1,
          explanation: 'ps aux shows all processes (a), includes processes not attached to terminal (u), and provides detailed info (x).'
        },
        {
          id: 'q11-2',
          question: 'What does "kill -9" do?',
          options: [
            'Kills 9 processes',
            'Gently asks process to shut down',
            'Forces immediate process termination',
            'Kills processes older than 9 seconds'
          ],
          correctAnswer: 2,
          explanation: 'kill -9 sends SIGKILL signal which forces immediate termination - the process cannot ignore this signal.'
        }
      ],
      bridgeToNext: `Now that you can manage processes, let's check system info.`
    }
  },

  {
    id: '12',
    title: 'System Info: df, du, free, uname',
    duration: 6,
    description: 'Monitor system resources with disk space, memory, and system information commands.',
    completed: false,
    content: {
      introduction: `
        Monitoring system resources is crucial for maintaining healthy systems. These commands help you check available space, memory usage, and system information:
        
        • df - shows filesystem disk space usage
        • du - shows directory space usage  
        • free - displays memory usage
        • uname - shows system information
        
        Essential for system administrators, developers managing servers, and anyone troubleshooting performance issues.
      `,
      commands: [
        {
          name: 'df',
          description: 'Display filesystem disk space usage',
          syntax: 'df [options]',
          examples: [
            {
              command: 'df -h',
              output: '/dev/disk1 465Gi 350Gi 113Gi 76% /',
              explanation: 'Shows disk usage in human-readable format (GB, MB)'
            },
            {
              command: 'df .',
              output: '/dev/disk1 488245288 366970960 118250072 76% /',
              explanation: 'Shows disk usage for current directory filesystem'
            }
          ]
        },
        {
          name: 'du',
          description: 'Display directory space usage',
          syntax: 'du [options] [directory]',
          examples: [
            {
              command: 'du -h Documents/',
              output: '150M Documents/Photos\\n50M Documents/Videos',
              explanation: 'Shows space used by each subdirectory in human-readable format'
            },
            {
              command: 'du -sh *',
              output: '2.1G Applications\\n150M Documents',
              explanation: 'Summary (-s) of each item in current directory'
            }
          ]
        },
        {
          name: 'free',
          description: 'Display memory usage',
          syntax: 'free [options]',
          examples: [
            {
              command: 'free -h',
              output: 'total used free shared buff/cache available\\nMem: 8.0Gi 4.2Gi 1.1Gi 634Mi 2.7Gi 2.9Gi',
              explanation: 'Shows memory usage in human-readable format'
            }
          ]
        },
        {
          name: 'uname',
          description: 'Display system information',
          syntax: 'uname [options]',
          examples: [
            {
              command: 'uname -a',
              output: 'Darwin MacBook-Pro.local 21.6.0 Darwin Kernel Version 21.6.0',
              explanation: 'Shows all system information'
            },
            {
              command: 'uname -s',
              output: 'Darwin',
              explanation: 'Shows kernel name'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p12-1',
          prompt: 'Check disk space usage in human-readable format',
          expectedCommand: 'df -h',
          hints: [
            'Use df command with -h option',
            '-h makes output human-readable (GB, MB instead of bytes)'
          ],
          completed: false
        },
        {
          id: 'p12-2',
          prompt: 'Use du -sh on a folder to check its size',
          expectedCommand: 'du -sh Documents/',
          hints: [
            'Use du command with -sh options on a directory',
            '-s gives summary, -h makes it human-readable'
          ],
          completed: false
        },
        {
          id: 'p12-3',
          prompt: 'Print out system information with uname -a',
          expectedCommand: 'uname -a',
          hints: [
            'Use uname with -a option',
            '-a shows all available system information'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You can now monitor crucial system resources. These commands are essential for system health and troubleshooting.
        
        Key points:
        • df shows filesystem space - use -h for readable format
        • du shows directory sizes - great for finding large files
        • free shows memory usage - important for performance
        • uname shows system details - useful for compatibility
        
        Pro tips:
        • df -h / shows root filesystem usage
        • du -sh * | sort -hr shows largest directories first
        • free -m shows memory in megabytes
        • Watch commands: watch "df -h" monitors disk space live
      `
    },
    quiz: {
      id: 'quiz-12',
      questions: [
        {
          id: 'q12-1',
          question: 'Which command shows filesystem disk space usage?',
          options: ['du', 'df', 'free', 'ls -l'],
          correctAnswer: 1,
          explanation: 'df (disk free) shows filesystem disk space usage and availability.'
        },
        {
          id: 'q12-2',
          question: 'Which command shows how much space a specific directory is using?',
          options: ['df /home', 'du /home', 'free /home', 'ls -l /home'],
          correctAnswer: 1,
          explanation: 'du (disk usage) shows the disk space used by directories and files.'
        },
        {
          id: 'q12-3',
          question: 'What information does the "free" command display?',
          options: [
            'Available disk space',
            'Memory (RAM) usage',
            'CPU usage',
            'Network status'
          ],
          correctAnswer: 1,
          explanation: 'The free command displays information about memory (RAM) usage, including total, used, and available memory.'
        }
      ],
      bridgeToNext: `Once you understand system resources, let's learn network troubleshooting.`
    }
  },

  {
    id: '13',
    title: 'Network Basics: ping, curl, wget',
    duration: 6,
    description: 'Learn essential network troubleshooting and data fetching commands.',
    completed: false,
    content: {
      introduction: `
        Network connectivity and data fetching are common tasks in terminal work. These commands help you test connections and retrieve data:
        
        • ping - tests network connectivity
        • curl - transfers data from/to servers
        • wget - downloads files from web
        
        Essential for developers, system administrators, and anyone working with web services or troubleshooting network issues.
      `,
      commands: [
        {
          name: 'ping',
          description: 'Test network connectivity',
          syntax: 'ping [options] hostname',
          examples: [
            {
              command: 'ping google.com',
              output: '64 bytes from 142.250.191.14: icmp_seq=1 ttl=117 time=12.3 ms',
              explanation: 'Tests connectivity to google.com, shows response time'
            },
            {
              command: 'ping -c 4 google.com',
              output: 'Sends exactly 4 ping packets then stops',
              explanation: '-c limits number of packets sent'
            }
          ]
        },
        {
          name: 'curl',
          description: 'Transfer data from or to a server',
          syntax: 'curl [options] URL',
          examples: [
            {
              command: 'curl https://api.github.com/users/octocat',
              output: '{"login":"octocat","id":1...}',
              explanation: 'Fetches data from GitHub API'
            },
            {
              command: 'curl -o file.html https://example.com',
              output: '',
              explanation: 'Downloads webpage and saves as file.html'
            }
          ]
        },
        {
          name: 'wget',
          description: 'Download files from the web',
          syntax: 'wget [options] URL',
          examples: [
            {
              command: 'wget https://example.com/file.zip',
              output: 'Downloading file.zip... 100%',
              explanation: 'Downloads file.zip to current directory'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p13-1',
          prompt: 'Test connectivity to google.com (send 3 pings)',
          expectedCommand: 'ping -c 3 google.com',
          hints: [
            'Use ping command',
            'Use -c option to limit ping count',
            'Format: ping -c NUMBER hostname'
          ],
          completed: false
        }
      ],
      summary: `
        Great! You now know essential networking commands for connectivity testing and data retrieval.
        
        Common use cases:
        • ping - test if a server is reachable
        • curl - interact with REST APIs, download data
        • wget - download files, backup websites
        
        Pro tips:
        • ping -c 4 limits to 4 pings (good for scripts)
        • curl -I shows only HTTP headers
        • wget -r downloads entire websites recursively
      `
    },
    quiz: {
      id: 'quiz-13',
      questions: [
        {
          id: 'q13-1',
          question: 'Which command tests network connectivity to a server?',
          options: ['curl', 'wget', 'ping', 'ssh'],
          correctAnswer: 2,
          explanation: 'ping tests network connectivity by sending ICMP packets to a host and measuring response time.'
        },
        {
          id: 'q13-2',
          question: 'Which command would you use to download a file from the internet?',
          options: ['ping example.com/file.txt', 'curl example.com/file.txt', 'ssh example.com/file.txt', 'cp example.com/file.txt'],
          correctAnswer: 1,
          explanation: 'curl can download files from the internet. You can also use wget for downloading files.'
        },
        {
          id: 'q13-3',
          question: 'What is the main difference between curl and wget?',
          options: [
            'curl only works with HTTP, wget works with FTP',
            'wget is primarily for downloading files, curl is more versatile for web requests',
            'curl is faster than wget',
            'wget can only download text files'
          ],
          correctAnswer: 1,
          explanation: 'wget is primarily designed for downloading files, while curl is more versatile and can handle various types of web requests and protocols.'
        }
      ]
    }
  },

  {
    id: '14',
    title: 'Environment Variables: env, export',
    duration: 6,
    description: 'Understand and manage environment variables that control system behavior.',
    completed: false,
    content: {
      introduction: `
        Environment variables are key-value pairs that affect how programs run. They control paths, settings, and behavior of applications:
        
        • env - displays all environment variables
        • export - sets environment variables
        • echo $VAR - displays variable value
        
        Essential for configuring development environments, deployment settings, and system behavior.
      `,
      commands: [
        {
          name: 'env',
          description: 'Display environment variables',
          syntax: 'env',
          examples: [
            {
              command: 'env',
              output: 'PATH=/usr/bin:/bin\\nHOME=/Users/john\\nUSER=john',
              explanation: 'Shows all environment variables and their values'
            },
            {
              command: 'env | grep PATH',
              output: 'PATH=/usr/local/bin:/usr/bin:/bin',
              explanation: 'Shows only PATH variable'
            }
          ]
        },
        {
          name: 'export',
          description: 'Set environment variables',
          syntax: 'export VARIABLE=value',
          examples: [
            {
              command: 'export MY_VAR="hello world"',
              output: '',
              explanation: 'Creates environment variable MY_VAR'
            },
            {
              command: 'export PATH=$PATH:/new/path',
              output: '',
              explanation: 'Adds /new/path to existing PATH variable'
            }
          ]
        },
        {
          name: 'echo $VAR',
          description: 'Display variable value',
          syntax: 'echo $VARIABLE',
          examples: [
            {
              command: 'echo $HOME',
              output: '/Users/john',
              explanation: 'Shows value of HOME variable'
            },
            {
              command: 'echo $PATH',
              output: '/usr/local/bin:/usr/bin:/bin',
              explanation: 'Shows PATH variable (where system looks for commands)'
            }
          ]
        },
        {
          name: 'PATH Manipulation',
          description: 'Modify PATH variable',
          syntax: 'export PATH=$PATH:/new/path',
          examples: [
            {
              command: 'export PATH=$PATH:/usr/local/mytools',
              output: '',
              explanation: 'Adds /usr/local/mytools to the end of PATH'
            },
            {
              command: 'echo $PATH',
              output: '/usr/local/bin:/usr/bin:/bin:/usr/local/mytools',
              explanation: 'Verify the new path was added'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p14-1',
          prompt: 'Display your HOME directory path',
          expectedCommand: 'echo $HOME',
          hints: [
            'Use echo command with $HOME variable',
            'Variables are accessed with $ prefix'
          ],
          completed: false
        },
        {
          id: 'p14-2',
          prompt: 'Create an environment variable called CITY with value "San Francisco" and echo it',
          expectedCommand: 'export CITY="San Francisco" && echo $CITY',
          hints: [
            'Use export command to set variable',
            'Format: export VARIABLE="value"',
            'Then echo $VARIABLE to display it'
          ],
          completed: false
        },
        {
          id: 'p14-3',
          prompt: 'Add /usr/local/testtools to your PATH and confirm with echo $PATH',
          expectedCommand: 'export PATH=$PATH:/usr/local/testtools && echo $PATH',
          hints: [
            'Use export PATH=$PATH:/new/path format',
            'Then echo $PATH to verify the addition'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You understand environment variables - a crucial concept for system configuration and development.
        
        Important variables:
        • PATH - directories where system looks for commands
        • HOME - user's home directory
        • USER - current username
        • PWD - current working directory
        
        Usage patterns:
        • export VAR=value - sets variable for current session
        • Add to ~/.bashrc or ~/.zshrc for permanent variables
        • Use $VAR to access variable values
        
        Pro tips:
        • env | sort shows variables alphabetically
        • unset VAR removes a variable
        • Variables are inherited by child processes
      `
    },
    quiz: {
      id: 'quiz-14',
      questions: [
        {
          id: 'q14-1',
          question: 'How do you display the value of an environment variable called PATH?',
          options: ['echo PATH', 'echo $PATH', 'print PATH', 'show PATH'],
          correctAnswer: 1,
          explanation: 'Use echo $PATH - the $ prefix tells the shell to substitute the variable\'s value.'
        }
      ]
    }
  },

  {
    id: '15',
    title: 'Command History: history, !!, aliases',
    duration: 6,
    description: 'Master command history navigation and create shortcuts with aliases.',
    completed: false,
    content: {
      introduction: `
        Efficient terminal usage involves reusing and modifying previous commands. These features boost productivity:
        
        • history - shows command history
        • !! - repeats last command
        • !n - repeats command number n
        • alias - creates command shortcuts
        
        Essential for power users who want to work faster and avoid retyping long commands.
      `,
      commands: [
        {
          name: 'history',
          description: 'Show command history',
          syntax: 'history [options]',
          examples: [
            {
              command: 'history',
              output: '1 ls -la\\n2 cd Documents\\n3 grep "error" log.txt',
              explanation: 'Shows numbered list of recent commands'
            },
            {
              command: 'history 5',
              output: 'Shows last 5 commands only',
              explanation: 'Limits output to recent commands'
            }
          ]
        },
        {
          name: 'History shortcuts',
          description: 'Quick ways to reuse commands',
          syntax: '!! !n !string',
          examples: [
            {
              command: '!!',
              output: 'Repeats the last command',
              explanation: 'Very useful when last command failed due to permissions'
            },
            {
              command: 'sudo !!',
              output: 'Runs last command with sudo',
              explanation: 'Common pattern when you forgot sudo'
            },
            {
              command: '!25',
              output: 'Repeats command number 25 from history',
              explanation: 'Runs specific command by history number'
            }
          ]
        },
        {
          name: 'alias',
          description: 'Create command shortcuts',
          syntax: 'alias name="command"',
          examples: [
            {
              command: 'alias ll="ls -la"',
              output: '',
              explanation: 'Creates shortcut "ll" for "ls -la"'
            },
            {
              command: 'alias grep="grep --color=auto"',
              output: '',
              explanation: 'Makes grep always use color highlighting'
            },
            {
              command: 'alias',
              output: 'Shows all current aliases',
              explanation: 'Lists all defined aliases'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p15-1',
          prompt: 'Show your command history',
          expectedCommand: 'history',
          hints: [
            'Use the history command',
            'This shows numbered list of previous commands'
          ],
          completed: false
        },
        {
          id: 'p15-2',
          prompt: 'Create an alias "ll" for "ls -la"',
          expectedCommand: 'alias ll="ls -la"',
          hints: [
            'Use alias command',
            'Format: alias name="command"',
            'Use quotes around the command'
          ],
          completed: false
        }
      ],
      summary: `
        Fantastic! You now know how to work efficiently with command history and shortcuts.
        
        Productivity boosters:
        • Up/Down arrows navigate history
        • Ctrl+R searches command history
        • !! repeats last command
        • sudo !! runs last command as admin
        
        Useful aliases:
        • alias ll="ls -la" - detailed list
        • alias ..="cd .." - go up directory
        • alias h="history" - shorter history command
        • alias c="clear" - clear screen quickly
        
        Making aliases permanent:
        • Add to ~/.bashrc (Bash) or ~/.zshrc (Zsh)
        • Reload with: source ~/.bashrc
        • Use unalias name to remove aliases
      `
    },
    quiz: {
      id: 'quiz-15',
      questions: [
        {
          id: 'q15-1',
          question: 'What does "sudo !!" do?',
          options: [
            'Shows command history',
            'Repeats the last command with sudo privileges',
            'Clears command history',
            'Creates an alias'
          ],
          correctAnswer: 1,
          explanation: 'sudo !! runs the previous command with administrator privileges - very useful when you forgot to use sudo initially.'
        }
      ]
    }
  },

  {
    id: '16',
    title: 'Pipes and Redirection: |, >, >>, <',
    duration: 6,
    description: 'Master powerful data flow control with pipes and redirection operators.',
    completed: false,
    content: {
      introduction: `
        Pipes and redirection are among the most powerful features of the command line. They let you chain commands together and control where data flows:
        
        • | (pipe) - sends output of one command to another
        • > - redirects output to a file (overwrites)
        • >> - redirects output to a file (appends)
        • < - redirects input from a file
        
        These concepts transform the terminal from individual commands to powerful data processing pipelines!
      `,
      commands: [
        {
          name: 'Pipes (|)',
          description: 'Connect commands together',
          syntax: 'command1 | command2',
          examples: [
            {
              command: 'ls -la | grep "txt"',
              output: '-rw-r--r-- 1 user staff 1024 Dec 1 10:30 file.txt',
              explanation: 'Lists files, then filters for lines containing "txt"'
            },
            {
              command: 'cat file.txt | sort | uniq',
              output: 'Sorted unique lines...',
              explanation: 'Reads file, sorts lines, removes duplicates'
            },
            {
              command: 'ps aux | grep python | wc -l',
              output: '3',
              explanation: 'Counts how many Python processes are running'
            }
          ]
        },
        {
          name: 'Output Redirection',
          description: 'Save command output to files',
          syntax: 'command > file or command >> file',
          examples: [
            {
              command: 'ls -la > filelist.txt',
              output: '',
              explanation: 'Saves directory listing to filelist.txt (overwrites existing file)'
            },
            {
              command: 'echo "new line" >> log.txt',
              output: '',
              explanation: 'Appends "new line" to log.txt (keeps existing content)'
            },
            {
              command: 'date >> daily.log',
              output: '',
              explanation: 'Appends current date/time to daily.log'
            }
          ]
        },
        {
          name: 'Input Redirection',
          description: 'Read input from files',
          syntax: 'command < file',
          examples: [
            {
              command: 'sort < unsorted.txt',
              output: 'Sorted lines from unsorted.txt',
              explanation: 'Sorts the contents of unsorted.txt'
            },
            {
              command: 'wc -l < file.txt',
              output: '42',
              explanation: 'Counts lines in file.txt'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p16-1',
          prompt: 'List all .txt files and save the output to "txtfiles.txt"',
          expectedCommand: 'ls *.txt > txtfiles.txt',
          hints: [
            'Use ls with wildcard pattern *.txt',
            'Use > to redirect output to file',
            'Format: command > filename'
          ],
          completed: false
        },
        {
          id: 'p16-2',
          prompt: 'Count the number of lines in practice.txt using pipes',
          expectedCommand: 'cat practice.txt | wc -l',
          hints: [
            'Use cat to read the file',
            'Pipe (|) the output to wc -l',
            'Format: cat filename | wc -l'
          ],
          completed: false
        }
      ],
      summary: `
        Outstanding! You've mastered one of the most powerful concepts in terminal usage. Pipes and redirection enable complex data processing workflows.
        
        Key concepts:
        • Pipes (|) chain commands: output of first becomes input of second
        • > overwrites files with new output
        • >> appends to existing files
        • < reads input from files
        
        Powerful combinations:
        • grep "error" *.log | sort | uniq -c | sort -nr
        • ps aux | grep -v grep | grep python
        • cat file1 file2 | sort | uniq > combined_sorted.txt
        
        Real-world examples:
        • Log analysis: grep "ERROR" /var/log/*.log | wc -l
        • Data processing: cat data.csv | cut -d',' -f2 | sort | uniq
        • System monitoring: ps aux | sort -k3 -nr | head -10
      `
    },
    quiz: {
      id: 'quiz-16',
      questions: [
        {
          id: 'q16-1',
          question: 'What does "ls | grep txt" do?',
          options: [
            'Lists only .txt files',
            'Lists all files then filters for lines containing "txt"',
            'Searches for "txt" in all files',
            'Creates a file named txt'
          ],
          correctAnswer: 1,
          explanation: 'The pipe (|) sends the output of ls to grep, which then filters for lines containing "txt".'
        },
        {
          id: 'q16-2',
          question: 'What\'s the difference between > and >> ?',
          options: [
            '> appends, >> overwrites',
            '> overwrites, >> appends',
            'No difference',
            '> is for input, >> is for output'
          ],
          correctAnswer: 1,
          explanation: '> overwrites the entire file with new content, while >> appends new content to the end of existing files.'
        },
        {
          id: 'q16-3',
          question: 'What does "ps aux | grep python | wc -l" do?',
          options: [
            'Lists all Python files',
            'Counts the number of Python processes running',
            'Installs Python packages',
            'Shows Python version information'
          ],
          correctAnswer: 1,
          explanation: 'This pipeline lists all processes (ps aux), filters for lines containing "python" (grep), then counts those lines (wc -l) to show how many Python processes are running.'
        }
      ]
    }
  },

  {
    id: '17',
    title: 'Archive Management: tar, zip, gzip',
    duration: 6,
    description: 'Learn to create, extract, and manage file archives and compressed files.',
    completed: false,
    content: {
      introduction: `
        File compression and archiving are essential for storage efficiency, backups, and file distribution:
        
        • tar - creates and extracts tape archives (collections of files)
        • zip/unzip - creates and extracts ZIP archives
        • gzip/gunzip - compresses individual files
        
        These tools help you bundle files for backup, reduce storage space, and prepare files for distribution.
      `,
      commands: [
        {
          name: 'tar',
          description: 'Archive files and directories',
          syntax: 'tar [options] archive files...',
          examples: [
            {
              command: 'tar -czf backup.tar.gz Documents/',
              output: '',
              explanation: 'Creates compressed tar archive of Documents directory'
            },
            {
              command: 'tar -xzf backup.tar.gz',
              output: '',
              explanation: 'Extracts compressed tar archive'
            },
            {
              command: 'tar -tzf backup.tar.gz',
              output: 'Lists files in archive without extracting',
              explanation: 'Views contents of tar archive'
            }
          ]
        },
        {
          name: 'zip/unzip',
          description: 'Create and extract ZIP archives',
          syntax: 'zip archive.zip files...',
          examples: [
            {
              command: 'zip -r backup.zip Documents/',
              output: 'adding: Documents/file1.txt',
              explanation: 'Creates ZIP archive recursively including subdirectories'
            },
            {
              command: 'unzip backup.zip',
              output: 'inflating: Documents/file1.txt',
              explanation: 'Extracts ZIP archive to current directory'
            },
            {
              command: 'unzip -l backup.zip',
              output: 'Lists contents without extracting',
              explanation: 'Views ZIP archive contents'
            }
          ]
        },
        {
          name: 'gzip/gunzip',
          description: 'Compress individual files',
          syntax: 'gzip file or gunzip file.gz',
          examples: [
            {
              command: 'gzip largefile.txt',
              output: '',
              explanation: 'Compresses largefile.txt to largefile.txt.gz'
            },
            {
              command: 'gunzip largefile.txt.gz',
              output: '',
              explanation: 'Decompresses back to largefile.txt'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p17-1',
          prompt: 'Create a compressed tar archive called "backup.tar.gz" containing all .txt files',
          expectedCommand: 'tar -czf backup.tar.gz *.txt',
          hints: [
            'Use tar command with -czf options',
            '-c creates, -z compresses, -f specifies filename',
            'Use *.txt to include all .txt files'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You now understand file archiving and compression - essential skills for file management and system administration.
        
        Key tar options:
        • -c create archive
        • -x extract archive
        • -z compress with gzip
        • -f specify filename
        • -v verbose (show files being processed)
        • -t list contents
        
        Common patterns:
        • tar -czf backup.tar.gz folder/ (create compressed backup)
        • tar -xzf backup.tar.gz (extract compressed backup)
        • zip -r archive.zip folder/ (create ZIP recursively)
        • unzip archive.zip -d /target/dir (extract to specific directory)
        
        Best practices:
        • Use .tar.gz for Unix/Linux systems
        • Use .zip for cross-platform compatibility
        • Test archives with -t before critical operations
        • Always verify extracted files
      `
    },
    quiz: {
      id: 'quiz-17',
      questions: [
        {
          id: 'q17-1',
          question: 'Which tar command creates a compressed archive?',
          options: ['tar -cf', 'tar -czf', 'tar -xf', 'tar -tf'],
          correctAnswer: 1,
          explanation: 'tar -czf creates (-c) a compressed (-z) archive with specified filename (-f).'
        },
        {
          id: 'q17-2',
          question: 'What does "zip -r backup.zip Documents/" do?',
          options: [
            'Creates a ZIP archive of only files in Documents/',
            'Creates a ZIP archive recursively including all subdirectories',
            'Extracts ZIP archive to Documents/',
            'Lists contents of backup.zip'
          ],
          correctAnswer: 1,
          explanation: 'The -r flag makes zip include all subdirectories recursively, creating a complete archive of the entire Documents folder structure.'
        },
        {
          id: 'q17-3',
          question: 'Which command would you use to view the contents of a tar.gz file without extracting it?',
          options: [
            'tar -xzf file.tar.gz',
            'tar -czf file.tar.gz',
            'tar -tzf file.tar.gz',
            'tar -rzf file.tar.gz'
          ],
          correctAnswer: 2,
          explanation: 'tar -tzf lists the contents (-t) of a compressed (-z) tar archive with filename (-f) without extracting the files.'
        }
      ]
    }
  },

  {
    id: '18',
    title: 'Package Management: apt/brew Basics',
    duration: 6,
    description: 'Learn to install and manage software packages using system package managers.',
    completed: false,
    content: {
      introduction: `
        Package managers automate software installation, updates, and removal. Different systems use different package managers:
        
        • apt (Ubuntu/Debian) - Advanced Package Tool
        • brew (macOS) - Homebrew package manager
        • yum/dnf (Red Hat/CentOS/Fedora)
        
        These tools handle dependencies, security updates, and system integration automatically.
      `,
      commands: [
        {
          name: 'apt (Ubuntu/Debian)',
          description: 'Package management for Debian-based systems',
          syntax: 'sudo apt [command] [package]',
          examples: [
            {
              command: 'sudo apt update',
              output: 'Fetching package lists...',
              explanation: 'Updates package database with latest versions'
            },
            {
              command: 'sudo apt install git',
              output: 'Installing git and dependencies...',
              explanation: 'Installs Git version control system'
            },
            {
              command: 'sudo apt upgrade',
              output: 'Upgrading installed packages...',
              explanation: 'Updates all installed packages to latest versions'
            },
            {
              command: 'apt search python',
              output: 'python3 - Interactive high-level programming language',
              explanation: 'Searches for packages containing "python"'
            }
          ]
        },
        {
          name: 'brew (macOS)',
          description: 'Package management for macOS',
          syntax: 'brew [command] [package]',
          examples: [
            {
              command: 'brew install git',
              output: 'Installing git...',
              explanation: 'Installs Git (no sudo needed with Homebrew)'
            },
            {
              command: 'brew update',
              output: 'Updating Homebrew...',
              explanation: 'Updates Homebrew and package definitions'
            },
            {
              command: 'brew list',
              output: 'git\\nnode\\npython@3.9',
              explanation: 'Lists installed packages'
            },
            {
              command: 'brew search python',
              output: 'python@3.8\\npython@3.9\\npython@3.10',
              explanation: 'Searches for packages matching "python"'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p18-1',
          prompt: 'Search for packages containing "curl" (use apt search or brew search based on your system)',
          expectedCommand: 'apt search curl',
          hints: [
            'Use your system\'s package manager',
            'Linux: apt search curl',
            'macOS: brew search curl'
          ],
          completed: false
        }
      ],
      summary: `
        Great! You understand package management basics. This knowledge is crucial for setting up development environments and maintaining systems.
        
        Common workflows:
        1. Update package database: apt update / brew update
        2. Search for packages: apt search / brew search
        3. Install packages: apt install / brew install
        4. List installed: apt list --installed / brew list
        5. Remove packages: apt remove / brew uninstall
        
        Best practices:
        • Always update before installing (apt update)
        • Use specific versions when needed
        • Regular updates for security patches
        • Remove unused packages to save space
        
        Package manager comparison:
        • apt: Debian/Ubuntu, requires sudo, system-wide installs
        • brew: macOS/Linux, user-friendly, /usr/local installs
        • yum/dnf: Red Hat/CentOS/Fedora, similar to apt
        • pacman: Arch Linux, fast and powerful
      `
    },
    quiz: {
      id: 'quiz-18',
      questions: [
        {
          id: 'q18-1',
          question: 'Which command updates the package database on Ubuntu?',
          options: ['apt upgrade', 'apt update', 'apt install', 'apt search'],
          correctAnswer: 1,
          explanation: 'apt update refreshes the package database with information about available packages and versions.'
        },
        {
          id: 'q18-2',
          question: 'What is the macOS equivalent of "apt install" for installing packages?',
          options: [
            'brew update',
            'brew install',
            'brew search',
            'brew upgrade'
          ],
          correctAnswer: 1,
          explanation: 'brew install is the Homebrew command for installing packages on macOS, equivalent to apt install on Ubuntu.'
        },
        {
          id: 'q18-3',
          question: 'Which command shows information about an installed package?',
          options: [
            'apt list --installed',
            'apt show package-name',
            'apt search package-name',
            'apt remove package-name'
          ],
          correctAnswer: 1,
          explanation: 'apt show displays detailed information about a specific package, including description, version, and dependencies.'
        }
      ]
    }
  },

  {
    id: '19',
    title: 'Shell Scripting: Basic Bash Scripts',
    duration: 6,
    description: 'Create simple shell scripts to automate repetitive terminal tasks.',
    completed: false,
    content: {
      introduction: `
        Shell scripting lets you automate repetitive tasks by combining terminal commands into executable files:
        
        • Scripts are text files containing commands
        • Use #!/bin/bash (shebang) to specify interpreter
        • Variables, loops, and conditionals for logic
        • chmod +x makes scripts executable
        
        Perfect for automation, deployment scripts, and system administration tasks.
      `,
      commands: [
        {
          name: 'Basic Script Structure',
          description: 'Creating executable shell scripts',
          syntax: '#!/bin/bash\\ncommands...',
          examples: [
            {
              command: 'nano myscript.sh',
              output: '[Opens editor with script content]',
              explanation: 'Create script file with .sh extension'
            },
            {
              command: 'chmod +x myscript.sh',
              output: '',
              explanation: 'Make script executable'
            },
            {
              command: './myscript.sh',
              output: 'Script output...',
              explanation: 'Run the script'
            }
          ]
        },
        {
          name: 'Variables and Echo',
          description: 'Using variables in scripts',
          syntax: 'VARIABLE=value\\necho $VARIABLE',
          examples: [
            {
              command: 'NAME="World"\\necho "Hello, $NAME!"',
              output: 'Hello, World!',
              explanation: 'Create variable and use it in echo command'
            },
            {
              command: 'DATE=$(date)\\necho "Today is $DATE"',
              output: 'Today is Wed Dec 1 10:30:00 PST 2024',
              explanation: 'Store command output in variable'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p19-1',
          prompt: 'Make the practice.txt file executable (simulate making a script executable)',
          expectedCommand: 'chmod +x practice.txt',
          hints: [
            'Use chmod command with +x option',
            'This adds execute permission to the file'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You've learned shell scripting basics - a powerful skill for automation and efficiency.
        
        Script template:
        #!/bin/bash
        # This is a comment
        NAME="value"
        echo "Hello, $NAME"
        
        Key concepts:
        • #!/bin/bash - shebang line specifies shell
        • Variables: NAME=value (no spaces around =)
        • Access variables: $NAME or \${NAME}
        • Command substitution: RESULT=$(command)
        • Comments start with #
        
        Common script patterns:
        • Backup scripts: tar -czf backup-$(date +%Y%m%d).tar.gz ~/Documents
        • System info: echo "Disk usage: $(df -h / | tail -1)"
        • File processing: for file in *.txt; do echo "Processing $file"; done
        
        Next steps:
        • Learn conditionals (if/then/else)
        • Loops (for/while)
        • Functions and parameters
        • Error handling and exit codes
      `
    },
    quiz: {
      id: 'quiz-19',
      questions: [
        {
          id: 'q19-1',
          question: 'What makes a shell script file executable?',
          options: ['chmod +r', 'chmod +w', 'chmod +x', 'chmod 644'],
          correctAnswer: 2,
          explanation: 'chmod +x adds execute permission, allowing the script to be run as a program.'
        },
        {
          id: 'q19-2',
          question: 'What is the purpose of the shebang line "#!/bin/bash" in a script?',
          options: [
            'It\'s a comment that documents the script',
            'It tells the system which interpreter to use',
            'It sets the script permissions',
            'It defines variables'
          ],
          correctAnswer: 1,
          explanation: 'The shebang (#!/bin/bash) tells the system to use the bash interpreter when executing the script.'
        },
        {
          id: 'q19-3',
          question: 'How do you access the first command-line argument in a bash script?',
          options: [
            '$0',
            '$1',
            '$arg1',
            '$first'
          ],
          correctAnswer: 1,
          explanation: '$1 represents the first command-line argument passed to the script. $0 is the script name itself.'
        }
      ]
    }
  },

  {
    id: '20',
    title: 'Advanced Tips: screen, tmux, shortcuts',
    duration: 6,
    description: 'Master advanced terminal techniques for power users and professionals.',
    completed: false,
    content: {
      introduction: `
        These advanced techniques will transform you into a terminal power user:
        
        • Terminal multiplexers (screen/tmux) - multiple sessions
        • Keyboard shortcuts - lightning-fast navigation
        • Advanced techniques - professional workflows
        
        Essential knowledge for developers, system administrators, and anyone who lives in the terminal.
      `,
      commands: [
        {
          name: 'Essential Shortcuts',
          description: 'Keyboard shortcuts for efficiency',
          syntax: 'Key combinations',
          examples: [
            {
              command: 'Ctrl+C',
              output: 'Interrupts current command',
              explanation: 'Stops running programs'
            },
            {
              command: 'Ctrl+Z',
              output: 'Suspends current program',
              explanation: 'Use "fg" to resume, "bg" to run in background'
            },
            {
              command: 'Ctrl+R',
              output: 'Searches command history',
              explanation: 'Type to search previous commands'
            },
            {
              command: 'Ctrl+L',
              output: 'Clears screen',
              explanation: 'Same as "clear" command but faster'
            }
          ]
        },
        {
          name: 'Terminal Multiplexers',
          description: 'screen and tmux for multiple sessions',
          syntax: 'screen or tmux commands',
          examples: [
            {
              command: 'screen -S mysession',
              output: '[Creates new screen session named "mysession"]',
              explanation: 'Start named screen session'
            },
            {
              command: 'Ctrl+A, D',
              output: '[Detaches from screen session]',
              explanation: 'Detach but keep session running'
            },
            {
              command: 'screen -r mysession',
              output: '[Reattaches to session]',
              explanation: 'Reconnect to detached session'
            },
            {
              command: 'tmux new -s work',
              output: '[Creates new tmux session]',
              explanation: 'Start named tmux session (more modern than screen)'
            }
          ]
        },
        {
          name: 'Advanced Techniques',
          description: 'Power user tricks',
          syntax: 'Various advanced commands',
          examples: [
            {
              command: 'watch "df -h"',
              output: '[Updates disk usage every 2 seconds]',
              explanation: 'Monitor command output in real-time'
            },
            {
              command: 'nohup long-command &',
              output: '[Runs command immune to hangups]',
              explanation: 'Process continues even if terminal closes'
            },
            {
              command: 'jobs',
              output: '[1]+ Running long-command',
              explanation: 'Shows background jobs'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p20-1',
          prompt: 'Clear the terminal screen using a keyboard shortcut (try Ctrl+L)',
          expectedCommand: 'clear',
          hints: [
            'The shortcut is Ctrl+L',
            'Alternatively, type the "clear" command',
            'Both do the same thing'
          ],
          completed: false
        }
      ],
      summary: `
        Congratulations! You've completed Terminal Mastery and learned advanced techniques used by professionals worldwide.
        
        Essential shortcuts to remember:
        • Ctrl+C - Stop current command
        • Ctrl+Z - Suspend command (use fg to resume)
        • Ctrl+R - Search command history
        • Ctrl+L - Clear screen
        • Ctrl+A/E - Move to beginning/end of line
        • Tab - Auto-complete commands and filenames
        
        Terminal multiplexer benefits:
        • Multiple terminal sessions in one window
        • Sessions survive disconnections
        • Perfect for remote server work
        • Tmux is more modern than screen
        
        You've now mastered:
        ✅ Terminal fundamentals and navigation
        ✅ File operations and permissions
        ✅ Text processing and searching
        ✅ System monitoring and management
        ✅ Network tools and package management
        ✅ Automation with pipes, scripts, and advanced techniques
        
        Next steps:
        • Practice these skills daily
        • Explore advanced scripting (conditionals, loops, functions)
        • Learn system-specific commands for your platform
        • Contribute to open source projects using these skills
        
        Welcome to the ranks of terminal power users! 🚀
      `
    },
    quiz: {
      id: 'quiz-20',
      questions: [
        {
          id: 'q20-1',
          question: 'Which keyboard shortcut searches your command history?',
          options: ['Ctrl+C', 'Ctrl+R', 'Ctrl+Z', 'Ctrl+L'],
          correctAnswer: 1,
          explanation: 'Ctrl+R opens reverse search mode where you can type to find matching commands from your history.'
        },
        {
          id: 'q20-2',
          question: 'What is the main advantage of terminal multiplexers like tmux?',
          options: [
            'They make commands run faster',
            'They allow multiple terminal sessions and survive disconnections',
            'They provide better security',
            'They use less memory'
          ],
          correctAnswer: 1,
          explanation: 'Terminal multiplexers allow you to run multiple sessions and keep them running even when you disconnect - perfect for remote work.'
        },
        {
          id: 'q20-3',
          question: 'What does Ctrl+Z do to a running command?',
          options: [
            'Stops the command permanently',
            'Suspends the command (can be resumed with fg)',
            'Saves the command output',
            'Restarts the command'
          ],
          correctAnswer: 1,
          explanation: 'Ctrl+Z suspends the current command, putting it in the background. You can resume it with the "fg" command or run it in background with "bg".'
        }
      ]
    }
  }
];

export const getTotalLessons = (): number => lessons.length;

export const getLessonById = (id: string): Lesson | undefined => {
  return lessons.find(lesson => lesson.id === id);
};

export const getNextLesson = (currentId: string): Lesson | undefined => {
  const currentIndex = lessons.findIndex(lesson => lesson.id === currentId);
  if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
    return lessons[currentIndex + 1];
  }
  return undefined;
};

export const getPreviousLesson = (currentId: string): Lesson | undefined => {
  const currentIndex = lessons.findIndex(lesson => lesson.id === currentId);
  if (currentIndex > 0) {
    return lessons[currentIndex - 1];
  }
  return undefined;
};