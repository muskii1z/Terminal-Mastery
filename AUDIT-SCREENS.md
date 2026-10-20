# Terminal Mastery — Screen-by-Screen Audit

> **→ [BACKLOG.md](BACKLOG.md)** — the sequenced fix plan built from this doc. Start there when you're ready to act.

Companion to [AUDIT.md](AUDIT.md). That doc covers system-level defects (broken code, infrastructure, content gaps). **This one walks each screen as a visitor experiences it**, through five lenses:

1. **Capture** — does it win a customer? Is the hook sharp, is there a reason to choose this over free alternatives?
2. **Clarity** — is it obvious what's happening and what to do next?
3. **Distinctiveness** — does it look generic, or like something made on purpose?
4. **Completeness** — does it tell them everything they need to know?
5. **Craft** — UI, layout, typography, responsiveness, accessibility.

Screenshots: [`audit-screenshots/`](audit-screenshots/). Measurements taken at 1440×900 unless noted.

> Working agreement: walk every screen first, record findings here, **then** make fixes. Nothing below has been actioned.

## Goal & strategic context

Established 19 Oct 2026. **Everything below is audited against this**, so re-read it before acting on any finding.

**Primary goal: stand out to employers.** Secondary: build in public, use content (YouTube, LinkedIn) as the distribution channel, and be able to say *"here's something I built and people are actually using."*

**The story:** got into AI without a technical background, built this to teach himself the terminal. Peer research says even senior engineers often can't use it confidently — so the gap is real and widely felt.

### How this re-prioritises the audit

| Reframe | Consequence |
|---|---|
| **Employers will read the repo** | The fabricated `ratingValue: 4.8 / reviewCount: 1000` (`StructuredData.tsx:28-32`) and "Join thousands…" (`CTABand.tsx:31`) stop being SEO/legal risks and become a **character judgment** on the author. Highest-priority deletion on the project. |
| **"People are actually using it" is the pitch** | Analytics moves from second-tier to **pre-launch blocker**. With zero instrumentation there are no numbers, and without numbers there is no claim — just a URL. |
| **Build in public** | The anonymous "Terminal Mastery Founder" is hiding the project's main asset. Real name, face and story, prominently. |
| **Peer insight is the positioning** | "Even senior developers can't use the terminal" beats "beginner course." Reframes the audience from beginners (crowded, low-status) to working developers with a gap they're embarrassed about — bigger, more motivated, far more shareable. Also resolves the current copy's confusion about who it's for. |
| **Repo is portfolio surface** | Code quality (776-line component, regex markdown parser, `dangerouslySetInnerHTML`, no tests) is now reviewed by humans deciding whether to hire. |
| **Polish > completeness** | A tight 12-lesson course beats a thin 20-lesson one. **Cutting** lessons 13–20 is now a legitimate option rather than a failure (see AUDIT.md D1). |

### Audience — resolved

The course content serves **anyone who can't use the terminal**. The *story* leads with the peer insight — **"even senior engineers can't confidently use the terminal"** — which serves both audiences at once:

- **Experienced developers:** a hook with a sting (*am I one of them?*)
- **Beginners:** permission — if senior devs don't know this, you're not behind. Removes the shame that stops beginners starting.

One frame, both audiences, and the version that travels as content. Course stays beginner-safe; only the positioning sharpens. Lesson 1 currently opens by explaining what a terminal *is* — correct for beginners, condescending to the second group. Flag where the two pull apart as each screen is reviewed.

### Current state as a portfolio signal

Today the project reads as *negative*: dead site, deleted backend, failed deploy, nine months dormant, fabricated social proof in the source. The distance to "strong portfolio piece" is shorter than it looks — live URL, real analytics, author's name on it, four deletions, tightened lesson set.

---

## Progress

| # | Screen | Route | Status |
|---|---|---|---|
| 1 | Landing page | `/` | ✅ Audited |
| 2 | Lesson index | `/lessons` | ✅ Audited |
| 3 | Lesson walkthrough | `/lessons/1` | ✅ Audited (out of order) |
| 4 | A later lesson | `/lessons/20` | ✅ Audited |
| 5 | Completion | `/completion` | ✅ Audited |
| 6 | Certificate | `/certificate` | ✅ Audited |
| 7 | Auth screens | `/login`, `/signup` | ✅ Audited |
| 8 | Account | `/account` | ✅ Audited |
| 9 | Legal | `/privacy`, `/terms` | ✅ Audited |

