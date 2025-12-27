# Experiment Log: [TOOL NAME]

**Tool:** [Codex / Claude Code / Gemini]
**Date:** YYYY-MM-DD
**Iteration:** #

---

## Stage 1: Task Specification
- **Document Used:** `artifacts/task-specification.md`
- **Version:** 1.0

## Stage 2: Prompt Execution

### Prompt Submitted
- **Timestamp:** HH:MM:SS
- **Prompt File:** `artifacts/prompt-template.md`

### Raw AI Output
```javascript
// Paste complete AI-generated code here (verbatim, unedited)
```

### Generation Metadata
- **Response Time:** _____ seconds
- **Output Length:** _____ lines
- **Files Generated:** [ ]

---

## Stage 3: Triage

### Decision Gate: Syntax Check
- [ ] Pass
- [ ] Fail
- **Notes:**

### Decision Gate: Lint Check
```
# npm run lint output
```
- **Errors:** _____
- **Warnings:** _____
- [ ] Pass (0 errors)
- [ ] Fail

### Decision Gate: Security Scan
- **Findings:**
- [ ] Pass (0 critical/high)
- [ ] Fail

---

## Stage 4: Verification

### Test Execution
```
# npm test output
```

### Test Results
| Test Case | Status |
|-----------|--------|
| Registration - success | |
| Registration - validation errors | |
| Login - success | |
| Login - invalid credentials | |
| Token refresh | |
| Logout | |
| Protected profile - success | |
| Protected profile - unauthorized | |

- **Tests Passed:** _____ / _____
- **Coverage:** _____%

---

## Iteration Summary

### Outcome
- [ ] **ACCEPTED** - All gates passed
- [ ] **REJECTED** - Failed at Stage ___

### If Rejected
- **Rejection Reason:**
- **Gate Failed:**
- **Error Details:**

### Modifications Required
1.
2.
3.

---

## Rubric Scores

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Functional Correctness | | |
| Code Quality | | |
| Error Handling | | |
| Security | | |
| Test Coverage | | |
| **Total** | /25 | |

---

## Notes & Observations

### Hallucinations Detected
-

### Patterns Observed
-

### Comparison Notes
-
