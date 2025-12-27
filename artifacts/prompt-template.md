# Prompt Template: Authentication Module

**Document ID:** PROMPT-TPL-001
**Created:** 2025-12-26T15:30:00Z
**Version:** 1.0

---

## Instructions for Use

This exact prompt must be used verbatim for each AI tool (Codex, Claude Code, Gemini). Do not modify, add context, or provide additional hints. Copy everything within the PROMPT block below.

---

## PROMPT

```
Create a JavaScript ES6+ authentication module (src/auth.js) that interfaces with a REST API at http://localhost:3000.

The module must export these functions:

1. register(email, password, confirmPassword)
   - Validate inputs client-side:
     - Email: valid format, max 254 chars
     - Password: min 8 chars, requires uppercase, lowercase, and digit
     - confirmPassword must match password
   - POST to /api/register with { email, password, confirmPassword }
   - Return the JSON response

2. login(email, password)
   - POST to /api/login with { email, password }
   - Store the returned accessToken and refreshToken
   - Return the JSON response

3. refreshToken(token)
   - POST to /api/refresh with { refreshToken: token }
   - Update stored accessToken
   - Return the JSON response

4. logout()
   - POST to /api/logout with Authorization: Bearer <accessToken> header
   - Include refreshToken in body if available
   - Clear stored tokens
   - Return the JSON response

5. getProfile()
   - GET /api/protected/profile with Authorization: Bearer <accessToken> header
   - Return the JSON response

Requirements:
- Use native fetch API (no external HTTP libraries)
- Use async/await syntax
- Handle errors gracefully, return error responses, never throw
- Make BASE_URL configurable
- Do not log passwords or tokens
- Export all functions as named exports

Also create tests/auth.test.js with Jest tests covering:
- Successful registration
- Registration validation errors
- Successful login
- Invalid credentials error
- Token refresh
- Logout
- Protected profile access
- Unauthorized access errors
```

---

## PROMPT END

---

## Logging Instructions

When executing this prompt with each AI tool, record:

1. **Timestamp** - When prompt was submitted
2. **Tool** - Which AI assistant (Codex/Claude Code/Gemini)
3. **Raw Output** - Complete unedited response
4. **Generation Time** - How long until response completed
5. **Iterations** - Number of refinement cycles needed

Save outputs to: `logs/{tool-name}/iteration-{n}.md`
