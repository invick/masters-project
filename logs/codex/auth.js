// Authentication module using native fetch and async/await.
// Provides client-side validation, token management, and
// graceful error handling without throwing.

const DEFAULT_BASE_URL = 'http://localhost:3000';

let baseUrl = DEFAULT_BASE_URL;
let currentAccessToken = null;
let currentRefreshToken = null;

/**
 * Configure the base URL for the authentication API.
 * @param {string} url
 */
function setBaseUrl(url) {
  if (typeof url === 'string' && url.trim()) {
    baseUrl = url.trim();
  }
}

/**
 * Internal helper to build full URL for an endpoint.
 * @param {string} path
 * @returns {string}
 */
function buildUrl(path) {
  const trimmedBase = baseUrl.replace(/\/+$/, '');
  const trimmedPath = path.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}`;
}

/**
 * Internal helper to perform a JSON HTTP request.
 * Always returns an object and never throws.
 *
 * @param {string} path
 * @param {Object} options
 * @returns {Promise<Object>}
 */
async function requestJson(path, options = {}) {
  const { method = 'GET', headers = {}, body } = options;

  const requestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(buildUrl(path), requestInit);

    let data = null;
    try {
      data = await response.json();
    } catch (parseError) {
      // Non-JSON response; return a generic structure.
      return {
        ok: response.ok,
        status: response.status,
        error: 'Invalid JSON response from server',
      };
    }

    // Ensure we always have an object.
    if (data && typeof data === 'object') {
      return data;
    }

    return {
      ok: response.ok,
      status: response.status,
      error: 'Unexpected response format',
    };
  } catch (error) {
    return {
      ok: false,
      error: 'Network error',
      message: error && error.message ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate registration inputs.
 * Returns null if valid, or an error object if invalid.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {Object|null}
 */
function validateRegistration(email, password, confirmPassword) {
  const errors = {};

  const emailStr = typeof email === 'string' ? email.trim() : '';
  const passwordStr = typeof password === 'string' ? password : '';
  const confirmPasswordStr =
    typeof confirmPassword === 'string' ? confirmPassword : '';

  // Email validation
  if (!emailStr) {
    errors.email = 'Email is required';
  } else if (emailStr.length > 254) {
    errors.email = 'Email must be at most 254 characters';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      errors.email = 'Email format is invalid';
    }
  }

  // Password validation
  if (!passwordStr) {
    errors.password = 'Password is required';
  } else {
    if (passwordStr.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else {
      const hasUppercase = /[A-Z]/.test(passwordStr);
      const hasLowercase = /[a-z]/.test(passwordStr);
      const hasDigit = /\d/.test(passwordStr);

      if (!hasUppercase || !hasLowercase || !hasDigit) {
        errors.password =
          'Password must include uppercase, lowercase, and a digit';
      }
    }
  }

  // Confirm password validation
  if (!confirmPasswordStr) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (passwordStr !== confirmPasswordStr) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      error: 'Validation failed',
      errors,
    };
  }

  return null;
}

/**
 * Register a new user.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {Promise<Object>} JSON response or validation/network error
 */
async function register(email, password, confirmPassword) {
  const validationError = validateRegistration(email, password, confirmPassword);
  if (validationError) {
    return validationError;
  }

  return requestJson('/api/register', {
    method: 'POST',
    body: { email, password, confirmPassword },
  });
}

/**
 * Log in a user and store access/refresh tokens.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} JSON response
 */
async function login(email, password) {
  const result = await requestJson('/api/login', {
    method: 'POST',
    body: { email, password },
  });

  if (result && typeof result === 'object') {
    if (Object.prototype.hasOwnProperty.call(result, 'accessToken')) {
      currentAccessToken = result.accessToken || null;
    }
    if (Object.prototype.hasOwnProperty.call(result, 'refreshToken')) {
      currentRefreshToken = result.refreshToken || null;
    }
  }

  return result;
}

/**
 * Refresh the access token using a refresh token.
 *
 * @param {string} token Optional refresh token; falls back to stored one.
 * @returns {Promise<Object>} JSON response
 */
async function refreshToken(token) {
  const refreshTokenToUse = token || currentRefreshToken;

  if (!refreshTokenToUse) {
    return {
      ok: false,
      error: 'No refresh token available',
    };
  }

  const result = await requestJson('/api/refresh', {
    method: 'POST',
    body: { refreshToken: refreshTokenToUse },
  });

  if (result && typeof result === 'object') {
    if (Object.prototype.hasOwnProperty.call(result, 'accessToken')) {
      currentAccessToken = result.accessToken || null;
    }
    if (Object.prototype.hasOwnProperty.call(result, 'refreshToken')) {
      currentRefreshToken = result.refreshToken || null;
    }
  }

  return result;
}

/**
 * Log out the current user, invalidating tokens on the server if possible.
 *
 * @returns {Promise<Object>} JSON response
 */
async function logout() {
  if (!currentAccessToken && !currentRefreshToken) {
    return {
      ok: false,
      error: 'No user is currently logged in',
    };
  }

  const headers = {};
  if (currentAccessToken) {
    headers.Authorization = `Bearer ${currentAccessToken}`;
  }

  const body = {};
  if (currentRefreshToken) {
    body.refreshToken = currentRefreshToken;
  }

  const result = await requestJson('/api/logout', {
    method: 'POST',
    headers,
    body: Object.keys(body).length > 0 ? body : undefined,
  });

  // Clear stored tokens regardless of server response.
  currentAccessToken = null;
  currentRefreshToken = null;

  return result;
}

/**
 * Get the profile of the currently authenticated user.
 *
 * @returns {Promise<Object>} JSON response
 */
async function getProfile() {
  if (!currentAccessToken) {
    return {
      ok: false,
      error: 'No access token available',
    };
  }

  const headers = {
    Authorization: `Bearer ${currentAccessToken}`,
  };

  return requestJson('/api/protected/profile', {
    method: 'GET',
    headers,
  });
}

/**
 * Internal helper for tests to inspect current tokens.
 * Not required by consumers but exported for convenience.
 *
 * @returns {{ accessToken: string|null, refreshToken: string|null }}
 */
function getTokens() {
  return {
    accessToken: currentAccessToken,
    refreshToken: currentRefreshToken,
  };
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  // Additional utilities
  setBaseUrl,
  getTokens,
};