---

# Screen 1 — Landing page (`/`)

**Measured:** 5,919px tall = **7.7 screens of scroll**, 8 sections, hero alone 932px. Sections 2 and 7 share an identical heading.

## Capture

**The best positioning on the page is buried in section 6 of 8.** The founder note reads:

> "I could ship projects with AI, but I felt like a fraud when it came to the terminal."

That is a sharp, current, emotionally specific hook — the AI-era developer who ships things without understanding their own tools. It is the most compelling sentence on the site and the only thing no competitor can copy. **It should be the hero.**

The actual hero — *"Master the Terminal in under 2 Hours / Learn 20 essential Linux commands"* — is a course description, not a hook. It competes directly with freeCodeCamp, YouTube and `man bash`, all free and better established, and gives no reason to choose this.

**"2 hours" appears seven times** (title, H1, subcopy, feature card, section heading, 2× FAQ, closing band). One differentiator repeated seven times reads as having only one thing to say — and it's derived from a hardcoded constant (`duration: 6` × 20), not anything measured.

**The page never shows the product.** For something selling interactivity there is no real screenshot, no GIF, no demo. The hero terminal is decorative with fake output; the "How it works" previews are tiny mockups. A visitor cannot tell what they'd actually be doing.

> **Highest-leverage change on the whole site:** a live mini-terminal in the hero where the visitor types `pwd` and sees it respond. Proves the promise in five seconds, needs no signup, and is the thing people would screenshot and share. Today the page asks for belief where it could give proof.

## Completeness

Four significant omissions:

1. **The certificate and cheat sheet are never mentioned.** A completion certificate and a 64-command reference PDF are real deliverables, and the landing page sells neither. The "what do I walk away with" is entirely unstated.
2. **No sample lesson** — every CTA goes to signup or a lesson *index*; nobody sees a lesson before committing.
3. **No author.** "Terminal Mastery Founder" with a "TM" monogram. For a teaching product, anonymity is a direct credibility cost — people learn from people.
4. **No sense of the arc.** The grid shows 6 categories; the course has 20 lessons covering considerably more. No beginner → competent map.

## Clarity

- **"guided stepper flow"** — implementation detail leaking into customer copy. Nobody outside the codebase knows what a stepper is.
- **"Your progress is saved to your free account"** — now false; no account exists or is needed.
- **The FAQ promises content that does not exist.** `FAQ.tsx:28` claims you'll *"use Git effectively, run development servers, manage dependencies, and deploy code."* Verified against all 20 lessons: **no Git lesson, no deployment lesson, no dependency-management lesson.** This is the most damaging copy on the page — someone arrives for Git and leaves disappointed.

## Distinctiveness

**Generic — and this is the most fixable thing here.** Dark slate background, blue→purple gradient headline, three-column feature grid with icons in rounded squares, FAQ accordion, gradient CTA band. This is the default Tailwind/shadcn landing aesthetic; swap the copy for a project-management SaaS and nothing looks out of place.

The irony is sharp: **a terminal course whose page has almost no terminal character.** Monospace appears only inside the decorative mockup. A command-line product could own monospace display type, a real terminal palette, a blinking-cursor motif, box-drawing rules instead of borders, keyboard-driven navigation, a hero that *is* a terminal — instantly recognisable, and reinforcing the subject instead of fighting it.

Also undercutting "professional": emoji as section markers throughout (🎯 🔥 👀 📄 🎓 🏆).

## Trust

Four credibility leaks, all self-inflicted, all removable:

- "Join thousands who've gone from terminal-phobic to confident developers" (`CTABand.tsx:31`) — there are no users
- `ratingValue: 4.8, reviewCount: 1000` in JSON-LD (`StructuredData.tsx:28-32`) — fabricated, machine-readable, the one item with real legal and SEO-penalty exposure
- Anonymous founder
- Footer reads © 2025

Removing all four makes the page *more* persuasive, because what remains is true.

