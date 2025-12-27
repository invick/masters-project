/**
 * Mock API Server - Appendix C: Authentication Module Contract
 *
 * This server implements the REST API contract for the case study.
 * It provides deterministic responses for testing AI-generated client code.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'test-secret-key-for-deterministic-testing';

// In-memory storage (reset on server restart)
const users = new Map();
const refreshTokens = new Set();
const loginAttempts = new Map(); // For rate limiting

// Middleware
app.use(cors());
app.use(express.json());

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }
  if (email.length > 254) {
    return { valid: false, message: 'Email must not exceed 254 characters' };
  }
  // RFC 5322 simplified validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true };
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must not exceed 128 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit' };
  }
  return { valid: true };
}

function generateAccessToken(userId, email) {
  return jwt.sign(
    { sub: userId, email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function generateRefreshToken() {
  const token = uuidv4();
  refreshTokens.add(token);
  return token;
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { expired: true };
    }
    return null;
  }
}

// Rate limiting helper
function checkRateLimit(email) {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, resetAt: now + 300000 };

  if (now > attempts.resetAt) {
    loginAttempts.delete(email);
    return { limited: false };
  }

  if (attempts.count >= 5) {
    return { limited: true, retryAfter: Math.ceil((attempts.resetAt - now) / 1000) };
  }

  return { limited: false };
}

function recordLoginAttempt(email) {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, resetAt: now + 300000 };
  attempts.count++;
  loginAttempts.set(email, attempts);
}

// =============================================================================
// AUTH MIDDLEWARE
// =============================================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access token required'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access token required'
    });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Access token is invalid'
    });
  }

  if (decoded.expired) {
    return res.status(401).json({
      success: false,
      error: 'TOKEN_EXPIRED',
      message: 'Access token has expired'
    });
  }

  req.user = decoded;
  next();
}

// =============================================================================
// ENDPOINTS
// =============================================================================

// C.2.1 User Registration
// POST /api/register
app.post('/api/register', (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const fields = {};

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    fields.email = emailValidation.message;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    fields.password = passwordValidation.message;
  }

  // Validate confirmPassword
  if (!confirmPassword) {
    fields.confirmPassword = 'Confirm password is required';
  } else if (password !== confirmPassword) {
    fields.confirmPassword = 'Passwords do not match';
  }

  // Return validation errors
  if (Object.keys(fields).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      fields
    });
  }

  // Check if email already exists
  if (users.has(email)) {
    return res.status(409).json({
      success: false,
      error: 'EMAIL_EXISTS',
      message: 'An account with this email already exists'
    });
  }

  // Create user
  const userId = uuidv4();
  users.set(email, {
    userId,
    email,
    password, // In production, this would be hashed
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    userId
  });
});

// C.2.2 User Login
// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Email and password are required'
    });
  }

  // Check rate limiting
  const rateLimit = checkRateLimit(email);
  if (rateLimit.limited) {
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMITED',
      message: 'Too many login attempts',
      retryAfter: rateLimit.retryAfter
    });
  }

  // Verify credentials
  const user = users.get(email);
  if (!user || user.password !== password) {
    recordLoginAttempt(email);
    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password'
    });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.userId, user.email);
  const refreshToken = generateRefreshToken();

  return res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    expiresIn: 3600,
    tokenType: 'Bearer'
  });
});

// C.2.3 Token Refresh
// POST /api/refresh
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Refresh token is required'
    });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Refresh token is invalid or expired'
    });
  }

  // For mock purposes, generate a new access token with test data
  const accessToken = generateAccessToken('test-user-id', 'test@example.com');

  return res.status(200).json({
    success: true,
    accessToken,
    expiresIn: 3600,
    tokenType: 'Bearer'
  });
});

// C.2.4 Logout
// POST /api/logout
app.post('/api/logout', authenticateToken, (req, res) => {
  const { refreshToken } = req.body;

  // Remove refresh token if provided
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// C.2.5 Protected Resource
// GET /api/protected/profile
app.get('/api/protected/profile', authenticateToken, (req, res) => {
  const user = Array.from(users.values()).find(u => u.userId === req.user.sub);

  return res.status(200).json({
    success: true,
    data: {
      userId: req.user.sub,
      email: req.user.email,
      createdAt: user?.createdAt || new Date().toISOString()
    }
  });
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  return res.status(500).json({
    success: false,
    error: 'SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'Endpoint not found'
  });
});

// =============================================================================
// SERVER START
// =============================================================================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Mock API server running at http://localhost:${PORT}`);
    console.log('\nAvailable endpoints:');
    console.log('  POST /api/register');
    console.log('  POST /api/login');
    console.log('  POST /api/refresh');
    console.log('  POST /api/logout');
    console.log('  GET  /api/protected/profile');
  });
}

module.exports = app;
