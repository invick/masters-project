# Experiment Log: Codex

**Tool:** Codex (OpenAI)
**Date:** 2025-12-26
**Iteration:** 1

---

## Stage 1: Task Specification
- **Document Used:** `artifacts/task-specification.md`
- **Version:** 1.0

## Stage 2: Prompt Execution

### Prompt Submitted
- **Timestamp:** (Record actual time)
- **Prompt File:** `artifacts/prompt-template.md`

### Raw AI Output
- **auth.js location:** `src/auth.js` (314 lines)
- **auth.test.js location:** `tests/auth.test.js` (277 lines)

### Generation Metadata
- **Response Time:** _____ seconds (record actual)
- **Output Length:** 591 total lines
- **Files Generated:** [x] auth.js  [x] auth.test.js

---

## Stage 3: Triage

### Decision Gate: Syntax Check
- [x] Pass
- [ ] Fail
- **Notes:** Code parses without syntax errors

### Decision Gate: Lint Check
```
C:\Users\VictorAdams\WebstormProjects\masters-project\src\auth.js
  61:14  warning  'parseError' is defined but never used  no-unused-vars

✖ 1 problem (0 errors, 1 warning)
```
- **Errors:** 0
- **Warnings:** 1
- [x] Pass (0 errors)
- [ ] Fail

### Decision Gate: Security Scan
- **Findings:** No security issues in Codex-generated code
- [x] Pass (0 critical/high)
- [ ] Fail

---

## Stage 4: Verification

### Test Execution
```
FAIL tests/auth.test.js
  auth module
    √ successful registration (4 ms)
    √ registration validation errors (2 ms)
    √ successful login stores tokens (1 ms)
    × invalid credentials error on login (1 ms)
    √ token refresh updates stored access token (1 ms)
    √ logout sends tokens and clears them
    √ protected profile access with valid token
    × unauthorized access error when no token available (1 ms)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 6 passed, 8 total
```

### Test Results
| Test Case | Status |
|-----------|--------|
| Registration - success | PASS |
| Registration - validation errors | PASS |
| Login - success | PASS |
| Login - invalid credentials | FAIL |
| Token refresh | PASS |
| Logout | PASS |
| Protected profile - success | PASS |
| Protected profile - unauthorized | FAIL |

- **Tests Passed:** 6 / 8
- **Coverage:** N/A

---

## Iteration Summary

### Outcome
- [ ] **ACCEPTED** - All gates passed
- [x] **REJECTED** - Failed at Stage 4

### If Rejected
- **Rejection Reason:** Test isolation failure - module state persists between tests
- **Gate Failed:** Stage 4 - Verification (Jest tests)
- **Error Details:**
  - Tests share module-level token state
  - No `clearTokens()` or `resetState()` function provided
  - `beforeEach` only resets `global.fetch`, not internal auth module state

### Modifications Required
1. Add `clearTokens()` or `resetState()` function to auth.js
2. Export reset function for test isolation
3. Call reset in `beforeEach` hook

---

## Rubric Scores

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Functional Correctness | 4 | Core functions work, but test isolation missing |
| Code Quality | 4 | Well-structured, good helpers, JSDoc comments |
| Error Handling | 5 | Comprehensive, never throws, graceful fallbacks |
| Security | 4 | No sensitive data logged, proper token handling |
| Test Coverage | 3 | 8 tests but 2 fail due to isolation bug |
| **Total** | 20/25 | |

---

## Notes & Observations

### Hallucinations Detected
- None observed - code follows prompt requirements accurately

### Patterns Observed
- Added bonus utilities (`setBaseUrl`, `getTokens`, `buildUrl`, `requestJson`)
- Used CommonJS `module.exports` instead of ES6 named exports
- Good defensive coding (type checks, null guards)
- Test mocking approach is sound but incomplete (missing state reset)

### Comparison Notes
- Waiting for Gemini and Claude Code results for comparison
