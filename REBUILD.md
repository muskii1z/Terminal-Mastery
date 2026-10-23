# Terminal Mastery — Rebuild Plan

**Goal:** someone opens it and it feels like a real course — Codecademy, freeCodeCamp, Coursera level — not a template.

**Keeping:** the lesson content (as raw material), the database setup, analytics, the certificate and cheat-sheet generators.

---

## The work, in six parts

**1. The look**
One consistent style for everything: fonts, colours, spacing, buttons, cards. This is what kills the "generic AI" feel.

**2. The lesson page**
Replace the step-by-step bubbles with one proper lesson screen: instructions on the left, a terminal on the right, progress across the top. You read and do at the same time, like Codecademy.

**3. The terminal**
A real terminal inside the browser. You type commands, it responds, and it checks your work. This is what makes it interactive.

**4. The lessons themselves**
Rewrite and tighten. Accurate commands, real exercises, a proper final challenge. Probably fewer lessons, all good ones.

**5. The landing page**
Rebuilt last, once there's something real to show. Your story up front, a live terminal demo people can try immediately.

**6. Finish and share**
Completion page, a certificate people can post on LinkedIn, email signup.

---

## How the interactivity works

A terminal that runs in the browser with a pretend file system behind it. Type `ls` and you see files. `mkdir projects` creates a folder you can then `cd` into. `cat notes.txt` shows what's inside.

- **Instant, free, and safe** — nothing runs on a server, nothing can break, works on a phone.
- **Checks what you did, not what you typed.** "Create a folder called projects" passes whether you type `mkdir projects` or `mkdir ./projects`, because it checks the folder exists — not the exact string.
- **Every lesson gets hands-on tasks**, not "go open your own terminal."

It's also a strong thing to show employers: *"I built a shell simulator for my course"* is a much better story than *"I built a course."*

---

## Where we start

**One lesson, done properly.** Lesson 2 (`pwd`, `ls`, `cd`) — the most naturally hands-on topic — rebuilt end to end: new look, new lesson layout, working terminal.

That one lesson settles parts 1, 2 and 3 at once. I'll build it in two or three different looks, you pick one, and it becomes the template for everything else.

## Order

1. Lesson 2 prototype — look + lesson page + terminal, together ✅ built 20 Oct 2026, awaiting your review
2. Apply to all lessons, rewriting content as we go
3. Landing page
4. Finish and share

**Going live** is separate and can happen whenever — it's the ~25 minutes of account setup listed at the bottom of [BACKLOG.md](BACKLOG.md).

---

*Detailed findings, if ever needed: [AUDIT.md](AUDIT.md), [AUDIT-SCREENS.md](AUDIT-SCREENS.md).*

---

## Lesson 2 plan

Built as one finished piece: new look, new layout, working terminal, rewritten content.

**What it teaches (rewritten and checked for accuracy)**

1. **The mental model.** Folders form a tree that starts at `/`, and you're always standing inside one of them.
2. **`pwd`: where am I.** Home is `/Users/you` on a Mac and `/home/you` on Linux. `~` is shorthand for it.
3. **`ls`: look around.** `ls -a` shows hidden files (and what `.` and `..` are), `ls -l` shows details, and `ls folder` peeks into a folder without moving.
4. **`cd`: move.** Relative vs absolute paths, the key concept the old version skipped. `..` goes up, `cd` on its own goes home, `cd -` goes back.
5. **Tab completion.** The biggest timesaver for beginners, which the old version never mentioned.
6. **Reading errors.** What "No such file or directory" means, and that names are case-sensitive.

**Hands-on tasks.** These are checked by what you did, not what you typed. There are about six of them, ending in a challenge: *a file is hidden somewhere inside `projects`, so find the folder it's in and go there.*

**Quiz.** Four questions, including relative vs absolute paths.

**Changes from the old lesson 2:** it adds absolute vs relative paths, `cd` with no argument, `cd -`, tab completion, and error reading. The three practice prompts that matched exact strings are replaced with tasks that check the result.


---

## Curriculum v2 (decided 22 Oct 2026)

Tightened from 20 lessons to 13. Topics that need a real machine to mean anything (networking, package managers, archives, tmux/screen) were cut; a final project replaces the old lesson 20.

| # | Lesson | Covers | Replaces |
|---|---|---|---|
| 1 | Meet the terminal | whoami, date, echo, errors, Ctrl+C, real terminal | 1 |
| 2 | Moving around | pwd, ls, cd, paths, Tab | 2 |
| 3 | Make files and folders | mkdir, touch, cat, > | 3 |
| 4 | Copy, move and delete | cp, mv, rm, rmdir | 4 |
| 5 | Read files | cat, head, tail, wc | 6, part of 9 |
| 6 | Match many files at once | *, ?, [ ] | 10 |
| 7 | Connect commands | pipes, > and >>, sort, uniq | 16, 9 |
| 8 | Find anything | grep, find | 7 |
| 9 | Permissions | ls -l, chmod, running scripts | 5 |
| 10 | Edit files with nano | nano | 8 |
| 11 | What's running | ps, kill, df, du | 11, 12 |
| 12 | Work faster | history, aliases, variables, PATH | 14, 15 |
| 13 | Final project | everything, on one realistic mess | new |

Total: 168 minutes, so "about 3 hours". The old "under 2 hours" and "20 lessons" claims are gone everywhere. Course size now comes from `src/lessons/summary.ts`, and a test fails if it drifts from the real lessons.

## Status (22 Oct 2026): all 13 lessons on the workbench

Done:

- **Lessons 1–13** in `src/lessons/`, all in the workbench format. The old lesson page, `src/data/lessons.ts` and its components are deleted.
- **Tests** (`npm test`, 65 passing). Every lesson is played start to finish with a reference solution. The tests also check that no task starts out done, that every example prints exactly what the lesson shows, and that common wrong answers don't pass.
- **nano** inside the practice terminal: ^O write out, ^X exit with the save prompt, ^K/^U cut and paste, ^C cancel. Every shortcut is also a button, for phones.
- **Map** now shows files and folders the moment you create or move them.
- **Typo help**: `whomai` → "Did you mean whoami?"
- **/lessons** rebuilt in the workbench look, grouped by part, with progress and a resume button.
- **/completion** rebuilt: certificate, plus a cheat sheet built from every lesson's command list. The PDF library loads only when you download.
- **Lesson pages** are pre-rendered with their own titles and descriptions, and all 13 are in the sitemap.
- **Landing**: "Sign up" buttons now go to Lesson 1, because accounts can't work until the backend is rebuilt (BACKLOG.md).

- **Landing page** rebuilt in the Ocean look (BACKLOG P5-1 to P5-6):
  - Hero leads with "Even senior engineers wing it in the terminal", the founder's line and name, and **a working practice terminal** visitors can type into.
  - "Start Lesson 1" is the main button everywhere. No sign-up step.
  - The curriculum is drawn as a `tree` listing, and every lesson links straight to itself.
  - "What you leave with" names the certificate and cheat sheet. "Why I built this" tells the founder story.
  - The FAQ is honest and uses native `<details>`.
  - 4.4 screens long, down from 7.7. 125 kB first load, down from 159 kB.
  - The old landing components are deleted. Structured data now comes from the real lessons and author.

Still to do:

- Author photo (`public/author.jpg`) and social links, in `src/lib/author.ts`.
- Email capture (BACKLOG P3-1, P3-3). Needs a backend or a mailing-list service.
- Accounts and synced progress (BACKLOG.md). For now, progress lives in the browser.
- Login, signup, account and reset-password pages still use the old look and the dead backend.
