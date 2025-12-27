# Section 6 Experiment Requirements

## Project Overview
Controlled execution experiment comparing AI coding assistants (Codex, Claude Code, Gemini) using a workflow framework.

---

## Environment Setup

### Required Tools
| Tool | Purpose | Status |
|------|---------|--------|
| WebStorm | IDE | Installed |
| JavaScript (ES6+) | Language | Ready |
| Jest | Testing | Installed |
| ESLint + security plugin | Linting | Installed |
| axe-core | Accessibility (optional) | Not installed |

### Project Structure
```
masters-project/
├── src/               # Source code (AI-generated)
├── tests/             # Jest test files
├── mock-api/          # Mock REST API (per Appendix C)
├── logs/              # Experiment logs
│   ├── codex/
│   ├── claude-code/
│   └── gemini/
├── artifacts/         # Task specs, prompts, outputs
│   ├── task-specification.md
│   └── prompt-template.md
└── REQUIREMENTS.md
```

---

## Workflow Stages

### Stage 1: Task Specification
- [x] Define the task clearly
- [x] Document acceptance criteria
- [x] Save verbatim with timestamp
- **File:** `artifacts/task-specification.md`

### Stage 2: Prompt Template
- [x] Write standardized prompt
- [x] Ensure identical prompt used for all tools
- [x] Save verbatim with timestamp
- **File:** `artifacts/prompt-template.md`

### Stage 3: Triage (Decision Gates)
- [ ] Define pass/fail criteria
- [ ] Document decision gate triggers

### Stage 4: Verification
- [ ] Lint checks (ESLint)
- [ ] Unit tests (Jest)
- [ ] Security scan (eslint-plugin-security)

---

## Data Collection Requirements

### Per Tool (Codex, Claude Code, Gemini)
- [ ] Raw AI output (verbatim)
- [ ] Lint results
- [ ] Test results
- [ ] Security findings
- [ ] Iteration count
- [ ] Stage causing rejection/regression
- [ ] Final rubric scores

### Output Mapping
| Data | Section |
|------|---------|
| Workflow narrative | 6.2 |
| Comparative tables | 6.3 |
| Patterns/observations | 6.4 |

---

## Rules of Engagement
1. Do NOT manually optimize code to "make it work"
2. Do NOT fix issues outside the framework
3. Do NOT hide failures - failures are data
4. All refinement must be triggered by a decision gate

---

## Next Steps
1. [x] Create project scaffold directories
2. [x] Set up mock REST API (Appendix C implemented)
3. [x] Write Task Specification
4. [x] Write Prompt Template
5. [ ] Begin controlled execution with first AI tool

---

## Mock API Reference

**Start server:** `npm run mock-api`

**Base URL:** `http://localhost:3000`

| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| `/api/register` | POST | No |
| `/api/login` | POST | No |
| `/api/refresh` | POST | No |
| `/api/logout` | POST | Yes (Bearer) |
| `/api/protected/profile` | GET | Yes (Bearer) |
