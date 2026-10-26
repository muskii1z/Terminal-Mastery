import Link from 'next/link';
import CourseTopbar from '@/components/course/CourseTopbar';
import HeroTerminal from '@/components/home/HeroTerminal';
import StructuredData from '@/components/seo/StructuredData';
import { LESSONS, PARTS } from '@/lessons';
import { COURSE } from '@/lessons/summary';
import { AUTHOR, initials } from '@/lib/author';
import topbar from '@/components/course/course.module.css';
import s from '@/components/home/home.module.css';

const slug = (part: string) => part.toLowerCase().replace(/\s+/g, '-');
const two = (n: number) => String(n).padStart(2, '0');

const STEPS = [
  {
    title: 'Read one small step',
    text: 'Each step teaches one command, with the exact output it prints. No walls of text.',
  },
  {
    title: 'Type it yourself',
    text: 'A practice terminal sits beside every lesson. It behaves like bash on Linux, error messages and all.',
  },
  {
    title: 'It checks your work',
    text: 'Tasks tick off the moment you do them. No “mark as complete” button, no honour system.',
  },
];

const FAQ = [
  {
    q: 'Who is this for?',
    a: 'Anyone who avoids the terminal, or copies commands into it without knowing what they do. Complete beginners are welcome. So are developers who never properly learned it.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. The practice terminal runs in your browser, and nothing you type can touch your computer. Lesson 1 shows you how to open the real terminal on Mac, Linux or Windows when you’re ready.',
  },
  {
    q: 'Mac, Windows or Linux?',
    a: 'The commands work on Mac and Linux, and the lessons point out where a Mac behaves differently. On Windows, you install WSL, which gives you a real Linux terminal. Lesson 1 walks you through it.',
  },
  {
    q: 'How long does it take?',
    a: `About ${COURSE.hours} hours for all ${COURSE.lessons} lessons, at 10 to 20 minutes each. Your progress saves to your account as you go, so stop whenever you like.`,
  },
  {
    q: 'Is it really free?',
    a: 'Yes. Every lesson, the certificate and the cheat sheet are free. Try lesson 1 without signing up; after that, a free account saves your progress so you can pick up on any device.',
  },
  {
    q: 'Will it teach me Git, Docker or deploying?',
    a: 'Not directly. Those tools all run in the terminal, and this course teaches the ground they stand on: moving around, files, searching, pipes, permissions, editing and processes. Once that clicks, their tutorials stop looking like magic spells.',
  },
];

function Avatar({ size }: { size: 'small' | 'large' }) {
  const className = size === 'large' ? s.avatarLarge : s.avatar;
  return AUTHOR.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={AUTHOR.photo} alt={AUTHOR.name} className={className} />
  ) : (
    <span className={className} aria-hidden="true">
      {initials(AUTHOR.name)}
    </span>
  );
}