## Conversion mechanics

- **Primary CTA points the wrong way.** "Sign Up Free" → `/signup`, which now gates nothing. Should be **"Start Lesson 1"** → `/lessons/1`.
- **No email capture anywhere.** The cheat sheet is a ready-made lead magnet locked behind 20/20 completion — reachable only by people who no longer need it.
- **The curriculum grid dead-ends.** Six cards naming real commands, all six linking to the same generic index rather than their lesson.
- **7.7 screens of persuasion for a free product**, selling someone on something they could just start doing. Cut to ~3 screens: hero → curriculum → FAQ → footer.

## Keep

The hero headline is specific and benefit-led. The terminal mockup is a nice touch. The trust row (Free / 2-Hour Mastery / No Experience Required) is honest and well-placed. The curriculum grid design is clean — it's the destination that's wrong, not the design.

## Top 5 for this screen

1. Hero becomes the founder's line, with a real name and face
2. Live mini-terminal in the hero
3. CTA → "Start Lesson 1", no account
4. Delete the four false claims
5. Make it *look* like a terminal product

---

# Screen 2 — Lesson index (`/lessons`)

**Measured:** 2,872px = 3.7 screens, 20 cards, **20 "New" badges**, **one unique duration value ("6m") across all 20**.

## Capture

**It's an inventory, not an invitation.** For a page whose only job is to get someone into lesson 1, it reads like a file listing: 20 equally-weighted tiles, each with an identical "Start Lesson" button. Twenty equal CTAs means no hierarchy and a decision to make before any learning happens.

**The most prominent element on a first visit is an empty progress bar reading 0%** — the best real estate given to a reminder that they've done nothing. That slot should be "Start with Lesson 1" plus a sentence on what they'll be able to do afterwards.

**The screen should sell the arc and sells nothing.** A course has a shape: by lesson 5 you move around a filesystem without thinking; by lesson 12 you can inspect a running system; by lesson 16 you chain commands. None of that is here. The landing page defines six categories (Navigation, Files, Viewing, Search, Processes, Pipes) — **grouping the 20 lessons under those headings would give structure, show progression, and tie the two pages together.** A beginner currently cannot tell that lesson 19 (shell scripting) is harder than lesson 2.

## Clarity — three things actively mislead

- **"New" on all 20 lessons.** It's the fallback label for "not started" (`page.tsx:327`) but reads as "recently added." Twenty of them makes it noise.
- **"6m" on all 20 lessons.** Identical values carry zero information. It's the hardcoded constant behind the "2 hours" claim, not a measurement.
- **The "In Progress" filter can never fire.** Verified: `setCurrentLesson` is never called anywhere outside `AppContext`, so `isInProgress` is permanently false. The filter, the "Current" badge and sort-by-status are dead code, permanently `(0)`.

Search + four filters for 20 items visible in under four screens is machinery the page doesn't need; three of four filters are empty or impossible on first visit.

## Distinctiveness

Same generic card grid as the landing page — strip the words and it could be a blog index or product catalogue. Nothing says *terminal*. The six categories would help; so would monospace lesson numbering and **commands on the cards**. Note the inversion: the landing page's teaser cards show `pwd, ls, cd` while the actual index shows only prose. The index should be *more* specific than the teaser, not less.

## Completeness

- **No difficulty signal** — lesson 1 and lesson 19 look identical in weight.
- **No prerequisites or ordering guidance** — can I skip to lesson 12?
- **No commands on cards** — someone scanning for "how do I search files" can't find lesson 7 without reading every description.

## Craft — the good

The most competent screen in the app. Clean responsive 4-column grid, consistent card spacing, well-written uniform descriptions, working search/filter/sort. The problem isn't execution — it's that the machinery solves problems this page doesn't have while leaving the real one (*get me started, show me the shape*) unaddressed.

## Top 5 for this screen

1. Replace the 0% progress card with a "Start with Lesson 1" hero for first-time visitors
2. Group the 20 lessons under the six landing-page categories, in order
3. Kill the "New" badge and per-card "6m"; add commands + difficulty instead
4. Remove the dead "In Progress" filter (or make `setCurrentLesson` actually fire)
5. Drop search and sort — 20 items don't need them

