---
description: "Check code for ESLint errors and warnings"
---

Run ESLint to check for code quality issues, style violations, and potential errors.

First, check @package.json to identify available lint scripts and ESLint configuration.

Try in order:
1. `npm run lint $1` (if lint script exists in package.json)
2. `npx eslint $1` (if ESLint is installed)
3. Check for ESLint config files and run appropriate command

Show both errors and warnings with clear formatting.

Arguments:
- $1: File or directory to lint (optional)
- If no argument provided, lint entire project according to ESLint config

Example usage:
- `/eslintscheck src/components/Button.tsx` - Lint specific file
- `/eslintscheck src/` - Lint directory
- `/eslintscheck` - Lint entire project

The command will automatically detect your ESLint setup and use the appropriate configuration.