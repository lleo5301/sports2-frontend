import { test, expect } from '@playwright/test';

test.describe('Performance API Integration', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    // Login to get auth token
    const loginResponse = await request.post('http://localhost:5000/api/auth/login', {
      data: {
        email: 'user@example.com',
        password: 'password'
      }
    });

    if (loginResponse.ok()) {
      const loginData = await loginResponse.json();
      authToken = loginData.data.token;
    }
  });

  test('should fetch performance data from API', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const response = await request.get('http://localhost:5000/api/players/performance', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.summary).toBeDefined();
    expect(data.summary).toHaveProperty('total_players');
    expect(data.summary).toHaveProperty('team_batting_avg');
    expect(data.summary).toHaveProperty('team_era');
  });

  test('should filter performance data by position', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const response = await request.get('http://localhost:5000/api/players/performance?position=P', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    // All returned players should be pitchers
    data.data.forEach(player => {
      expect(player.position).toBe('P');
    });
  });

  test('should sort performance data correctly', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const response = await request.get('http://localhost:5000/api/players/performance?sort_by=home_runs&order=DESC', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    if (data.data.length > 1) {
      // Verify home runs are in descending order
      for (let i = 1; i < data.data.length; i++) {
        expect(data.data[i].home_runs).toBeLessThanOrEqual(data.data[i-1].home_runs);
      }
    }
  });

  test('should include calculated statistics', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const response = await request.get('http://localhost:5000/api/players/performance', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    if (data.data.length > 0) {
      const player = data.data[0];
      expect(player).toHaveProperty('rank');
      expect(player).toHaveProperty('calculated_stats');
      expect(player.calculated_stats).toHaveProperty('performance_score');
      expect(player).toHaveProperty('display_stats');
      expect(player.display_stats).toHaveProperty('batting_avg');
    }
  });

  test('should handle invalid filters gracefully', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const response = await request.get('http://localhost:5000/api/players/performance?position=INVALID', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validation error');
  });
});
