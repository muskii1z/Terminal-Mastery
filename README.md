# Terminal Mastery

An interactive web-based platform for learning Linux terminal commands and command-line fundamentals. Built with Next.js, TypeScript, and Supabase.

## Features

- **20 Interactive Lessons**: Comprehensive curriculum covering essential Linux terminal commands
- **Progress Tracking**: User authentication with Supabase to track learning progress
- **Interactive Terminal Simulator**: Practice commands in a safe, simulated environment
- **PDF Certificate Generation**: Downloadable completion certificates
- **Command Cheat Sheet**: PDF export of all learned commands
- **Responsive Design**: Modern UI with dark theme and smooth animations
- **Real-time Feedback**: Instant validation of terminal commands

## Tech Stack

- **Frontend**: Next.js 15.5.2, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion for animations
- **Backend**: Supabase (Authentication, Database, Real-time)
- **PDF Generation**: jsPDF for certificates and cheat sheets
- **Code Highlighting**: React Syntax Highlighter with Prism
- **Markdown**: React Markdown with GitHub Flavored Markdown support

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Supabase account (for user authentication and progress tracking)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/muskii1z/Terminal-Mastery.git
cd Terminal-Mastery
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   └── lessons/        # Lesson-specific components
├── context/            # React Context providers
├── data/               # Static lesson data
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Key Features

### Lesson System
- 20 structured lessons covering basic to advanced terminal commands
- Interactive command practice with real-time validation
- Progress tracking with completion status
- Estimated time and difficulty levels

### User Authentication
- Supabase-powered authentication (email/password, OAuth)
- Progress synchronization across devices
- Guest mode for anonymous learning

### PDF Generation
- Completion certificates with user names and dates
- Command cheat sheets with all learned commands
- Professional styling and branding

### Interactive Terminal
- Simulated terminal environment
- Command validation and feedback
- Safety features preventing harmful commands

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application is configured for deployment on Netlify with the following build settings:

- **Build Command**: `npm run build`
- **Publish Directory**: `out` (for static export)
- **Environment Variables**: Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.
