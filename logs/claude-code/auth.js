/**
 * Authentication Module
 * Interfaces with REST API at configurable BASE_URL
 */

// Configurable base URL - defaults to localhost:3000
let BASE_URL = 'http://localhost:3000';

// Token storage (module-level state)
let storedAccessToken = null;
let storedRefreshToken = null;

/**
 * Configure the base URL for API requests
 * @param {string} url - The base URL to use
 */
const setBaseUrl = (url) => {
  BASE_URL = url;
};

/**
 * Get the current base URL
 * @returns {string} The current base URL
 */
const getBaseUrl = () => BASE_URL;

/**
 * Clear stored tokens (useful for testing)
 */
const clearTokens = () => {
  storedAccessToken = null;
  storedRefreshToken = null;
};

/**
 * Get stored access token (for testing purposes)
 * @returns {string|null} The stored access token
 */
const getStoredAccessToken = () => storedAccessToken;

/**
 * Get stored refresh token (for testing purposes)
 * @returns {string|null} The stored refresh token
 */
const getStoredRefreshToken = () => storedRefreshToken;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {{valid: boolean, error?: string}}
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  if (email.length > 254) {
    return { valid: false, error: 'Email must not exceed 254 characters' };
  }
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{valid: boolean, error?: string}}
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one digit' };
  }
  return { valid: true };
};

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise<Object>} JSON response from API or error object
 */
const register = async (email, password, confirmPassword) => {
  // Client-side validation
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { success: false, error: emailValidation.error };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.error };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} JSON response from API or error object
 */
const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Store tokens if login successful
    if (data.accessToken) {
      storedAccessToken = data.accessToken;
    }
    if (data.refreshToken) {
      storedRefreshToken = data.refreshToken;
    }

    return data;
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
};

/**
 * Refresh the access token
 * @param {string} token - The refresh token to use
 * @returns {Promise<Object>} JSON response from API or error object
 */
const refreshToken = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token }),
    });

    const data = await response.json();

    // Update stored access token if refresh successful
    if (data.accessToken) {
      storedAccessToken = data.accessToken;
    }

    return data;
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} JSON response from API or error object
 */
const logout = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if we have an access token
    if (storedAccessToken) {
      headers['Authorization'] = `Bearer ${storedAccessToken}`;
    }

    // Build request body
    const body = {};
    if (storedRefreshToken) {
      body.refreshToken = storedRefreshToken;
    }

    const response = await fetch(`${BASE_URL}/api/logout`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Clear stored tokens regardless of response
    storedAccessToken = null;
    storedRefreshToken = null;

    return data;
  } catch (error) {
    // Still clear tokens even on error
    storedAccessToken = null;
    storedRefreshToken = null;
    return { success: false, error: 'Network error occurred' };
  }
};

/**
 * Get user profile
 * @returns {Promise<Object>} JSON response from API or error object
 */
const getProfile = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if we have an access token
    if (storedAccessToken) {
      headers['Authorization'] = `Bearer ${storedAccessToken}`;
    }

    const response = await fetch(`${BASE_URL}/api/protected/profile`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
};

// Export all functions as named exports (CommonJS)
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  setBaseUrl,
  getBaseUrl,
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
};
