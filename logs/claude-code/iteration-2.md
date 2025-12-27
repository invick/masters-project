# Experiment Log: Claude Code

**Tool:** Claude Code (Anthropic)
**Model:** Claude Opus 4.5 (claude-opus-4-5-20251101)
**Date:** 2025-12-26
**Iteration:** 2

---

## Stage 1: Task Specification
- **Document Used:** `artifacts/task-specification.md`
- **Version:** 1.0

## Stage 2: Prompt Execution

### Prompt Submitted
- **Timestamp:** Session started with reading order provided by user
- **Prompt File:** `artifacts/prompt-template.md`

### Generation Metadata
- **Output Length (auth.js):** 271 lines
- **Output Length (auth.test.js):** 382 lines
- **Total Lines:** 653 lines
- **Files Generated:** `src/auth.js`, `tests/auth.test.js`

---

## Stage 3: Triage

### Decision Gate: Syntax Check
- [x] Pass
- [ ] Fail
- **Notes:** No syntax errors

### Decision Gate: Lint Check
```
> masters-project@1.0.0 lint
> eslint .

C:\Users\VictorAdams\WebstormProjects\masters-project\src\auth.js
  110:3   warning  Potential timing attack, left side: true  security/detect-possible-timing-attacks
  125:12  warning  'error' is defined but never used         no-unused-vars
  157:12  warning  'error' is defined but never used         no-unused-vars
  185:12  warning  'error' is defined but never used         no-unused-vars
  224:12  warning  'error' is defined but never used         no-unused-vars
  254:12  warning  'error' is defined but never used         no-unused-vars

(Additional warnings from other project files omitted)

✖ 10 problems (0 errors, 10 warnings)
```
- **Errors:** 0
- **Warnings:** 5 (from generated code)
- [x] Pass (0 errors)
- [ ] Fail

### Decision Gate: Security Scan
- **Findings:** 1 potential timing attack warning (password comparison using `!==`)
- [x] Pass (0 critical/high - warning only)
- [ ] Fail

---

## Stage 4: Verification

### Test Execution
```
> masters-project@1.0.0 test
> jest

PASS tests/auth.test.js
  Authentication Module
    register
      √ successful registration (2 ms)
      √ registration validation errors - invalid email (1 ms)
      √ registration validation errors - weak password
      √ registration validation errors - password mismatch
      √ registration validation errors - email too long
    login
      √ successful login stores tokens (1 ms)
      √ invalid credentials error
    refreshToken
      √ token refresh updates access token
      √ token refresh with invalid token
    logout
      √ logout clears tokens and calls API
      √ logout without prior login (1 ms)
    getProfile
      √ protected profile access with valid token
      √ unauthorized access errors - no token
      √ unauthorized access errors - invalid token
    error handling
      √ handles network errors gracefully
      √ register handles network errors
      √ refreshToken handles network errors
      √ logout handles network errors
      √ getProfile handles network errors

Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        0.351 s
```

### Test Results
| Test Case | Status |
|-----------|--------|
| Registration - success | PASS |
| Registration - validation errors (4 cases) | PASS |
| Login - success | PASS |
| Login - invalid credentials | PASS |
| Token refresh - success | PASS |
| Token refresh - invalid token | PASS |
| Logout - with tokens | PASS |
| Logout - without tokens | PASS |
| Protected profile - success | PASS |
| Protected profile - unauthorized (2 cases) | PASS |
| Network error handling (5 cases) | PASS |

- **Tests Passed:** 19 / 19
- **Coverage:** Not measured (Jest coverage not enabled)

---

## Iteration Summary

### Outcome
- [x] **ACCEPTED** - All gates passed
- [ ] **REJECTED** - Failed at Stage ___

### Key Differences from Iteration 1
| Aspect | Iteration 1 | Iteration 2 |
|--------|-------------|-------------|
| Module System | ES6 (`export`/`import`) | CommonJS (`module.exports`) |
| Lint Result | FAIL (2 errors) | PASS (0 errors) |
| Tests Run | 0/8 (blocked) | 19/19 passed |
| Stage Failed | Stage 3 | None |
| Outcome | REJECTED | ACCEPTED |

---

## Rubric Scores

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Functional Correctness | 5 | All 5 required functions implemented correctly |
| Code Quality | 5 | Clean structure, JSDoc comments, helper functions for validation |
| Error Handling | 5 | Graceful error handling, returns error objects instead of throwing |
| Security | 4 | No password/token logging; timing attack warning on password compare |
| Test Coverage | 5 | 19 tests covering all 8 required scenarios plus error handling |
| **Total** | **24/25** | |

