import { test, expect } from '@playwright/test';
import { setupAuthenticatedUser } from './helpers/api-mocks.js';
import { setupScoutingReportMocks } from './helpers/scouting-report-mocks.js';

test.describe('Visual Regression Tests - Scouting Reports', () => {
  test.beforeEach(async ({ page }) => {
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

    // Mock players with consistent data for visual tests
    await page.route('**/api/players**', async route => {
      const players = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          position: 'SS',
          school_type: 'HS',
          status: 'active',
          school: 'Central High School',
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
        }
      ];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: players,
          pagination: { page: 1, limit: 20, total: players.length, pages: 1 }
        })
      });
    });

    await setupScoutingReportMocks(page);
  });

  test('player modal with scouting reports section', async ({ page }) => {
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();

    // Open John Doe's player modal
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    // Wait for modal and reports to load
    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    // Wait for reports to be visible
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
    
    // Take screenshot of player modal with scouting reports
    await expect(page.locator('.modal.modal-open .modal-box')).toHaveScreenshot('player-modal-with-reports.png');
  });

  test('scouting reports list view', async ({ page }) => {
    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();

    // Focus on just the scouting reports section
    const reportsSection = page.locator('div:has(> h4:text("Scouting Reports"))');
    await expect(reportsSection).toHaveScreenshot('scouting-reports-section.png');
  });

  test('full scouting report detail modal', async ({ page }) => {
    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    // Click on first report
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Wait for report modal to fully load
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();

    // Take screenshot of full report modal
    await expect(page.locator('.modal.modal-open .modal-box.max-w-4xl')).toHaveScreenshot('full-report-modal.png');
  });

  test('tool grades grid layout', async ({ page }) => {
    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();

    // Focus on tool grades grid
    const gradesGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-4.mb-6');
    await expect(gradesGrid).toHaveScreenshot('tool-grades-grid.png');
  });

  test('pitcher report with pitching assessment', async ({ page }) => {
    await page.goto('/players');
    
    const mikeRow = page.locator('table.table tbody tr').filter({ hasText: 'Mike Johnson' });
    await mikeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    await expect(page.getByText('Scouting Report - Mike Johnson')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pitching Assessment' })).toBeVisible();

    // Screenshot the pitching assessment section
    const pitchingSection = page.locator('div:has(> h5:text("Pitching Assessment"))');
    await expect(pitchingSection).toHaveScreenshot('pitching-assessment.png');
  });

  test('empty reports state', async ({ page }) => {
    // Mock empty reports for this test
    await page.route('**/api/reports/scouting**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        })
      });
    });

    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('No scouting reports available for this player')).toBeVisible();

    // Screenshot empty state
    const reportsSection = page.locator('div:has(> h4:text("Scouting Reports"))');
    await expect(reportsSection).toHaveScreenshot('empty-reports-state.png');
  });

  test('mobile responsive player modal', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();

    // Screenshot mobile player modal
    await expect(page.locator('.modal.modal-open .modal-box')).toHaveScreenshot('mobile-player-modal.png');
  });

  test('mobile responsive report detail modal', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();

    // Screenshot mobile report modal
    await expect(page.locator('.modal.modal-open .modal-box.max-w-4xl')).toHaveScreenshot('mobile-report-modal.png');
  });

  test('report list item hover state', async ({ page }) => {
    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Hover over first report item
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.hover();

    // Wait a moment for hover state to apply
    await page.waitForTimeout(100);

    // Screenshot hover state
    await expect(firstReport).toHaveScreenshot('report-item-hover.png');
  });

  test('loading state visual', async ({ page }) => {
    // Add delay to mock to capture loading state
    await page.route('**/api/reports/scouting**', async route => {
      // Add delay to see loading state
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const url = new URL(route.request().url());
      const playerId = url.searchParams.get('player_id');
      
      const reports = playerId === '1' ? [{
        id: 1,
        player_id: 1,
        report_date: '2024-03-15',
        overall_grade: 'B+',
        Player: { first_name: 'John', last_name: 'Doe' },
        User: { first_name: 'Coach', last_name: 'Smith' }
      }] : [];
      
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

    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    // Wait for modal to open and capture loading state
    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();
    
    // Capture loading spinner
    await expect(page.locator('.loading.loading-spinner')).toBeVisible();
    
    const reportsSection = page.locator('div:has(> h4:text("Scouting Reports"))');
    await expect(reportsSection).toHaveScreenshot('reports-loading-state.png');
  });
});
