/**
 * Comprehensive API mocking helpers for Playwright tests
 */

/**
 * Mock authentication endpoints with cookie-based authentication
 * @param {import('@playwright/test').Page} page
 */
export async function mockAuthEndpoints(page) {
  // Mock CSRF token endpoint
  await page.route('**/api/auth/csrf-token', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        token: 'mock-csrf-token'
      }),
      headers: {
        'Set-Cookie': '__Host-psifi.x-csrf-token=mock-csrf-cookie; Path=/; HttpOnly; SameSite=Strict'
      }
    });
  });

  // Mock login endpoint - sets JWT in httpOnly cookie
  await page.route('**/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'head_coach',
          team_id: 1
        }
      }),
      headers: {
        'Set-Cookie': 'token=mock-jwt-token; Path=/; HttpOnly; SameSite=Strict'
      }
    });
  });

  // Mock profile endpoint - checks for cookie instead of Bearer token
  await page.route('**/api/auth/me', async route => {
    const cookieHeader = route.request().headers().cookie || '';
    const hasTokenCookie = cookieHeader.includes('token=');

    if (!hasTokenCookie) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'head_coach',
          team_id: 1
        }
      })
    });
  });

  // Mock registration endpoint - sets JWT in httpOnly cookie
  await page.route('**/api/auth/register', async route => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: 2,
          email: 'newuser@example.com',
          first_name: 'New',
          last_name: 'User',
          role: 'assistant_coach',
          team_id: 1
        }
      }),
      headers: {
        'Set-Cookie': 'token=new-mock-jwt-token; Path=/; HttpOnly; SameSite=Strict'
      }
    });
  });

  // Mock logout endpoint - clears cookies
  await page.route('**/api/auth/logout', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Logged out successfully'
      }),
      headers: {
        'Set-Cookie': [
          'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
          '__Host-psifi.x-csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        ].join(', ')
      }
    });
  });
}

/**
 * Mock player endpoints
 * @param {import('@playwright/test').Page} page
 */
export async function mockPlayerEndpoints(page) {
  const mockPlayers = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      position: 'Pitcher',
      jersey_number: 15,
      year: 'Junior',
      team_id: 1
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      position: 'Catcher',
      jersey_number: 23,
      year: 'Senior',
      team_id: 1
    }
  ];

  await page.route('**/api/players', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockPlayers
      })
    });
  });

  await page.route('**/api/players/*', async route => {
    const playerId = route.request().url().split('/').pop();
    const player = mockPlayers.find(p => p.id.toString() === playerId);

    if (!player) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Player not found' })
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: player
      })
    });
  });
}

/**
 * Mock team endpoints
 * @param {import('@playwright/test').Page} page
 */
export async function mockTeamEndpoints(page) {
  const mockTeam = {
    id: 1,
    name: 'Test University Eagles',
    conference: 'Test Conference',
    season: '2024'
  };

  await page.route('**/api/teams/*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockTeam
      })
    });
  });
}

/**
 * Mock error responses for testing error handling
 * @param {import('@playwright/test').Page} page
 */
export async function mockErrorResponses(page) {
  // Mock network error
  await page.route('**/api/network-error', async route => {
    await route.abort('failed');
  });

  // Mock server error
  await page.route('**/api/server-error', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal server error' })
    });
  });

  // Mock validation error
  await page.route('**/api/validation-error', async route => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Validation failed',
        details: {
          email: 'Invalid email format',
          password: 'Password too short'
        }
      })
    });
  });
}

/**
 * Setup all API mocks
 * @param {import('@playwright/test').Page} page
 */
export async function setupAllMocks(page) {
  await mockAuthEndpoints(page);
  await mockPlayerEndpoints(page);
  await mockTeamEndpoints(page);
  await mockErrorResponses(page);
}

/**
 * Setup authenticated user context with cookie-based authentication
 * @param {import('@playwright/test').Page} page
 */
export async function setupAuthenticatedUser(page) {
  // Set authentication cookie instead of localStorage
  await page.context().addCookies([
    {
      name: 'token',
      value: 'mock-jwt-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Strict'
    }
  ]);

  // Setup user context in page
  await page.addInitScript(() => {
    window.__TEST_USER__ = {
      id: 1,
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'head_coach',
      team_id: 1
    };
  });
}
