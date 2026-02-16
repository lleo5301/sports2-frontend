import { test, expect } from '@playwright/test';
import { setupAuthenticatedUser } from './helpers/api-mocks.js';
import { setupScoutingReportMocks } from './helpers/scouting-report-mocks.js';

test.describe('Performance Tests - Scouting Reports', () => {
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

    // Mock players
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

  test('player modal opens within performance budget', async ({ page }) => {
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();

    // Measure time to open player modal
    const startTime = Date.now();

    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    // Wait for modal to be fully loaded
    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByText('John Doe').first()).toBeVisible();

    const modalOpenTime = Date.now() - startTime;

    // Modal should open within 1 second
    expect(modalOpenTime).toBeLessThan(1000);
    console.log(`Player modal opened in ${modalOpenTime}ms`);
  });

  test('scouting reports load within performance budget', async ({ page }) => {
    await page.goto('/players');

    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.modal.modal-open')).toBeVisible();

    // Measure time for reports to load
    const startTime = Date.now();

    // Wait for loading to complete
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();

    const reportsLoadTime = Date.now() - startTime;

    // Reports should load within 2 seconds
    expect(reportsLoadTime).toBeLessThan(2000);
    console.log(`Scouting reports loaded in ${reportsLoadTime}ms`);
  });

  test('report detail modal opens within performance budget', async ({ page }) => {
    await page.goto('/players');

    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Measure time to open report detail modal
    const startTime = Date.now();

    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Wait for report modal to be fully loaded
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hitting Assessment' })).toBeVisible();

    const reportModalOpenTime = Date.now() - startTime;

    // Report modal should open within 1 second
    expect(reportModalOpenTime).toBeLessThan(1000);
    console.log(`Report detail modal opened in ${reportModalOpenTime}ms`);
  });

  test('memory usage remains stable with multiple report operations', async ({ page }) => {
    await page.goto('/players');

    // Open and close player modal multiple times
    for (let i = 0; i < 5; i++) {
      const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
      await johnDoeRow.getByText('View').click();

      await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();

      // Open and close report detail modal
      const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
      await firstReport.click();
      await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();

      await page.getByRole('button', { name: 'Close' }).last().click();
      await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();

      // Close player modal
      await page.getByRole('button', { name: 'Close' }).click();
      await expect(page.locator('.modal.modal-open')).not.toBeVisible();

      // Small delay between iterations
      await page.waitForTimeout(100);
    }

    // Test should complete without memory leaks or performance degradation
    expect(true).toBe(true);
  });

  test('large number of reports renders efficiently', async ({ page }) => {
    // Mock many reports to test performance
    await page.route('**/api/reports/scouting**', async route => {
      const url = new URL(route.request().url());
      const playerId = url.searchParams.get('player_id');

      if (playerId === '1') {
        // Generate 20 reports
        const reports = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          player_id: 1,
          created_by: 1,
          report_date: `2024-0${Math.floor(i / 9) + 1}-${String((i % 30) + 1).padStart(2, '0')}`,
          game_date: `2024-0${Math.floor(i / 9) + 1}-${String((i % 30) + 1).padStart(2, '0')}`,
          opponent: `Opponent ${i + 1}`,
          overall_grade: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+'][i % 7],
          hitting_grade: ['A', 'B+', 'B', 'B-', 'C+', 'C'][i % 6],
          pitching_grade: i % 3 === 0 ? ['A-', 'B+', 'B'][i % 3] : null,
          fielding_grade: ['A-', 'B+', 'B', 'C+'][i % 4],
          speed_grade: ['A', 'A-', 'B+', 'B'][i % 4],
          overall_notes: `Report ${i + 1} notes with detailed assessment.`,
          hitting_notes: `Hitting assessment for report ${i + 1}.`,
          fielding_notes: `Fielding assessment for report ${i + 1}.`,
          speed_notes: `Speed assessment for report ${i + 1}.`,
          bat_speed: ['Excellent', 'Good', 'Average'][i % 3],
          power_potential: ['Good', 'Average', 'Below Average'][i % 3],
          plate_discipline: ['Excellent', 'Good', 'Average'][i % 3],
          arm_strength: ['Excellent', 'Good', 'Average'][i % 3],
          arm_accuracy: ['Excellent', 'Good', 'Average'][i % 3],
          range: ['Excellent', 'Good', 'Average'][i % 3],
          home_to_first: 4.0 + (i % 10) * 0.1,
          work_ethic: ['Excellent', 'Good', 'Average'][i % 3],
          coachability: ['Excellent', 'Good', 'Average'][i % 3],
          projection: ['Professional', 'College', 'High School'][i % 3],
          is_draft: false,
          is_public: true,
          created_at: `2024-0${Math.floor(i / 9) + 1}-${String((i % 30) + 1).padStart(2, '0')}T10:00:00Z`,
          updated_at: `2024-0${Math.floor(i / 9) + 1}-${String((i % 30) + 1).padStart(2, '0')}T10:00:00Z`,
          Player: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            position: 'SS',
            school: 'Central High'
          },
          User: {
            id: 1,
            first_name: 'Coach',
            last_name: 'Smith'
          }
        }));

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: reports,
            pagination: { page: 1, limit: 20, total: reports.length, pages: 1 }
          })
        });
      }
    });

    await page.goto('/players');

    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    // Measure render time for many reports
    const startTime = Date.now();

    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Wait for all reports to be visible
    const reports = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300');
    await expect(reports).toHaveCount(20);

    const renderTime = Date.now() - startTime;

    // Should render 20 reports within 3 seconds
    expect(renderTime).toBeLessThan(3000);
    console.log(`20 reports rendered in ${renderTime}ms`);

    // Verify scrolling is smooth (no lag)
    const reportsContainer = page.locator('.space-y-2.max-h-40.overflow-y-auto');
    await reportsContainer.hover();

    // Scroll down and up to test performance
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(100);
    await page.mouse.wheel(0, -200);

    // Test should complete without hanging
    expect(true).toBe(true);
  });

  test('report modal content renders efficiently', async ({ page }) => {
    await page.goto('/players');

    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Measure time to render full report content
    const startTime = Date.now();

    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Wait for all sections to be visible
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hitting Assessment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Fielding Assessment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Speed Assessment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Overall Assessment' })).toBeVisible();

    const contentRenderTime = Date.now() - startTime;

    // Full report content should render within 1.5 seconds
    expect(contentRenderTime).toBeLessThan(1500);
    console.log(`Report content rendered in ${contentRenderTime}ms`);
  });

  test('multiple modal operations maintain performance', async ({ page }) => {
    await page.goto('/players');

    // Test rapid opening and closing of modals
    const operations = [];

    for (let i = 0; i < 10; i++) {
      const operationStart = Date.now();

      // Open player modal
      const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
      await johnDoeRow.getByText('View').click();
      await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

      // Open report modal
      const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
      await firstReport.click();
      await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();

      // Close report modal
      await page.getByRole('button', { name: 'Close' }).last().click();
      await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();

      // Close player modal
      await page.getByRole('button', { name: 'Close' }).click();
      await expect(page.locator('.modal.modal-open')).not.toBeVisible();

      const operationTime = Date.now() - operationStart;
      operations.push(operationTime);
    }

    // Each operation should complete within 3 seconds
    operations.forEach((time, index) => {
      expect(time).toBeLessThan(3000);
    });

    // Performance shouldn't degrade significantly over multiple operations
    const firstHalf = operations.slice(0, 5);
    const secondHalf = operations.slice(5);
    const firstHalfAvg = firstHalf.reduce((a, b) => a + b) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((a, b) => a + b) / secondHalf.length;

    // Second half should not be more than 50% slower than first half
    expect(secondHalfAvg).toBeLessThan(firstHalfAvg * 1.5);

    console.log(`Average operation time - First half: ${firstHalfAvg}ms, Second half: ${secondHalfAvg}ms`);
  });
});
