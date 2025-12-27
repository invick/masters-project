/**
 * Authentication Module Tests
 * Jest test suite for src/auth.js
 */

const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  clearTokens,
  setBaseUrl,
} = require('../src/auth');

// Mock fetch globally
global.fetch = jest.fn();

// Reset mocks and module state before each test
beforeEach(() => {
  fetch.mockClear();
  clearTokens();
  setBaseUrl('http://localhost:3000');
});

describe('Authentication Module', () => {
  describe('register', () => {
    test('successful registration', async () => {
      const mockResponse = {
        success: true,
        message: 'User registered successfully',
        user: { id: '123', email: 'test@example.com' },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await register('test@example.com', 'Password123', 'Password123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Password123',
            confirmPassword: 'Password123',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('registration validation errors - invalid email', async () => {
      const result = await register('invalid-email', 'Password123', 'Password123');

      expect(fetch).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });

    test('registration validation errors - weak password', async () => {
      const result = await register('test@example.com', 'weak', 'weak');

      expect(fetch).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Password');
    });

    test('registration validation errors - password mismatch', async () => {
      const result = await register('test@example.com', 'Password123', 'Password456');

      expect(fetch).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toContain('match');
    });

    test('registration validation errors - email too long', async () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = await register(longEmail, 'Password123', 'Password123');

      expect(fetch).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toContain('254');
    });
  });

  describe('login', () => {
    test('successful login stores tokens', async () => {
      const mockResponse = {
        success: true,
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
        user: { id: '123', email: 'test@example.com' },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await login('test@example.com', 'Password123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Password123',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.accessToken).toBe('access-token-123');
    });

    test('invalid credentials error', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid email or password',
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockResponse,
      });

      const result = await login('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('refreshToken', () => {
    test('token refresh updates access token', async () => {
      const mockResponse = {
        success: true,
        accessToken: 'new-access-token-789',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await refreshToken('refresh-token-456');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/refresh',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: 'refresh-token-456' }),
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.accessToken).toBe('new-access-token-789');
    });

    test('token refresh with invalid token', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid refresh token',
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockResponse,
      });

      const result = await refreshToken('invalid-token');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('logout', () => {
    test('logout clears tokens and calls API', async () => {
      // First login to store tokens
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          accessToken: 'access-token-123',
          refreshToken: 'refresh-token-456',
        }),
      });

      await login('test@example.com', 'Password123');

      // Now logout
      const mockLogoutResponse = {
        success: true,
        message: 'Logged out successfully',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLogoutResponse,
      });

      const result = await logout();

      expect(fetch).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/logout',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer access-token-123',
          }),
        })
      );
      expect(result).toEqual(mockLogoutResponse);
    });

    test('logout without prior login', async () => {
      const mockResponse = {
        success: true,
        message: 'Logged out',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await logout();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProfile', () => {
    test('protected profile access with valid token', async () => {
      // First login to store access token
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          accessToken: 'access-token-123',
          refreshToken: 'refresh-token-456',
        }),
      });

      await login('test@example.com', 'Password123');

      // Now get profile
      const mockProfileResponse = {
        success: true,
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfileResponse,
      });

      const result = await getProfile();

      expect(fetch).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/protected/profile',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer access-token-123',
          }),
        })
      );
      expect(result).toEqual(mockProfileResponse);
    });

    test('unauthorized access errors - no token', async () => {
      const mockResponse = {
        success: false,
        error: 'Unauthorized',
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockResponse,
      });

      const result = await getProfile();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('unauthorized access errors - invalid token', async () => {
      // Login first
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          accessToken: 'expired-token',
          refreshToken: 'refresh-token',
        }),
      });

      await login('test@example.com', 'Password123');

      // Profile returns unauthorized
      const mockResponse = {
        success: false,
        error: 'Token expired or invalid',
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockResponse,
      });

      const result = await getProfile();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('error handling', () => {
    test('handles network errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      const result = await login('test@example.com', 'Password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network');
    });

    test('register handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      const result = await register('test@example.com', 'Password123', 'Password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network');
    });

    test('refreshToken handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      const result = await refreshToken('some-token');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network');
    });

    test('logout handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      const result = await logout();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network');
    });

    test('getProfile handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      const result = await getProfile();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network');
    });
  });
});