export default function Home() {
  const links = Object.entries(AUTHOR.links).filter(([, url]) => url);

  return (
    <div className={s.root}>
      <StructuredData />
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <CourseTopbar>
        <Link href="/lessons" className={topbar.topbarLink}>
          Lessons
        </Link>
      </CourseTopbar>

      <main id="main">
        {/* ── Hero: the hook, the person, and the proof ─────────────── */}
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>
              <span className={s.prompt}>$</span> a free course · {COURSE.lessons} lessons · about {COURSE.hours} hours
            </p>
            <h1 id="hero-title" className={s.title}>
              Even senior engineers wing it in the terminal.
            </h1>
            <p className={s.lede}>
              You don’t have to. Learn it properly in {COURSE.lessons} short lessons, typing every command into a
              practice terminal that checks your work. Free, and lesson 1 needs no sign-up.
            </p>

            <div className={s.actions}>
              <Link href="/lessons/1" className={s.primary}>
                Start Lesson 1 <span aria-hidden="true">→</span>
              </Link>
              <Link href="/lessons" className={s.secondary}>
                See all {COURSE.lessons} lessons
              </Link>
            </div>

            <figure className={s.quote}>
              <Avatar size="small" />
              <div>
                <blockquote>
                  “I could ship projects with AI, but I felt like a fraud in the terminal. So I built the course I wish
                  I’d had.”
                </blockquote>
                <figcaption>{AUTHOR.name}, who made Terminal Mastery</figcaption>
              </div>
            </figure>
          </div>

          <HeroTerminal />
        </section>

        {/* ── How a lesson works ─────────────────────────────────────── */}
        <section className={s.band} aria-labelledby="how-title">
          <div className={s.inner}>
            <h2 id="how-title" className={s.heading}>
              How every lesson works
            </h2>
            <ol className={s.steps}>
              {STEPS.map((step, i) => (
                <li key={step.title} className={s.step}>
                  <span className={s.stepNumber}>{two(i + 1)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── The curriculum, drawn the way `tree` draws it ──────────── */}
        <section className={s.section} aria-labelledby="course-title">
          <div className={s.inner}>
            <h2 id="course-title" className={s.heading}>
              From your first command to cleaning up a real project
            </h2>
            <p className={s.sub}>
              {COURSE.lessons} lessons in five parts. Each one builds on the last, and the final project uses all of
              them. Jump into any lesson.
            </p>

            <div className={s.tree} role="list" aria-label="All lessons">
              <div className={s.treeRoot} aria-hidden="true">
                ~/terminal-mastery
              </div>
              {PARTS.map((part, p) => {
                const lastPart = p === PARTS.length - 1;
                const inPart = LESSONS.filter((l) => l.part === part);
                return (
                  <div key={part} role="listitem" className={s.treePart}>
                    <div className={s.treeDir}>
                      <span className={s.branch} aria-hidden="true">
                        {lastPart ? '└── ' : '├── '}
                      </span>
                      {slug(part)}/
                    </div>
                    <ul className={s.treeLessons}>
                      {inPart.map((lesson, i) => (
                        <li key={lesson.id}>
                          <Link href={`/lessons/${lesson.id}`} className={s.treeLesson}>
                            <span className={s.branch} aria-hidden="true">
                              {lastPart ? '    ' : '│   '}
                              {i === inPart.length - 1 ? '└── ' : '├── '}
                            </span>
                            <span className={s.treeNumber}>{two(lesson.number)}</span>
                            <span className={s.treeTitle}>{lesson.title}</span>
                            <span className={s.treeCommands}>
                              {lesson.commands
                                .slice(0, 4)
                                .map((c) => c.name)
                                .join('  ')}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── What you leave with, and who made it ───────────────────── */}
        <section className={s.band} aria-labelledby="finish-title">
          <div className={`${s.inner} ${s.split}`}>
            <div>
              <h2 id="finish-title" className={s.heading}>
                What you leave with
              </h2>
              <ul className={s.gets}>
                <li>
                  <h3>The habit, not just the facts</h3>
                  <p>You’ll have typed every command yourself, and fixed your own mistakes along the way.</p>
                </li>
                <li>
                  <h3>A certificate with your name on it</h3>
                  <p>Earned by finishing all {COURSE.lessons} lessons, every task checked. Download it as a PDF.</p>
                </li>
                <li>
                  <h3>A one-page cheat sheet</h3>
                  <p>Every command from the course, to keep next to your keyboard.</p>
                </li>
              </ul>
            </div>

            <div className={s.founder}>
              <h2 className={s.heading}>Why I built this</h2>
              <div className={s.founderBody}>
                <Avatar size="large" />
                <div>
                  <p>
                    I got into AI without a technical background. I could ship projects, but the terminal was a
                    black box I typed into and hoped. So I built this course to learn it properly myself.
                  </p>
                  <p>
                    Then I started asking my peers, and found I wasn’t alone. Plenty of people who write code every
                    day, senior engineers included, never really learned it either.
                  </p>
                  <p className={s.signature}>{AUTHOR.name}</p>
                  {links.length > 0 && (
                    <p className={s.links}>
                      {links.map(([name, url]) => (
                        <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                          {name === 'linkedin' ? 'LinkedIn' : name === 'youtube' ? 'YouTube' : 'GitHub'}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Questions ──────────────────────────────────────────────── */}
        <section className={s.section} aria-labelledby="faq-title">
          <div className={`${s.inner} ${s.narrow}`}>
            <h2 id="faq-title" className={s.heading}>
              Questions
            </h2>
            <div className={s.faq}>
              {FAQ.map((item) => (
                <details key={item.q} className={s.faqItem}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Last word ──────────────────────────────────────────────── */}
        <section className={s.final} aria-labelledby="final-title">
          <p className={s.finalPrompt} aria-hidden="true">
            you@terminal-mastery:~$ <span className={s.cursor} />
          </p>
          <h2 id="final-title" className={s.finalTitle}>
            Your first command is one click away.
          </h2>
          <Link href="/lessons/1" className={s.primary}>
            Start Lesson 1 <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>

      <footer className={s.footer}>
        <span>
          © {new Date().getFullYear()} Terminal Mastery · made by {AUTHOR.name}
        </span>
        <nav aria-label="Footer">
          <Link href="/lessons">Lessons</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