---

# Screen 3 — Lesson walkthrough (`/lessons/1`)

*Audited ahead of order. Recorded here for completeness.*

**Measured at 1440×900:**

| | |
|---|---|
| Step 5 (Practice) content height | **129px** |
| Empty space below it | **567px** — 81% of the screen is nothing |
| Step 1 line length | **86 characters** (comfortable is 60–75) |
| Step 1 content height | 934px — overflows a 900px viewport |
| Body font | `-apple-system, system-ui, Segoe UI` — the system **UI** stack |

## Craft — four structural problems, not styling

**1. The stepper is the wrong model for this content.** `getStepCount` is `1 + commands.length + 1 + 1 + 1` (`page.tsx:127`) — lesson 1 is 7 steps, lesson 8 is 11. Six to ten clicks to read ~600 words. Prose paginated into fragments far too small to fill a screen: that is the "compressed" feeling.

**2. The layout guarantees dead space.** `min-h-screen flex flex-col` (`:631`) + `flex-1` content (`:690`) + `mt-auto` nav (`:704`). Card sizes to content, container forced to full viewport, nav pinned to bottom — the remainder becomes a void. The 567px gap is arithmetic, not a decision.

**3. No reading typography.** The system UI stack is for buttons and menus, not 350 words of prose. A 768px column at 18px yields 86-character lines — too long to read comfortably *and* visually narrow against a 1440px page.

**4. The content has no structure to display.** `parseIntroText` (`:165-180`) splits on `\n\n` and emits `<p>`. That is the entire formatting model — no headings, lists, callouts or images. Even a perfect renderer would have nothing to work with; the data in `lessons.ts` is flat prose blobs.

Plus ~200px of chrome before the first word (global header `pt-20` + sticky sub-header at `py-8` with two stacked gradient overlays), and the walkthrough card overlapping content (see AUDIT.md B3).

## Recommendation

Kill the stepper. One scrollable lesson page — intro, each command, practice, quiz as sections — with a thin sticky progress rail. Give the content model real structure (headings, callouts, code blocks as first-class types) so lessons can be *designed*. Set a reading typeface at 65–70ch measure. Removes problems 1, 2 and 4 at once.

**Open decision:** rebuild on a new content structure (better, more work — touches `lessons.ts`), or fix within the existing stepper shape?

---

# Screen 4 — Lesson 20 (`/lessons/20`)

Quality does not hold up — and not merely by thinning out. The back half is **structurally incoherent**, and lesson 20 is the worst instance of a problem running through the whole course.

## The data model is abused — 26 times

Lesson 20's three "commands" are **Essential Shortcuts**, **Terminal Multiplexers**, **Advanced Techniques**, with `syntax` values `'Key combinations'`, `'screen or tmux commands'`, `'Various advanced commands'`. Categories, not commands. Rendered literally, producing nonsense:

> **Command You're Learning:** `Terminal Multiplexers`
> Learn the `Terminal Multiplexers` command — screen and tmux for multiple sessions
> Command syntax: `screen or tmux commands`

Scanned all 20 lessons: **26 of 64 "commands" are pseudo-commands** — categories, key combos or concepts in a slot designed for one command. Lesson 8 has six (`Ctrl+O`, `Ctrl+X`, `Ctrl+K`…); lesson 20 has three of three. One field doing four jobs, and the UI cannot distinguish them.

**Fix implication:** the content model needs distinct types (command / shortcut / concept), which is the same restructuring D2 requires.

## Fabricated outputs

`screen -S mysession` → `[Creates new screen session named "mysession"]` — a bracketed description dressed as terminal output. Reality: a cleared screen. Same for `Ctrl+C` → `"Interrupts current command"`.

**12 of 166 examples** use this placeholder style. Teaching fake output to beginners makes them think they did it wrong.

## Practice has collapsed

One exercise:

> "Clear the terminal screen using a keyboard shortcut **(try Ctrl+L)**"
> Hints: *"The shortcut is Ctrl+L"* → *"Alternatively, type the clear command"* → *"Both do the same thing"*
> `expectedCommand: 'clear'`

