---
description: "Run tests for a specific file or directory"
---

Run the test suite for $1 and show detailed results.

If no argument is provided, run all tests.

Arguments:
- $1: File or directory path to test (optional)

Example usage:
- `/test-runner src/utils.js` - Run tests for specific file
- `/test-runner src/components/` - Run tests for directory
- `/test-runner` - Run all tests