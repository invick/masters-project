# Experiment Log: Gemini

**Tool:** Gemini
**Date:** 2025-12-26
**Iteration:** 1

---

## Stage 1: Task Specification
- **Document Used:** `artifacts/task-specification.md`
- **Version:** 1.0

## Stage 2: Prompt Execution

### Prompt Submitted
- **Timestamp:** 12:00:00 (approx)
- **Prompt File:** `artifacts/prompt-template.md`

### Raw AI Output
```javascript
// src/auth.js

let BASE_URL = 'http://localhost:3000';
let accessToken = null;
let refreshTokenStored = null;

const setBaseUrl = (url) => {
  BASE_URL = url;
};

// Internal helpers for validation
const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  return hasUpper && hasLower && hasDigit;
};

const register = async (email, password, confirmPassword) => {
  if (!isValidEmail(email)) {
    return { error: 'Invalid email format' };
  }
  if (!isValidPassword(password)) {
    return { error: 'Password must be at least 8 characters and contain uppercase, lowercase, and digit' };
  }
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, confirmPassword }),
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      if (data.accessToken) accessToken = data.accessToken;
      if (data.refreshToken) refreshTokenStored = data.refreshToken;
    }

    return data;
  } catch (error) {
    return { error: error.message };
  }
};

const refreshToken = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token }),
    });
    const data = await response.json();

    if (response.ok && data.accessToken) {
      accessToken = data.accessToken;
    }

    return data;
  } catch (error) {
    return { error: error.message };
  }
};

const logout = async () => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const body = refreshTokenStored ? JSON.stringify({ refreshToken: refreshTokenStored }) : undefined;

    const response = await fetch(`${BASE_URL}/api/logout`, {
      method: 'POST',
      headers,
      body,
    });

    // Clear stored tokens
    accessToken = null;
    refreshTokenStored = null;

    return await response.json();
  } catch (error) {
    // Clear stored tokens even if request fails
    accessToken = null;
    refreshTokenStored = null;
    return { error: error.message };
  }
};

const getProfile = async () => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}/api/protected/profile`, {
      method: 'GET',
      headers,
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

// Test helpers
const _clearTokens = () => {
  accessToken = null;
  refreshTokenStored = null;
};

const _getTokens = () => ({
  accessToken,
  refreshToken: refreshTokenStored,
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  setBaseUrl,
  _clearTokens,
  _getTokens,
};
```

```javascript
// tests/auth.test.js

const auth = require('../src/auth');

global.fetch = jest.fn();

describe('Authentication Module', () => {
  beforeEach(() => {
    fetch.mockClear();
    auth._clearTokens();
    auth.setBaseUrl('http://localhost:3000');
  });

  describe('register', () => {
    test('should register successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, userId: '123' }),
      });

      const result = await auth.register('test@example.com', 'Password123', 'Password123');
      expect(result).toEqual({ success: true, userId: '123' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/register', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'Password123', confirmPassword: 'Password123' }),
      }));
    });

    test('should return validation error for invalid email', async () => {
      const result = await auth.register('invalid-email', 'Password123', 'Password123');
      expect(result).toEqual({ error: 'Invalid email format' });
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should return validation error for weak password', async () => {
      const result = await auth.register('test@example.com', 'weak', 'weak');
      expect(result.error).toMatch(/Password must be/);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should return validation error for mismatched passwords', async () => {
      const result = await auth.register('test@example.com', 'Password123', 'Different123');
      expect(result).toEqual({ error: 'Passwords do not match' });
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    test('should login successfully and store tokens', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: 'access123', refreshToken: 'refresh123' }),
      });

      const result = await auth.login('test@example.com', 'Password123');
      expect(result).toEqual({ accessToken: 'access123', refreshToken: 'refresh123' });
      
      const tokens = auth._getTokens();
      expect(tokens.accessToken).toBe('access123');
      expect(tokens.refreshToken).toBe('refresh123');
    });

    test('should return error on invalid credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      const result = await auth.login('test@example.com', 'WrongPass');
      expect(result).toEqual({ error: 'Invalid credentials' });
      
      const tokens = auth._getTokens();
      expect(tokens.accessToken).toBeNull();
    });
  });

  describe('refreshToken', () => {
    test('should refresh token successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: 'newAccess123' }),
      });

      const result = await auth.refreshToken('refresh123');
      expect(result).toEqual({ accessToken: 'newAccess123' });
      
      const tokens = auth._getTokens();
      expect(tokens.accessToken).toBe('newAccess123');
    });
  });

  describe('logout', () => {
    test('should logout successfully and clear tokens', async () => {
      // Simulate login first (populate tokens)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: 'access123', refreshToken: 'refresh123' }),
      });
      await auth.login('test@example.com', 'Pass');
      fetch.mockClear();

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await auth.logout();
      expect(result).toEqual({ success: true });
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/logout', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer access123',
        }),
        body: JSON.stringify({ refreshToken: 'refresh123' }),
      }));

      const tokens = auth._getTokens();
      expect(tokens.accessToken).toBeNull();
      expect(tokens.refreshToken).toBeNull();
    });
  });

  describe('getProfile', () => {
    test('should access protected profile', async () => {
      // Simulate login
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: 'access123' }),
      });
      await auth.login('test@example.com', 'Pass');
      fetch.mockClear();

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, email: 'test@example.com' }),
      });

      const result = await auth.getProfile();
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/protected/profile', expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access123',
        }),
      }));
    });
    
    test('should handle unauthorized access error', async () => {
         fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ error: 'Unauthorized' })
         });
         
         const result = await auth.getProfile();
         expect(result).toEqual({ error: 'Unauthorized' });
    });
  });
});
```

### Generation Metadata
- **Response Time:** 5 seconds
- **Output Length:** 272 lines
- **Files Generated:** [x] src/auth.js [x] tests/auth.test.js

---

## Stage 3: Triage

### Decision Gate: Syntax Check
- [x] Pass
- [ ] Fail
- **Notes:** Code is valid JavaScript (CommonJS).

### Decision Gate: Lint Check
```
C:\Users\VictorAdams\WebstormProjects\masters-project\src\auth.js
  35:3  warning  Potential timing attack, left side: true  security/detect-possible-timing-attacks
