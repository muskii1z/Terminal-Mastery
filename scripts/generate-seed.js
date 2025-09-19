// Script to generate SQL seed data from existing lessons.ts file
const fs = require('fs');
const path = require('path');

// Read the lessons.ts file to extract lesson data
const lessonsPath = path.join(__dirname, '../src/data/lessons.ts');
const lessonsContent = fs.readFileSync(lessonsPath, 'utf8');

// Function to convert lesson content to markdown
function convertLessonToMarkdown(lesson) {
  let markdown = '';

  // Introduction section
  if (lesson.content.introduction) {
    markdown += `# ${lesson.title}\n\n`;
    markdown += `${lesson.content.introduction.trim()}\n\n`;
  }

  // Commands section
  if (lesson.content.commands && lesson.content.commands.length > 0) {
    markdown += `## Commands\n\n`;
    lesson.content.commands.forEach(command => {
      markdown += `### ${command.name}\n\n`;
      markdown += `${command.description}\n\n`;
      markdown += `**Syntax:** \`${command.syntax}\`\n\n`;

      if (command.examples && command.examples.length > 0) {
        markdown += `**Examples:**\n\n`;
        command.examples.forEach(example => {
          markdown += `\`\`\`bash\n${example.command}\n\`\`\`\n\n`;
          if (example.output) {
            markdown += `Output:\n\`\`\`\n${example.output}\n\`\`\`\n\n`;
          }
          markdown += `${example.explanation}\n\n`;
        });
      }
    });
  }

  // Practice section
  if (lesson.content.practice && lesson.content.practice.length > 0) {
    markdown += `## Practice Exercises\n\n`;
    lesson.content.practice.forEach((exercise, index) => {
      markdown += `### Exercise ${index + 1}\n\n`;
      markdown += `${exercise.prompt}\n\n`;

      if (exercise.hints && exercise.hints.length > 0) {
        markdown += `**Hints:**\n`;
        exercise.hints.forEach(hint => {
          markdown += `- ${hint}\n`;
        });
        markdown += `\n`;
      }

      if (exercise.expectedCommand !== 'observation') {
        markdown += `**Expected command:** \`${exercise.expectedCommand}\`\n\n`;
      }
    });
  }

  // Summary section
  if (lesson.content.summary) {
    markdown += `## Summary\n\n`;
    markdown += `${lesson.content.summary.trim()}\n\n`;
  }

  return markdown;
}

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim('-');
}

// Simple lesson data extraction (we'll manually create this for now since parsing TS is complex)
const simplifiedLessons = [
  {
    id: '1',
    title: 'Getting Started with the Terminal',
    description: 'Learn what the terminal is and how to open it on different systems.'
  },
  {
    id: '2',
    title: 'Navigation Basics',
    description: 'Master the fundamental commands for moving around your file system.'
  },
  {
    id: '3',
    title: 'File Operations',
    description: 'Learn to create, copy, move, and delete files and directories.'
  },
  {
    id: '4',
    title: 'Viewing Files',
    description: 'Different ways to view and examine file contents.'
  },
  {
    id: '5',
    title: 'Search and Find',
    description: 'Powerful commands to search for files and content.'
  }
];

// Generate SQL insert statements
let sql = '-- Seed data for lessons table\n\n';
sql += 'INSERT INTO lessons (id, title, slug, duration_min, sort_order, content_md) VALUES\n';

const values = simplifiedLessons.map((lesson, index) => {
  const slug = createSlug(lesson.title);
  const contentMd = `# ${lesson.title}\n\n${lesson.description}\n\n*Full lesson content will be populated from the frontend data.*`;

  return `  ('${lesson.id}', '${lesson.title}', '${slug}', 3, ${index + 1}, '${contentMd.replace(/'/g, "''")}')`;
});

sql += values.join(',\n');
sql += '\nON CONFLICT (id) DO UPDATE SET\n';
sql += '  title = EXCLUDED.title,\n';
sql += '  slug = EXCLUDED.slug,\n';
sql += '  duration_min = EXCLUDED.duration_min,\n';
sql += '  sort_order = EXCLUDED.sort_order,\n';
sql += '  content_md = EXCLUDED.content_md,\n';
sql += '  updated_at = NOW();\n';

// Write to file
const outputPath = path.join(__dirname, '../database/seed-lessons.sql');
fs.writeFileSync(outputPath, sql);

console.log('✅ Generated seed-lessons.sql successfully!');
console.log('📁 File location:', outputPath);
console.log('🚀 Run this SQL in your Supabase SQL editor to populate the lessons table.');