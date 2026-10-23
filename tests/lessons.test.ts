import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { toText } from '../src/lib/shell/shell';
import { LESSONS, TOTAL_MINUTES } from '../src/lessons';
import { COURSE } from '../src/lessons/summary';
import { play, shellFor, type Step } from './harness';

/**
 * Every lesson, played start to finish the way a learner would, plus checks
 * that what the lessons *say* the terminal prints is what it actually prints.
 */

const SOLUTIONS: Record<string, Step[]> = {
  '1': ['whoami', 'date', 'echo Sam', 'whomai', { interrupt: 'ls' }, 'clear', { manual: 'real-terminal' }],
  '2': [
    'pwd',
    'ls',
    'ls -a',
    'cd projects',
    'cd ..',
    { tab: 'cd pro' },
    'cd /tmp',
    'cd',
    'cd -',
    'cd',
    'cd Projects',
    'cd projects/game/levels/bonus',
  ],
  '3': [
    'mkdir notes',
    'mkdir -p projects/blog/posts',
    'touch notes/ideas.txt',
    'cat documents/todo.txt',
    'echo "Learn the terminal" > notes/ideas.txt',
    'echo "Build something" >> notes/ideas.txt',
    'mkdir -p projects/portfolio/images',
    'touch projects/portfolio/index.html projects/portfolio/about.html',
    'echo "<h1>Hello</h1>" > projects/portfolio/index.html',
  ],
  '4': [
    'cp downloads/report-final.pdf documents',
    'cp -r projects/site projects/site-backup',
    'mv downloads/photo.jpg documents',
    'mv documents/resume.pdf documents/cv.pdf',
    'rm downloads/report-draft.pdf',
    'rm -r projects/site-backup',
    'ls downloads',
    'rm downloads/report-final.pdf downloads/setup.tmp',
  ],
  '5': ['cat notes.txt', 'head -n 5 logs/server.log', 'tail -n 3 logs/server.log', 'wc -l logs/server.log', { manual: 'less' }, 'tail logs/server.log'],
  '6': [
    'ls photos/*.png',
    'echo photos/*.jpg',
    'ls photos/IMG_00?.jpg',
    'ls photos/screenshot-[13].png',
    'mkdir photos/png',
    'mv photos/*.png photos/png',
    'ls downloads/*.tmp',
    'rm downloads/*.tmp',
    'mv downloads/invoice-* documents',
  ],
  '7': [
    'ls data > data/contents.txt',
    'ls data | wc -l',
    'sort data/names.txt',
    'sort data/names.txt | uniq',
    'sort data/names.txt | uniq -c',
    'sort data/visitors.txt | uniq -c | sort -rn',
    'sort data/visitors.txt | uniq -c | sort -rn | head -n 1 > data/top-visitor.txt',
  ],
  '8': [
    'grep ERROR logs/app.log',
    'grep -in todo notes.txt',
    'grep -c ERROR logs/app.log',
    'grep -r TODO projects',
    'find projects -name config.json',
    'grep -r API_KEY projects',
    'cat projects/shop/src/checkout.js',
  ],
  '9': [
    'ls -l scripts',
    './scripts/hello.sh',
    'chmod +x scripts/hello.sh',
    './scripts/hello.sh',
    'chmod 600 diary.txt',
    'chmod 777 /etc/hosts',
    'cat scripts/backup.sh',
    'chmod +x scripts/backup.sh',
    './scripts/backup.sh',
  ],
  '10': [
    { save: 'notes.txt', content: 'Things to learn:\n- the terminal\n- nano\n' },
    { save: 'todo.txt', content: 'water the plants\ncall the bank\n' },
    { save: 'shopping.txt', content: 'eggs\nmilk\nbread\n' },
    { save: 'config/settings.conf', content: 'theme=light\ndebug=false\nport=8080\n' },
    'cat config/settings.conf',
  ],
  '11': [
    'ps aux',
    'ps aux | grep python',
    'kill 1874',
    'kill 2046',
    'ps aux',
    'kill -9 2046',
    { manual: 'top' },
    'df -h',
    'du -sh *',
    'du -sh logs/*',
    'rm logs/debug.log',
    'df -h',
  ],
  '12': [
    'ls',
    'cat notes.txt',
    'history',
    'pwd',
    '!!',
    "alias ll='ls -la'",
    'll',
    'NAME=Sam',
    'echo $NAME',
    'which grep',
    "alias proj='cd ~/projects/app && ls'",
    'cd ~',
    'proj',
  ],
  '13': [
    'cd handoff',
    'ls -la',
    'mkdir src docs assets',
    'mv *.js src',
    'mv *.md docs',
    'mv *.png assets',
    'rm *.tmp',
    'rm .DS_Store',
    'grep -r TODO src | wc -l',
    'grep -ri password src',
    { save: 'config.conf', content: 'debug=false\nport=3000\n' },
    'cat deploy.sh',
    'chmod +x deploy.sh',
    './deploy.sh',
    'echo "Sorted files into src, docs and assets" > docs/CLEANUP.md',
    'echo "Deleted the tmp files and .DS_Store" >> docs/CLEANUP.md',
    'echo "server.js has a password in the code: move it out" >> docs/CLEANUP.md',
  ],
};

