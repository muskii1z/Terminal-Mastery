# Terminal Mastery — Fix Backlog

Consolidated from [AUDIT.md](AUDIT.md) (system defects) and [AUDIT-SCREENS.md](AUDIT-SCREENS.md) (screen-by-screen UX, marketing, positioning).

**Sequenced against the goal**, not by screen: *stand out to employers · build in public · "here's something I built and people are actually using" · content via YouTube & LinkedIn.*

Effort estimates assume focused work and include testing.

---

## The shape of the plan

The tension: ship fast to have something live, versus not showing employers a weak lesson experience. Resolved with a **soft launch / hard launch** split, which is also the honest build-in-public pattern:

```
P0 Stop the bleeding  →  P1 Live + measured  →  ⚑ SOFT LAUNCH (quiet, collecting data)
                                                      ↓
                      P2 Rebuild the lesson experience  ←  the thing that makes it impressive
                                                      ↓
                      P3 Make it spread  →  P4 Content quality
                                                      ↓
                                              ⚑ HARD LAUNCH (LinkedIn / YouTube push)
```

**Do not do the big LinkedIn/YouTube push until P2–P4 are done.** First impressions with an audience are one-shot. But get it live and measured early — a quiet live URL collecting real drop-off data is worth far more than a perfect plan.

---

## P0 — Stop the bleeding ✅ COMPLETE (20 Oct 2026)
**Before anyone sees this, including employers.** All deletions and small fixes. No decisions required.

| ID | Fix | Why | Effort |
|---|---|---|---|
| **P0-1** | Delete the fabricated `aggregateRating` (4.8 / 1000 reviews) — `StructuredData.tsx:28-32` | Employers read this repo. Fabricated review data is a **character** judgment, not a code one. Also a Google spam-policy violation and false-advertising exposure. **Highest priority item in this document.** | ✅ 5 min |
| **P0-2** | Delete "Join thousands who've gone from terminal-phobic…" — `CTABand.tsx:31` | Same category. There are no users. | ✅ 5 min |
| **P0-3** | Delete the `/certificate` route | Public, crawlable page rendering fake "John Smith" certificates with a "sample data for testing" comment. | ✅ 5 min |
| **P0-4** | Fix `README.md:122` "private and proprietary" on a public repo; fix the OAuth claim at `:84` (no OAuth exists); fix the Netlify/static-export deployment section | The README is the first thing a technical reviewer reads, and three of its claims are false. | ✅ 30 min |
| **P0-5** | Fix lesson 8 — add the missing `quiz` and `summary` keys; make `getStepCount` conditional | Ships two visibly broken screens: a quiz reading "Question 1 of" with no question, and a generic fallback summary. | ✅ 1.5 h |
| **P0-6** | Delete `LessonWalkthroughCard` (floating variant) | Overlaps lesson content and covers the "Lessons" button. Pure decoration — no lesson data flows into it. | ✅ 15 min |
| **P0-7** | Strip `console.log` of user emails — `middleware.ts:48,51` | *Already done — middleware deleted this session.* | ✅ |
| **P0-8** | Fix the footer © 2025 → current year | | ✅ 2 min |
| **P0-9** | Rewrite the terms clause forbidding "public display" and "copying"; it prohibits your own growth loop | A learner sharing a screenshot is "public display." | ✅ 20 min |

**P0 total: ~3 hours — done.** Verified: `tsc` clean, ESLint 0 errors, production build passes, all routes 200, `/certificate` now 404s, no fabricated claims in served HTML. Everything here is a deletion or a small correction, and several are five-minute jobs with outsized effect.

---

## P1 — Live and measured — 🟡 my half done (20 Oct 2026)
**Goal: a working URL that collects real data.**

> Code side complete: `netlify.toml`, PostHog wired (lazy-loaded, zero bundle cost), env-driven `SITE_URL`, terminal-styled OG image. **Remaining items need your logins** — see "Handoff" at the end of this file. Blocks everything downstream.