Answer is in the prompt; three hints restate it; prompt asks for a *shortcut* while `expectedCommand` is a *command*. **screen and tmux — the hardest content — have no practice at all.**

## Three lessons in one

Keyboard shortcuts + multiplexers (screen *and* tmux) + job control (`watch`, `nohup`, `jobs`). Each warrants its own lesson; tmux alone is hours. Labelled "6 min."

## Summary teaches what the lesson didn't

161 words of summary against a **43-word introduction** — more time spent recapping than teaching. It lists `Ctrl+A/E` and `Tab`, which **never appear in the lesson body**. Closes with *"Welcome to the ranks of terminal power users! 🚀"* after one exercise whose answer was printed in the question.

## No capstone

The final lesson introduces three new hard topics and never asks the learner to combine anything from the previous 19. No cumulative exercise, no review, no consolidation.

## Portability bug (the predicted macOS/Linux trap)

Lesson 18: prompt says *"use apt search or brew search based on your system"*; `expectedCommand: 'apt search curl'`. A Mac user doing the right thing is measured against the Linux answer. **Confirms the content-accuracy pass is needed.**

## Rendering bug

Lesson 20's intro bullets (`•`) render as one run-on paragraph — the hand-rolled parser handles `•` in summaries but not introductions.

## Where it's still good

Content *selection* is right: shortcuts, multiplexers and job control genuinely separate a confident terminal user from a hesitant one. Lessons 16–17 have real practice prompts (`tar -czf backup.tar.gz *.txt` is a proper task). The instinct for what to teach is sound throughout; execution thins in the back half.

## Decision this forces

Lessons 13–20 need either substantial rewriting or **cutting**. Given the portfolio goal (polish > completeness), a tight 12–14 lesson course that ends on a genuine capstone would be stronger than 20 lessons ending on this one.

---

# Screen 5 — Completion (`/completion`)

The most consequential screen in the product for the stated goals, and the emptiest.

## Core problem: maximum goodwill, zero ask

A user reaching this page has just spent real time on something you made and feels good about it — the highest-willingness moment the product will ever produce. Right now they are maximally likely to **share on LinkedIn** (the distribution channel), **give a testimonial** (the credibility gap), **join an email list** (the stated goal), **follow the YouTube** (the content strategy).

The page offers **"Review Lessons"** and **"Back to Home."**

Every goal in the "Goal & strategic context" section above could be served by this one screen, and it asks for nothing. Note the irony: the landing page carries *fabricated* social proof precisely because there is none — and this is the exact mechanism for earning real testimonials, unused.

"What's Next?" is one sentence of generic encouragement plus a button that sends people away.

## Factual errors

- **"20 Commands Mastered"** — the course teaches **64** commands (38 real + 26 pseudo-entries, see Screen 4). All three stats are hardcoded literals (`completion/page.tsx:72-85`): two are the same number, one is false.
- **"Completed on: <today>"** — not the actual completion date. `lesson_completions.completed_at` exists and `getCompletionStats` reads it; never called.
- **"Terminal Master Achieved!"** after a run where no quiz had to be passed and no command was ever verified. The claim far outruns the evidence.

## The certificate

- **Blank name by default.** The name input added during this session is a stopgap, not a design — a bare field floating above the certificate with no explanation.
- **No public URL.** Download-only; `certificateId` accepted and never rendered (`Certificate.tsx:9`). Below the Coursera/Codecademy standard **and** the growth loop most needed here — a LinkedIn credential entry linking back is free distribution from every finisher. (See D5.)
- **Signed "Terminal Mastery Team / Founder & Educator"** — anonymous, on the artefact most likely to be seen by other people.
- **Visually a Word template** — light background, blue double border, centred corporate layout. The most obvious place to be distinctive (terminal-rendered certificate, ASCII border, monospace) is the most conventional thing on the site.

## All-or-nothing

Gate is 20/20. Nineteen lessons earns nothing — no cheat sheet, no certificate, no acknowledgement. Combined with the thin back half (Screen 4), people who stall near lesson 13 get zero payoff for real effort.

## Genuinely good

