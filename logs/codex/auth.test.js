const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  setBaseUrl,
  getTokens,
} = require('../src/auth');

describe('auth module', () => {
  beforeEach(() => {
    // Ensure base URL starts from default for each test
    setBaseUrl('http://localhost:3000');
    // Reset fetch between tests
    global.fetch = undefined;
  });

  test('successful registration', async () => {
    const email = 'user@example.com';
    const password = 'Password1';

    const mockResponse = {
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue({
        success: true,
        message: 'User registered',
      }),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await register(email, password, password);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          confirmPassword: password,
        }),
      }),
    );

    expect(result).toEqual({
      success: true,
      message: 'User registered',
    });
  });

  test('registration validation errors', async () => {
    global.fetch = jest.fn();

    const result = await register('bad-email', 'short', 'different');

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Validation failed');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).toHaveProperty('confirmPassword');
  });

  test('successful login stores tokens', async () => {
    const email = 'user@example.com';
    const password = 'Password1';

    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      }),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await login(email, password);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.accessToken).toBe('access-token-123');
    expect(result.refreshToken).toBe('refresh-token-456');

    const tokens = getTokens();
    expect(tokens.accessToken).toBe('access-token-123');
    expect(tokens.refreshToken).toBe('refresh-token-456');
  });

  test('invalid credentials error on login', async () => {
    const email = 'user@example.com';
    const password = 'WrongPass1';

    const mockResponse = {
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({
        error: 'Invalid credentials',
      }),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await login(email, password);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.error).toBe('Invalid credentials');

    const tokens = getTokens();
    expect(tokens.accessToken).toBeNull();
    expect(tokens.refreshToken).toBeNull();
  });

  test('token refresh updates stored access token', async () => {
    const email = 'user@example.com';
    const password = 'Password1';

    const loginResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        accessToken: 'old-access-token',
        refreshToken: 'refresh-token-xyz',
      }),
    };

    const refreshResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
      }),
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(loginResponse)
      .mockResolvedValueOnce(refreshResponse);

    await login(email, password);

    const refreshResult = await refreshToken();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://localhost:3000/api/refresh',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          refreshToken: 'refresh-token-xyz',
        }),
      }),
    );

    expect(refreshResult.accessToken).toBe('new-access-token');
    const tokens = getTokens();
    expect(tokens.accessToken).toBe('new-access-token');
    expect(tokens.refreshToken).toBe('refresh-token-xyz');
  });

  test('logout sends tokens and clears them', async () => {
    const email = 'user@example.com';
    const password = 'Password1';

    const loginResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        accessToken: 'access-token-logout',
        refreshToken: 'refresh-token-logout',
      }),
    };

    const logoutResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        success: true,
        message: 'Logged out',
      }),
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(loginResponse)
      .mockResolvedValueOnce(logoutResponse);

    await login(email, password);
    const result = await logout();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://localhost:3000/api/logout',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token-logout',
        }),
        body: JSON.stringify({
          refreshToken: 'refresh-token-logout',
        }),
      }),
    );

    expect(result).toEqual({
      success: true,
      message: 'Logged out',
    });

    const tokens = getTokens();
    expect(tokens.accessToken).toBeNull();
    expect(tokens.refreshToken).toBeNull();
  });

  test('protected profile access with valid token', async () => {
    const email = 'user@example.com';
    const password = 'Password1';

    const loginResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        accessToken: 'profile-access-token',
        refreshToken: 'profile-refresh-token',
      }),
    };

    const profileResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        email,
        id: 'user-id-123',
      }),
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(loginResponse)
      .mockResolvedValueOnce(profileResponse);

    await login(email, password);
    const profile = await getProfile();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://localhost:3000/api/protected/profile',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer profile-access-token',
        }),
      }),
    );

    expect(profile).toEqual({
      email,
      id: 'user-id-123',
    });
  });

  test('unauthorized access error when no token available', async () => {
    global.fetch = jest.fn();

    const profile = await getProfile();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(profile.ok).toBe(false);
    expect(profile.error).toBe('No access token available');
  });
});

