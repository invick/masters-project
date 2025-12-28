# Framework Validation Results

## Summary

This document presents the results of validating the AI Code Assistant Evaluation Framework using three different AI coding assistants.

### Tools Evaluated

| Tool | Company | Result | Score |
|------|---------|--------|-------|
| Codex | OpenAI | REJECTED (Stage 4) | 20/25 |
| Claude Code | Anthropic | ACCEPTED | 24/25 |
| Gemini | Google | ACCEPTED | 25/25 |

---

## Validation Task

Each tool was asked to generate a **JavaScript authentication module** that:
- Implements user registration, login, logout, and token management
- Interfaces with a REST API (specification in `project/Appendix_C_Mock_API_Contract.pdf`)
- Includes client-side validation
- Handles errors gracefully
- Includes a Jest test suite

The exact prompt is documented in `artifacts/prompt-template.md`.

---

## Results by Tool

### Codex (OpenAI)

**Result:** REJECTED at Stage 4

| Metric | Value |
|--------|-------|
| Lines of Code | 314 |
| Lines of Tests | 277 |
| Lint Errors | 0 |
| Tests Passed | 6/8 |

**Rubric Score:** 20/25

| Criterion | Score |
|-----------|-------|
| Functional Correctness | 4/5 |
| Code Quality | 4/5 |
| Error Handling | 5/5 |
| Security | 4/5 |
| Test Coverage | 3/5 |

**Failure Analysis:** Test isolation issue - module state persisted between tests, causing 2 tests to fail.

---

### Claude Code (Anthropic)

**Result:** ACCEPTED (2 iterations required)

| Metric | Value |
|--------|-------|
| Lines of Code | 271 |
| Lines of Tests | 382 |
| Lint Errors | 0 |
| Tests Passed | 19/19 |

**Rubric Score:** 24/25

| Criterion | Score |
|-----------|-------|
| Functional Correctness | 5/5 |
| Code Quality | 5/5 |
| Error Handling | 5/5 |
| Security | 4/5 |
| Test Coverage | 5/5 |

**Notes:** First iteration used ES6 module syntax incompatible with project configuration. Second iteration correctly used CommonJS and included test isolation helpers.

---

### Gemini (Google)

**Result:** ACCEPTED (first attempt)

| Metric | Value |
|--------|-------|
| Lines of Code | 156 |
| Lines of Tests | 159 |
| Lint Errors | 0 |
| Tests Passed | 10/10 |

**Rubric Score:** 25/25

| Criterion | Score |
|-----------|-------|
| Functional Correctness | 5/5 |
| Code Quality | 5/5 |
| Error Handling | 5/5 |
| Security | 5/5 |
| Test Coverage | 5/5 |

**Notes:** Shortest implementation with perfect results. Proactively included test isolation helpers.

---

## Comparative Analysis

### Metrics Comparison

| Metric | Codex | Claude Code | Gemini |
|--------|-------|-------------|--------|
| Lines of Code | 314 | 271 | 156 |
| Lines of Tests | 277 | 382 | 159 |
| Lint Errors | 0 | 0 | 0 |
| Tests Passed | 6/8 | 19/19 | 10/10 |
| Iterations Required | 1 | 2 | 1 |
| Final Score | 20/25 | 24/25 | **25/25** |

### Key Findings

1. **Module System Interpretation**
   - Codex and Gemini correctly inferred CommonJS was required
   - Claude Code initially interpreted "ES6+" as ES6 module syntax
   - Finding: Prompt ambiguity can significantly impact results

2. **Test Isolation**
   - Codex did not include state reset functionality
   - Claude Code (iteration 2) and Gemini included test helpers
   - Finding: More sophisticated tools proactively address testing concerns

3. **Code Efficiency**
   - Gemini produced the shortest implementation (156 lines)
   - All tools met functional requirements
   - Finding: Code length does not correlate with quality

---

## Framework Effectiveness

The framework successfully:
- Differentiated tool capabilities through standardized evaluation
- Identified specific failure points (Stage 3 vs Stage 4)
- Provided objective, reproducible scoring
- Revealed patterns in AI code generation approaches

---

## File References

| Document | Location |
|----------|----------|
| Task Specification | `artifacts/task-specification.md` |
| Prompt Template | `artifacts/prompt-template.md` |
| API Specification | `project/Appendix_C_Mock_API_Contract.pdf` |
| Codex Results | `logs/codex/iteration-1.md` |
| Claude Code Results | `logs/claude-code/iteration-1.md`, `iteration-2.md` |
| Gemini Results | `logs/gemini/iteration-1.md` |
