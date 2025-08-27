import { test, expect } from '@playwright/test';
import { setupAuthenticatedUser, mockPlayerEndpoints } from './helpers/api-mocks.js';
import { setupScoutingReportMocks, mockEmptyScoutingReports, mockScoutingReports } from './helpers/scouting-report-mocks.js';

test.describe('Scouting Reports in Player Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated user context
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token');
    });
    
    // Mock auth endpoints
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

    // Mock players data with detailed information
    await page.route('**/api/players**', async route => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search') || '';
      const position = url.searchParams.get('position') || '';
      const school_type = url.searchParams.get('school_type') || '';
      const status = url.searchParams.get('status') || 'active';
      const page_num = url.searchParams.get('page') || '1';
      
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
          status: 'active',
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

      // Apply filters (same logic as in players-management.spec.js)
      if (search) {
        players = players.filter(p => 
          p.first_name.toLowerCase().includes(search.toLowerCase()) ||
          p.last_name.toLowerCase().includes(search.toLowerCase()) ||
          p.school.toLowerCase().includes(search.toLowerCase()) ||
          p.city.toLowerCase().includes(search.toLowerCase()) ||
          p.state.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (position) players = players.filter(p => p.position === position);
      if (school_type) players = players.filter(p => p.school_type === school_type);
      if (status) players = players.filter(p => p.status === status);

      // Pagination
      const limit = 20;
      const offset = (parseInt(page_num) - 1) * limit;
      const paginatedPlayers = players.slice(offset, offset + limit);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: paginatedPlayers,
          pagination: {
            page: parseInt(page_num),
            limit,
            total: players.length,
            pages: Math.ceil(players.length / limit)
          }
        })
      });
    });

    // Setup scouting report mocks
    await setupScoutingReportMocks(page);

    // Navigate to players page
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();
    await expect(page.locator('table.table tbody')).toBeVisible();
  });

  test('should display scouting reports section when viewing a player', async ({ page }) => {
    // Click View button for John Doe (player with reports)
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    // Wait for player modal to open
    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();

    // Check that scouting reports section is visible
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();

    // Wait for reports to load
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Check that reports are displayed
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
    await expect(page.getByText('Report Date: 2/20/2024')).toBeVisible();
  });

  test('should show tool grades preview in report list', async ({ page }) => {
    // Open John Doe's player modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Check for tool grades badges in the first report
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await expect(firstReport.getByText('Overall: B+')).toBeVisible();
    await expect(firstReport.getByText('Hitting: B')).toBeVisible();
  });

  test('should show game date and opponent when available', async ({ page }) => {
    // Open John Doe's player modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Check for game date and opponent in reports
    await expect(page.getByText('Game Date: 3/14/2024')).toBeVisible();
    await expect(page.getByText('vs State University')).toBeVisible();
    await expect(page.getByText('Game Date: 2/19/2024')).toBeVisible();
    await expect(page.getByText('vs Metro High')).toBeVisible();
  });

  test('should open full report modal when clicking on a report', async ({ page }) => {
    // Open John Doe's player modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Click on the first report
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Wait for report detail modal to open
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    
    // Check report header information
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
    await expect(page.getByText('Game Date: 3/14/2024')).toBeVisible();
    await expect(page.getByText('Opponent: State University')).toBeVisible();
    await expect(page.getByText('Scout: Coach Smith')).toBeVisible();
  });

  test('should display tool grades grid in full report modal', async ({ page }) => {
    // Open John Doe's player modal and click first report
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Check tool grades grid
    const gradesGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-4.mb-6');
    await expect(gradesGrid).toBeVisible();

    // Check individual grade cards
    await expect(page.getByText('B+').and(page.locator('.text-lg.font-bold.text-primary'))).toBeVisible();
    await expect(page.getByText('Overall Grade')).toBeVisible();
    await expect(page.getByText('B').and(page.locator('.text-lg.font-bold.text-secondary'))).toBeVisible();
    await expect(page.getByText('Hitting Grade')).toBeVisible();
    await expect(page.getByText('B+').and(page.locator('.text-lg.font-bold.text-info'))).toBeVisible();
    await expect(page.getByText('Fielding Grade')).toBeVisible();
  });

  test('should display detailed assessment sections in full report', async ({ page }) => {
    // Open John Doe's player modal and click first report
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Check hitting assessment section
    await expect(page.getByRole('heading', { name: 'Hitting Assessment' })).toBeVisible();
    await expect(page.getByText('Bat Speed: Good')).toBeVisible();
    await expect(page.getByText('Power: Average')).toBeVisible();
    await expect(page.getByText('Plate Discipline: Good')).toBeVisible();

    // Check fielding assessment section
    await expect(page.getByRole('heading', { name: 'Fielding Assessment' })).toBeVisible();
    await expect(page.getByText('Arm Strength: Good')).toBeVisible();
    await expect(page.getByText('Arm Accuracy: Excellent')).toBeVisible();
    await expect(page.getByText('Range: Excellent')).toBeVisible();

    // Check speed assessment section
    await expect(page.getByRole('heading', { name: 'Speed Assessment' })).toBeVisible();
    await expect(page.getByText('Home to First: 4.1 seconds')).toBeVisible();

    // Check overall assessment section
    await expect(page.getByRole('heading', { name: 'Overall Assessment' })).toBeVisible();
    await expect(page.getByText('Solid prospect with good fundamentals')).toBeVisible();
  });

  test('should display pitching assessment for pitcher reports', async ({ page }) => {
    // Open Mike Johnson's (pitcher) player modal
    const mikeRow = page.locator('table.table tbody tr').filter({ hasText: 'Mike Johnson' });
    await mikeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    // Click on Mike's report (should be the pitcher report)
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Check pitching assessment section
    await expect(page.getByRole('heading', { name: 'Pitching Assessment' })).toBeVisible();
    await expect(page.getByText('Fastball Velocity: 92 mph')).toBeVisible();
    await expect(page.getByText('Fastball Grade: A-')).toBeVisible();
    await expect(page.getByText('Breaking Ball: A')).toBeVisible();
    await expect(page.getByText('Command: Excellent')).toBeVisible();
    await expect(page.getByText('Outstanding control and velocity')).toBeVisible();
  });

  test('should close report detail modal when clicking close button', async ({ page }) => {
    // Open player modal and report detail modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Verify report modal is open
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();

    // Click close button
    await page.getByRole('button', { name: 'Close' }).last().click();

    // Verify report modal is closed but player modal is still open
    await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();
    await expect(page.getByText('John Doe').first()).toBeVisible(); // Player name in player modal
  });

  test('should handle player with no scouting reports', async ({ page }) => {
    // Mock empty reports for player 3 (Alex Wilson)
    await mockEmptyScoutingReports(page, 3);

    // Open Alex Wilson's player modal
    const alexRow = page.locator('table.table tbody tr').filter({ hasText: 'Alex Wilson' });
    await alexRow.getByText('View').click();

    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Check empty state message
    await expect(page.getByText('No scouting reports available for this player')).toBeVisible();
  });

  test('should show loading state while fetching reports', async ({ page }) => {
    // Add delay to mock to see loading state
    await page.route('**/api/reports/scouting**', async route => {
      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const url = new URL(route.request().url());
      const playerId = url.searchParams.get('player_id');
      
      let reports = [...mockScoutingReports];
      if (playerId) {
        reports = reports.filter(report => report.player_id.toString() === playerId);
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: reports,
          pagination: { page: 1, limit: 20, total: reports.length, pages: 1 }
        })
      });
    });

    // Open player modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();

    // Check loading spinner is visible
    await expect(page.locator('.loading.loading-spinner')).toBeVisible();

    // Wait for loading to complete
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    // Verify reports are loaded
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
  });

  test('should handle error when fetching scouting reports', async ({ page }) => {
    // Mock error response for scouting reports
    await page.route('**/api/reports/scouting**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Server error'
        })
      });
    });

    // Open player modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Should show empty state when reports fail to load
    await expect(page.getByText('No scouting reports available for this player')).toBeVisible();
  });

  test('should handle error when fetching specific report details', async ({ page }) => {
    // Open player modal first
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Mock error for specific report
    await page.route('**/api/reports/scouting/1', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Server error'
        })
      });
    });

    // Click on first report - should handle error gracefully
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Report detail modal should not open due to error
    await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();
    
    // Player modal should still be open
    await expect(page.getByText('John Doe').first()).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open player modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Check scouting reports section is visible on mobile
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();
    
    // Reports should be scrollable on mobile
    const reportsContainer = page.locator('.space-y-2.max-h-40.overflow-y-auto');
    await expect(reportsContainer).toBeVisible();

    // Click on a report to open detail modal
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Check that modal is responsive
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    
    // Tool grades should stack properly on mobile
    const gradesGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    await expect(gradesGrid).toBeVisible();
  });

  test('should show truncated grade list with "more grades" indicator', async ({ page }) => {
    // Open player modal for Mike Johnson (pitcher with more tool grades)
    const mikeRow = page.locator('table.table tbody tr').filter({ hasText: 'Mike Johnson' });
    await mikeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Check that first report shows grade summary
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    
    // Should show first 2 grades
    await expect(firstReport.getByText('Overall: A-')).toBeVisible();
    await expect(firstReport.getByText('Hitting: C')).toBeVisible();
    
    // Should show "more grades" indicator since pitcher has more than 2 grades
    await expect(firstReport.getByText(/\+\d+ more grades/)).toBeVisible();
  });
});
