---
description: "Check code for parsing errors"
---

Check the code for parsing errors by analyzing syntax and structure.

First, check @package.json to identify the project type and available tools.

If TypeScript is available:
- Run `npx tsc --noEmit $1` to check for TypeScript parsing errors
- If no argument provided, check the entire project

If only JavaScript:
- Run `node --check $1` for syntax validation
- Use appropriate tools based on project setup

Arguments:
- $1: File or directory to check (optional)
- If no argument provided, check entire project

Example usage:
- `/parseme src/components/Button.tsx` - Check specific file
- `/parseme src/` - Check directory
- `/parseme` - Check entire project