| ID | Fix | Why | Effort | Decision |
|---|---|---|---|---|
| **P1-1** | ⚠️ **NEEDS YOU** — Rebuild Supabase (new project, run `database/schema.sql` + `migration-fix-progress-tracking.sql`), or commit to localStorage-only | Backend is deleted (NXDOMAIN). Schema is reproducible. Stated preference: rebuild, for the email list. | 1 h | — |
| **P1-2** | `netlify.toml` + Next.js runtime (**not** static export — it breaks on the dynamic lesson route), env vars, deploy | No deploy config exists. Last Vercel deploy failed; all URLs 404. | ✅ done | — |
| **P1-3** | **Add analytics** — page views, lesson starts, lesson completions, drop-off by lesson, completion rate | **Without this there is no "people are actually using it."** You'd have a URL and no story. Also the only way to learn where the course loses people. | ✅ done | — |
| **P1-4** | Replace the hardcoded `terminal-mastery.com` in `metadataBase`, `robots.ts`, `sitemap.ts`, `openGraph.url` with the real URL | Domain was never registered; every OG preview and the sitemap point nowhere. | ✅ done | D-domain |
| **P1-5** | Create the missing `og-image.png` (referenced, 404s) and remove the placeholder Google verification code | Every link share currently previews a broken image. Directly affects LinkedIn posts. | ✅ done | — |
| **P1-6** | Fix `AuthContext` resilience | *Already done this session — try/catch + 5s timeout.* | ✅ |
| **P1-7** | Fix `/completion` hydration redirect; fix guest-progress `Infinity` bug | *Already done this session.* | ✅ |

**P1 total: ~5–6 hours.** → **⚑ SOFT LAUNCH.** Live, honest, quietly collecting data. Don't promote yet.

---

## P2 — Rebuild the lesson experience
**The work that makes this impressive rather than adequate.** Biggest chunk; highest payoff for the portfolio goal.

> **D2 + D3 + D7 are one piece of work.** Doing any one properly forces the other two. Decide them together.

| ID | Fix | Why | Effort |
|---|---|---|---|
| **P2-1** | **Restructure the content model** in `lessons.ts` — distinct types for command / shortcut / concept; headings, lists, callouts and code blocks as first-class | 26 of 64 "commands" are categories or key combos stuffed into a single slot, producing "Learn the `Terminal Multiplexers` command." The intro formatter is `split('\\n\\n') → <p>` — there is no structure to design with. | 1–1.5 days |
| **P2-2** | **Rebuild the lesson page as persistent two-pane** — instruction beside doing, scrollable, with a sticky progress rail. Kill the stepper. | Category convention (Codecademy uses 2–5 persistent panes, narration always first). The stepper hides the command exactly when the learner needs it, and mathematically guarantees the 567px dead space. | 1–1.5 days |
| **P2-3** | **Build real command validation** against `expectedCommand` | The field already exists and is unused. Codecademy auto-grades exercises and reserves self-marking for ungradeable *projects*; you self-attest everything. **This is also the decision about whether your competitive position exists** — without it you're notes competing with free notes. | 1–2 days |
| **P2-4** | Reading typography: a real reading typeface, 65–70ch measure, proper type scale | Currently the system **UI** font at 86 characters per line. | 2–3 h |
| **P2-5** | Replace the hand-rolled regex markdown + `dangerouslySetInnerHTML` with the existing `MarkdownContent` / `react-markdown` | Already a dependency. Current parser drops list structure and is fragile. | 2–3 h |
| **P2-6** | Quiz: gate progression, persist scores (wire up the unused `updateQuizScore`) | Quiz currently gates nothing and discards results — the "quizzes lock in the basics" claim is unimplemented. | 3–4 h |
| **P2-7** | Split `lessons/[id]/page.tsx` (776 lines) | Reviewed by humans deciding whether to hire you. Most defect-dense file in the project. | folded into P2-2 |

**P2 total: ~4–6 days.** This is the real project.

---

## P3 — Make it spread
**Cheap, high-leverage, directly serves the goal.**

| ID | Fix | Why | Effort |
|---|---|---|---|
| **P3-1** | **Add the asks to `/completion`** — LinkedIn share, testimonial prompt, email capture, follow link | **Highest return-per-hour item in this document.** Peak goodwill, currently says "Back to Home." Serves four stated goals at once — and it's the legitimate cure for the fake-social-proof problem. | 3–4 h |
| **P3-2** | Public verifiable certificate page (`/certificate/[id]`) + Add-to-LinkedIn | Category standard (Coursera, Codecademy) **and** a distribution loop: every finisher's LinkedIn credential links back. Render the `certificateId` that's already accepted and dropped. | 4–6 h |
| **P3-3** | Cheat sheet as email-gated lead magnet at lesson 3–5 | A 64-command reference currently locked behind 20/20 — reachable only by people who no longer need it. You already built the asset. | 2–3 h |
| **P3-4** | Milestone rewards at lessons 5 and 10 | All-or-nothing means stalling at 13 earns nothing. | 2 h |
| **P3-5** | Certificate: real name (needs the name field, D8), real completion date, drop the unmeasured "Mastered in 2 hours", fix the nonexistent `font-script` class | The artefact most likely to be seen by other people. | 2 h |

**P3 total: ~1.5–2 days.**

---

