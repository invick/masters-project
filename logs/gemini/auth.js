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
