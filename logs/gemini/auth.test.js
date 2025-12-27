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
