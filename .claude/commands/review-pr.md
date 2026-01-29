---
description: Review pull requests
---

Pull request(s): $ARGUMENTS

- If no PR numbers are provided, ask the user to provide PR number(s).
- At least 1 PR is required.

## TASKS

1. **Retrieve PR Details**
   - Use the GH CLI tool to retrieve the details (descriptions, diffs, comments, feedback, reviews, etc)

2. **Analyze Codebase Impact**
   - Use 3 deepdive subagents to analyze the impact on the codebase

3. **Vision Alignment Check**
   - Read the project's README.md and CLAUDE.md to understand the application's core purpose
   - Assess whether this PR aligns with the application's intended functionality
   - If the changes deviate significantly from the core vision or add functionality that doesn't serve the application's purpose, note this in the review
   - This is not a blocker, but should be flagged for the reviewer's consideration

4. **Safety Assessment**
   - Provide a review on whether the PR is safe to merge as-is
   - Provide any feedback in terms of risk level

5. **Improvements**
   - Propose any improvements in terms of importance and complexity