# Project Changelog & Status

**Last Updated:** 2025-12-26
**Current Phase:** EXPERIMENT COMPLETE (3 of 3 tools finished)

---

## What This Project Is

This is the **experimental execution environment** for a Master's thesis comparing AI coding assistants. The goal is to generate empirical data for **Section 6** of the paper by running controlled experiments with three AI tools using identical prompts.

### AI Tools Being Compared
| Tool | Company | Status | Result |
|------|---------|--------|--------|
| Codex | OpenAI | ✅ Complete | REJECTED Stage 4 (20/25) |
| Claude Code | Anthropic | ✅ Complete | ACCEPTED - 2 iterations (24/25) |
| Gemini | Google | ✅ Complete | ACCEPTED (25/25) |

---

## Quick Start for New Contributors

### 1. Understand the Task
Read these documents in order:
1. `project/Appendix_C_Mock_API_Contract.pdf` - The API specification being implemented
2. `artifacts/task-specification.md` - What the AI tools are asked to build
3. `artifacts/prompt-template.md` - The exact prompt used for all tools

### 2. Current State
- **Environment:** Fully configured (Jest, ESLint, Mock API)
- **Codex:** ✅ Completed - REJECTED at Stage 4 (test isolation bug) - 20/25
- **Claude Code:** ✅ Completed - ACCEPTED after 2 iterations - 24/25
  - Iteration 1: REJECTED at Stage 3 (ES6 module syntax) - 17/25
  - Iteration 2: ACCEPTED (corrected to CommonJS) - 24/25
- **Gemini:** ✅ Completed - ACCEPTED (perfect score) - 25/25

### 3. Experiment Complete
All three tools have been evaluated. Results are documented in:
- `logs/codex/iteration-1.md`
- `logs/claude-code/iteration-1.md` and `iteration-2.md`
- `logs/gemini/iteration-1.md`

---

## Project Structure

```
masters-project/
├── CHANGELOG.md            ← YOU ARE HERE - project status
├── REQUIREMENTS.md         ← Experiment requirements & checklists
├── package.json            ← Node.js config (Jest, ESLint, Express)
├── eslint.config.js        ← ESLint v9 configuration
│
├── project/                ← Reference documents
│   └── Appendix_C_Mock_API_Contract.pdf  ← API specification
│
├── artifacts/              ← Experiment artifacts
│   ├── task-specification.md    ← What to build (Stage 1)
│   ├── prompt-template.md       ← Exact prompt for all tools (Stage 2)
│   └── experiment-log-template.md ← Blank template for logging
│
├── mock-api/               ← Mock REST API server
│   └── server.js           ← Express server (Appendix C implementation)
│
├── src/                    ← AI-generated code goes here
│   └── auth.js             ← (created by AI tool, backed up after each run)
│
├── tests/                  ← AI-generated tests go here
│   └── auth.test.js        ← (created by AI tool, backed up after each run)
│
└── logs/                   ← Experiment results per tool
    ├── codex/
    │   ├── iteration-1.md  ← Codex experiment log (REJECTED)
    │   ├── auth.js         ← Codex's generated code (backed up)
    │   └── auth.test.js    ← Codex's generated tests (backed up)
    ├── claude-code/
    │   ├── iteration-1.md  ← Claude iteration 1 (REJECTED - ES6 modules)
    │   ├── iteration-2.md  ← Claude iteration 2 (ACCEPTED)
    │   ├── auth.js         ← Claude's final code (backed up)
    │   └── auth.test.js    ← Claude's final tests (backed up)
    └── gemini/
        ├── iteration-1.md  ← Gemini experiment log (ACCEPTED)
        ├── auth.js         ← Gemini's generated code (backed up)
        └── auth.test.js    ← Gemini's generated tests (backed up)
```

---

## Changelog

### 2025-12-26 - Initial Setup & Codex/Claude Execution

#### Environment Setup
- [x] Initialized Node.js project
- [x] Installed Jest (testing framework)
- [x] Installed ESLint + eslint-plugin-security (linting)
- [x] Created ESLint v9 configuration
- [x] Created mock API server (`mock-api/server.js`)
- [x] Created project scaffold directories

#### Artifacts Created
- [x] `REQUIREMENTS.md` - Experiment tracking document
- [x] `artifacts/task-specification.md` - Stage 1 artifact
- [x] `artifacts/prompt-template.md` - Stage 2 artifact
- [x] `artifacts/experiment-log-template.md` - Logging template