---

## Notes & Observations

### Key Learning from Iteration 1
The previous Claude Code iteration (Iteration 1) failed at Stage 3 because it interpreted "ES6+" as requiring ES6 module syntax (`export`/`import`). The project was configured for CommonJS (`module.exports`/`require`), causing all lint gates to fail before code logic could be evaluated.

**Resolution:** In this iteration, Claude Code correctly used CommonJS module syntax, understanding that "ES6+" refers to modern JavaScript features (arrow functions, async/await, const/let, template literals) rather than specifically ES6 modules.

### Hallucinations Detected
- None observed

### Patterns Observed
1. **Module System Awareness:** This iteration demonstrates that Claude Code can correctly infer the expected module system from project context (eslint config, package.json)
2. **Helper Functions:** Added utility functions (`clearTokens`, `setBaseUrl`, `getStoredAccessToken`, `getStoredRefreshToken`) beyond requirements to enable proper test isolation
3. **Validation Functions:** Separated email and password validation into reusable functions
4. **Comprehensive Error Handling:** Every function wraps API calls in try/catch and returns error objects

### Comparison Notes (vs Iteration 1)
- **Lines of Code:** 271 (vs 231 in Iteration 1)
- **Lines of Tests:** 382 (vs 234 in Iteration 1)
- **Test Count:** 19 (vs 8 attempted)
- **Additional tests:** Added network error handling tests for all 5 functions

### Code Quality Highlights
1. Configurable `BASE_URL` with setter/getter
2. `clearTokens()` helper for test isolation (addresses the shared bug pattern from Codex)
3. Consistent error response format `{ success: false, error: '...' }`
4. Client-side validation runs before network requests
5. Tokens cleared even on logout network failure

---

## Methodology Finding: Prompt Ambiguity

### The Problem

The prompt template contains ambiguous language regarding the module system:

**From `artifacts/prompt-template.md`:**
> "Create a JavaScript ES6+ authentication module..."
> "Export all functions as named exports"

**From `artifacts/task-specification.md`:**
> "Use ES6+ syntax (const/let, arrow functions, async/await)"
> "Export functions as named exports"

### Analysis

| Term | Possible Interpretation A | Possible Interpretation B |
|------|---------------------------|---------------------------|
| "ES6+" | Use ES6 module system (`export`/`import`) | Use ES6+ features (arrow functions, async/await) |
| "named exports" | `export const fn = ...` (ES6) | `module.exports = { fn }` (CommonJS) |

Both interpretations are technically valid. The phrase "named exports" exists in both module systems.

### What the Prompt Did NOT Specify

1. **No explicit module system requirement** - The prompt never said "use CommonJS" or "use ES6 modules"
2. **No reference to project configuration** - The prompt didn't mention checking `eslint.config.js` or `package.json`
3. **"ES6+" is ambiguous** - It could mean "ES6 module syntax" or "modern ES6+ language features"

### How the Correct Answer Was Determined

The only way to know CommonJS was expected:
1. Read `eslint.config.js` line 13: `sourceType: 'commonjs'`
2. Observe that Jest/Node.js defaults to CommonJS
3. Infer from project context (not from the prompt itself)

### Implication for the Experiment

**Iteration 1 was not necessarily "wrong"** - it correctly followed the prompt's literal wording. It failed because the prompt was ambiguous and the project configuration contradicted a reasonable interpretation of "ES6+".

**Iteration 2 succeeded** because it had additional context:
- Knowledge of iteration 1's failure mode
- Access to project configuration files
- Understanding that "ES6+" typically means features, not module system

### Recommendation for Future Experiments

If a specific module system is required, the prompt should explicitly state it:

```
// Current (ambiguous):
- Export all functions as named exports

// Recommended (explicit):
- Export all functions using module.exports (CommonJS format)
// OR
- Export all functions using ES6 export syntax
```

### Relevance to Thesis

This finding supports a key observation: **AI code generation is highly sensitive to prompt precision.** Ambiguous prompts can produce valid but incompatible code, and the "correct" interpretation may depend on external context not provided in the prompt.

This should be documented in:
- **Section 6.4** (Observations and Patterns)
- **Section 7** (Discussion) - implications for prompt engineering

---

## Raw Code Output

### src/auth.js
See `logs/claude-code/auth.js` for complete source.

### tests/auth.test.js
See `logs/claude-code/auth.test.js` for complete source.