The cheat sheet is a real asset — a 64-command reference generated from the actual curriculum, the best deliverable in the product. It is also the *only* place it appears, which is backwards: it belongs as an email-gated lead magnet at lesson 3–5, not a reward for people who already finished. Layout is clean; the achievement card is well built. The bones are fine — the intent is missing.

## Top 5 for this screen

1. **Add the asks** — LinkedIn share, testimonial prompt, email capture, follow link. Serves four stated goals at once.
2. Public verifiable certificate URL (D5)
3. Fix the three wrong numbers; use the real completion date
4. Milestone rewards at 5 and 10 so stalling isn't worth nothing
5. Real name on the certificate signature

---

# Screen 6 — Certificate (`/certificate`)

Two separate subjects: the page (delete) and the certificate design (the part that matters).

## The page: a dev leftover shipped to production

`src/app/certificate/page.tsx` is scaffolding, per its own comment: *"Sample data for testing - in production this would come from user session/database"*. It renders two fake certificates — **"John Smith"** (`TM-2024-0215-JS001`) and **"developer@company.com"** — under headings "Certificate with Student Name" / "Certificate with Email Only". Public, unauthenticated, crawlable.

Given employers will review this project, a live page of fabricated certificates sits in the same category as the fake review ratings. **Delete the route.**

## Certificate design — four real problems

1. **`certificateId` accepted and never rendered.** In the props interface (`:9`), destructured (`:16`), used nowhere in the body. It is the natural verification anchor, silently dropped — which is why D5 currently has nothing to hang off.
2. **The fallback prints an email as the recipient's name.** `displayName = studentName || studentEmail` (`:18`). The second sample demonstrates it as a feature: `developer@company.com` at 5xl where a person's name belongs. On a credential posted to LinkedIn that is a leak, not a graceful degradation.
3. **The signature uses a CSS class that does not exist.** `font-script` (`:76`) is not a Tailwind class and no `--font-script` token exists in `globals.css` (verified). The "signature" renders in default sans inside a grey gradient box reading "Terminal Mastery" — a fake signature that doesn't look like one.
4. **It asserts an unmeasured claim.** *"Mastered in 2 hours"* is printed on the certificate, derived from the hardcoded `duration: 6`. Someone finishing in 25 minutes still gets "2 hours."

## Visual

Four gradients (border, logo tile, wordmark, bottom pill) on a white card. Generic SaaS certificate; nothing says terminal. This is the artefact most likely to be seen by **other people**, and it is the most conventional thing in the project.

Opportunity: a terminal course could issue a terminal-looking certificate — monospace, box-drawing borders, a `$ verify TM-2026-…` line. Recognisable, screenshot-worthy, and it does the distribution work the portfolio goal needs.

Credit: the `print:` styles are thoughtful, and "Terminal Mastery: Command Line Fundamentals" is a credible course title.

## Top 4

1. Delete `/certificate`
2. Render `certificateId`, backed by a public verify URL (D5)
3. Never fall back to an email address as a name
4. Drop "Mastered in 2 hours" unless it is measured

---

# Screen 7 — Login / Signup (`/login`, `/signup`)

## Identity crisis

Auth now gates nothing, so what is signup *for*? The page says *"Create Account — Start your terminal mastery journey today"*, but the journey needs no account. **No stated benefit appears on either screen** — no cross-device sync, no certificate, nothing. It asks for an email and password in exchange for an unspecified nothing.

Not a new problem introduced by opening the course — a problem the gate was **hiding**. People previously signed up because they were forced to; now the page must persuade and has no argument.

## What a user sees right now

Submitting the form produces:

> 🔴 **Failed to fetch**

A raw browser network error rendered as user-facing copy. Beyond the dead backend, this shows error handling passes technical strings straight through — a user on flaky wifi sees "Failed to fetch" instead of "Can't reach the server."

## No name field — root cause of the blank certificate

The form collects **email and password only**; `User` (`types/index.ts:58-63`) has no name property. That is *why* the certificate falls back to an email local-part or renders blank (Screen 6). The fix starts here.

## Signup doesn't sign you in

`AuthForm.tsx:42-45` withholds `onSuccess` and shows *"check your email to verify your account before signing in."* Fill form → leave site → find email → return → re-enter the same credentials. An out-of-app round trip for an account with no stated benefit. `login/page.tsx:20-22` also hardcodes `/lessons`, ignoring `?redirect=`, flattening deep links.