```
- **Errors:** 0
- **Warnings:** 1
- [x] Pass (0 errors)
- [ ] Fail

### Decision Gate: Security Scan
- **Findings:** One false positive warning about timing attack on client-side password comparison.
- [x] Pass (0 critical/high)
- [ ] Fail

---

## Stage 4: Verification

### Test Execution
```
PASS  tests/auth.test.js
  Authentication Module
    register
      √ should register successfully (2 ms)
      √ should return validation error for invalid email (1 ms)
      √ should return validation error for weak password (0 ms)
      √ should return validation error for mismatched passwords (1 ms)
    login
      √ should login successfully and store tokens (1 ms)
      √ should return error on invalid credentials (1 ms)
    refreshToken
      √ should refresh token successfully (0 ms)
    logout
      √ should logout successfully and clear tokens (1 ms)
    getProfile
      √ should access protected profile (0 ms)
      √ should handle unauthorized access error (1 ms)
```

### Test Results
| Test Case | Status |
|-----------|--------|
| Registration - success | PASS |
| Registration - validation errors | PASS |
| Login - success | PASS |
| Login - invalid credentials | PASS |
| Token refresh | PASS |
| Logout | PASS |
| Protected profile - success | PASS |
| Protected profile - unauthorized | PASS |

- **Tests Passed:** 10 / 10
- **Coverage:** 100% (Functional)

---

## Iteration Summary

### Outcome
- [x] **ACCEPTED** - All gates passed
- [ ] **REJECTED**

### If Rejected
- **Rejection Reason:**
- **Gate Failed:**
- **Error Details:**

### Modifications Required
1. None.

---

## Rubric Scores

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Functional Correctness | 5 | All requirements met, all tests passed. |
| Code Quality | 5 | Clean code, idiomatic CommonJS (per project config), good helpers. |
| Error Handling | 5 | Graceful error handling, no throwing, returns error objects. |
| Security | 5 | Proper token handling, explicit clearing on logout/test. |
| Test Coverage | 5 | Complete test suite covering all scenarios. |
| **Total** | 25/25 | |

---

## Notes & Observations

### Hallucinations Detected
- None.

### Patterns Observed
- Automatically adapted to CommonJS environment despite "ES6+" prompt to ensure working code.
- Included `_clearTokens` helper for test isolation.

### Comparison Notes
- Surpassed Codex by ensuring test isolation (cleaning up state between tests).
