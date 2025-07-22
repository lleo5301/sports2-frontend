import { test, expect } from '@playwright/test';

test.describe('Players Management Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting up the auth context
    await page.addInitScript(() => {
      // Mock localStorage for authentication
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (key) => {
            if (key === 'token') return 'mock-jwt-token';
            return null;
          },
          setItem: (key, value) => {},
          removeItem: (key) => {}
        },
        writable: true
      });
    });

    // Mock user profile
    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 1,
            email: 'coach@example.edu',
            first_name: 'Coach',
            last_name: 'Smith',
            role: 'head_coach',
            team_id: 1
          }
        })
      });
    });

    // Mock players data
    await page.route('**/api/players**', async route => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search') || '';
      const position = url.searchParams.get('position') || '';
      const school_type = url.searchParams.get('school_type') || '';
      const status = url.searchParams.get('status') || 'active';
      const page = url.searchParams.get('page') || '1';
      
      let players = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          position: 'SS',
          school_type: 'HS',
          status: 'active',
          school: 'Central High',
          city: 'Springfield',
          state: 'IL',
          graduation_year: 2025,
          height: "6'0\"",
          weight: 180,
          batting_avg: 0.350,
          home_runs: 8,
          rbi: 45,
          stolen_bases: 12,
          created_at: '2024-01-15T10:00:00Z',
          Creator: { first_name: 'Coach', last_name: 'Smith' }
        },
        {
          id: 2,
          first_name: 'Mike',
          last_name: 'Johnson',
          position: 'P',
          school_type: 'COLL',
          status: 'active',
          school: 'State University',
          city: 'Chicago',
          state: 'IL',
          graduation_year: 2024,
          height: "6'2\"",
          weight: 195,
          era: 2.85,
          wins: 8,
          losses: 3,
          strikeouts: 95,
          innings_pitched: 85.2,
          created_at: '2024-01-10T10:00:00Z',
          Creator: { first_name: 'Coach', last_name: 'Smith' }
        },
        {
          id: 3,
          first_name: 'Alex',
          last_name: 'Wilson',
          position: 'CF',
          school_type: 'HS',
          status: 'inactive',
          school: 'North High',
          city: 'Milwaukee',
          state: 'WI',
          graduation_year: 2026,
          height: "5'11\"",
          weight: 170,
          batting_avg: 0.320,
          home_runs: 5,
          rbi: 32,
          stolen_bases: 18,
          created_at: '2024-01-05T10:00:00Z',
          Creator: { first_name: 'Coach', last_name: 'Smith' }
        }
      ];

      // Apply filters
      if (search) {
        players = players.filter(p => 
          p.first_name.toLowerCase().includes(search.toLowerCase()) ||
          p.last_name.toLowerCase().includes(search.toLowerCase()) ||
          p.school.toLowerCase().includes(search.toLowerCase()) ||
          p.city.toLowerCase().includes(search.toLowerCase()) ||
          p.state.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (position) {
        players = players.filter(p => p.position === position);
      }

      if (school_type) {
        players = players.filter(p => p.school_type === school_type);
      }

      if (status) {
        players = players.filter(p => p.status === status);
      }

      // Pagination
      const limit = 20;
      const offset = (parseInt(page) - 1) * limit;
      const paginatedPlayers = players.slice(offset, offset + limit);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: paginatedPlayers,
          pagination: {
            page: parseInt(page),
            limit,
            total: players.length,
            pages: Math.ceil(players.length / limit)
          }
        })
      });
    });

    // Mock stats summary
    await page.route('**/api/players/stats/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            total_players: 25,
            active_recruits: 15,
            recent_reports: 8,
            team_avg: 0.285
          }
        })
      });
    });

    await page.goto('/players');
  });

  test('should display players management page with stats', async ({ page }) => {
    // Check page title and description
    await expect(page.getByRole('heading', { name: 'Players' })).toBeVisible();
    await expect(page.getByText('Manage your team\'s player roster and information.')).toBeVisible();
    
    // Check stats cards
    await expect(page.getByText('Total Players')).toBeVisible();
    await expect(page.locator('.card').filter({ hasText: 'Total Players' }).getByText('25')).toBeVisible();
    await expect(page.getByText('Active Recruits')).toBeVisible();
    await expect(page.locator('.card').filter({ hasText: 'Active Recruits' }).getByText('15')).toBeVisible();
    await expect(page.getByText('Recent Reports')).toBeVisible();
    await expect(page.locator('.card').filter({ hasText: 'Recent Reports' }).getByText('8')).toBeVisible();
    await expect(page.getByText('Team Avg')).toBeVisible();
    await expect(page.locator('.card').filter({ hasText: 'Team Avg' }).getByText('0.285')).toBeVisible();
  });

  test('should display player cards with correct information', async ({ page }) => {
    // Check first player card
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('SS • HS')).toBeVisible();
    await expect(page.getByText('Central High')).toBeVisible();
    await expect(page.getByText('Springfield, IL')).toBeVisible();
    await expect(page.getByText('Grad Year: 2025')).toBeVisible();
    await expect(page.getByText('Size: 6\'0" • 180 lbs')).toBeVisible();
    
    // Check stats in card
    await expect(page.getByText('AVG: 0.350')).toBeVisible();
    await expect(page.getByText('HR: 8')).toBeVisible();
    
    // Check status badge
    await expect(page.getByText('Active')).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search players by name, school, city, state...');
    await expect(searchInput).toBeVisible();
    
    // Test search
    await searchInput.fill('John');
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Mike Johnson')).not.toBeVisible();
    await expect(page.getByText('Alex Wilson')).not.toBeVisible();
  });

  test('should have filter functionality', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: 'Filters' }).click();
    
    // Check filter options are visible
    await expect(page.getByLabel('School Type')).toBeVisible();
    await expect(page.getByLabel('Position')).toBeVisible();
    await expect(page.getByLabel('Status')).toBeVisible();
    
    // Test position filter
    await page.getByLabel('Position').selectOption('P');
    await expect(page.getByText('Mike Johnson')).toBeVisible();
    await expect(page.getByText('John Doe')).not.toBeVisible();
    await expect(page.getByText('Alex Wilson')).not.toBeVisible();
    
    // Test school type filter
    await page.getByLabel('Position').selectOption('');
    await page.getByLabel('School Type').selectOption('HS');
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Alex Wilson')).toBeVisible();
    await expect(page.getByText('Mike Johnson')).not.toBeVisible();
  });

  test('should have clear filters functionality', async ({ page }) => {
    // Open filters and apply some
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.getByLabel('Position').selectOption('P');
    
    // Clear filters
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    
    // All players should be visible again
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Mike Johnson')).toBeVisible();
    await expect(page.getByText('Alex Wilson')).toBeVisible();
  });

  test('should have pagination controls', async ({ page }) => {
    // Mock more players for pagination
    await page.route('**/api/players**', async route => {
      const url = new URL(route.request().url());
      const pageNum = url.searchParams.get('page') || '1';
      
      const players = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        first_name: `Player${i + 1}`,
        last_name: 'Test',
        position: 'SS',
        school_type: 'HS',
        status: 'active',
        school: 'Test School',
        city: 'Test City',
        state: 'TX',
        created_at: '2024-01-15T10:00:00Z',
        Creator: { first_name: 'Coach', last_name: 'Smith' }
      }));

      const limit = 20;
      const offset = (parseInt(pageNum) - 1) * limit;
      const paginatedPlayers = players.slice(offset, offset + limit);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: paginatedPlayers,
          pagination: {
            page: parseInt(pageNum),
            limit,
            total: players.length,
            pages: Math.ceil(players.length / limit)
          }
        })
      });
    });

    await page.reload();
    
    // Check pagination info
    await expect(page.getByText('Showing 1 to 20 of 25 players')).toBeVisible();
    
    // Check pagination buttons
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
    
    // Go to next page
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Showing 21 to 25 of 25 players')).toBeVisible();
  });

  test('should have action buttons on player cards', async ({ page }) => {
    // Check action buttons are present
    const firstPlayerCard = page.locator('.card').first();
    await expect(firstPlayerCard.getByRole('link', { name: 'View Details' })).toBeVisible();
    await expect(firstPlayerCard.getByRole('link', { name: 'Edit Player' })).toBeVisible();
    await expect(firstPlayerCard.getByRole('button', { name: 'Delete Player' })).toBeVisible();
  });

  test('should handle delete player action', async ({ page }) => {
    // Mock delete API
    await page.route('**/api/players/1', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Player deleted successfully'
          })
        });
      }
    });

    // Click delete button and confirm
    await page.locator('.card').first().getByRole('button', { name: 'Delete Player' }).click();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Should show success message
    await expect(page.getByText('Player deleted successfully')).toBeVisible();
  });

  test('should have add player button', async ({ page }) => {
    const addButton = page.getByRole('link', { name: 'Add Player' });
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveAttribute('href', '/players/create');
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/players**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0
          }
        })
      });
    });

    await page.reload();
    
    await expect(page.getByText('No players found')).toBeVisible();
    await expect(page.getByText('Get started by adding your first player.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add Player' })).toBeVisible();
  });

  test('should handle error state', async ({ page }) => {
    // Mock error response
    await page.route('**/api/players**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Server error'
        })
      });
    });

    await page.reload();
    
    await expect(page.getByText('Error loading players. Please try again.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile layout
    await expect(page.getByRole('heading', { name: 'Players' })).toBeVisible();
    
    // Stats cards should stack
    const statsCards = page.locator('.card');
    await expect(statsCards).toHaveCount(4);
    
    // Search and filters should be responsive
    await expect(page.getByPlaceholder('Search players by name, school, city, state...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Filters' })).toBeVisible();
  });
}); 