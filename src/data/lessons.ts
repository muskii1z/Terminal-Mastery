import { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Getting Started with the Terminal',
    duration: 3,
    description: 'Learn what the terminal is and how to open it on different systems.',
    completed: false,
    content: {
      introduction: `
        Welcome to Terminal Mastery! The terminal is a powerful text-based interface that gives you direct control over your computer's operating system.
        
        Unlike graphical interfaces where you click buttons and icons, the terminal lets you type commands to perform tasks. It might seem intimidating at first, but it's incredibly efficient once you learn the basics.
        
        Think of it as having a conversation with your computer - you tell it what to do using specific commands, and it responds with results or confirmations.
      `,
      commands: [
        {
          name: 'Terminal Access',
          description: 'How to open the terminal on different systems',
          syntax: 'System dependent',
          examples: [
            {
              command: 'On macOS: Cmd + Space, type "Terminal"',
              output: 'Opens Terminal application',
              explanation: 'Uses Spotlight search to quickly find and open Terminal'
            },
            {
              command: 'On Windows: Win + R, type "cmd"',
              output: 'Opens Command Prompt',
              explanation: 'Opens the Windows command line interface'
            },
            {
              command: 'On Linux: Ctrl + Alt + T',
              output: 'Opens terminal emulator',
              explanation: 'Standard keyboard shortcut for most Linux distributions'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p1-1',
          prompt: 'Open your terminal and observe what you see. What information is displayed in the prompt?',
          expectedCommand: 'observation',
          hints: [
            'Look at the text before the cursor',
            'Notice your username and computer name',
            'See the current directory path'
          ],
          completed: false
        }
      ],
      summary: `
        Great! You've taken your first step into the world of command-line computing. The terminal might look simple, but it's one of the most powerful tools available to developers and system administrators.
        
        Key takeaways:
        • The terminal is a text-based interface to your operating system
        • Different systems have different ways to access the terminal
        • The prompt shows useful information about your current context
        
        In the next lesson, we'll explore your first actual commands!
      `
    },
    quiz: {
      id: 'quiz-1',
      questions: [
        {
          id: 'q1-1',
          question: 'What is the primary advantage of using a terminal over a graphical interface?',
          options: [
            'It looks more professional',
            'It uses less system resources and allows for precise control',
            'It\'s easier for beginners to use',
            'It has better graphics'
          ],
          correctAnswer: 1,
          explanation: 'The terminal is efficient, uses minimal resources, and gives you precise control over system operations.'
        },
        {
          id: 'q1-2',
          question: 'On macOS, what\'s the quickest way to open the terminal?',
          options: [
            'Click on Applications folder',
            'Use Cmd + Space and type "Terminal"',
            'Right-click on desktop',
            'Use Ctrl + Alt + T'
          ],
          correctAnswer: 1,
          explanation: 'Cmd + Space opens Spotlight search, allowing you to quickly find and launch Terminal.'
        }
      ]
    }
  },
  
  {
    id: '2',
    title: 'Navigation Basics: pwd, ls, cd',
    duration: 3,
    description: 'Master the fundamental commands for navigating your file system.',
    completed: false,
    content: {
      introduction: `
        Now that you have your terminal open, let's learn how to navigate around your computer. These three commands are the foundation of terminal navigation:
        
        • pwd - "Print Working Directory" - shows where you are
        • ls - "List" - shows what's in your current location  
        • cd - "Change Directory" - moves you to a different location
        
        Think of your file system as a building with floors and rooms. These commands help you figure out which room you're in, see what's around you, and move to different rooms.
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
              output: 'drwxr-xr-x  2 john  staff  64 Dec 1 10:30 Desktop',
              explanation: 'Long format showing permissions, owner, size, and modification date'
            },
            {
              command: 'ls -a',
              output: '.  ..  .hidden  Desktop  Documents',
              explanation: 'Shows all files including hidden ones (starting with .)'
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
        }
      ]
    }
  },

  {
    id: '3',
    title: 'Working with Files: touch, cat, less',
    duration: 3,
    description: 'Learn to create and view files from the command line.',
    completed: false,
    content: {
      introduction: `
        Now that you can navigate around, let's learn how to work with files. You'll discover how to create new files, view their contents, and read through larger files efficiently.
        
        These commands are essential for any developer or system administrator:
        • touch - creates new empty files
        • cat - displays file contents
        • less - views large files page by page
        
        Think of these as your basic file toolkit - create, view, and read!
      `,
      commands: [
        {
          name: 'touch',
          description: 'Create new empty files or update file timestamps',
          syntax: 'touch filename',
          examples: [
            {
              command: 'touch myfile.txt',
              output: '',
              explanation: 'Creates a new empty file called myfile.txt'
            },
            {
              command: 'touch file1.txt file2.txt file3.txt',
              output: '',
              explanation: 'Creates multiple files at once'
            }
          ]
        },
        {
          name: 'cat',
          description: 'Display the contents of a file',
          syntax: 'cat filename',
          examples: [
            {
              command: 'cat myfile.txt',
              output: 'Hello World!\nThis is my first file.',
              explanation: 'Shows the entire contents of myfile.txt'
            },
            {
              command: 'cat file1.txt file2.txt',
              output: 'Contents of file1\nContents of file2',
              explanation: 'Displays contents of multiple files in sequence'
            }
          ]
        },
        {
          name: 'less',
          description: 'View file contents page by page (good for large files)',
          syntax: 'less filename',
          examples: [
            {
              command: 'less largefile.txt',
              output: '[Opens paginated view - use arrow keys to navigate, q to quit]',
              explanation: 'Opens the file in a scrollable view. Press q to exit.'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p3-1',
          prompt: 'Create a new file called "practice.txt"',
          expectedCommand: 'touch practice.txt',
          hints: [
            'Use the touch command',
            'Follow it with the filename'
          ],
          completed: false
        },
        {
          id: 'p3-2',
          prompt: 'List the files to confirm your new file was created',
          expectedCommand: 'ls',
          hints: [
            'Use the list command you learned earlier',
            'You should see practice.txt in the output'
          ],
          completed: false
        }
      ],
      summary: `
        Great job! You can now create and view files from the command line. These skills are fundamental for working with code, configuration files, and logs.
        
        Key points:
        • touch creates new files (or updates timestamps of existing ones)
        • cat shows entire file contents at once
        • less is better for large files - it shows them page by page
        
        Next up: we'll learn how to edit files and manage their contents!
      `
    },
    quiz: {
      id: 'quiz-3',
      questions: [
        {
          id: 'q3-1',
          question: 'Which command creates a new empty file?',
          options: ['create', 'touch', 'new', 'make'],
          correctAnswer: 1,
          explanation: 'The touch command creates new empty files or updates timestamps of existing files.'
        },
        {
          id: 'q3-2',
          question: 'When should you use "less" instead of "cat"?',
          options: [
            'When the file is very large',
            'When you want to edit the file',
            'When creating new files',
            'When deleting files'
          ],
          correctAnswer: 0,
          explanation: 'Use "less" for large files because it displays them page by page, making them easier to read.'
        }
      ]
    }
  },

  {
    id: '4',
    title: 'File Operations: Copy, Move, Delete',
    duration: 3,
    description: 'Master essential file operations with cp, mv, and rm commands.',
    completed: false,
    content: {
      introduction: `
        Now that you know how to navigate and create files, let's learn how to manipulate them. These three commands are essential for managing your files and directories:
        
        • cp - "Copy" - duplicates files and directories
        • mv - "Move" - moves/renames files and directories  
        • rm - "Remove" - deletes files and directories
        
        These operations are permanent, so we'll learn how to use them safely with various options and best practices.
        
        Think of these as your file management toolkit - copy important files, organize by moving them, and clean up by removing what you don't need.
      `,
      commands: [
        {
          name: 'cp',
          description: 'Copy files and directories',
          syntax: 'cp [options] source destination',
          examples: [
            {
              command: 'cp file1.txt file2.txt',
              output: '',
              explanation: 'Creates a copy of file1.txt named file2.txt'
            },
            {
              command: 'cp file1.txt /home/user/backup/',
              output: '',
              explanation: 'Copies file1.txt to the backup directory'
            },
            {
              command: 'cp -r Documents/ Documents_backup/',
              output: '',
              explanation: 'Recursively copies entire Documents directory to Documents_backup'
            },
            {
              command: 'cp *.txt backup/',
              output: '',
              explanation: 'Copies all .txt files to the backup directory'
            }
          ]
        },
        {
          name: 'mv',
          description: 'Move or rename files and directories',
          syntax: 'mv [options] source destination',
          examples: [
            {
              command: 'mv oldname.txt newname.txt',
              output: '',
              explanation: 'Renames oldname.txt to newname.txt'
            },
            {
              command: 'mv file1.txt Documents/',
              output: '',
              explanation: 'Moves file1.txt into the Documents directory'
            },
            {
              command: 'mv *.jpg Pictures/',
              output: '',
              explanation: 'Moves all JPEG files to the Pictures directory'
            },
            {
              command: 'mv old_folder/ new_folder/',
              output: '',
              explanation: 'Renames old_folder to new_folder'
            }
          ]
        },
        {
          name: 'rm',
          description: 'Remove (delete) files and directories',
          syntax: 'rm [options] file...',
          examples: [
            {
              command: 'rm unwanted.txt',
              output: '',
              explanation: 'Deletes the file unwanted.txt'
            },
            {
              command: 'rm -i important.txt',
              output: 'rm: remove regular file \'important.txt\'? ',
              explanation: 'Interactive mode - asks for confirmation before deleting'
            },
            {
              command: 'rm -r old_directory/',
              output: '',
              explanation: 'Recursively deletes directory and all its contents'
            },
            {
              command: 'rm *.tmp',
              output: '',
              explanation: 'Deletes all files ending with .tmp'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p4-1',
          prompt: 'Create a copy of practice.txt called practice_backup.txt',
          expectedCommand: 'cp practice.txt practice_backup.txt',
          hints: [
            'Use the cp command',
            'Format: cp source destination',
            'Source is practice.txt, destination is practice_backup.txt'
          ],
          completed: false
        },
        {
          id: 'p4-2',
          prompt: 'Rename practice_backup.txt to backup.txt',
          expectedCommand: 'mv practice_backup.txt backup.txt',
          hints: [
            'Use the mv command for renaming',
            'Format: mv old_name new_name'
          ],
          completed: false
        },
        {
          id: 'p4-3',
          prompt: 'Delete the backup.txt file',
          expectedCommand: 'rm backup.txt',
          hints: [
            'Use the rm command',
            'Be careful - this will permanently delete the file!'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You've learned the core file manipulation commands. These are some of the most frequently used commands in daily terminal work.
        
        Safety reminders:
        • Always double-check before using rm - deletions are permanent
        • Use rm -i for important files to get confirmation prompts
        • Use cp -r for directories (recursive copy)
        • mv works for both renaming and moving files
        
        Pro tips:
        • Use wildcards like *.txt to work with multiple files
        • Create backups with cp before making major changes
        • The -v (verbose) option shows what's happening: cp -v file1 file2
      `
    },
    quiz: {
      id: 'quiz-4',
      questions: [
        {
          id: 'q4-1',
          question: 'Which command would you use to make a backup copy of important.txt?',
          options: [
            'mv important.txt backup.txt',
            'cp important.txt backup.txt', 
            'rm important.txt backup.txt',
            'ls important.txt backup.txt'
          ],
          correctAnswer: 1,
          explanation: 'cp (copy) creates a duplicate while keeping the original file intact.'
        },
        {
          id: 'q4-2',
          question: 'What does the -r option do with cp and rm commands?',
          options: [
            'Makes the operation reversible',
            'Runs the command repeatedly',
            'Works recursively on directories and subdirectories',
            'Requests confirmation before each operation'
          ],
          correctAnswer: 2,
          explanation: 'The -r option enables recursive operation, allowing the command to work on directories and all their contents.'
        },
        {
          id: 'q4-3',
          question: 'Which is safer when deleting important files?',
          options: [
            'rm filename',
            'rm -f filename',
            'rm -i filename', 
            'rm -r filename'
          ],
          correctAnswer: 2,
          explanation: 'rm -i (interactive) asks for confirmation before deleting, preventing accidental deletions.'
        }
      ]
    }
  },

  {
    id: '5',
    title: 'Understanding File Permissions',
    duration: 3,
    description: 'Learn to read and modify file permissions with chmod and understand ownership.',
    completed: false,
    content: {
      introduction: `
        Every file and directory in Unix-like systems has permissions that control who can read, write, or execute them. Understanding permissions is crucial for security and proper file management.
        
        There are three types of permissions:
        • Read (r) - view file contents or list directory contents
        • Write (w) - modify files or add/remove files in directories  
        • Execute (x) - run files as programs or access directories
        
        And three categories of users:
        • Owner - the person who created the file
        • Group - users in the same group as the file
        • Others - everyone else on the system
        
        Let's learn how to read and modify these permissions!
      `,
      commands: [
        {
          name: 'ls -l',
          description: 'View detailed file information including permissions',
          syntax: 'ls -l [file]',
          examples: [
            {
              command: 'ls -l myfile.txt',
              output: '-rw-r--r-- 1 john staff 1024 Dec 1 10:30 myfile.txt',
              explanation: 'Shows permissions (-rw-r--r--), owner (john), group (staff), size, and date'
            },
            {
              command: 'ls -la',
              output: 'drwxr-xr-x 2 john staff 64 Dec 1 10:30 Documents',
              explanation: 'Directory permissions start with d, showing owner has full access, group and others can read/execute'
            }
          ]
        },
        {
          name: 'chmod',
          description: 'Change file permissions',
          syntax: 'chmod [permissions] file',
          examples: [
            {
              command: 'chmod 755 script.sh',
              output: '',
              explanation: 'Sets permissions to rwxr-xr-x (owner: read/write/execute, group/others: read/execute)'
            },
            {
              command: 'chmod +x script.sh',
              output: '',
              explanation: 'Adds execute permission for all users'
            },
            {
              command: 'chmod u+w,g-r file.txt',
              output: '',
              explanation: 'Adds write for user (u), removes read for group (g)'
            },
            {
              command: 'chmod 644 document.txt',
              output: '',
              explanation: 'Sets permissions to rw-r--r-- (owner: read/write, others: read only)'
            }
          ]
        },
        {
          name: 'chown',
          description: 'Change file ownership (requires appropriate permissions)',
          syntax: 'chown [owner]:[group] file',
          examples: [
            {
              command: 'sudo chown alice:users file.txt',
              output: '',
              explanation: 'Changes owner to alice and group to users (requires sudo for others\' files)'
            },
            {
              command: 'chown :staff file.txt',
              output: '',
              explanation: 'Changes only the group to staff, keeps current owner'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p5-1',
          prompt: 'Check the detailed permissions of your practice.txt file',
          expectedCommand: 'ls -l practice.txt',
          hints: [
            'Use ls with the -l option',
            'This shows the "long" format with permissions'
          ],
          completed: false
        },
        {
          id: 'p5-2',
          prompt: 'Make practice.txt executable for all users',
          expectedCommand: 'chmod +x practice.txt',
          hints: [
            'Use chmod to change permissions',
            'The +x adds execute permission for all users'
          ],
          completed: false
        },
        {
          id: 'p5-3',
          prompt: 'Check the permissions again to see the change',
          expectedCommand: 'ls -l practice.txt',
          hints: [
            'Use the same command as the first exercise',
            'You should see x permissions added'
          ],
          completed: false
        }
      ],
      summary: `
        Great work! You now understand the fundamentals of file permissions and ownership. This knowledge is essential for system security and file management.
        
        Key concepts to remember:
        • Permissions: read (r), write (w), execute (x)
        • Users: owner, group, others
        • chmod changes permissions using numbers (755) or letters (u+x)
        • ls -l shows detailed permission information
        
        Permission numbers:
        • 7 = read + write + execute (4+2+1)
        • 6 = read + write (4+2)  
        • 5 = read + execute (4+1)
        • 4 = read only
        
        Common permission patterns:
        • 755: Scripts and programs (owner can modify, everyone can run)
        • 644: Documents (owner can modify, everyone can read)
        • 600: Private files (only owner can read/write)
      `
    },
    quiz: {
      id: 'quiz-5',
      questions: [
        {
          id: 'q5-1',
          question: 'What do the permissions "rwxr-xr-x" mean?',
          options: [
            'Owner: read/write/execute, Group: read/execute, Others: read/execute',
            'Owner: read only, Group: write only, Others: execute only',
            'Everyone has read/write/execute permissions',
            'Only the owner can access the file'
          ],
          correctAnswer: 0,
          explanation: 'rwx for owner (full access), r-x for group (read/execute), r-x for others (read/execute).'
        },
        {
          id: 'q5-2',
          question: 'Which command adds execute permission for all users?',
          options: [
            'chmod +r filename',
            'chmod +x filename',
            'chmod +w filename',
            'chmod +a filename'
          ],
          correctAnswer: 1,
          explanation: 'chmod +x adds execute permission for all users (owner, group, and others).'
        },
        {
          id: 'q5-3',
          question: 'What does the permission number 644 represent?',
          options: [
            'Owner: read/write, Group: read, Others: read',
            'Owner: read, Group: write, Others: execute',
            'Everyone has read/write permissions', 
            'Only execute permissions for everyone'
          ],
          correctAnswer: 0,
          explanation: '644 = rw-r--r-- (6=rw for owner, 4=r for group, 4=r for others).'
        }
      ]
    }
  },

  {
    id: '6',
    title: 'Text Viewing: head, tail, more',
    duration: 3,
    description: 'Learn efficient ways to view parts of files with head, tail, and more commands.',
    completed: false,
    content: {
      introduction: `
        When working with large files, you often don't need to see the entire contents at once. These commands help you view specific parts of files efficiently:
        
        • head - shows the first lines of a file
        • tail - shows the last lines of a file  
        • more - displays file content page by page (alternative to less)
        
        These tools are especially useful for log files, data files, and any large text files where you want to peek at the beginning, end, or scroll through gradually.
        
        Perfect for developers checking log files or data analysts examining large datasets!
      `,
      commands: [
        {
          name: 'head',
          description: 'Display the first lines of a file',
          syntax: 'head [options] file',
          examples: [
            {
              command: 'head myfile.txt',
              output: 'First 10 lines of the file...',
              explanation: 'Shows the first 10 lines by default'
            },
            {
              command: 'head -n 5 myfile.txt',
              output: 'First 5 lines of the file...',
              explanation: 'Shows only the first 5 lines'
            },
            {
              command: 'head -c 100 myfile.txt',
              output: 'First 100 characters...',
              explanation: 'Shows the first 100 characters instead of lines'
            }
          ]
        },
        {
          name: 'tail',
          description: 'Display the last lines of a file',
          syntax: 'tail [options] file',
          examples: [
            {
              command: 'tail myfile.txt',
              output: 'Last 10 lines of the file...',
              explanation: 'Shows the last 10 lines by default'
            },
            {
              command: 'tail -n 3 myfile.txt',
              output: 'Last 3 lines of the file...',
              explanation: 'Shows only the last 3 lines'
            },
            {
              command: 'tail -f logfile.txt',
              output: 'Continuously shows new lines as they\'re added...',
              explanation: 'Follows the file - great for monitoring log files in real-time'
            }
          ]
        },
        {
          name: 'more',
          description: 'View file content page by page',
          syntax: 'more file',
          examples: [
            {
              command: 'more longfile.txt',
              output: '[Shows first page with --More-- prompt at bottom]',
              explanation: 'Press spacebar for next page, q to quit, h for help'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p6-1',
          prompt: 'Show the first 5 lines of practice.txt',
          expectedCommand: 'head -n 5 practice.txt',
          hints: [
            'Use the head command',
            'Use -n option to specify number of lines',
            'Format: head -n NUMBER filename'
          ],
          completed: false
        },
        {
          id: 'p6-2',
          prompt: 'Show the last 3 lines of practice.txt',
          expectedCommand: 'tail -n 3 practice.txt',
          hints: [
            'Use the tail command',
            'Use -n option to specify number of lines'
          ],
          completed: false
        }
      ],
      summary: `
        Perfect! You've learned essential tools for efficiently viewing file contents. These commands save time and system resources when working with large files.
        
        Key takeaways:
        • head shows the beginning of files (default: 10 lines)
        • tail shows the end of files (default: 10 lines)  
        • Use -n to specify exactly how many lines you want
        • tail -f is invaluable for monitoring log files in real-time
        • more provides paginated viewing for long files
        
        Pro tips:
        • tail -f /var/log/system.log monitors system logs live
        • head -1 filename shows just the first line (great for CSV headers)
        • Combine with pipes: ps aux | head -20 shows top 20 processes
      `
    },
    quiz: {
      id: 'quiz-6',
      questions: [
        {
          id: 'q6-1',
          question: 'Which command would you use to see the last 5 lines of a log file?',
          options: [
            'head -5 logfile.txt',
            'tail -5 logfile.txt', 
            'more -5 logfile.txt',
            'cat -5 logfile.txt'
          ],
          correctAnswer: 1,
          explanation: 'tail -5 displays the last 5 lines of a file.'
        },
        {
          id: 'q6-2',
          question: 'What does "tail -f" do?',
          options: [
            'Shows the first lines of a file',
            'Follows a file and shows new lines as they are added',
            'Forces the tail command to run',
            'Shows file permissions'
          ],
          correctAnswer: 1,
          explanation: 'tail -f follows the file, continuously showing new lines as they are appended - perfect for monitoring logs.'
        }
      ]
    }
  },

  {
    id: '7',
    title: 'Text Search: grep and find',
    duration: 3,
    description: 'Master text searching with grep and file finding with the find command.',
    completed: false,
    content: {
      introduction: `
        Finding information quickly is crucial when working with the command line. These two commands are your search superpowers:
        
        • grep - searches for patterns within files (text search)
        • find - searches for files and directories by name, size, date, etc.
        
        Think of grep as "Google for text files" - it can find any word, phrase, or pattern within file contents. Find is like a powerful file explorer that can locate files based on various criteria.
        
        These tools together make you incredibly efficient at locating information in large systems!
      `,
      commands: [
        {
          name: 'grep',
          description: 'Search for patterns within files',
          syntax: 'grep [options] pattern file',
          examples: [
            {
              command: 'grep "hello" myfile.txt',
              output: 'Lines containing "hello"...',
              explanation: 'Finds all lines containing the word "hello"'
            },
            {
              command: 'grep -i "Hello" myfile.txt',
              output: 'Lines with "hello", "Hello", "HELLO"...',
              explanation: 'Case-insensitive search (-i option)'
            },
            {
              command: 'grep -n "error" logfile.txt',
              output: '42:Error: Connection failed',
              explanation: 'Shows line numbers (-n) where pattern is found'
            },
            {
              command: 'grep -r "TODO" .',
              output: './file1.txt:5:TODO: Fix this bug',
              explanation: 'Recursively searches all files in current directory for "TODO"'
            }
          ]
        },
        {
          name: 'find',
          description: 'Search for files and directories',
          syntax: 'find [path] [expression]',
          examples: [
            {
              command: 'find . -name "*.txt"',
              output: './document.txt\\n./notes.txt',
              explanation: 'Finds all .txt files in current directory and subdirectories'
            },
            {
              command: 'find /home -name "config"',
              output: '/home/user/.config',
              explanation: 'Finds files or directories named "config" in /home'
            },
            {
              command: 'find . -type f -size +1M',
              output: './large-file.dat',
              explanation: 'Finds files (-type f) larger than 1 megabyte'
            },
            {
              command: 'find . -name "*.log" -mtime -1',
              output: './recent.log',
              explanation: 'Finds .log files modified in the last day'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p7-1',
          prompt: 'Search for the word "practice" in your practice.txt file',
          expectedCommand: 'grep "practice" practice.txt',
          hints: [
            'Use grep to search within files',
            'Format: grep "search_term" filename',
            'Put the search term in quotes'
          ],
          completed: false
        },
        {
          id: 'p7-2',
          prompt: 'Find all .txt files in the current directory',
          expectedCommand: 'find . -name "*.txt"',
          hints: [
            'Use the find command',
            'Start with current directory: .',
            'Use -name option with wildcard pattern "*.txt"'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You've mastered two of the most powerful search tools in the terminal. These commands will save you countless hours when working with files and data.
        
        Grep power features:
        • -i for case-insensitive search
        • -n to show line numbers  
        • -r to search recursively through directories
        • -v to show lines that DON'T match (inverse)
        • -c to count matches instead of showing them
        
        Find power features:
        • -name for filename patterns
        • -type f for files, -type d for directories
        • -size +1M for files larger than 1MB
        • -mtime -7 for files modified in last 7 days
        • -exec to run commands on found files
        
        Common combinations:
        • find . -name "*.log" -exec grep "ERROR" {} \\; 
        • grep -r "function" --include="*.js" .
      `
    },
    quiz: {
      id: 'quiz-7',
      questions: [
        {
          id: 'q7-1',
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
          id: 'q7-2',
          question: 'What does "find . -name \'*.pdf\'" do?',
          options: [
            'Finds all files in the current directory',
            'Finds all PDF files starting from the current directory',
            'Creates PDF files in the current directory',
            'Deletes PDF files from the current directory'
          ],
          correctAnswer: 1,
          explanation: 'This finds all files with .pdf extension starting from the current directory (.) and searching subdirectories.'
        }
      ]
    }
  },

  {
    id: '8',
    title: 'Text Editing: nano Basics',
    duration: 3,
    description: 'Learn to edit files directly in the terminal with the user-friendly nano editor.',
    completed: false,
    content: {
      introduction: `
        Sometimes you need to edit files directly in the terminal. While there are several text editors available, nano is perfect for beginners - it's simple, user-friendly, and shows helpful commands at the bottom of the screen.
        
        Nano is great for:
        • Quick file edits and configurations
        • Writing simple scripts
        • Editing system configuration files
        • When you don't have a graphical interface available
        
        Unlike complex editors like vim, nano uses familiar keyboard shortcuts and provides constant help, making it approachable for anyone new to terminal text editing.
      `,
      commands: [
        {
          name: 'nano',
          description: 'Open nano text editor',
          syntax: 'nano [filename]',
          examples: [
            {
              command: 'nano myfile.txt',
              output: '[Opens nano editor with myfile.txt]',
              explanation: 'Opens the file for editing. Creates new file if it doesn\'t exist.'
            },
            {
              command: 'nano',
              output: '[Opens nano with empty buffer]',
              explanation: 'Opens nano without a file - you can save with a filename later'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p8-1',
          prompt: 'Open practice.txt in nano editor (run this in your actual terminal, not the web simulator)',
          expectedCommand: 'nano practice.txt',
          hints: [
            'Use nano followed by the filename',
            'This will open the file for editing',
            'Note: This requires running in your actual terminal'
          ],
          completed: false
        }
      ],
      summary: `
        Great introduction to nano! Even though you can't fully practice in the web terminal, understanding nano is crucial for real-world terminal usage.
        
        Essential nano commands (shown at bottom of editor):
        • Ctrl+O - Save (Write Out)
        • Ctrl+X - Exit
        • Ctrl+K - Cut entire line
        • Ctrl+U - Paste (Uncut)
        • Ctrl+W - Search (Where Is)
        • Ctrl+G - Help
        
        Nano workflow:
        1. Open file with: nano filename.txt
        2. Edit using normal typing and arrow keys
        3. Save with Ctrl+O, press Enter to confirm filename
        4. Exit with Ctrl+X
        
        Pro tips:
        • Alt+# shows line numbers
        • Ctrl+A goes to beginning of line, Ctrl+E to end
        • Ctrl+C shows current position
        • Nano auto-wraps long lines for readability
      `
    },
    quiz: {
      id: 'quiz-8',
      questions: [
        {
          id: 'q8-1',
          question: 'Which key combination saves a file in nano?',
          options: [
            'Ctrl+S',
            'Ctrl+O',
            'Ctrl+W',
            'Ctrl+F'
          ],
          correctAnswer: 1,
          explanation: 'Ctrl+O (Write Out) saves the current file in nano.'
        },
        {
          id: 'q8-2',
          question: 'How do you exit nano?',
          options: [
            'Ctrl+Q',
            'Ctrl+E',
            'Ctrl+X',
            'Esc'
          ],
          correctAnswer: 2,
          explanation: 'Ctrl+X exits nano. If you have unsaved changes, it will ask if you want to save.'
        }
      ]
    }
  },

  {
    id: '9',
    title: 'Text Processing: sort, uniq, wc',
    duration: 3,
    description: 'Learn to process and analyze text data with sort, uniq, and wc commands.',
    completed: false,
    content: {
      introduction: `
        Text processing is a powerful capability of the terminal. These commands help you analyze, organize, and get insights from text data:
        
        • sort - arranges lines in order (alphabetical, numerical)
        • uniq - removes or identifies duplicate lines
        • wc - counts words, lines, and characters
        
        These tools are invaluable for data analysis, log processing, and cleaning up text files. They're often used together in pipelines to process large amounts of data efficiently.
        
        Perfect for developers analyzing logs, data scientists cleaning datasets, or anyone working with structured text data!
      `,
      commands: [
        {
          name: 'sort',
          description: 'Sort lines in text files',
          syntax: 'sort [options] file',
          examples: [
            {
              command: 'sort names.txt',
              output: 'Alice\\nBob\\nCharlie',
              explanation: 'Sorts lines alphabetically'
            },
            {
              command: 'sort -n numbers.txt',
              output: '1\\n5\\n10\\n25',
              explanation: 'Numerical sort (-n) - treats numbers as numbers, not text'
            },
            {
              command: 'sort -r file.txt',
              output: 'Lines in reverse order...',
              explanation: 'Reverse sort (-r)'
            },
            {
              command: 'sort -u duplicates.txt',
              output: 'Unique lines only...',
              explanation: 'Sort and remove duplicates (-u)'
            }
          ]
        },
        {
          name: 'uniq',
          description: 'Report or omit repeated lines',
          syntax: 'uniq [options] file',
          examples: [
            {
              command: 'uniq sorted_file.txt',
              output: 'Lines with consecutive duplicates removed...',
              explanation: 'Removes consecutive duplicate lines (file must be sorted first)'
            },
            {
              command: 'uniq -c sorted_file.txt',
              output: '3 apple\\n1 banana\\n2 cherry',
              explanation: 'Shows count of each unique line'
            },
            {
              command: 'uniq -d sorted_file.txt',
              output: 'Only lines that were duplicated...',
              explanation: 'Shows only duplicate lines'
            }
          ]
        },
        {
          name: 'wc',
          description: 'Count lines, words, and characters',
          syntax: 'wc [options] file',
          examples: [
            {
              command: 'wc myfile.txt',
              output: '10 50 300 myfile.txt',
              explanation: 'Shows lines, words, characters, and filename'
            },
            {
              command: 'wc -l myfile.txt',
              output: '10 myfile.txt',
              explanation: 'Count lines only (-l)'
            },
            {
              command: 'wc -w myfile.txt',
              output: '50 myfile.txt',
              explanation: 'Count words only (-w)'
            },
            {
              command: 'wc -c myfile.txt',
              output: '300 myfile.txt',
              explanation: 'Count characters only (-c)'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p9-1',
          prompt: 'Count the lines in practice.txt',
          expectedCommand: 'wc -l practice.txt',
          hints: [
            'Use wc with -l option',
            'Format: wc -l filename'
          ],
          completed: false
        },
        {
          id: 'p9-2',
          prompt: 'Sort the contents of practice.txt',
          expectedCommand: 'sort practice.txt',
          hints: [
            'Use the sort command',
            'This will display the sorted lines'
          ],
          completed: false
        }
      ],
      summary: `
        Excellent! You've mastered essential text processing tools. These commands are building blocks for complex data analysis workflows.
        
        Common combinations:
        • sort file.txt | uniq -c | sort -nr (find most common lines)
        • cat *.log | wc -l (count total lines in all log files)
        • sort names.txt | uniq (remove duplicates from names)
        
        Pro tips:
        • Always sort before using uniq (uniq only removes consecutive duplicates)
        • Use sort -n for numbers, sort -h for human-readable sizes
        • wc without options shows lines, words, characters
        • Combine with pipes: cat file1 file2 | sort | uniq
        
        Real-world usage:
        • Analyzing web server logs
        • Processing CSV data
        • Finding unique visitors, IPs, or errors
        • Cleaning up data files
      `
    },
    quiz: {
      id: 'quiz-9',
      questions: [
        {
          id: 'q9-1',
          question: 'Which option makes sort treat numbers as numbers rather than text?',
          options: ['-r', '-n', '-u', '-c'],
          correctAnswer: 1,
          explanation: 'The -n option makes sort perform numerical sorting (1, 2, 10) rather than lexicographic (1, 10, 2).'
        },
        {
          id: 'q9-2',
          question: 'What does "wc -l" count?',
          options: ['Words', 'Characters', 'Lines', 'Letters'],
          correctAnswer: 2,
          explanation: 'wc -l counts the number of lines in a file.'
        }
      ]
    }
  },

  {
    id: '10',
    title: 'Pattern Matching: Wildcards & Regex Basics',
    duration: 3,
    description: 'Master wildcards and basic regular expressions for powerful pattern matching.',
    completed: false,
    content: {
      introduction: `
        Pattern matching is one of the most powerful features of the command line. It allows you to work with multiple files at once and find complex patterns in text:
        
        • Wildcards (* ? []) - simple pattern matching for filenames
        • Regular expressions - complex pattern matching for text content
        
        These patterns save enormous amounts of time by letting you specify groups of files or complex search criteria with just a few characters.
        
        Think of wildcards as shortcuts for "all files like this" and regex as "all text matching this pattern."
      `,
      commands: [
        {
          name: 'Wildcards',
          description: 'Pattern matching for filenames',
          syntax: '* ? [] patterns',
          examples: [
            {
              command: 'ls *.txt',
              output: 'file1.txt file2.txt notes.txt',
              explanation: '* matches any characters - finds all .txt files'
            },
            {
              command: 'ls file?.txt',
              output: 'file1.txt file2.txt',
              explanation: '? matches exactly one character'
            },
            {
              command: 'ls [abc]*.txt',
              output: 'apple.txt banana.txt cherry.txt',
              explanation: '[abc] matches any one of the listed characters'
            },
            {
              command: 'cp *.jpg Pictures/',
              output: '',
              explanation: 'Copies all JPEG files to Pictures directory'
            }
          ]
        },
        {
          name: 'grep with regex',
          description: 'Pattern matching in text content',
          syntax: 'grep [pattern] file',
          examples: [
            {
              command: 'grep "^Error" logfile.txt',
              output: 'Error: Connection failed',
              explanation: '^ matches start of line - finds lines beginning with "Error"'
            },
            {
              command: 'grep "test$" file.txt',
              output: 'This is a test',
              explanation: '$ matches end of line - finds lines ending with "test"'
            },
            {
              command: 'grep "[0-9]+" file.txt',
              output: 'Found 123 items',
              explanation: '[0-9]+ matches one or more digits'
            },
            {
              command: 'grep "colou?r" file.txt',
              output: 'color and colour',
              explanation: '? makes the previous character optional'
            }
          ]
        }
      ],
      practice: [
        {
          id: 'p10-1',
          prompt: 'List all .txt files using a wildcard',
          expectedCommand: 'ls *.txt',
          hints: [
            'Use ls with a wildcard pattern',
            '* matches any characters',
            'Pattern: *.txt'
          ],
          completed: false
        },
        {
          id: 'p10-2',
          prompt: 'Search for lines starting with "p" in practice.txt',
          expectedCommand: 'grep "^p" practice.txt',
          hints: [
            'Use grep with regex pattern',
            '^ means start of line',
            'Pattern: "^p"'
          ],
          completed: false
        }
      ],
      summary: `
        Outstanding! You've learned pattern matching - one of the most powerful terminal skills. This knowledge will make you incredibly efficient.
        
        Wildcard patterns:
        • * matches any characters (including none)
        • ? matches exactly one character  
        • [abc] matches any one of a, b, or c
        • [a-z] matches any lowercase letter
        • [0-9] matches any digit
        
        Basic regex patterns:
        • ^ matches start of line
        • $ matches end of line
        • . matches any single character
        • + means one or more of the previous
        • * means zero or more of the previous
        • ? means zero or one of the previous
        
        Powerful combinations:
        • find . -name "*.log" -exec grep "ERROR" {} \\;
        • grep -r "TODO.*urgent" --include="*.js" .
        • rm temp_[0-9]*.txt (removes temp files with numbers)
      `
    },
    quiz: {
      id: 'quiz-10',
      questions: [
        {
          id: 'q10-1',
          question: 'What does the wildcard pattern "file?.txt" match?',
          options: [
            'Any file ending with .txt',
            'Files like file1.txt, file2.txt (one character between file and .txt)',
            'Files containing the word "file"',
            'Only the file named "file?.txt"'
          ],
          correctAnswer: 1,
          explanation: 'The ? wildcard matches exactly one character, so file?.txt matches file1.txt, file2.txt, but not file10.txt.'
        },
        {
          id: 'q10-2',
          question: 'In regex, what does "^Error" match?',
          options: [
            'Any line containing "Error"',
            'Lines ending with "Error"',
            'Lines starting with "Error"',
            'The exact text "^Error"'
          ],
          correctAnswer: 2,
          explanation: 'The ^ symbol in regex matches the beginning of a line, so "^Error" matches lines that start with "Error".'
        }
      ]
    }
  },

  {
    id: '11',
    title: 'Process Management: ps, top, kill',
    duration: 3,
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
      ]
    }
  },

  {
    id: '12',
    title: 'System Info: df, du, free, uname',
    duration: 3,
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
          prompt: 'Show system information',
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
        }
      ]
    }
  },

  {
    id: '13',
    title: 'Network Basics: ping, curl, wget',
    duration: 3,
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
        }
      ]
    }
  },

  {
    id: '14',
    title: 'Environment Variables: env, export',
    duration: 3,
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
          prompt: 'Create an environment variable called GREETING with value "hello"',
          expectedCommand: 'export GREETING="hello"',
          hints: [
            'Use export command',
            'Format: export VARIABLE="value"',
            'Use quotes for the value'
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
    duration: 3,
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
    duration: 3,
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
        }
      ]
    }
  },

  {
    id: '17',
    title: 'Archive Management: tar, zip, gzip',
    duration: 3,
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
        }
      ]
    }
  },

  {
    id: '18',
    title: 'Package Management: apt/brew Basics',
    duration: 3,
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
        }
      ]
    }
  },

  {
    id: '19',
    title: 'Shell Scripting: Basic Bash Scripts',
    duration: 3,
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
        }
      ]
    }
  },

  {
    id: '20',
    title: 'Advanced Tips: screen, tmux, shortcuts',
    duration: 3,
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