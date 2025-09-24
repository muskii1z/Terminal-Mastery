-- Complete seed data for all 20 lessons
-- Generated from frontend data

INSERT INTO lessons (id, title, slug, duration_min, sort_order, content_md) VALUES
  ('1', 'Getting Started with the Terminal', 'getting-started-with-the-terminal', 3, 1, '# Getting Started with the Terminal

Learn and practice getting started with the terminal.

*Full lesson content will be populated from the frontend data.*'),
  ('2', 'Navigation Basics (pwd, ls, cd)', 'navigation-basics-pwd-ls-cd', 3, 2, '# Navigation Basics (pwd, ls, cd)

Learn and practice navigation basics (pwd, ls, cd).

*Full lesson content will be populated from the frontend data.*'),
  ('3', 'Working with Files: touch, cat, less', 'working-with-files-touch-cat-less', 3, 3, '# Working with Files: touch, cat, less

Learn and practice working with files: touch, cat, less.

*Full lesson content will be populated from the frontend data.*'),
  ('4', 'File Operations: Copy, Move, Delete', 'file-operations-copy-move-delete', 3, 4, '# File Operations: Copy, Move, Delete

Learn and practice file operations: copy, move, delete.

*Full lesson content will be populated from the frontend data.*'),
  ('5', 'Understanding File Permissions', 'understanding-file-permissions', 3, 5, '# Understanding File Permissions

Learn and practice understanding file permissions.

*Full lesson content will be populated from the frontend data.*'),
  ('6', 'Text Viewing: head, tail, more', 'text-viewing-head-tail-more', 3, 6, '# Text Viewing: head, tail, more

Learn and practice text viewing: head, tail, more.

*Full lesson content will be populated from the frontend data.*'),
  ('7', 'Text Search: grep and find', 'text-search-grep-and-find', 3, 7, '# Text Search: grep and find

Learn and practice text search: grep and find.

*Full lesson content will be populated from the frontend data.*'),
  ('8', 'Text Editing: nano Basics', 'text-editing-nano-basics', 3, 8, '# Text Editing: nano Basics

Learn and practice text editing: nano basics.

*Full lesson content will be populated from the frontend data.*'),
  ('9', 'Text Processing: sort, uniq, wc', 'text-processing-sort-uniq-wc', 3, 9, '# Text Processing: sort, uniq, wc

Learn and practice text processing: sort, uniq, wc.

*Full lesson content will be populated from the frontend data.*'),
  ('10', 'Pattern Matching: Wildcards & Regex Basics', 'pattern-matching-wildcards-regex-basics', 3, 10, '# Pattern Matching: Wildcards & Regex Basics

Learn and practice pattern matching: wildcards & regex basics.

*Full lesson content will be populated from the frontend data.*'),
  ('11', 'Process Management: ps, top, kill', 'process-management-ps-top-kill', 3, 11, '# Process Management: ps, top, kill

Learn and practice process management: ps, top, kill.

*Full lesson content will be populated from the frontend data.*'),
  ('12', 'System Info: df, du, free, uname', 'system-info-df-du-free-uname', 3, 12, '# System Info: df, du, free, uname

Learn and practice system info: df, du, free, uname.

*Full lesson content will be populated from the frontend data.*'),
  ('13', 'Network Basics: ping, curl, wget', 'network-basics-ping-curl-wget', 3, 13, '# Network Basics: ping, curl, wget

Learn and practice network basics: ping, curl, wget.

*Full lesson content will be populated from the frontend data.*'),
  ('14', 'Environment Variables: env, export', 'environment-variables-env-export', 3, 14, '# Environment Variables: env, export

Learn and practice environment variables: env, export.

*Full lesson content will be populated from the frontend data.*'),
  ('15', 'Command History: history, !!, aliases', 'command-history-history-aliases', 3, 15, '# Command History: history, !!, aliases

Learn and practice command history: history, !!, aliases.

*Full lesson content will be populated from the frontend data.*'),
  ('16', 'Pipes and Redirection: |, >, >>, <', 'pipes-and-redirection-', 3, 16, '# Pipes and Redirection: |, >, >>, <

Learn and practice pipes and redirection: |, >, >>, <.

*Full lesson content will be populated from the frontend data.*'),
  ('17', 'Archive Management: tar, zip, gzip', 'archive-management-tar-zip-gzip', 3, 17, '# Archive Management: tar, zip, gzip

Learn and practice archive management: tar, zip, gzip.

*Full lesson content will be populated from the frontend data.*'),
  ('18', 'Package Management: apt/brew Basics', 'package-management-aptbrew-basics', 3, 18, '# Package Management: apt/brew Basics

Learn and practice package management: apt/brew basics.

*Full lesson content will be populated from the frontend data.*'),
  ('19', 'Shell Scripting: Basic Bash Scripts', 'shell-scripting-basic-bash-scripts', 3, 19, '# Shell Scripting: Basic Bash Scripts

Learn and practice shell scripting: basic bash scripts.

*Full lesson content will be populated from the frontend data.*'),
  ('20', 'Advanced Tips: screen, tmux, shortcuts', 'advanced-tips-screen-tmux-shortcuts', 3, 20, '# Advanced Tips: screen, tmux, shortcuts

Learn and practice advanced tips: screen, tmux, shortcuts.

*Full lesson content will be populated from the frontend data.*')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  duration_min = EXCLUDED.duration_min,
  sort_order = EXCLUDED.sort_order,
  content_md = EXCLUDED.content_md,
  updated_at = NOW();