test('the course hangs together', () => {
  assert.equal(LESSONS.length, COURSE.lessons, 'update COURSE in src/lessons/summary.ts');
  assert.equal(Math.round(TOTAL_MINUTES / 60), COURSE.hours, 'update COURSE in src/lessons/summary.ts');
  const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
  assert.match(manifest.description, new RegExp(`${COURSE.lessons} hands-on lessons, about ${COURSE.hours} hours`), 'update public/manifest.json');
  LESSONS.forEach((lesson, i) => {
    assert.equal(lesson.number, i + 1, `lesson ${lesson.id} is numbered ${lesson.number}`);
    assert.equal(lesson.id, String(i + 1));
    const following = LESSONS[i + 1];
    if (following) {
      assert.deepEqual(lesson.next, { id: following.id, title: following.title }, `lesson ${lesson.id} points at the wrong next lesson`);
    } else {
      assert.equal(lesson.next, undefined);
    }
  });
});

for (const lesson of LESSONS) {
  test(`lesson ${lesson.id}: structure`, () => {
    assert.ok(lesson.commands.length > 0, 'lists its commands');
    assert.ok(lesson.sections.length >= 4 && lesson.sections.length <= 9, `has ${lesson.sections.length} steps`);

    const taskIds = lesson.sections.flatMap((s) => s.tasks.map((t) => t.id));
    assert.equal(new Set(taskIds).size, taskIds.length, 'task ids are unique');
    assert.equal(new Set(lesson.sections.map((s) => s.id)).size, lesson.sections.length, 'step ids are unique');
    // A step may be reading only, but most steps should give you something to do.
    assert.ok(lesson.sections.filter((s) => s.tasks.length === 0).length <= 1, 'at most one reading-only step');

    assert.ok(lesson.quiz.length >= 4, 'has a quiz');
    for (const q of lesson.quiz) {
      assert.ok(q.correctAnswer >= 0 && q.correctAnswer < q.options.length, `${q.id} answer is one of the options`);
      assert.equal(new Set(q.options).size, q.options.length, `${q.id} has distinct options`);
    }
  });

  test(`lesson ${lesson.id}: nothing is done before you start`, () => {
    const { doneAtStart } = play(lesson, []);
    assert.deepEqual(doneAtStart, []);
  });

  test(`lesson ${lesson.id}: the reference solution completes every task`, () => {
    const steps = SOLUTIONS[lesson.id];
    assert.ok(steps, 'has a reference solution');
    const { missing, log } = play(lesson, steps);
    assert.deepEqual(missing, [], `not completed: ${missing.join(', ')}\n\n${log.join('\n')}`);
  });

  test(`lesson ${lesson.id}: examples print what the lesson says`, () => {
    const stampless = (text: string) => text.replace(/[A-Z][a-z]{2} [ \d]\d \d\d:\d\d/g, 'DATE');
    for (const section of lesson.sections) {
      for (const block of section.blocks) {
        if (block.type !== 'example' || block.context) continue;
        const shell = shellFor(lesson);
        const result = shell.run(block.command);
        // Grey notes are the practice terminal's own coaching, not something bash prints.
        const printed = result.lines
          .filter((l) => !l.every((s) => s.tone === 'muted'))
          .map(toText)
          .join('\n');
        assert.equal(
          stampless(printed),
          stampless(block.output ?? ''),
          `${section.id}: ${block.command}`
        );
      }
    }
  });
}

test('wrong answers don’t pass', () => {
  const byId = (id: string) => LESSONS.find((l) => l.id === id)!;

  // * would include IMG_010 to IMG_012
  assert.ok(!play(byId('6'), ['ls photos/IMG_0*.jpg']).done.has('question'));
  // Saving the whole ranking isn't saving the top line
  assert.ok(!play(byId('7'), ['sort data/visitors.txt | uniq -c | sort -rn > data/top-visitor.txt']).done.has('save-top'));
  // uniq without sort leaves duplicates
  assert.ok(!play(byId('7'), ['uniq data/names.txt']).done.has('uniq'));
  // A polite kill isn't enough for the stuck process
  assert.ok(!play(byId('11'), ['kill 2046']).done.has('kill-python'));
  // Deleting the videos frees space but isn't the answer
  assert.ok(!play(byId('11'), ['rm -r videos']).done.has('free-space'));
  // bash script.sh runs it without fixing the permission
  const bashRun = play(byId('9'), ['bash scripts/hello.sh']);
  assert.ok(!bashRun.done.has('chmod-x'));
  // Deleting the config isn't fixing it
  assert.ok(!play(byId('10'), ['rm config/settings.conf']).done.has('debug-off'));
  // * skips .DS_Store
  assert.ok(!play(byId('13'), ['cd handoff', 'rm *']).done.has('clean'));
});