## P4 — Content quality
**The gap between "a nice project" and "a course worth recommending."**

| ID | Fix | Why | Effort | Decision |
|---|---|---|---|---|
| **P4-1** | **Technical accuracy pass over all 20 lessons** | Never audited. Confirmed live example: lesson 18's prompt says "use apt **or** brew" while `expectedCommand` is `apt search curl` — a Mac user doing the right thing is marked wrong. BSD vs GNU differences (`sed -i`, `ls`, `head`) will bite beginners on lesson 3 and lose them permanently. | 1 day | — |
| **P4-2** | **Lessons 13–20: rewrite or cut** | Lesson 10's intro is 16 words. Lessons 17–20 have one exercise each. Lesson 20 crams shortcuts + screen + tmux + job control into "6 min", gives the answer in the prompt, and summarises content it never taught. | 2–3 days (rewrite) / 0.5 day (cut) | **D6** |
| **P4-3** | Replace the 12 bracketed fake outputs (`[Creates new screen session…]`) with real terminal output | Teaching fake output makes beginners think they did it wrong. | 2 h | — |
| **P4-4** | Per-lesson durations computed from content, or removed | All 20 hardcode `duration: 6`. It's where "2 hours" comes from. | 1 h | — |
| **P4-5** | Add a capstone to the final lesson | The course currently ends by introducing three new hard topics rather than consolidating 19 lessons. | 4 h | — |

**P4 total: ~2–4 days depending on D6.**

> **Recommendation on D6:** given polish beats completeness for a portfolio, **cut to a tight 12–14 lessons ending on a real capstone.** A short excellent course is a better thing to show than 20 lessons ending on "Clear the terminal screen (try Ctrl+L)."

---

## P5 — Positioning and polish
**Do before the hard launch.**

> **Status, 22 Oct 2026:** P5-1, P5-2, P5-3, P5-4, P5-5, P5-6, P5-7 and P5-9 are done (landing page, lesson index and lesson pages rebuilt; see REBUILD.md). P5-1 still needs a real photo at `public/author.jpg` (set it in `src/lib/author.ts`). P5-8 waits on accounts (P1-1).

| ID | Fix | Why | Effort | Decision |
|---|---|---|---|---|
| **P5-1** | **Hero = the founder story, with your name and face** | "I could ship projects with AI, but I felt like a fraud when it came to the terminal" is the best sentence on the site, buried in section 6 of 8, signed by a placeholder. It's the one thing no competitor can copy. | 2–3 h | — |
| **P5-2** | **Primary CTA → "Start Lesson 1"**; reframe accounts as optional progress-saving | Signup gates nothing now; the loudest action leads nowhere useful while "Browse all 20 lessons" is a text link. | 1 h | **D1** |
| **P5-3** | **Live mini-terminal in the hero** — type `pwd`, see it work | Proves the promise in 5 seconds with no signup. The highest-converting single addition, and the thing you'd film for YouTube. | 1 day | — |
| **P5-4** | Reposition around "even senior engineers can't use the terminal" | Serves both audiences — a sting for experienced devs, permission for beginners. Far better content hook than "beginner course." | 2 h | — |
| **P5-5** | Cut the landing page from 7.7 screens to ~3; deep-link the six curriculum cards to their lessons | Three near-duplicate value-prop sections; six cards all pointing at the same generic index. | 3–4 h | — |
| **P5-6** | **Terminal-native visual identity** — monospace display type, terminal palette, cursor motif, box-drawing rules | A terminal course that looks like generic Tailwind SaaS. Distinctiveness is what gets shared, and generic doesn't travel. | 1–2 days | **D4** |
| **P5-7** | Lesson index: group under the six categories, "Start with Lesson 1" hero, kill the "New" badge + per-card "6m" + the dead "In Progress" filter | An inventory, not an invitation. Shows no arc. | 4 h | — |
| **P5-8** | GitHub OAuth as primary sign-in + name field | One click, no verification round trip, perfect audience fit — and the name field fixes the blank certificate at source. | 4 h | **D8** |
| **P5-9** | SEO: per-lesson metadata, all 20 lessons in `sitemap.ts`, server-render lesson content | No lesson content is indexable; `/lessons` is submitted at priority 0.8 and every page is `'use client'`. | 4–6 h | — |

**P5 total: ~3–5 days.** → **⚑ HARD LAUNCH.**

---

## Not yet audited
Dimensions deliberately out of scope so far. Flagged so they aren't lost.

