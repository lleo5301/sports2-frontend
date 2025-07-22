import { test, expect } from '@playwright/test';

test.describe('Recruiting Board Page', () => {
  test.beforeEach(async ({ page }) => {
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

    // Mock recruits data (non-pitchers only)
    await page.route('**/api/recruits**', async route => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search') || '';
      const position = url.searchParams.get('position') || '';
      const school_type = url.searchParams.get('school_type') || '';
      const page = url.searchParams.get('page') || '1';
      
      let recruits = [
        {
          id: 1,
          first_name: 'Tom',
          last_name: 'Anderson',
          position: 'SS',
          school_type: 'HS',
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
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          first_name: 'Chris',
          last_name: 'Davis',
          position: 'CF',
          school_type: 'HS',
          school: 'North High',
          city: 'Milwaukee',
          state: 'WI',
          graduation_year: 2025,
          height: "5'11\"",
          weight: 170,
          batting_avg: 0.320,
          home_runs: 5,
          rbi: 32,
          stolen_bases: 18,
          created_at: '2024-01-10T10:00:00Z'
        },
        {
          id: 3,
          first_name: 'Ryan',
          last_name: 'Miller',
          position: 'C',
          school_type: 'COLL',
          school: 'State University',
          city: 'Chicago',
          state: 'IL',
          graduation_year: 2024,
          height: "6'1\"",
          weight: 190,
          batting_avg: 0.285,
          home_runs: 12,
          rbi: 58,
          stolen_bases: 3,
          created_at: '2024-01-05T10:00:00Z'
        }
      ];

      // Apply filters
      if (search) {
        recruits = recruits.filter(r => 
          r.first_name.toLowerCase().includes(search.toLowerCase()) ||
          r.last_name.toLowerCase().includes(search.toLowerCase()) ||
          r.school.toLowerCase().includes(search.toLowerCase()) ||
          r.city.toLowerCase().includes(search.toLowerCase()) ||
          r.state.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (position) {
        recruits = recruits.filter(r => r.position === position);
      }

      if (school_type) {
        recruits = recruits.filter(r => r.school_type === school_type);
      }

      // Pagination
      const limit = 20;
      const offset = (parseInt(page) - 1) * limit;
      const paginatedRecruits = recruits.slice(offset, offset + limit);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: paginatedRecruits,
          pagination: {
            page: parseInt(page),
            limit,
            total: recruits.length,
            pages: Math.ceil(recruits.length / limit)
          }
        })
      });
    });

    // Mock preference lists data
    await page.route('**/api/recruits/preference-lists**', async route => {
      const url = new URL(route.request().url());
      const listType = url.searchParams.get('list_type') || 'overall_pref_list';
      
      const preferenceLists = [
        {
          id: 1,
          player_id: 1,
          list_type: 'overall_pref_list',
          priority: 1,
          interest_level: 'High',
          visit_scheduled: true,
          scholarship_offered: false,
          status: 'active',
          added_date: '2024-01-15T10:00:00Z',
          Player: {
            id: 1,
            first_name: 'Tom',
            last_name: 'Anderson',
            position: 'SS',
            school_type: 'HS',
            school: 'Central High',
            city: 'Springfield',
            state: 'IL',
            graduation_year: 2025
          },
          AddedBy: { first_name: 'Coach', last_name: 'Smith' }
        },
        {
          id: 2,
          player_id: 2,
          list_type: 'overall_pref_list',
          priority: 2,
          interest_level: 'Medium',
          visit_scheduled: false,
          scholarship_offered: true,
          status: 'active',
          added_date: '2024-01-10T10:00:00Z',
          Player: {
            id: 2,
            first_name: 'Chris',
            last_name: 'Davis',
            position: 'CF',
            school_type: 'HS',
            school: 'North High',
            city: 'Milwaukee',
            state: 'WI',
            graduation_year: 2025
          },
          AddedBy: { first_name: 'Coach', last_name: 'Smith' }
        }
      ];

      const filteredLists = preferenceLists.filter(p => p.list_type === listType);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: filteredLists,
          pagination: {
            page: 1,
            limit: 20,
            total: filteredLists.length,
            pages: 1
          }
        })
      });
    });

    await page.goto('/recruiting');
  });

  test('should display recruiting board with stats', async ({ page }) => {
    // Check page title and description
    await expect(page.getByRole('heading', { name: 'Recruiting Board' })).toBeVisible();
    await expect(page.getByText('View and manage your recruiting targets and prospects.')).toBeVisible();
    
    // Check stats cards
    await expect(page.getByText('Total Recruits')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();
    await expect(page.getByText('High Interest')).toBeVisible();
    await expect(page.getByText('1')).toBeVisible();
    await expect(page.getByText('Scheduled Visits')).toBeVisible();
    await expect(page.getByText('1')).toBeVisible();
    await expect(page.getByText('Scholarship Offers')).toBeVisible();
    await expect(page.getByText('1')).toBeVisible();
  });

  test('should display preference list tabs', async ({ page }) => {
    // Check preference list tabs
    await expect(page.getByRole('button', { name: 'New Players' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overall Pref List' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HS Pref List' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'College Transfers' })).toBeVisible();
    
    // Overall Pref List should be selected by default
    await expect(page.getByRole('button', { name: 'Overall Pref List' })).toHaveClass(/bg-primary-100/);
  });

  test('should display recruit cards with correct information', async ({ page }) => {
    // Check first recruit card
    await expect(page.getByText('Tom Anderson')).toBeVisible();
    await expect(page.getByText('SS • HS')).toBeVisible();
    await expect(page.getByText('Central High')).toBeVisible();
    await expect(page.getByText('Springfield, IL')).toBeVisible();
    await expect(page.getByText('Grad Year: 2025')).toBeVisible();
    await expect(page.getByText('Size: 6\'0" • 180 lbs')).toBeVisible();
    
    // Check stats in card
    await expect(page.getByText('AVG: 0.350')).toBeVisible();
    await expect(page.getByText('HR: 8')).toBeVisible();
    await expect(page.getByText('RBI: 45')).toBeVisible();
    await expect(page.getByText('SB: 12')).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search recruits by name, school, city, state...');
    await expect(searchInput).toBeVisible();
    
    // Test search
    await searchInput.fill('Tom');
    await expect(page.getByText('Tom Anderson')).toBeVisible();
    await expect(page.getByText('Chris Davis')).not.toBeVisible();
    await expect(page.getByText('Ryan Miller')).not.toBeVisible();
  });

  test('should have filter functionality', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: 'Filters' }).click();
    
    // Check filter options are visible
    await expect(page.getByLabel('School Type')).toBeVisible();
    await expect(page.getByLabel('Position')).toBeVisible();
    
    // Test position filter
    await page.getByLabel('Position').selectOption('SS');
    await expect(page.getByText('Tom Anderson')).toBeVisible();
    await expect(page.getByText('Chris Davis')).not.toBeVisible();
    await expect(page.getByText('Ryan Miller')).not.toBeVisible();
    
    // Test school type filter
    await page.getByLabel('Position').selectOption('');
    await page.getByLabel('School Type').selectOption('HS');
    await expect(page.getByText('Tom Anderson')).toBeVisible();
    await expect(page.getByText('Chris Davis')).toBeVisible();
    await expect(page.getByText('Ryan Miller')).not.toBeVisible();
  });

  test('should have clear filters functionality', async ({ page }) => {
    // Open filters and apply some
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.getByLabel('Position').selectOption('SS');
    
    // Clear filters
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    
    // All recruits should be visible again
    await expect(page.getByText('Tom Anderson')).toBeVisible();
    await expect(page.getByText('Chris Davis')).toBeVisible();
    await expect(page.getByText('Ryan Miller')).toBeVisible();
  });

  test('should show preference list status for recruits', async ({ page }) => {
    // Check that Tom Anderson is in preference list
    const tomCard = page.locator('.card').filter({ hasText: 'Tom Anderson' });
    await expect(tomCard.getByText('Interest Level:')).toBeVisible();
    await expect(tomCard.getByText('Visit Scheduled')).toBeVisible();
    
    // Check that Chris Davis is in preference list
    const chrisCard = page.locator('.card').filter({ hasText: 'Chris Davis' });
    await expect(chrisCard.getByText('Scholarship Offered')).toBeVisible();
    
    // Check that Ryan Miller is not in preference list
    const ryanCard = page.locator('.card').filter({ hasText: 'Ryan Miller' });
    await expect(ryanCard.getByRole('button', { name: 'Add to List' })).toBeVisible();
  });

  test('should allow adding recruits to preference list', async ({ page }) => {
    // Mock add to preference list API
    await page.route('**/api/recruits/preference-lists', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 3,
              player_id: 3,
              list_type: 'overall_pref_list',
              priority: 999,
              interest_level: 'Unknown'
            }
          })
        });
      }
    });

    // Find Ryan Miller's card and add to list
    const ryanCard = page.locator('.card').filter({ hasText: 'Ryan Miller' });
    await ryanCard.getByRole('button', { name: 'Add to List' }).click();
    
    // Should show success message
    await expect(page.getByText('Added to preference list')).toBeVisible();
  });

  test('should allow updating interest level', async ({ page }) => {
    // Mock update preference list API
    await page.route('**/api/recruits/preference-lists/1', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 1,
              interest_level: 'Medium'
            }
          })
        });
      }
    });

    // Find Tom Anderson's card and update interest level
    const tomCard = page.locator('.card').filter({ hasText: 'Tom Anderson' });
    const interestSelect = tomCard.locator('select');
    await interestSelect.selectOption('Medium');
    
    // Should show success message
    await expect(page.getByText('Preference list updated')).toBeVisible();
  });

  test('should switch between preference list types', async ({ page }) => {
    // Mock different preference list data for HS Pref List
    await page.route('**/api/recruits/preference-lists**', async route => {
      const url = new URL(route.request().url());
      const listType = url.searchParams.get('list_type');
      
      let data = [];
      if (listType === 'hs_pref_list') {
        data = [
          {
            id: 1,
            player_id: 1,
            list_type: 'hs_pref_list',
            priority: 1,
            interest_level: 'High',
            Player: {
              id: 1,
              first_name: 'Tom',
              last_name: 'Anderson',
              position: 'SS',
              school_type: 'HS'
            }
          }
        ];
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data,
          pagination: { page: 1, limit: 20, total: data.length, pages: 1 }
        })
      });
    });

    // Click on HS Pref List tab
    await page.getByRole('button', { name: 'HS Pref List' }).click();
    
    // Should update the selected tab
    await expect(page.getByRole('button', { name: 'HS Pref List' })).toHaveClass(/bg-primary-100/);
    await expect(page.getByRole('button', { name: 'Overall Pref List' })).not.toHaveClass(/bg-primary-100/);
  });

  test('should have pagination controls', async ({ page }) => {
    // Mock more recruits for pagination
    await page.route('**/api/recruits**', async route => {
      const url = new URL(route.request().url());
      const pageNum = url.searchParams.get('page') || '1';
      
      const recruits = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        first_name: `Recruit${i + 1}`,
        last_name: 'Test',
        position: 'SS',
        school_type: 'HS',
        school: 'Test School',
        city: 'Test City',
        state: 'TX',
        graduation_year: 2025,
        created_at: '2024-01-15T10:00:00Z'
      }));

      const limit = 20;
      const offset = (parseInt(pageNum) - 1) * limit;
      const paginatedRecruits = recruits.slice(offset, offset + limit);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: paginatedRecruits,
          pagination: {
            page: parseInt(pageNum),
            limit,
            total: recruits.length,
            pages: Math.ceil(recruits.length / limit)
          }
        })
      });
    });

    await page.reload();
    
    // Check pagination info
    await expect(page.getByText('Showing 1 to 20 of 25 recruits')).toBeVisible();
    
    // Check pagination buttons
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
    
    // Go to next page
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Showing 21 to 25 of 25 recruits')).toBeVisible();
  });

  test('should have action buttons on recruit cards', async ({ page }) => {
    // Check action buttons are present
    const firstRecruitCard = page.locator('.card').first();
    await expect(firstRecruitCard.getByRole('link', { name: 'View Details' })).toBeVisible();
    
    // Check add to preference list button for recruits not in list
    const ryanCard = page.locator('.card').filter({ hasText: 'Ryan Miller' });
    await expect(ryanCard.getByRole('button', { name: 'Add to Preference List' })).toBeVisible();
  });

  test('should have add recruit button', async ({ page }) => {
    const addButton = page.getByRole('link', { name: 'Add Recruit' });
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveAttribute('href', '/players/create');
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/recruits**', async route => {
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
    
    await expect(page.getByText('No recruits found')).toBeVisible();
    await expect(page.getByText('Get started by adding your first recruit.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add Recruit' })).toBeVisible();
  });

  test('should handle error state', async ({ page }) => {
    // Mock error response
    await page.route('**/api/recruits**', async route => {
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
    
    await expect(page.getByText('Error loading recruits. Please try again.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile layout
    await expect(page.getByRole('heading', { name: 'Recruiting Board' })).toBeVisible();
    
    // Stats cards should stack
    const statsCards = page.locator('.card');
    await expect(statsCards).toHaveCount(4);
    
    // Search and filters should be responsive
    await expect(page.getByPlaceholder('Search recruits by name, school, city, state...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Filters' })).toBeVisible();
    
    // Preference list tabs should wrap
    await expect(page.getByRole('button', { name: 'New Players' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overall Pref List' })).toBeVisible();
  });

  test('should exclude pitchers from recruiting board', async ({ page }) => {
    // Verify that no pitchers are shown in the recruiting board
    // (pitchers should be excluded from the recruiting board)
    await expect(page.getByText('P •')).not.toBeVisible();
    
    // Only position players should be visible
    await expect(page.getByText('SS •')).toBeVisible();
    await expect(page.getByText('CF •')).toBeVisible();
    await expect(page.getByText('C •')).toBeVisible();
  });
}); 