-- Seed data for lessons table

INSERT INTO lessons (id, title, slug, duration_min, sort_order, content_md) VALUES
  ('1', 'Getting Started with the Terminal', 'getting-started-with-the-terminal', 3, 1, '# Getting Started with the Terminal

Learn what the terminal is and how to open it on different systems.

*Full lesson content will be populated from the frontend data.*'),
  ('2', 'Navigation Basics', 'navigation-basics', 3, 2, '# Navigation Basics

Master the fundamental commands for moving around your file system.

*Full lesson content will be populated from the frontend data.*'),
  ('3', 'File Operations', 'file-operations', 3, 3, '# File Operations

Learn to create, copy, move, and delete files and directories.

*Full lesson content will be populated from the frontend data.*'),
  ('4', 'Viewing Files', 'viewing-files', 3, 4, '# Viewing Files

Different ways to view and examine file contents.

*Full lesson content will be populated from the frontend data.*'),
  ('5', 'Search and Find', 'search-and-find', 3, 5, '# Search and Find

Powerful commands to search for files and content.

*Full lesson content will be populated from the frontend data.*')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  duration_min = EXCLUDED.duration_min,
  sort_order = EXCLUDED.sort_order,
  content_md = EXCLUDED.content_md,
  updated_at = NOW();