## No OAuth, despite the README

`README.md:84` claims *"Supabase-powered authentication (email/password, OAuth)."* Verified: no `signInWithOAuth` anywhere. OAuth does not exist.

For a developer audience this is the obvious miss — **"Continue with GitHub"**: one click, no password, no verification email, no round trip, perfect audience fit, and it removes the entire verification detour.

## Smaller

- No password requirements, strength indicator or confirmation field
- No reassurance or social proof on a page asking for credentials
- Generic centred card; the most anonymous screen in the app

## Recommendation — re-scope rather than polish

> **Save your progress** — Create an account to sync across devices and claim your certificate. Not required to take the course.

With GitHub OAuth primary, email/password secondary. Gives the page a real argument, removes the verification round trip, collects a name for the certificate, and matches the audience.

---

# Screen 8 — Account (`/account`)

**Currently unreachable.** The page gates on auth (`:18-22`); with Supabase deleted nobody can sign in, so it redirects everyone to `/login` (verified in browser). The gate is correct behaviour — the door behind it no longer exists.

When it works it offers three things: **Email Address**, **Change Password** (sends a reset email), **Sign Out**. All account plumbing.

**Missing: progress.** This is the account page of a *course* and shows no completion count, no next lesson, no start date. For most learners that is the only reason to visit.

Two capabilities exist in code with no UI:

- **`resetProgress`** is fully implemented in `AppContext` (Supabase path, local path, error handling) and **nothing calls it** — zero references on this page. A learner cannot start over.
- **No delete account, no data export.** Basic hygiene; a GDPR consideration with EU traffic.

Also no name field (same root cause as Screens 6 and 7). "Change Password" bounces to the inbox again.

Low stakes relative to the rest — but "course account page with no course progress" is a real gap, and surfacing the already-built `resetProgress` is nearly free.

---

# Screen 9 — Legal (`/privacy`, `/terms`)

Real prose, not placeholders — better than most side projects. Four problems, one that matters.

## 1. The terms forbid the growth strategy

> "Use the materials for any commercial purpose **or for any public display**"
> "Modify or copy the materials"

The entire plan depends on people sharing this — LinkedIn, YouTube, screenshots, certificates on profiles. A learner posting a screenshot **is** public display. The terms prohibit the growth loop.

Compounding: `README.md:122` says **"This project is private and proprietary"** on a **public** GitHub repo intended for employers to read. The kind of small contradiction a reviewer notices.

## 2. Both pages claim they were updated today, every day

`{new Date().toLocaleDateString()}` on both (`privacy:13`, `terms:13`). A legal document always "updated today" is transparently automated, and it is a hydration-mismatch risk across timezones/midnight.

## 3. The privacy policy describes collection that doesn't happen

*"Usage analytics to improve our service"* (`:25`) and *"aggregated, non-personally identifiable information for analytics purposes"* (`:43`). Zero analytics exist. Becomes accurate once analytics are added — which the audit recommends anyway.

## 4. Promises with no mechanism

"Opt out of communications at any time" (no mechanism, no communications). "Contact us through our platform" (no contact form, email address or social link anywhere in the app).

Absent: company name, jurisdiction, governing law, GDPR/CCPA language, cookie disclosure (Supabase sets auth cookies).

**Priority:** fix the terms and the README licence line. The rest is low priority — but these are two static prose files, so correcting them is ~20 minutes.

---

# Competitive benchmark

Researched 19 Oct 2026, scoped to the open decisions. Unverified items flagged as such.

## Lesson structure — settles D2

Codecademy's learning environment uses **2–5 persistent panes**. The first is always a **narration pane** (intro, checkpoints, cheatsheets); others hold the editor and output terminal. **Instruction stays visible while you work.**

That is the opposite of a stepper. Terminal Mastery shows one fragment at a time and hides it on Next — so at the practice step the command you're meant to run is off screen, and the learner must hold it in memory while switching to their own terminal.

