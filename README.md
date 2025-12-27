# AI Code Assistant Comparison Study

## Overview

This repository contains the experimental environment for a Master's thesis comparing the code generation capabilities of three AI coding assistants:

- **Codex** (OpenAI)
- **Claude Code** (Anthropic)
- **Gemini** (Google)

The study uses a controlled methodology to evaluate how each tool performs when given identical prompts for a real-world programming task.

---

## Research Question

> How do leading AI coding assistants compare in generating functional, secure, and maintainable code when given identical specifications?

---

## The Experiment

### Task
Each AI tool is asked to generate a **JavaScript authentication module** that:
- Implements user registration, login, logout, and token management
- Interfaces with a REST API (mock server provided)
- Includes client-side validation
- Handles errors gracefully
- Comes with a Jest test suite

### Methodology
1. **Same prompt** - All tools receive identical instructions
2. **No assistance** - No hints, corrections, or help outside the prompt
3. **Automated verification** - ESLint + Jest determine pass/fail
4. **Rubric scoring** - Standardized evaluation criteria (25 points max)

### Workflow Framework
```
Stage 1: Task Specification    → Define what to build
Stage 2: Prompt Template       → Standardized prompt for all tools
Stage 3: Triage                → Lint check, security scan
Stage 4: Verification          → Run tests, evaluate results
```

---

## Current Status

| Tool | Status | Result |
|------|--------|--------|
| Codex | Complete | REJECTED Stage 4 (20/25) |
| Claude Code | Complete | ACCEPTED (24/25) - 2 iterations |
| Gemini | Complete | ACCEPTED (25/25) |

**Experiment Complete.** See `CHANGELOG.md` for detailed results and observations.

---

## Repository Structure

```
masters-project/
│
├── README.md              ← You are here (high-level overview)
├── CHANGELOG.md           ← Detailed progress and results
├── REQUIREMENTS.md        ← Experiment checklists
│
├── project/               ← Thesis documents
│   ├── part-6.pdf         ← Methodology guide
│   └── Appendix_C_*.pdf   ← API specification
│
├── artifacts/             ← Experiment inputs
│   ├── task-specification.md
│   └── prompt-template.md
│
├── mock-api/              ← Test server
│   └── server.js
│
├── src/                   ← AI-generated code
├── tests/                 ← AI-generated tests
│
└── logs/                  ← Results per tool
    ├── codex/
    ├── claude-code/
    └── gemini/
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
npm install
```

### Run Mock API
```bash
npm run mock-api
```

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `CHANGELOG.md` | Current status, results, next steps |
| `REQUIREMENTS.md` | Detailed experiment requirements |
| `artifacts/task-specification.md` | What the AI tools must build |
| `artifacts/prompt-template.md` | Exact prompt (use verbatim) |
| `project/part-6.pdf` | Why this experiment exists |
| `project/Appendix_C_Mock_API_Contract.pdf` | API specification |

---

## Contributing

This is an academic research project. If continuing the experiment:

1. Read `CHANGELOG.md` for current status
2. Follow the workflow in `REQUIREMENTS.md`
3. Use the exact prompt from `artifacts/prompt-template.md`
4. Document results in `logs/{tool}/iteration-N.md`
5. Update `CHANGELOG.md` when complete

---

## Rules

1. **Do NOT modify the prompt** - All tools must receive identical input
2. **Do NOT help the AI** - No hints or corrections outside the framework
3. **Do NOT hide failures** - Failures are valuable data
4. **Document everything** - Raw outputs, errors, observations

---

## License

Academic use only. Part of a Master's thesis research project.
