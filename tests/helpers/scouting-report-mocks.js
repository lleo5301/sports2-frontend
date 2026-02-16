/**
 * Scouting Report API mocking helpers for Playwright tests
 */

/**
 * Mock scouting report data
 */
export const mockScoutingReports = [
  {
    id: 1,
    player_id: 1,
    created_by: 1,
    report_date: '2024-03-15',
    game_date: '2024-03-14',
    opponent: 'State University',
    overall_grade: 'B+',
    overall_notes: 'Solid prospect with good fundamentals. Shows strong leadership qualities and work ethic.',
    hitting_grade: 'B',
    hitting_notes: 'Good approach at the plate, needs to improve power.',
    bat_speed: 'Good',
    power_potential: 'Average',
    plate_discipline: 'Good',
    pitching_grade: null,
    pitching_notes: null,
    fastball_velocity: null,
    fastball_grade: null,
    breaking_ball_grade: null,
    command: null,
    fielding_grade: 'B+',
    fielding_notes: 'Excellent range and good arm strength.',
    arm_strength: 'Good',
    arm_accuracy: 'Excellent',
    range: 'Excellent',
    speed_grade: 'A-',
    speed_notes: 'Very fast, excellent base stealing potential.',
    home_to_first: 4.1,
    intangibles_grade: 'A',
    intangibles_notes: 'Natural leader, excellent work ethic.',
    work_ethic: 'Excellent',
    coachability: 'Excellent',
    projection: 'College',
    projection_notes: 'Projects as solid college player.',
    is_draft: false,
    is_public: true,
    created_at: '2024-03-15T10:30:00Z',
    updated_at: '2024-03-15T10:30:00Z',
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
  },
  {
    id: 2,
    player_id: 1,
    created_by: 1,
    report_date: '2024-02-20',
    game_date: '2024-02-19',
    opponent: 'Metro High',
    overall_grade: 'B',
    overall_notes: 'Good fundamentals but needs consistency.',
    hitting_grade: 'B-',
    hitting_notes: 'Shows potential but needs more plate discipline.',
    bat_speed: 'Average',
    power_potential: 'Below Average',
    plate_discipline: 'Average',
    pitching_grade: null,
    pitching_notes: null,
    fastball_velocity: null,
    fastball_grade: null,
    breaking_ball_grade: null,
    command: null,
    fielding_grade: 'B',
    fielding_notes: 'Solid fielder with room for improvement.',
    arm_strength: 'Average',
    arm_accuracy: 'Good',
    range: 'Good',
    speed_grade: 'B+',
    speed_notes: 'Good speed, could improve first step.',
    home_to_first: 4.3,
    intangibles_grade: 'B+',
    intangibles_notes: 'Shows good attitude and coachability.',
    work_ethic: 'Good',
    coachability: 'Good',
    projection: 'College',
    projection_notes: 'Has potential for college level.',
    is_draft: false,
    is_public: true,
    created_at: '2024-02-20T14:15:00Z',
    updated_at: '2024-02-20T14:15:00Z',
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
  },
  {
    id: 3,
    player_id: 2,
    created_by: 1,
    report_date: '2024-03-10',
    game_date: '2024-03-09',
    opponent: 'Valley College',
    overall_grade: 'A-',
    overall_notes: 'Excellent pitcher with great potential.',
    hitting_grade: 'C',
    hitting_notes: 'Limited hitting ability, focus on pitching.',
    bat_speed: 'Below Average',
    power_potential: 'Poor',
    plate_discipline: 'Average',
    pitching_grade: 'A',
    pitching_notes: 'Outstanding control and velocity. Great breaking ball.',
    fastball_velocity: 92,
    fastball_grade: 'A-',
    breaking_ball_grade: 'A',
    command: 'Excellent',
    fielding_grade: 'B',
    fielding_notes: 'Adequate fielding for a pitcher.',
    arm_strength: 'Excellent',
    arm_accuracy: 'Excellent',
    range: 'Average',
    speed_grade: 'C+',
    speed_notes: 'Average speed for a pitcher.',
    home_to_first: 4.8,
    intangibles_grade: 'A-',
    intangibles_notes: 'Very competitive, great focus.',
    work_ethic: 'Excellent',
    coachability: 'Excellent',
    projection: 'Professional',
    projection_notes: 'Has professional potential.',
    is_draft: false,
    is_public: true,
    created_at: '2024-03-10T16:45:00Z',
    updated_at: '2024-03-10T16:45:00Z',
    Player: {
      id: 2,
      first_name: 'Mike',
      last_name: 'Johnson',
      position: 'P',
      school: 'State University'
    },
    User: {
      id: 1,
      first_name: 'Coach',
      last_name: 'Smith'
    }
  }
];

