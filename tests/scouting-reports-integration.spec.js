import { test, expect } from '@playwright/test';
import { setupAuthenticatedUser } from './helpers/api-mocks.js';
import { setupScoutingReportMocks, mockScoutingReports } from './helpers/scouting-report-mocks.js';

test.describe('Scouting Reports Integration Tests', () => {
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

    // Enhanced player mock with more realistic data
    await page.route('**/api/players**', async route => {
      const url = new URL(route.request().url());
      
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

  test('complete user journey: view player → see reports → view full report details', async ({ page }) => {
    // Step 1: Navigate to players page
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();

    // Step 2: Verify players are loaded
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Mike Johnson')).toBeVisible();

    // Step 3: Click View on John Doe
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await expect(johnDoeRow).toBeVisible();
    await johnDoeRow.getByText('View').click();

    // Step 4: Verify player modal opens with basic info
    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByText('John Doe').first()).toBeVisible();
    await expect(page.getByText('Position:')).toBeVisible();
    await expect(page.getByText('SS')).toBeVisible();
    await expect(page.getByText('Central High School')).toBeVisible();

    // Step 5: Verify Performance Stats section
    await expect(page.getByRole('heading', { name: 'Performance Stats' })).toBeVisible();
    await expect(page.getByText('0.350')).toBeVisible(); // Batting avg
    await expect(page.getByText('8')).toBeVisible(); // Home runs

    // Step 6: Verify Scouting Reports section appears
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();

    // Step 7: Wait for reports to load and verify they appear
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    // Verify multiple reports are shown
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
    await expect(page.getByText('Report Date: 2/20/2024')).toBeVisible();

    // Step 8: Verify report preview information
    const mostRecentReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await expect(mostRecentReport.getByText('Game Date: 3/14/2024')).toBeVisible();
    await expect(mostRecentReport.getByText('vs State University')).toBeVisible();
    await expect(mostRecentReport.getByText('Overall: B+')).toBeVisible();
    await expect(mostRecentReport.getByText('Hitting: B')).toBeVisible();

    // Step 9: Click on the most recent report
    await mostRecentReport.click();

    // Step 10: Verify full report modal opens
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();

    // Step 11: Verify report header details
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
    await expect(page.getByText('Game Date: 3/14/2024')).toBeVisible();
    await expect(page.getByText('Opponent: State University')).toBeVisible();
    await expect(page.getByText('Scout: Coach Smith')).toBeVisible();
    await expect(page.getByText('Position: SS')).toBeVisible();

    // Step 12: Verify tool grades grid
    const overallGrade = page.locator('.text-lg.font-bold.text-primary').filter({ hasText: 'B+' });
    await expect(overallGrade).toBeVisible();
    await expect(page.getByText('Overall Grade')).toBeVisible();

    const hittingGrade = page.locator('.text-lg.font-bold.text-secondary').filter({ hasText: 'B' });
    await expect(hittingGrade).toBeVisible();
    await expect(page.getByText('Hitting Grade')).toBeVisible();

    const fieldingGrade = page.locator('.text-lg.font-bold.text-info').filter({ hasText: 'B+' });
    await expect(fieldingGrade).toBeVisible();
    await expect(page.getByText('Fielding Grade')).toBeVisible();

    const speedGrade = page.locator('.text-lg.font-bold.text-warning').filter({ hasText: 'A-' });
    await expect(speedGrade).toBeVisible();
    await expect(page.getByText('Speed Grade')).toBeVisible();

    // Step 13: Verify detailed assessment sections
    await expect(page.getByRole('heading', { name: 'Hitting Assessment' })).toBeVisible();
    await expect(page.getByText('Bat Speed: Good')).toBeVisible();
    await expect(page.getByText('Power: Average')).toBeVisible();
    await expect(page.getByText('Plate Discipline: Good')).toBeVisible();
    await expect(page.getByText('Good approach at the plate, needs to improve power.')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Fielding Assessment' })).toBeVisible();
    await expect(page.getByText('Arm Strength: Good')).toBeVisible();
    await expect(page.getByText('Arm Accuracy: Excellent')).toBeVisible();
    await expect(page.getByText('Range: Excellent')).toBeVisible();
    await expect(page.getByText('Excellent range and good arm strength.')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Speed Assessment' })).toBeVisible();
    await expect(page.getByText('Home to First: 4.1 seconds')).toBeVisible();
    await expect(page.getByText('Very fast, excellent base stealing potential.')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Overall Assessment' })).toBeVisible();
    await expect(page.getByText('Solid prospect with good fundamentals. Shows strong leadership qualities and work ethic.')).toBeVisible();

    // Step 14: Close report modal and verify we're back to player modal
    await page.getByRole('button', { name: 'Close' }).last().click();
    await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();
    await expect(page.getByText('John Doe').first()).toBeVisible(); // Still in player modal

    // Step 15: Close player modal and verify we're back to players list
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('.modal.modal-open')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();
  });

  test('pitcher-specific report viewing journey', async ({ page }) => {
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();

    // Open Mike Johnson (pitcher) modal
    const mikeRow = page.locator('table.table tbody tr').filter({ hasText: 'Mike Johnson' });
    await mikeRow.getByText('View').click();

    await expect(page.locator('.modal.modal-open')).toBeVisible();
    await expect(page.getByText('Mike Johnson').first()).toBeVisible();

    // Verify pitcher-specific stats are shown
    await expect(page.getByText('2.85')).toBeVisible(); // ERA
    await expect(page.getByText('8')).toBeVisible(); // Wins

    // Wait for reports and click on pitcher report
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const reportItem = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await reportItem.click();

    // Verify pitcher report details
    await expect(page.getByText('Scouting Report - Mike Johnson')).toBeVisible();

    // Check pitching-specific grades and details
    const pitchingGrade = page.locator('.text-lg.font-bold.text-accent').filter({ hasText: 'A' });
    await expect(pitchingGrade).toBeVisible();
    await expect(page.getByText('Pitching Grade')).toBeVisible();

    // Verify pitching assessment section
    await expect(page.getByRole('heading', { name: 'Pitching Assessment' })).toBeVisible();
    await expect(page.getByText('Fastball Velocity: 92 mph')).toBeVisible();
    await expect(page.getByText('Fastball Grade: A-')).toBeVisible();
    await expect(page.getByText('Breaking Ball: A')).toBeVisible();
    await expect(page.getByText('Command: Excellent')).toBeVisible();
    await expect(page.getByText('Outstanding control and velocity. Great breaking ball.')).toBeVisible();

    // Verify hitting section shows limited hitting ability
    await expect(page.getByRole('heading', { name: 'Hitting Assessment' })).toBeVisible();
    await expect(page.getByText('Bat Speed: Below Average')).toBeVisible();
    await expect(page.getByText('Power: Poor')).toBeVisible();
    await expect(page.getByText('Limited hitting ability, focus on pitching.')).toBeVisible();
  });

  test('multiple reports navigation and comparison', async ({ page }) => {
    await page.goto('/players');
    
    // Open John Doe who has multiple reports
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Verify multiple reports are visible
    const reports = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300');
    await expect(reports).toHaveCount(2);

    // Check first report (most recent)
    const firstReport = reports.first();
    await expect(firstReport.getByText('Report Date: 3/15/2024')).toBeVisible();
    await expect(firstReport.getByText('Overall: B+')).toBeVisible();

    // Check second report (older)
    const secondReport = reports.nth(1);
    await expect(secondReport.getByText('Report Date: 2/20/2024')).toBeVisible();
    await expect(secondReport.getByText('Overall: B')).toBeVisible();

    // Open first report and verify details
    await firstReport.click();
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    await expect(page.getByText('Report Date: 3/15/2024')).toBeVisible();
    await expect(page.locator('.text-lg.font-bold.text-primary').filter({ hasText: 'B+' })).toBeVisible();

    // Close and open second report
    await page.getByRole('button', { name: 'Close' }).last().click();
    await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();
    
    await secondReport.click();
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    await expect(page.getByText('Report Date: 2/20/2024')).toBeVisible();
    await expect(page.locator('.text-lg.font-bold.text-primary').filter({ hasText: 'B' })).toBeVisible();
    
    // Verify different notes/assessments
    await expect(page.getByText('Good fundamentals but needs consistency.')).toBeVisible();
    await expect(page.getByText('Shows potential but needs more plate discipline.')).toBeVisible();
  });

  test('error handling and recovery during report viewing', async ({ page }) => {
    await page.goto('/players');
    
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });

    // Mock error for specific report
    await page.route('**/api/reports/scouting/1', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Report not found'
        })
      });
    });

    // Try to open first report - should fail gracefully
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Report modal should not open
    await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();
    
    // Player modal should still be functional
    await expect(page.getByText('John Doe').first()).toBeVisible();
    
    // Should be able to try second report (remove the error mock)
    await page.unroute('**/api/reports/scouting/1');
    
    const secondReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').nth(1);
    await secondReport.click();
    
    // Second report should open successfully
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    await expect(page.getByText('Report Date: 2/20/2024')).toBeVisible();
  });

  test('responsive design and mobile interaction', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: /players/i })).toBeVisible();

    // Open player modal on mobile
    const johnDoeRow = page.locator('table.table tbody tr').filter({ hasText: 'John Doe' });
    await johnDoeRow.getByText('View').click();

    // Modal should be properly sized for mobile
    const modal = page.locator('.modal.modal-open .modal-box');
    await expect(modal).toBeVisible();
    
    // Scouting reports section should be visible and scrollable
    await expect(page.getByRole('heading', { name: 'Scouting Reports' })).toBeVisible();
    await expect(page.locator('.loading.loading-spinner')).not.toBeVisible({ timeout: 5000 });
    
    const reportsContainer = page.locator('.space-y-2.max-h-40.overflow-y-auto');
    await expect(reportsContainer).toBeVisible();

    // Click on report
    const firstReport = page.locator('.bg-base-200.rounded-lg.hover\\:bg-base-300').first();
    await firstReport.click();

    // Report detail modal should be responsive
    await expect(page.getByText('Scouting Report - John Doe')).toBeVisible();
    
    // Content should be scrollable on mobile
    const reportModal = page.locator('.modal.modal-open .modal-box.max-w-4xl');
    await expect(reportModal).toBeVisible();
    
    // Tool grades should stack properly on mobile (grid-cols-1)
    const gradesGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    await expect(gradesGrid).toBeVisible();
    
    // Close functionality should work on mobile
    await page.getByRole('button', { name: 'Close' }).last().click();
    await expect(page.getByText('Scouting Report - John Doe')).not.toBeVisible();
  });
});
