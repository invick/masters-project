# Codex Experiment Instructions

**Purpose:** Run the Codex (OpenAI) portion of an AI coding assistant comparison study.

---

## Prerequisites

1. Node.js 18+ installed
2. Access to OpenAI Codex (via ChatGPT, OpenAI API, or OpenAI CLI)
3. Project dependencies installed (`npm install` in project root)

---

## Quick Start

### Step 1: Verify Environment

```bash
cd C:\Users\VictorAdams\WebstormProjects\masters-project
npm install
```

### Step 2: Start Fresh

Ensure `src/auth.js` and `tests/auth.test.js` do NOT exist before starting:
```bash
# Delete if they exist
rm src/auth.js tests/auth.test.js 2>/dev/null
```

### Step 3: Launch Codex

Access Codex through your preferred interface:
- **ChatGPT (GPT-4):** https://chat.openai.com
- **OpenAI Playground:** https://platform.openai.com/playground
- **OpenAI CLI:** If installed, run in terminal

### Step 4: Submit the Prompt

Copy the **exact prompt** from `artifacts/prompt-template.md` (the text inside the ``` PROMPT ``` block) and paste it into Codex.

**IMPORTANT RULES:**
- Use the prompt EXACTLY as written - do not modify it
- Do not provide hints or help beyond the prompt
- Do not fix errors manually - failures are valid data

### Step 5: Save Generated Code

Have Codex create:
- `src/auth.js` - The authentication module
- `tests/auth.test.js` - The Jest test suite

Copy the generated code from Codex's response into the appropriate files.

### Step 6: Run Verification

```bash
# Stage 3: Lint check (must have 0 errors to pass)
npm run lint

# Stage 4: Test execution (all tests must pass)
npm test
```

### Step 7: Document Results

Record the following in `logs/codex/iteration-1.md`:
- Raw AI output (copy the generated code)
- Lint results (copy terminal output)
- Test results (copy terminal output)
- Any errors or failures observed

Use the template at `artifacts/experiment-log-template.md` as a guide.

### Step 8: Backup Output

```bash
# Copy generated files to logs folder for preservation
cp src/auth.js logs/codex/auth.js
cp tests/auth.test.js logs/codex/auth.test.js
```

---

## What to Record

| Data Point | Where to Find It |
|------------|------------------|
| Lines of code | Count lines in `src/auth.js` |
| Lines of tests | Count lines in `tests/auth.test.js` |
| Lint errors | `npm run lint` output |
| Lint warnings | `npm run lint` output |
| Tests passed | `npm test` output (X passed, Y failed) |
| Stage failed at | 3 (lint) or 4 (tests) or NONE if all pass |

---

## Rubric Scoring (25 points max)

Score each criterion 1-5:

| Criterion | What to Evaluate |
|-----------|------------------|
| Functional Correctness | Do the functions work as specified? |
| Code Quality | Is it well-structured, readable, documented? |
| Error Handling | Does it handle errors gracefully without throwing? |
| Security | No passwords/tokens logged, proper token handling? |
| Test Coverage | Are all 8 required test cases present and correct? |

---

## Rules of Engagement

1. **Do NOT** modify the prompt in any way
2. **Do NOT** help Codex beyond the initial prompt
3. **Do NOT** manually fix code to make it work
4. **Do NOT** hide failures - document everything
5. **DO** record exact outputs, errors, and observations

---

## Reference Files

| File | Purpose |
|------|---------|
| `artifacts/prompt-template.md` | The exact prompt to use |
| `artifacts/task-specification.md` | Detailed requirements |
| `artifacts/experiment-log-template.md` | Template for documenting results |
| `project/Appendix_C_Mock_API_Contract.pdf` | API specification (for reference) |

---

## If You Need the Mock API Running

Some tests may require the mock API server:

```bash
# In a separate terminal
npm run mock-api
```

This starts the server at `http://localhost:3000`.

---

## When Complete

1. Ensure all results are documented in `logs/codex/iteration-1.md`
2. Ensure generated code is backed up to `logs/codex/`
3. Notify the project lead with your findings

---

## Questions?

Refer to `CHANGELOG.md` for project context or `project/part-6.pdf` for methodology details.