/**
 * Mock scouting report endpoints
 * @param {import('@playwright/test').Page} page
 */
export async function mockScoutingReportEndpoints(page) {
  // Mock GET /api/reports/scouting - Get scouting reports with filtering
  await page.route('**/api/reports/scouting**', async route => {
    const url = new URL(route.request().url());
    const playerId = url.searchParams.get('player_id');
    const page_num = url.searchParams.get('page') || '1';
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let reports = [...mockScoutingReports];

    // Filter by player_id if provided
    if (playerId) {
      reports = reports.filter(report => report.player_id.toString() === playerId);
    }

    // Pagination
    const offset = (parseInt(page_num) - 1) * limit;
    const paginatedReports = reports.slice(offset, offset + limit);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: paginatedReports,
        pagination: {
          page: parseInt(page_num),
          limit,
          total: reports.length,
          pages: Math.ceil(reports.length / limit)
        }
      })
    });
  });

  // Mock GET /api/reports/scouting/:id - Get specific scouting report
  await page.route('**/api/reports/scouting/*', async route => {
    const reportId = route.request().url().split('/').pop();
    const report = mockScoutingReports.find(r => r.id.toString() === reportId);

    if (!report) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Scouting report not found'
        })
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: report
      })
    });
  });

  // Mock POST /api/reports/scouting - Create new scouting report
  await page.route('**/api/reports/scouting', async route => {
    if (route.request().method() === 'POST') {
      const requestBody = await route.request().postDataJSON();

      const newReport = {
        id: mockScoutingReports.length + 1,
        ...requestBody,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        Player: {
          id: requestBody.player_id,
          first_name: 'Test',
          last_name: 'Player',
          position: 'SS',
          school: 'Test School'
        },
        User: {
          id: 1,
          first_name: 'Coach',
          last_name: 'Smith'
        }
      };

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Scouting report created successfully',
          data: newReport
        })
      });
    }
  });
}

/**
 * Mock empty scouting reports for a player
 * @param {import('@playwright/test').Page} page
 * @param {number} playerId
 */
export async function mockEmptyScoutingReports(page, playerId) {
  await page.route('**/api/reports/scouting**', async route => {
    const url = new URL(route.request().url());
    const requestedPlayerId = url.searchParams.get('player_id');

    if (requestedPlayerId === playerId.toString()) {
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
    } else {
      // Return normal mock for other players
      const reports = mockScoutingReports.filter(r =>
        !requestedPlayerId || r.player_id.toString() === requestedPlayerId
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: reports,
          pagination: {
            page: 1,
            limit: 20,
            total: reports.length,
            pages: Math.ceil(reports.length / 20)
          }
        })
      });
    }
  });
}

/**
 * Mock scouting report error responses
 * @param {import('@playwright/test').Page} page
 */
export async function mockScoutingReportErrors(page) {
  // Mock network error for reports
  await page.route('**/api/reports/scouting/error-test', async route => {
    await route.abort('failed');
  });

  // Mock server error for reports
  await page.route('**/api/reports/scouting/500', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        message: 'Internal server error'
      })
    });
  });

  // Mock not found error
  await page.route('**/api/reports/scouting/999', async route => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        message: 'Scouting report not found'
      })
    });
  });
}

/**
 * Setup all scouting report mocks
 * @param {import('@playwright/test').Page} page
 */
export async function setupScoutingReportMocks(page) {
  await mockScoutingReportEndpoints(page);
  await mockScoutingReportErrors(page);
}