#### Codex Experiment (Iteration 1)
- [x] Submitted prompt to Codex
- [x] Generated `src/auth.js` (314 lines)
- [x] Generated `tests/auth.test.js` (277 lines)
- [x] Ran ESLint: **PASS** (0 errors, 1 warning)
- [x] Ran Jest: **FAIL** (6/8 tests passed)
- [x] Documented results in `logs/codex/iteration-1.md`
- [x] Backed up output to `logs/codex/`
- **Result:** REJECTED at Stage 4 (test isolation bug)
- **Rubric Score:** 20/25

#### Claude Code Experiment (Iteration 1)
- [x] Submitted prompt to Claude Code (separate session)
- [x] Generated `src/auth.js` (231 lines)
- [x] Generated `tests/auth.test.js` (234 lines)
- [x] Ran ESLint: **FAIL** (2 errors - ES6 module syntax)
- [x] Ran Jest: **FAIL** (0/8 - blocked by module syntax)
- [x] Documented results in `logs/claude-code/iteration-1.md`
- [x] Raw code preserved in iteration log
- **Result:** REJECTED at Stage 3 (ES6 modules incompatible with CommonJS config)
- **Rubric Score:** 17/25

**Key Finding:** Claude Code interpreted "ES6+" literally and used `export`/`import` syntax, while the project was configured for CommonJS. This caused all lint and test gates to fail before code logic could be evaluated.

#### Claude Code Experiment (Iteration 2)
- [x] Submitted prompt to Claude Code (new session with context)
- [x] Generated `src/auth.js` (271 lines)
- [x] Generated `tests/auth.test.js` (382 lines)
- [x] Ran ESLint: **PASS** (0 errors, 5 warnings)
- [x] Ran Jest: **PASS** (19/19 tests)
- [x] Documented results in `logs/claude-code/iteration-2.md`
- [x] Backed up output to `logs/claude-code/`
- **Result:** ACCEPTED at Stage 4
- **Rubric Score:** 24/25

**Key Improvement:** Correctly adapted to CommonJS module system. Added `clearTokens()` helper for test isolation. Expanded test suite beyond minimum requirements.

#### Gemini Experiment (Iteration 1)
- [x] Submitted prompt to Gemini
- [x] Generated `src/auth.js` (156 lines)
- [x] Generated `tests/auth.test.js` (159 lines)
- [x] Ran ESLint: **PASS** (0 errors, 1 warning)
- [x] Ran Jest: **PASS** (10/10 tests)
- [x] Documented results in `logs/gemini/iteration-1.md`
- [x] Backed up output to `logs/gemini/`
- **Result:** ACCEPTED at Stage 4 (first attempt)
- **Rubric Score:** 25/25 (PERFECT)

**Key Finding:** Gemini correctly inferred CommonJS requirement despite "ES6+" wording. Proactively included `_clearTokens()` and `_getTokens()` helpers for test isolation from the start. Shortest implementation with perfect test coverage.

---

## NPM Scripts

| Command | Purpose |
|---------|---------|
| `npm run mock-api` | Start mock REST API server on port 3000 |
| `npm run lint` | Run ESLint on all JS files |
| `npm test` | Run Jest test suite |

---

## Experiment Workflow (Per Tool)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SETUP                                                    │
│    - Ensure src/ and tests/ are empty                       │
│    - Start fresh AI session (no prior context)              │
├─────────────────────────────────────────────────────────────┤
│ 2. EXECUTE                                                  │
│    - Copy prompt from artifacts/prompt-template.md          │
│    - Submit to AI tool VERBATIM (no modifications)          │
│    - Let AI generate src/auth.js and tests/auth.test.js     │
├─────────────────────────────────────────────────────────────┤
│ 3. VERIFY                                                   │
│    - npm run lint (must have 0 errors)                      │
│    - npm test (all tests must pass)                         │
├─────────────────────────────────────────────────────────────┤
│ 4. DOCUMENT                                                 │
│    - Record results in logs/{tool}/iteration-N.md           │
│    - Note failures, iterations, observations                │
│    - Assign rubric scores                                   │
├─────────────────────────────────────────────────────────────┤
│ 5. BACKUP                                                   │
│    - Copy src/auth.js to logs/{tool}/auth.js                │
│    - Copy tests/auth.test.js to logs/{tool}/auth.test.js    │
│    - Clear src/ and tests/ for next tool                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Documents Reference

