# AI Code Assistant Evaluation Framework

## Overview

This repository contains a **workflow framework** for evaluating AI coding assistants, developed as part of a Master's thesis. The framework provides a structured, reproducible methodology for assessing AI-generated code quality.

The framework was validated by evaluating three AI coding assistants:
- **Codex** (OpenAI)
- **Claude Code** (Anthropic)
- **Gemini** (Google)

---

## Research Objective

> To develop a systematic framework for evaluating AI coding assistants that ensures consistent, reproducible, and objective assessment of generated code.

---

## The Framework

### Four-Stage Workflow

```
Stage 1: Task Specification    → Define requirements and acceptance criteria
Stage 2: Prompt Template       → Standardized prompt for consistent input
Stage 3: Triage                → Automated checks (lint, security scan)
Stage 4: Verification          → Test execution and rubric scoring
```

### Key Principles

1. **Identical Input** - All tools receive the same prompt verbatim
2. **No Intervention** - No hints, corrections, or assistance outside the framework
3. **Automated Verification** - ESLint and Jest provide objective pass/fail criteria
4. **Standardized Scoring** - 25-point rubric across five dimensions

### Evaluation Rubric

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Functional Correctness | 5 pts | Does the code meet requirements? |
| Code Quality | 5 pts | Structure, readability, documentation |
| Error Handling | 5 pts | Graceful failure, no exceptions thrown |
| Security | 5 pts | Proper handling of sensitive data |
| Test Coverage | 5 pts | Completeness of test suite |

---

## Framework Validation Results

The framework was validated using a JavaScript authentication module task.

| Tool | Result | Score |
|------|--------|-------|
| Codex | REJECTED (Stage 4) | 20/25 |
| Claude Code | ACCEPTED | 24/25 |
| Gemini | ACCEPTED | 25/25 |

Detailed results are available in `logs/` for each tool.

---

## Repository Structure

```
masters-project/
│
├── README.md                 ← Framework overview
├── REQUIREMENTS.md           ← Evaluation requirements
│
├── artifacts/                ← Framework artifacts
│   ├── task-specification.md ← Stage 1: Task definition
│   ├── prompt-template.md    ← Stage 2: Standardized prompt
│   └── experiment-log-template.md
│
├── project/                  ← Reference documents
│   └── Appendix_C_*.pdf      ← API specification
│
├── mock-api/                 ← Test infrastructure
│   └── server.js             ← Mock REST API server
│
├── logs/                     ← Evaluation results
│   ├── codex/
│   ├── claude-code/
│   └── gemini/
│
├── src/                      ← Generated code (during evaluation)
└── tests/                    ← Generated tests (during evaluation)
```

---

## Using the Framework

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
npm install
```

### Running an Evaluation

1. Clear `src/` and `tests/` directories
2. Submit the prompt from `artifacts/prompt-template.md` to the AI tool
3. Save generated code to `src/auth.js` and `tests/auth.test.js`
4. Run Stage 3 (Triage):
   ```bash
   npm run lint
   ```
5. Run Stage 4 (Verification):
   ```bash
   npm test
   ```
6. Document results using `artifacts/experiment-log-template.md`
7. Score using the 25-point rubric

### Mock API Server
```bash
npm run mock-api
```
Starts the test server at `http://localhost:3000`

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `artifacts/task-specification.md` | Defines what the AI must build |
| `artifacts/prompt-template.md` | Exact prompt used for evaluation |
| `project/Appendix_C_Mock_API_Contract.pdf` | API specification |
| `logs/{tool}/iteration-*.md` | Evaluation results per tool |

---

## License

Academic use only. Part of a Master's thesis research project.
