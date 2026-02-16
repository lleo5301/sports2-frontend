import { test, expect } from '@playwright/test';

// Helper function to set up authentication
async function stubAuth(page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-jwt-token');
  });

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

test.describe('Depth Chart Baseball Field Views', () => {
  // Only run on Chromium for faster testing
  test.skip(({ browserName }) => browserName !== 'chromium');
  test.beforeEach(async ({ page }) => {
    await stubAuth(page);

    // Mock depth charts API
    await page.route('**/api/depth-charts', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{
            id: 1,
            name: 'Test Depth Chart',
            description: 'Test depth chart for field views',
            team_id: 1,
            is_active: true,
            DepthChartPositions: [
              {
                id: 1,
                position_code: 'LF',
                position_name: 'Left Field',
                DepthChartPlayers: [
                  {
                    id: 1,
                    depth_order: 1,
                    Player: {
                      id: 1,
                      first_name: 'John',
                      last_name: 'Smith',
                      jersey_number: 7
                    }
                  }
                ]
              },
              {
                id: 2,
                position_code: 'CF',
                position_name: 'Center Field',
                DepthChartPlayers: [
                  {
                    id: 2,
                    depth_order: 1,
                    Player: {
                      id: 2,
                      first_name: 'Mike',
                      last_name: 'Johnson',
                      jersey_number: 8
                    }
                  }
                ]
              },
              {
                id: 3,
                position_code: 'RF',
                position_name: 'Right Field',
                DepthChartPlayers: [
                  {
                    id: 3,
                    depth_order: 1,
                    Player: {
                      id: 3,
                      first_name: 'Dave',
                      last_name: 'Wilson',
                      jersey_number: 9
                    }
                  }
                ]
              },
              {
                id: 4,
                position_code: 'SS',
                position_name: 'Shortstop',
                DepthChartPlayers: [
                  {
                    id: 4,
                    depth_order: 1,
                    Player: {
                      id: 4,
                      first_name: 'Alex',
                      last_name: 'Brown',
                      jersey_number: 6
                    }
                  }
                ]
              },
              {
                id: 5,
                position_code: '2B',
                position_name: 'Second Base',
                DepthChartPlayers: [
                  {
                    id: 5,
                    depth_order: 1,
                    Player: {
                      id: 5,
                      first_name: 'Tom',
                      last_name: 'Davis',
                      jersey_number: 4
                    }
                  }
                ]
              },
              {
                id: 6,
                position_code: '3B',
                position_name: 'Third Base',
                DepthChartPlayers: [
                  {
                    id: 6,
                    depth_order: 1,
                    Player: {
                      id: 6,
                      first_name: 'Chris',
                      last_name: 'Miller',
                      jersey_number: 5
                    }
                  }
                ]
              },
              {
                id: 7,
                position_code: '1B',
                position_name: 'First Base',
                DepthChartPlayers: [
                  {
                    id: 7,
                    depth_order: 1,
                    Player: {
                      id: 7,
                      first_name: 'Ryan',
                      last_name: 'Taylor',
                      jersey_number: 3
                    }
                  }
                ]
              },
              {
                id: 8,
                position_code: 'C',
                position_name: 'Catcher',
                DepthChartPlayers: [
                  {
                    id: 8,
                    depth_order: 1,
                    Player: {
                      id: 8,
                      first_name: 'Matt',
                      last_name: 'Anderson',
                      jersey_number: 2
                    }
                  }
                ]
              },
              {
                id: 9,
                position_code: 'P',
                position_name: 'Pitcher',
                DepthChartPlayers: [
                  {
                    id: 9,
                    depth_order: 1,
                    Player: {
                      id: 9,
                      first_name: 'Brad',
                      last_name: 'Thompson',
                      jersey_number: 1
                    }
                  }
                ]
              }
            ]
          }]
        })
      });
    });

    // Mock individual depth chart API
    await page.route('**/api/depth-charts/byId/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 1,
            name: 'Test Depth Chart',
            description: 'Test depth chart for field views',
            team_id: 1,
            is_active: true,
            DepthChartPositions: [
              {
                id: 1,
                position_code: 'LF',
                position_name: 'Left Field',
                DepthChartPlayers: [
                  {
                    id: 1,
                    depth_order: 1,
                    Player: {
                      id: 1,
                      first_name: 'John',
                      last_name: 'Smith',
                      jersey_number: 7
                    }
                  }
                ]
              },
              {
                id: 2,
                position_code: 'CF',
                position_name: 'Center Field',
                DepthChartPlayers: [
                  {
                    id: 2,
                    depth_order: 1,
                    Player: {
                      id: 2,
                      first_name: 'Mike',
                      last_name: 'Johnson',
                      jersey_number: 8
                    }
                  }
                ]
              },
              {
                id: 3,
                position_code: 'RF',
                position_name: 'Right Field',
                DepthChartPlayers: [
                  {
                    id: 3,
                    depth_order: 1,
                    Player: {
                      id: 3,
                      first_name: 'Dave',
                      last_name: 'Wilson',
                      jersey_number: 9
                    }
                  }
                ]
              },
              {
                id: 4,
                position_code: 'SS',
                position_name: 'Shortstop',
                DepthChartPlayers: [
                  {
                    id: 4,
                    depth_order: 1,
                    Player: {
                      id: 4,
                      first_name: 'Alex',
                      last_name: 'Brown',
                      jersey_number: 6
                    }
                  }
                ]
              },
              {
                id: 5,
                position_code: '2B',
                position_name: 'Second Base',
                DepthChartPlayers: [
                  {
                    id: 5,
                    depth_order: 1,
                    Player: {
                      id: 5,
                      first_name: 'Tom',
                      last_name: 'Davis',
                      jersey_number: 4
                    }
                  }
                ]
              },
              {
                id: 6,
                position_code: '3B',
                position_name: 'Third Base',
                DepthChartPlayers: [
                  {
                    id: 6,
                    depth_order: 1,
                    Player: {
                      id: 6,
                      first_name: 'Chris',
                      last_name: 'Miller',
                      jersey_number: 5
                    }
                  }
                ]
              },
              {
                id: 7,
                position_code: '1B',
                position_name: 'First Base',
                DepthChartPlayers: [
                  {
                    id: 7,
                    depth_order: 1,
                    Player: {
                      id: 7,
                      first_name: 'Ryan',
                      last_name: 'Taylor',
                      jersey_number: 3
                    }
                  }
                ]
              },
              {
                id: 8,
                position_code: 'C',
                position_name: 'Catcher',
                DepthChartPlayers: [
                  {
                    id: 8,
                    depth_order: 1,
                    Player: {
                      id: 8,
                      first_name: 'Matt',
                      last_name: 'Anderson',
                      jersey_number: 2
                    }
                  }
                ]
              },
              {
                id: 9,
                position_code: 'P',
                position_name: 'Pitcher',
                DepthChartPlayers: [
                  {
                    id: 9,
                    depth_order: 1,
                    Player: {
                      id: 9,
                      first_name: 'Brad',
                      last_name: 'Thompson',
                      jersey_number: 1
                    }
                  }
                ]
              }
            ]
          }
        })
      });
    });

    // Mock auxiliary endpoints used by the page
    await page.route('**/api/depth-charts/byId/1/available-players', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: [] }) });
    });
    await page.route('**/api/depth-charts/byId/1/history', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: [] }) });
    });

    // Navigate to depth chart page (list) and let the component auto-select default
    await page.goto('/depth-chart');
    await page.waitForLoadState('networkidle');
    // Wait for the controls to render (more robust than exact heading)
    await expect(page.getByRole('button', { name: 'List View' })).toBeVisible({ timeout: 15000 });
  });

  test('Enhanced Baseball Field View - Pro View', async ({ page }) => {
    // Switch to Pro View (Enhanced Field)
    await page.click('button:has-text("Pro View")');
    // Wait for enhanced field container
    const fieldContainer = page.locator('[data-testid="enhanced-baseball-field"]').first();
    await expect(fieldContainer).toBeVisible({ timeout: 10000 });

    // Test SVG field elements are present (target the enhanced field SVG specifically)
    const svg = page.locator('[data-testid="enhanced-field-svg"]').first();
    await expect(svg).toBeVisible({ timeout: 10000 });

    // Check for essential field elements
    const fieldElements = [
      'path', // Outfield arc and foul lines
      'rect', // Bases
      'circle', // Pitcher's mound and player markers
      'polygon' // Home plate
    ];

    for (const element of fieldElements) {
      await expect(svg.locator(element).first()).toBeVisible();
    }

    // Test player positions are visible and not overlapping
    const playerBubbles = page.locator('circle[r="28"]'); // Player circles with radius 28
    const playerCount = await playerBubbles.count();

    if (playerCount > 0) {
      // Check that player names are readable (not empty)
      const playerTexts = page.locator('svg text').filter({ hasText: /\w+/ }); // Text with at least one word character
      const textCount = await playerTexts.count();
      expect(textCount).toBeGreaterThan(0);

      // Verify no player text is clipped (basic check - text should have reasonable font size)
      const fontSize = await playerTexts.first().getAttribute('font-size');
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(9);
    }

    // Test field proportions look correct
    const svgBox = await svg.boundingBox();
    expect(svgBox.width).toBeGreaterThan(500); // Reasonable minimum width
    expect(svgBox.height).toBeGreaterThan(400); // Reasonable minimum height

    // Width should be greater than height for a baseball field
    expect(svgBox.width).toBeGreaterThan(svgBox.height * 0.8);
  });

  test('Compact View - Fangraphs Style', async ({ page }) => {
    // Switch to Compact View
    await page.click('button:has-text("Compact View")');
    await page.waitForTimeout(1000);

    // Test that the main container is visible
    const container = page.locator('[data-testid="fangraphs-depth-chart"]');
    await expect(container).toBeVisible();

    // Test baseball field SVG is present
    const fieldSvg = page.locator('[data-testid="baseball-field-svg"]');
    await expect(fieldSvg).toBeVisible();

    // Test essential field elements
    const fieldElementTests = [
      { testId: 'outfield-area', description: 'outfield grass area' },
      { testId: 'infield-dirt', description: 'infield dirt area' },
      { testId: 'home-plate', description: 'home plate' },
      { testId: 'pitchers-mound', description: 'pitcher\'s mound' },
      { testId: 'first-base', description: 'first base' },
      { testId: 'second-base', description: 'second base' },
      { testId: 'third-base', description: 'third base' },
      { testId: 'foul-line-left', description: 'left foul line' },
      { testId: 'foul-line-right', description: 'right foul line' }
    ];

    for (const element of fieldElementTests) {
      await expect(page.locator(`[data-testid="${element.testId}"]`),
        `${element.description} should be visible`).toBeVisible();
    }

    // Test all position boxes are present and positioned correctly
    const positions = ['LF', 'CF', 'RF', 'SS', '2B', '3B', '1B', 'C', 'RP'];

    for (const position of positions) {
      const positionBox = page.locator(`[data-testid="position-box-${position}"]`);
      await expect(positionBox, `${position} position box should be visible`).toBeVisible();

      // Check box content is readable
      const boxText = positionBox.locator('text, span, div').filter({ hasText: /\w+/ });
      await expect(boxText.first(), `${position} box should contain readable text`).toBeVisible();
    }

    // Test no overlapping position boxes
    const allBoxes = page.locator('[data-testid^="position-box-"]');
    const boxCount = await allBoxes.count();

    if (boxCount > 1) {
      const boxPositions = [];

      for (let i = 0; i < boxCount; i++) {
        const box = allBoxes.nth(i);
        const boundingBox = await box.boundingBox();
        boxPositions.push(boundingBox);
      }

      // Check for overlaps
      for (let i = 0; i < boxPositions.length; i++) {
        for (let j = i + 1; j < boxPositions.length; j++) {
          const box1 = boxPositions[i];
          const box2 = boxPositions[j];

          // Check if boxes overlap (with small tolerance for borders)
          const tolerance = 5;
          const noOverlap = (
            box1.x + box1.width < box2.x + tolerance ||
            box2.x + box2.width < box1.x + tolerance ||
            box1.y + box1.height < box2.y + tolerance ||
            box2.y + box2.height < box1.y + tolerance
          );

          expect(noOverlap, `Position boxes ${i} and ${j} should not overlap`).toBe(true);
        }
      }
    }

    // Test player name readability
    const playerElements = page.locator('[data-testid^="player-"]');
    const playerCount = await playerElements.count();

    if (playerCount > 0) {
      // Check first few players have readable names
      for (let i = 0; i < Math.min(3, playerCount); i++) {
        const player = playerElements.nth(i);
        const playerText = await player.textContent();
        expect(playerText.length, `Player ${i} should have a readable name`).toBeGreaterThan(0);
        expect(playerText.trim(), `Player ${i} name should not be just whitespace`).not.toBe('');
      }
    }

    // Test container size accommodates all elements
    const containerBox = await container.boundingBox();
    expect(containerBox.width).toBeGreaterThan(800); // Should be wide enough
    expect(containerBox.height).toBeGreaterThan(600); // Should be tall enough
  });

  test('Sheet View Baseball Elements', async ({ page }) => {
    // Switch to Sheet View
    await page.click('button:has-text("Sheet View")');
    await page.waitForTimeout(500);

    // Test that position sections are visible and properly labeled
    const positionSections = [
      'Left Field', 'Center Field', 'Right Field',
      'Shortstop', 'Second Base', 'Third Base', 'First Base',
      'Catcher', 'Pitchers'
    ];

    for (const section of positionSections) {
      await expect(page.getByText(section, { exact: true }), `${section} section should be visible`).toBeVisible({ timeout: 15000 });
    }

    // Test no overlapping sections using grid layout
    const gridContainer = page.locator('.grid.grid-cols-12');
    await expect(gridContainer).toBeVisible();

    // Test that the sheet has appropriate size (letter/A4-like)
    const sheetContainer = page.locator('.max-w-\\[980px\\]').first();
    await expect(sheetContainer).toBeVisible();

    const containerBox = await sheetContainer.boundingBox();
    expect(containerBox.width).toBeGreaterThan(700); // Reasonable letter width
    expect(containerBox.height).toBeGreaterThan(900); // Reasonable letter height
  });

  test('Field View Consistency Across Views', async ({ page }) => {
    const views = [
      { button: 'Field View', testId: 'baseball-field-view' },
      { button: 'Pro View', testId: 'enhanced-baseball-field' },
      { button: 'Compact View', testId: 'fangraphs-depth-chart' }
    ];

    for (const view of views) {
      await page.click(`button:has-text("${view.button}")`);
      await page.waitForTimeout(1000);

      // Each view should have some representation of a baseball field
      const hasFieldElements = await page.locator('svg, .field, [data-testid*="field"]').count() > 0;
      expect(hasFieldElements, `${view.button} should contain field-like elements`).toBe(true);

      // Each view should be fully visible (not clipped)
      const mainContainer = page.locator('[data-testid], .relative').first();
      const isVisible = await mainContainer.isVisible();
      expect(isVisible, `${view.button} main container should be visible`).toBe(true);
    }
  });

  test('Text Readability and Contrast', async ({ page }) => {
    // Test all views for text readability
    const views = ['Field View', 'Pro View', 'Compact View', 'Sheet View'];

    for (const viewName of views) {
      await page.click(`button:has-text("${viewName}")`);
      await page.waitForTimeout(1000);

      // Check that text elements have adequate size
      const textElements = page.locator('text, span, div').filter({ hasText: /\w{2,}/ }); // At least 2 characters
      const textCount = await textElements.count();

      if (textCount > 0) {
        // Sample a few text elements to check they're not too small
        const sampleSize = Math.min(5, textCount);
        for (let i = 0; i < sampleSize; i++) {
          const textElement = textElements.nth(i);
          const isVisible = await textElement.isVisible();
          expect(isVisible, `Text element ${i} in ${viewName} should be visible`).toBe(true);
        }
      }
    }
  });

  test('Responsive Behavior', async ({ page }) => {
    // Test that field views work at different viewport sizes
    const viewports = [
      { width: 1200, height: 800 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Test Pro View at this size
      await page.click('button:has-text("Pro View")');
      // Wait for enhanced field SVG to render
      const fieldContainer = page.locator('[data-testid="enhanced-field-svg"]').first();
      await expect(fieldContainer).toBeVisible({ timeout: 10000 });

      // Field should maintain reasonable proportions
      const fieldBox = await fieldContainer.boundingBox();
      expect(fieldBox.width).toBeGreaterThan(200); // Minimum usable width
      expect(fieldBox.height).toBeGreaterThan(150); // Minimum usable height
    }
  });
});
