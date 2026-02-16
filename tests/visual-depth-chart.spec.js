import { test, expect } from '@playwright/test';

// Visual regression tests focus on Chromium only for stability
const shouldRunVisual = (testInfo) => testInfo.project.name === 'chromium';

async function stubAuth(page) {
  // Ensure app treats us as authenticated
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-jwt-token');
  });

  // Current user profile
  await page.route('**/api/auth/me', async (route) => {
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

  // Wide permissions so UI renders all controls
  await page.route('**/api/auth/permissions', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          'depth_chart_view',
          'depth_chart_create',
          'depth_chart_edit',
          'depth_chart_delete',
          'depth_chart_manage_positions',
          'player_assign',
          'player_unassign'
        ]
      })
    });
  });
}

async function stubDepthChart(page) {
  const depthChartId = 101;

  const positions = [
    {
      id: 1,
      position_code: 'C',
      position_name: 'Catcher',
      color: '#3B82F6',
      DepthChartPlayers: [
        {
          id: 1001,
          depth_order: 1,
          Player: {
            id: 11,
            first_name: 'Alex',
            last_name: 'Miller',
            position: 'C',
            jersey_number: 12,
            school_type: 'COLL',
            graduation_year: 2025
          }
        }
      ]
    },
    {
      id: 2,
      position_code: 'P',
      position_name: 'Pitcher',
      color: '#EF4444',
      DepthChartPlayers: [
        {
          id: 1002,
          depth_order: 1,
          Player: {
            id: 12,
            first_name: 'Ryan',
            last_name: 'Lee',
            position: 'P',
            jersey_number: 34,
            school_type: 'COLL',
            graduation_year: 2025
          }
        }
      ]
    },
    {
      id: 3,
      position_code: '1B',
      position_name: 'First Base',
      color: '#10B981',
      DepthChartPlayers: [
        {
          id: 1003,
          depth_order: 1,
          Player: {
            id: 13,
            first_name: 'Sam',
            last_name: 'Taylor',
            position: '1B',
            jersey_number: 19,
            school_type: 'COLL',
            graduation_year: 2024
          }
        }
      ]
    },
    {
      id: 4,
      position_code: '2B',
      position_name: 'Second Base',
      color: '#F59E0B',
      DepthChartPlayers: [
        {
          id: 1004,
          depth_order: 1,
          Player: {
            id: 14,
            first_name: 'Evan',
            last_name: 'Brooks',
            position: '2B',
            jersey_number: 8,
            school_type: 'HS',
            graduation_year: 2026
          }
        }
      ]
    },
    {
      id: 5,
      position_code: '3B',
      position_name: 'Third Base',
      color: '#8B5CF6',
      DepthChartPlayers: [
        {
          id: 1005,
          depth_order: 1,
          Player: {
            id: 15,
            first_name: 'Nate',
            last_name: 'Long',
            position: '3B',
            jersey_number: 7,
            school_type: 'HS',
            graduation_year: 2026
          }
        }
      ]
    },
    {
      id: 6,
      position_code: 'SS',
      position_name: 'Shortstop',
      color: '#6366F1',
      DepthChartPlayers: [
        {
          id: 1006,
          depth_order: 1,
          Player: {
            id: 16,
            first_name: 'Owen',
            last_name: 'Park',
            position: 'SS',
            jersey_number: 2,
            school_type: 'HS',
            graduation_year: 2026
          }
        }
      ]
    },
    {
      id: 7,
      position_code: 'LF',
      position_name: 'Left Field',
      color: '#EC4899',
      DepthChartPlayers: [
        {
          id: 1007,
          depth_order: 1,
          Player: {
            id: 17,
            first_name: 'Leo',
            last_name: 'Pratt',
            position: 'LF',
            jersey_number: 23,
            school_type: 'COLL',
            graduation_year: 2024
          }
        }
      ]
    },
    {
      id: 8,
      position_code: 'CF',
      position_name: 'Center Field',
      color: '#14B8A6',
      DepthChartPlayers: [
        {
          id: 1008,
          depth_order: 1,
          Player: {
            id: 18,
            first_name: 'Mason',
            last_name: 'Cole',
            position: 'CF',
            jersey_number: 5,
            school_type: 'COLL',
            graduation_year: 2025
          }
        }
      ]
    },
    {
      id: 9,
      position_code: 'RF',
      position_name: 'Right Field',
      color: '#F97316',
      DepthChartPlayers: [
        {
          id: 1009,
          depth_order: 1,
          Player: {
            id: 19,
            first_name: 'Kyle',
            last_name: 'Reed',
            position: 'RF',
            jersey_number: 17,
            school_type: 'COLL',
            graduation_year: 2024
          }
        }
      ]
    },
    {
      id: 10,
      position_code: 'DH',
      position_name: 'Designated Hitter',
      color: '#06B6D4',
      DepthChartPlayers: []
    }
  ];

  // List charts
  await page.route('**/api/depth-charts', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: depthChartId,
            name: 'Spring 2025 Default',
            description: 'Visual test chart',
            is_default: true,
            is_active: true,
            version: 1,
            effective_date: '2025-02-01T00:00:00Z',
            DepthChartPositions: positions.map((p) => ({
              id: p.id,
              position_code: p.position_code,
              position_name: p.position_name,
              color: p.color
            }))
          }
        ]
      })
    });
  });

  // Chart details
  await page.route(`**/api/depth-charts/byId/${depthChartId}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: depthChartId,
          name: 'Spring 2025 Default',
          description: 'Visual test chart',
          version: 1,
          effective_date: '2025-02-01T00:00:00Z',
          Creator: { first_name: 'Coach', last_name: 'Smith' },
          DepthChartPositions: positions
        }
      })
    });
  });

  // Available players (used by modal queries even if closed)
  await page.route(`**/api/depth-charts/byId/${depthChartId}/available-players`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] })
    });
  });
}

test.describe('Visual - Depth Chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; caret-color: transparent !important; }' });
    await stubAuth(page);
    await stubDepthChart(page);
  });

  test('List view snapshot', async ({ page }, testInfo) => {
    if (!shouldRunVisual(testInfo)) test.skip();
    await page.goto('/depth-chart');

    // Use level to avoid strict mode multiple matches
    await expect(page.getByRole('heading', { level: 1, name: 'Depth Chart' })).toBeVisible();
    await expect(page).toHaveScreenshot('depth-chart-list-view.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.03
    });
  });

  test('Field view snapshot', async ({ page }, testInfo) => {
    if (!shouldRunVisual(testInfo)) test.skip();
    await page.goto('/depth-chart');

    // Switch to Field View
    await page.getByRole('button', { name: 'Field View' }).click();
    await expect(page.getByRole('button', { name: 'Field View' })).toHaveClass(/btn-active|active/);

    await expect(page).toHaveScreenshot('depth-chart-field-view.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.03
    });
  });

  test('Pro view (Enhanced) snapshot', async ({ page }, testInfo) => {
    if (!shouldRunVisual(testInfo)) test.skip();
    await page.goto('/depth-chart');

    // Switch to Pro View
    await page.getByRole('button', { name: 'Pro View' }).click();
    await expect(page.getByRole('heading', { name: 'Enhanced Baseball Field View' })).toBeVisible();

    await expect(page).toHaveScreenshot('depth-chart-pro-view.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.03
    });
  });
});
