#!/usr/bin/env node

// Script to extract lesson data from frontend and generate database seed file
const fs = require('fs');
const path = require('path');

// Function to escape SQL strings
function escapeSqlString(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Read the lessons file
const lessonsPath = path.join(__dirname, 'src/data/lessons.ts');
const lessonsContent = fs.readFileSync(lessonsPath, 'utf8');

// Extract lesson data using regex
const lessonMatches = lessonsContent.match(/{\s*id:\s*'(\d+)',\s*title:\s*'([^']*)',\s*duration:\s*(\d+),/g);

if (!lessonMatches) {
  console.error('Could not find lesson data in the expected format');
  process.exit(1);
}

const lessons = [];
const idMatches = lessonsContent.match(/id:\s*'(\d+)'/g);
const titleMatches = lessonsContent.match(/title:\s*'([^']*)'/g);
const durationMatches = lessonsContent.match(/duration:\s*(\d+)/g);

if (!idMatches || !titleMatches || !durationMatches) {
  console.error('Could not extract lesson data');
  process.exit(1);
}

// Extract data
for (let i = 0; i < Math.min(idMatches.length, titleMatches.length, durationMatches.length); i++) {
  const id = idMatches[i].match(/id:\s*'(\d+)'/)[1];
  const title = titleMatches[i].match(/title:\s*'([^']*)'/)[1];
  const duration = durationMatches[i].match(/duration:\s*(\d+)/)[1];

  // Only include main lessons (id is a simple number, not like 'p1-1' or 'quiz-1')
  if (id && /^\d+$/.test(id)) {
    lessons.push({
      id,
      title,
      duration: parseInt(duration),
      slug: createSlug(title)
    });
  }
}

// Sort by ID
lessons.sort((a, b) => parseInt(a.id) - parseInt(b.id));

console.log(`Found ${lessons.length} lessons:`);
lessons.forEach(lesson => {
  console.log(`- ${lesson.id}: ${lesson.title}`);
});

// Generate SQL
let sql = `-- Complete seed data for all 20 lessons
-- Generated from frontend data

INSERT INTO lessons (id, title, slug, duration_min, sort_order, content_md) VALUES
`;

const values = lessons.map(lesson => {
  const escapedTitle = escapeSqlString(lesson.title);
  const content = `# ${escapedTitle}

Learn and practice ${lesson.title.toLowerCase()}.

*Full lesson content will be populated from the frontend data.*`;

  return `  ('${lesson.id}', '${escapedTitle}', '${lesson.slug}', ${lesson.duration}, ${lesson.id}, '${escapeSqlString(content)}')`;
});

sql += values.join(',\n');
sql += `
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  duration_min = EXCLUDED.duration_min,
  sort_order = EXCLUDED.sort_order,
  content_md = EXCLUDED.content_md,
  updated_at = NOW();
`;

// Write the new seed file
const seedPath = path.join(__dirname, 'database/seed-lessons-complete.sql');
fs.writeFileSync(seedPath, sql);

console.log(`\n✅ Generated complete seed file: ${seedPath}`);
console.log(`📊 Total lessons: ${lessons.length}`);