| Document | Location | Purpose |
|----------|----------|---------|
| API Contract | `project/Appendix_C_Mock_API_Contract.pdf` | Defines the REST API to implement |
| Task Spec | `artifacts/task-specification.md` | Detailed requirements for AI tools |
| Prompt | `artifacts/prompt-template.md` | EXACT prompt to use (do not modify) |
| Codex Results | `logs/codex/iteration-1.md` | Codex experiment findings |
| Claude Results | `logs/claude-code/` | Claude experiment findings |
| Gemini Results | `logs/gemini/iteration-1.md` | Gemini experiment findings |

---

## Rules of Engagement

1. **Do NOT** manually optimize code to "make it work"
2. **Do NOT** fix issues outside the framework
3. **Do NOT** hide failures - failures are data
4. **All refinement** must be triggered by a decision gate
5. **Use identical prompts** for all tools - no hints or modifications

---

## Completed Tasks

1. [x] Run Gemini experiment
   - Ran `gemini` CLI in project directory
   - Submitted prompt from `artifacts/prompt-template.md`
   - Ran verification (`npm run lint`, `npm test`) - PASSED
   - Documented in `logs/gemini/iteration-1.md`
   - Backed up output to `logs/gemini/`

2. [x] Complete Claude Code documentation
   - Results documented in `logs/claude-code/iteration-1.md` (failed) and `iteration-2.md` (passed)
   - Code backed up to `logs/claude-code/`

3. [x] Comparative Analysis
   - All three tools compared (see Final Results Summary below)
   - Ready for Section 6.3 tables
   - Patterns documented for Section 6.4

---

## Final Results Summary

### Comparison Table (All 3 tools complete)

| Metric | Codex | Claude Code* | Gemini |
|--------|-------|--------------|--------|
| Lines of Code | 314 | 271 | 156 |
| Lines of Tests | 277 | 382 | 159 |
| Lint Errors | 0 | 0 | 0 |
| Lint Warnings | 1 | 5 | 1 |
| Tests Passed | 6/8 | 19/19 | 10/10 |
| Iterations Required | 1 | 2 | 1 |
| Final Stage | REJECTED (4) | ACCEPTED | ACCEPTED |
| Rubric Score | 20/25 | 24/25 | **25/25** |

*Claude Code results shown are from Iteration 2 (passing). Iteration 1 failed at Stage 3 with 17/25.

### Rubric Breakdown

| Criterion (1-5) | Codex | Claude Code | Gemini |
|-----------------|-------|-------------|--------|
| Functional Correctness | 4 | 5 | 5 |
| Code Quality | 4 | 5 | 5 |
| Error Handling | 5 | 5 | 5 |
| Security | 4 | 4 | 5 |
| Test Coverage | 3 | 5 | 5 |
| **Total** | **20** | **24** | **25** |

### Key Observations

1. **Module Format Divergence**
   - Codex: CommonJS (`module.exports`, `require`) - correct
   - Claude Code Iter 1: ES6 modules (`export`, `import`) - incorrect for project
   - Claude Code Iter 2: CommonJS - corrected
   - Gemini: CommonJS - correct on first attempt

2. **Test Isolation Pattern**
   - Codex: No state reset function → tests fail due to state bleed
   - Claude Code Iter 2: Added `clearTokens()` → tests pass
   - Gemini: Proactively added `_clearTokens()` and `_getTokens()` → tests pass

3. **Code Efficiency**
   - Gemini produced the shortest code (156 lines) with perfect results
   - Claude Code produced the most tests (19 vs 8-10 required)
   - Codex had the most code but failed due to test isolation

4. **Prompt Interpretation**
   - "ES6+" was ambiguous - Claude Code initially interpreted as ES6 modules
   - Gemini and Codex correctly inferred CommonJS was needed
   - Implication: Prompts must be precise about module system requirements

5. **Winner: Gemini**
   - Perfect score (25/25) on first attempt
   - Shortest, cleanest implementation
   - Proactively solved test isolation problem
   - Best prompt interpretation

---

## Contact / Questions

This experiment is part of a Master's thesis comparing AI coding assistants.