**Nobody in this category paginates prose into sequential steps.** The convention is persistent instruction beside persistent doing. Strong argument for rebuilding rather than fixing the stepper in place — and it structurally explains the 567px dead space, since a two-pane layout has no "leftover" to become a void.

## Auto-grading — bears on D3

Codecademy: *"the code you submit will be checked automatically. If your code is considered correct, the checkpoint will be marked as complete."* Self-marking is reserved for **projects**, where open-ended work cannot be graded.

Terminal Mastery self-attests **everything**, including single-command exercises where `expectedCommand` already exists in the data, unused. It applies the fallback meant for ungradeable work to the most gradeable case there is. Tilts D3 toward building validation.

## Certificates — below category standard

Coursera prints a verify URL (`coursera.org/verify/<code>`), offers a **Share Certificate** button producing a public link, and an **Add to LinkedIn** button populating name, issuer, date and credential URL. Codecademy is similar, with the credential URL pointing at a certificate page.

**Both have a public, verifiable certificate page. Terminal Mastery's is a download-only PDF**, with a `certificateId` prop accepted and never rendered (`Certificate.tsx:9`).

Double miss given the portfolio goal: below standard, *and* a declined growth loop. Every learner adding a certificate to LinkedIn is a backlink and visible endorsement — precisely the "people are actually using it" evidence required.

## Landscape

| | What it is | Gap |
|---|---|---|
| **OverTheWire Bandit** | Free CTF wargame on a real SSH server; genuinely hands-on, escalating difficulty | Unguided and intimidating — a wargame, not a course. Beginners bounce. |
| **explainshell** | Parses man pages to explain each part of a command | A tool, not a course. No progression. |
| **Hexlet "Basics of Bash"** | Free, 8 lessons: navigation, files, pipes | Narrow; last updated 2024 |
| **Udemy / university courses** | Mostly paid or institution-gated | Cost, length, no interactivity |

*Could not verify: Linux Journey's current state; Codecademy's pricing for command-line content.*

**The gap is real** and it is the honest answer to "why this instead of freeCodeCamp": *guided, friendly, browser-based, genuinely interactive, free, terminal-specific.* Bandit is real but brutal; big platforms are guided but general-purpose. Nothing occupies the middle well.

**But the position is only occupied if the interactivity is real.** Without command validation this is a well-designed set of notes competing with free written tutorials — a crowded, losing position. **The competitive analysis and D3 are the same decision.**

Sources: [Codecademy learning environment](https://help.codecademy.com/hc/en-us/articles/360056641953) · [Codecademy editor layouts](https://curriculum-documentation.codecademy.com/exercises/le-layouts/code-editor-layout/) · [Coursera verified certificates](https://blog.coursera.org/the-anatomy-of-a-verified-certificate-shareable) · [Codecademy certificates on LinkedIn](https://help.codecademy.com/hc/en-us/articles/360055616274-Adding-Certificates-to-Linkedin) · [OverTheWire Bandit](https://cs.carleton.edu/faculty/jondich/courses/cs338_f25/assignments/03-bandit.html) · [Hexlet Basics of Bash](https://hexlet.io/courses/basics_of_bash)

---

# Open decisions

| # | Decision | Context |
|---|---|---|
| D1 | Hero CTA → lesson 1, accounts as optional progress-saving? | Screen 1 |
| D2 | Rebuild lesson page on new content structure, or fix in place? | Screen 3 — **benchmark favours rebuild** (persistent two-pane is the category convention) |
| D3 | Build real command validation, or soften the "instant feedback" copy? | AUDIT.md R1 — **benchmark says build it**; it is the same decision as whether the competitive position exists |
| D4 | Lean into terminal-native visual identity, or keep the current aesthetic? | Screen 1 |
| D6 | Rewrite lessons 13–20, or cut to a tighter 12–14 lesson course ending on a capstone? | Screen 4 |
| D7 | Add distinct content types (command / shortcut / concept) to fix the 26 pseudo-commands? | Screen 4 — same restructuring as D2 |
| D8 | Add GitHub OAuth as primary sign-in, and a name field (fixes the blank certificate at source)? | Screen 7 |
| D5 | Public verifiable certificate page (Coursera/Codecademy standard + growth loop), or keep download-only PDF? | Competitive benchmark |