| Area | Why it matters | Recommended |
|---|---|---|
| **Pedagogy — does it actually teach?** | It's a *course* and nobody has audited retention. No spaced review, no cumulative recall, quizzes discard results, practice is unverified. Someone could click through in 40 minutes and retain nothing — and still get "Terminal Master Achieved." | **Yes** — its own pass |
| **Technical accuracy** | See P4-1. A terminal course with wrong flags is worse than none. | **Yes** — already P4-1 |
| **Performance** | `/lessons/[id]` ships **457KB** First Load JS for what is essentially text. It's the page everyone lands on. | Worth a look |
| **Retention / lifecycle** | No email, streak, reminder or re-entry point. Most courses lose people around lesson 3 and you'd never know. | After analytics |
| **No-JS / slow connections** | Everything is client-rendered; nothing renders before JS. Also why Google sees almost no content. | Folded into P5-9 |
| **Maintenance** | Command output drifts (frozen `Sep 21 2025` date). Who updates this in a year? | Low |
| **Privacy / GDPR** | Policy claims analytics you don't run (becomes true after P1-3); no cookie disclosure despite Supabase auth cookies. | Low |

---

## Open decisions

These gate real work. **D2/D3/D7 are one decision.**

| # | Decision | Recommendation |
|---|---|---|
| **D1** | Hero CTA → lesson 1, accounts optional? | **Yes** — signup gates nothing |
| **D2/D3/D7** | Rebuild lesson page on a new content model, with real validation? | **Yes** — category convention, and it's whether your competitive position exists at all |
| **D4** | Terminal-native visual identity? | **Yes** — generic doesn't get shared, and sharing is the strategy |
| **D5** | Public verifiable certificate page? | **Yes** — standard + free distribution |
| **D6** | Rewrite lessons 13–20, or cut to 12–14? | **Cut** — polish beats completeness for a portfolio |
| **D8** | GitHub OAuth + name field? | **Yes** — fixes the certificate at source |
| **D-domain** | Register a domain, or use the free subdomain? | Free subdomain to start; `terminal-mastery.com` is still available |

---

## If you only did ten things

Ordered by return per hour, assuming the goal:

1. **P0-1 / P0-2** — delete the fabricated rating and "join thousands" *(10 min, removes a job-costing risk)*
2. **P1-3** — analytics *(2 h, without it there is no traction story)*
3. **P3-1** — the asks on `/completion` *(3 h, serves four goals, earns real testimonials)*
4. **P1-1 / P1-2** — backend + deploy *(3 h, nothing matters until it's live)*
5. **P5-1** — your story and face in the hero *(3 h, the one thing nobody can copy)*
6. **P5-2** — CTA to lesson 1 *(1 h)*
7. **P0-5** — fix lesson 8's broken screens *(2 h)*
8. **P2-3** — real command validation *(1–2 days, the differentiator)*
9. **P4-1** — technical accuracy pass *(1 day, protects everything else)*
10. **P5-3** — live terminal in the hero *(1 day, the demo and the YouTube shot)*

Roughly **2 weeks of focused work** to go from "abandoned project with invented numbers" to something worth pointing an employer at.

---

## Handoff — what needs your login (P1)

My half of P1 is done and verified. These four steps need accounts I can't create.

### 1. Supabase (~10 min)
1. Create a project at [supabase.com](https://supabase.com) — pick a region near you
2. SQL Editor → run `database/schema.sql`, then `database/migration-fix-progress-tracking.sql`
3. Settings → API → copy the **Project URL** and **anon public** key
4. Paste both into `.env.local` (replacing the dead ones)
5. Verify: `node test-progress-20-lessons.js` → expects "Found 20 lessons in database"

### 2. PostHog (~5 min)
1. Sign up at [posthog.com](https://posthog.com) — free tier is 1M events/month
2. Project Settings → copy the **Project API Key**
3. Add to `.env.local`: `NEXT_PUBLIC_POSTHOG_KEY=phc_...`
4. Analytics no-ops entirely while this is unset, so nothing breaks before you do this

### 3. Netlify (~10 min)
1. [netlify.com](https://netlify.com) → Add new site → Import from GitHub → `muskii1z/Terminal-Mastery`
2. Build settings are read from `netlify.toml` — don't override them
3. Site configuration → Environment variables, add all four:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_SITE_URL` ← set to your `*.netlify.app` URL once Netlify assigns it
4. Deploy, then redeploy after setting `NEXT_PUBLIC_SITE_URL` so metadata picks it up

### 4. Check it worked
- Open the live URL, click through two lessons, mark one complete
- PostHog → Activity should show `lesson_started` and `lesson_completed`
- Paste the URL into LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) to confirm the OG card renders
- `curl https://your-site.netlify.app/sitemap.xml` should show the real domain, not localhost

**Then you're soft-launched.** Live, honest, measured. Don't promote yet — that waits for P2–P4.
