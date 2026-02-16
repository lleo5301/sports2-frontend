/**
 * @fileoverview Reports management service module providing CRUD operations for reports,
 * specialized report generation, PDF utilities, and chart data generators.
 *
 * This service handles all report-related operations including:
 * - Basic CRUD operations for report records
 * - Specialized report endpoints (player performance, team statistics, scouting analysis)
 * - Server-side PDF and Excel generation with blob responses
 * - Client-side PDF generation using jsPDF library
 * - Chart data formatting for visualization libraries
 *
 * The module exports three main objects:
 * - reportsService: API methods for report data and server-side generation
 * - pdfUtils: Client-side PDF generation utilities for different report types
 * - chartUtils: Chart data generators for performance and statistics visualization
 *
 * PDF Generation Integration:
 * - Uses jsPDF library for client-side PDF creation
 * - Includes jsPDF-autotable plugin for table generation
 * - Uses file-saver library for blob download handling
 * - Server endpoints return blob responses for downloadable files
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings, null, and undefined
 * values from request payloads to avoid backend validation errors.
 *
 * All async functions return promises that resolve to API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/reports
 * @requires ./api
 * @requires jspdf
 * @requires jspdf-autotable
 * @requires file-saver
 */

import api from './api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

/**
 * Reports management service object containing all report-related API methods
 *
 * @namespace reportsService
 */
export const reportsService = {
  /**
   * Retrieves a list of all reports
   *
   * @async
   * @function getAllReports
   * @memberof reportsService
   * @returns {Promise<Object>} Response containing array of report objects
   * @returns {Array<Object>} return.data - Array of report objects
   * @returns {string} return.data[].id - Report's unique identifier
   * @returns {string} return.data[].title - Report title
   * @returns {string} return.data[].type - Report type (e.g., 'player-performance', 'team-statistics', 'scouting-analysis')
   * @returns {string} return.data[].createdAt - ISO timestamp of report creation
   * @returns {string} return.data[].createdBy - ID of user who created the report
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const allReports = await reportsService.getAllReports();
   * console.log('Total reports:', allReports.data.length);
   */
  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  /**
   * Retrieves detailed information for a single report by ID
   *
   * @async
   * @function getReport
   * @memberof reportsService
   * @param {string} id - The unique identifier of the report to retrieve
   * @returns {Promise<Object>} The report object with complete details
   * @returns {string} return.id - Report's unique identifier
   * @returns {string} return.title - Report title
   * @returns {string} return.type - Report type
   * @returns {Object} return.data - Report data payload
   * @returns {Object} [return.filters] - Filters applied to the report
   * @returns {string} return.createdAt - ISO timestamp of report creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if report not found
   *
   * @example
   * const report = await reportsService.getReport('report-123');
   * console.log('Report title:', report.title);
   */
  getReport: async (id) => {
    const response = await api.get(`/reports/byId/${id}`);
    return response.data;
  },

  /**
   * Creates a new report record
   *
   * @async
   * @function createReport
   * @memberof reportsService
   * @param {Object} reportData - Data for the new report
   * @param {string} reportData.title - Report title (required)
   * @param {string} reportData.type - Report type (required, e.g., 'player-performance', 'team-statistics')
   * @param {Object} [reportData.data] - Report data payload
   * @param {Object} [reportData.filters] - Filters to apply to the report
   * @param {string} [reportData.description] - Report description
   * @returns {Promise<Object>} The newly created report object
   * @returns {string} return.id - Report's unique identifier
   * @returns {string} return.title - Report title
   * @returns {string} return.type - Report type
   * @returns {string} return.createdAt - ISO timestamp of report creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the reportData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newReport = await reportsService.createReport({
   *   title: 'Q1 Player Performance',
   *   type: 'player-performance',
   *   filters: { season: '2024', quarter: 1 }
   * });
   */
  createReport: async (reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const response = await api.post('/reports', filteredData);
    return response.data;
  },

  /**
   * Updates an existing report's information
   *
   * @async
   * @function updateReport
   * @memberof reportsService
   * @param {string} id - The unique identifier of the report to update
   * @param {Object} reportData - Report fields to update (only include fields you want to change)
   * @param {string} [reportData.title] - Updated report title
   * @param {string} [reportData.type] - Updated report type
   * @param {Object} [reportData.data] - Updated report data payload
   * @param {Object} [reportData.filters] - Updated filters
   * @param {string} [reportData.description] - Updated description
   * @returns {Promise<Object>} The updated report object with all current data
   * @returns {string} return.id - Report's unique identifier
   * @returns {string} return.title - Updated report title
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if report not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the reportData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updated = await reportsService.updateReport('report-123', {
   *   title: 'Q1 Performance - Updated',
   *   description: 'Updated quarterly analysis'
   * });
   */
  updateReport: async (id, reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const response = await api.put(`/reports/byId/${id}`, filteredData);
    return response.data;
  },

  /**
   * Deletes a report record
   *
   * @async
   * @function deleteReport
   * @memberof reportsService
   * @param {string} id - The unique identifier of the report to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if report not found
   *
   * @example
   * const result = await reportsService.deleteReport('report-123');
   * console.log(result.message); // "Report deleted successfully"
   */
  deleteReport: async (id) => {
    const response = await api.delete(`/reports/byId/${id}`);
    return response.data;
  },

  /**
   * Retrieves player performance data with optional filtering
   *
   * @async
   * @function getPlayerPerformance
   * @memberof reportsService
   * @param {Object} [filters={}] - Optional query parameters for filtering performance data
   * @param {string} [filters.playerId] - Filter by specific player ID
   * @param {string} [filters.teamId] - Filter by team ID
   * @param {string} [filters.position] - Filter by position
   * @param {string} [filters.season] - Filter by season year
   * @param {string} [filters.startDate] - Filter by start date (ISO format)
   * @param {string} [filters.endDate] - Filter by end date (ISO format)
   * @returns {Promise<Object>} Response containing player performance data
   * @returns {Array<Object>} return.players - Array of player performance objects
   * @returns {string} return.players[].player_id - Player's unique identifier
   * @returns {string} return.players[].first_name - Player's first name
   * @returns {string} return.players[].last_name - Player's last name
   * @returns {string} return.players[].position - Player's position
   * @returns {number} [return.players[].batting_avg] - Batting average (baseball)
   * @returns {number} [return.players[].home_runs] - Home runs count
   * @returns {number} [return.players[].rbi] - Runs batted in
   * @returns {number} [return.players[].era] - Earned run average (pitchers)
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const performance = await reportsService.getPlayerPerformance({
   *   season: '2024',
   *   position: 'P'
   * });
   */
  getPlayerPerformance: async (filters = {}) => {
    const response = await api.get('/reports/player-performance', {
      params: filters
    });
    return response.data;
  },

  /**
   * Retrieves team statistics with optional filtering
   *
   * @async
   * @function getTeamStatistics
   * @memberof reportsService
   * @param {Object} [filters={}] - Optional query parameters for filtering team stats
   * @param {string} [filters.teamId] - Filter by specific team ID
   * @param {string} [filters.season] - Filter by season year
   * @param {string} [filters.startDate] - Filter by start date (ISO format)
   * @param {string} [filters.endDate] - Filter by end date (ISO format)
   * @returns {Promise<Object>} Response containing team statistics
   * @returns {string} return.team_name - Team name
   * @returns {number} return.total_players - Total number of players
   * @returns {number} return.team_batting_average - Team batting average
   * @returns {number} return.team_era - Team earned run average
   * @returns {number} return.wins - Number of wins
   * @returns {number} return.losses - Number of losses
   * @returns {number} return.win_percentage - Win percentage
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const stats = await reportsService.getTeamStatistics({
   *   teamId: 'team-123',
   *   season: '2024'
   * });
   */
  getTeamStatistics: async (filters = {}) => {
    const response = await api.get('/reports/team-statistics', {
      params: filters
    });
    return response.data;
  },

  /**
   * Retrieves scouting reports with optional filtering
   *
   * @async
   * @function getScoutingReports
   * @memberof reportsService
   * @param {Object} [filters={}] - Optional query parameters for filtering scouting reports
   * @param {string|number} [filters.player_id] - Filter by player ID
   * @param {string|number} [filters.prospect_id] - Filter by prospect ID
   * @param {string|number} [filters.scout_id] - Filter by scout ID
   * @param {string} [filters.position] - Filter by player position
   * @param {string} [filters.startDate] - Filter by start date (ISO format)
   * @param {string} [filters.endDate] - Filter by end date (ISO format)
   * @returns {Promise<Object>} Response containing scouting reports
   */
  getScoutingReports: async (filters = {}) => {
    const response = await api.get('/reports/scouting', { params: filters });
    return response.data;
  },

  /**
   * Creates a new scouting report
   *
   * @async
   * @function createScoutingReport
   * @memberof reportsService
   * @param {Object} reportData - Scouting report data
   * @param {string|number} [reportData.player_id] - Player ID (exactly one of player_id or prospect_id required)
   * @param {string|number} [reportData.prospect_id] - Prospect ID (exactly one of player_id or prospect_id required)
   * @param {string|number} [reportData.report_date] - Report date (ISO format)
   * @param {string} [reportData.event_type] - Event type (game, showcase, etc.)
   * @param {number|string} [reportData.overall_present] - Overall present grade (20-80 or letter)
   * @param {number|string} [reportData.overall_future] - Overall future grade (20-80 or letter)
   * @param {string} [reportData.notes] - Scouting notes
   * @returns {Promise<Object>} The newly created scouting report
   */
  createScoutingReport: async (reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const response = await api.post('/reports/scouting', filteredData);
    return response.data;
  },

  /**
   * Retrieves a specific scouting report by ID
   *
   * @async
   * @function getScoutingReport
   * @memberof reportsService
   * @param {string} id - The unique identifier of the scouting report
   * @returns {Promise<Object>} The scouting report object
   * @returns {string} return.id - Report's unique identifier
   * @returns {string} return.playerId - Player ID
   * @returns {string} return.scoutId - Scout ID
   * @returns {string} return.overallGrade - Overall scouting grade
   * @returns {string} [return.overallNotes] - Overall notes
   * @returns {string} return.createdAt - ISO timestamp of creation
   *
   * @throws {Error} Throws 404 error if report not found
   *
   * @example
   * const report = await reportsService.getScoutingReport('report-789');
   */
  getScoutingReport: async (id) => {
    const response = await api.get(`/reports/scouting/${id}`);
    return response.data;
  },

  /**
   * Updates an existing scouting report
   *
   * @async
   * @function updateScoutingReport
   * @memberof reportsService
   * @param {string} id - The unique identifier of the scouting report to update
   * @param {Object} reportData - Fields to update (only include fields you want to change)
   * @param {string} [reportData.overallGrade] - Updated overall grade
   * @param {string} [reportData.hittingGrade] - Updated hitting grade
   * @param {string} [reportData.pitchingGrade] - Updated pitching grade
   * @param {string} [reportData.fieldingGrade] - Updated fielding grade
   * @param {string} [reportData.overallNotes] - Updated notes
   * @returns {Promise<Object>} The updated scouting report
   * @returns {string} return.id - Report's unique identifier
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if report not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the reportData object before sending to the API.
   *
   * @example
   * const updated = await reportsService.updateScoutingReport('report-789', {
   *   overallGrade: 'A+',
   *   overallNotes: 'Showed significant improvement in hitting mechanics'
   * });
   */
  updateScoutingReport: async (id, reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const response = await api.put(`/reports/scouting/${id}`, filteredData);
    return response.data;
  },

  /**
   * Generates a PDF report on the server side
   *
   * @async
   * @function generatePDF
   * @memberof reportsService
   * @param {string} reportType - Type of report to generate (e.g., 'player-performance', 'team-statistics', 'scouting-analysis')
   * @param {Object} data - Data to include in the report
   * @param {Object} [options={}] - Additional options for PDF generation
   * @param {string} [options.orientation] - PDF orientation ('portrait' or 'landscape')
   * @param {string} [options.format] - Page format (e.g., 'letter', 'a4')
   * @param {boolean} [options.includeCharts] - Whether to include charts
   * @returns {Promise<Blob>} PDF file as a blob for download
   *
   * @throws {Error} Throws error if server error occurs or report type is invalid
   *
   * @description This method sends a POST request to the server with responseType: 'blob'
   *              to receive the PDF file as a binary blob. Use file-saver or URL.createObjectURL
   *              to download or display the PDF.
   *
   * @example
   * const pdfBlob = await reportsService.generatePDF('player-performance', {
   *   players: playersData,
   *   season: '2024'
   * }, {
   *   orientation: 'landscape',
   *   includeCharts: true
   * });
   * saveAs(pdfBlob, 'player-performance-2024.pdf');
   */
  generatePDF: async (reportType, data, options = {}) => {
    const response = await api.post(
      '/reports/generate-pdf',
      {
        type: reportType,
        data,
        options
      },
      {
        responseType: 'blob'
      }
    );
    return response.data;
  },

  /**
   * Exports report data to Excel on the server side
   *
   * @async
   * @function exportToExcel
   * @memberof reportsService
   * @param {string} reportType - Type of report to export (e.g., 'player-performance', 'team-statistics')
   * @param {Object} data - Data to include in the Excel file
   * @param {Object} [options={}] - Additional options for Excel generation
   * @param {string} [options.sheetName] - Name of the Excel worksheet
   * @param {boolean} [options.includeCharts] - Whether to include charts
   * @param {boolean} [options.autoFilter] - Whether to add auto-filter to headers
   * @returns {Promise<Blob>} Excel file as a blob for download
   *
   * @throws {Error} Throws error if server error occurs or report type is invalid
   *
   * @description This method sends a POST request to the server with responseType: 'blob'
   *              to receive the Excel file as a binary blob. Use file-saver or URL.createObjectURL
   *              to download the file.
   *
   * @example
   * const excelBlob = await reportsService.exportToExcel('team-statistics', {
   *   teams: teamsData,
   *   season: '2024'
   * }, {
   *   sheetName: 'Team Stats 2024',
   *   autoFilter: true
   * });
   * saveAs(excelBlob, 'team-statistics-2024.xlsx');
   */
  exportToExcel: async (reportType, data, options = {}) => {
    const response = await api.post(
      '/reports/export-excel',
      {
        type: reportType,
        data,
        options
      },
      {
        responseType: 'blob'
      }
    );
    return response.data;
  }
};

/**
 * Client-side PDF generation utilities using jsPDF library
 *
 * This object provides methods for generating various types of PDF reports
 * directly in the browser using the jsPDF library and jsPDF-autotable plugin.
 * These utilities create formatted PDF documents with headers, tables, and text.
 *
 * All PDF generation methods return a jsPDF document instance that can be:
 * - Downloaded using the downloadPDF utility
 * - Saved using file-saver library
 * - Displayed in an iframe or new window
 * - Converted to blob or data URL
 *
 * jsPDF Integration:
 * - Uses jsPDF for document creation and text rendering
 * - Uses jsPDF-autotable plugin for table generation
 * - Supports custom styling, colors, and formatting
 * - Handles pagination automatically for long reports
 *
 * @namespace pdfUtils
 */
export const pdfUtils = {
  /**
   * Generates a Player Performance Report PDF
   *
   * @function generatePlayerPerformancePDF
   * @memberof pdfUtils
   * @param {Object} data - Player performance data
   * @param {Array<Object>} data.players - Array of player objects with statistics
   * @param {string} data.players[].first_name - Player's first name
   * @param {string} data.players[].last_name - Player's last name
   * @param {string} data.players[].position - Player's position
   * @param {number} [data.players[].batting_avg] - Batting average
   * @param {number} [data.players[].home_runs] - Home runs count
   * @param {number} [data.players[].rbi] - Runs batted in
   * @param {number} [data.players[].era] - Earned run average
   * @param {number} [data.players[].wins] - Wins count
   * @param {Object} [options={}] - Additional options for PDF generation (currently unused)
   * @returns {jsPDF} jsPDF document instance with player performance report
   *
   * @description Creates a formatted PDF with a centered header and a table of player
   *              statistics. The table includes columns for player name, position, and
   *              various performance metrics. Uses blue theme colors (RGB: 59, 130, 246).
   *
   * @example
   * const doc = pdfUtils.generatePlayerPerformancePDF({
   *   players: [
   *     { first_name: 'John', last_name: 'Doe', position: 'P', era: 2.45, wins: 12 },
   *     { first_name: 'Jane', last_name: 'Smith', position: 'SS', batting_avg: 0.315, home_runs: 8 }
   *   ]
   * });
   * pdfUtils.downloadPDF(doc, 'player-performance');
   */
  generatePlayerPerformancePDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text('Player Performance Report', pageWidth / 2, 20, {
      align: 'center'
    });

    doc.setFontSize(12);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    // Table data
    const tableData = data.players.map((player) => [
      `${player.first_name} ${player.last_name}`,
      player.position,
      player.batting_avg || 'N/A',
      player.home_runs || 'N/A',
      player.rbi || 'N/A',
      player.era || 'N/A',
      player.wins || 'N/A'
    ]);

    // Create table
    doc.autoTable({
      startY: 40,
      head: [['Player', 'Position', 'AVG', 'HR', 'RBI', 'ERA', 'Wins']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 }
    });

    return doc;
  },

  /**
   * Generates a Team Statistics Report PDF
   *
   * @function generateTeamStatisticsPDF
   * @memberof pdfUtils
   * @param {Object} data - Team statistics data
   * @param {string} data.team_name - Name of the team
   * @param {number} [data.total_players] - Total number of players on the team
   * @param {number} [data.team_batting_average] - Team batting average
   * @param {number} [data.team_era] - Team earned run average
   * @param {number} [data.wins] - Number of wins
   * @param {number} [data.losses] - Number of losses
   * @param {number} [data.win_percentage] - Win percentage
   * @param {Object} [options={}] - Additional options for PDF generation (currently unused)
   * @returns {jsPDF} jsPDF document instance with team statistics report
   *
   * @description Creates a formatted PDF with centered headers (title, team name, date)
   *              and a two-column table showing team statistics. Uses blue theme colors
   *              (RGB: 59, 130, 246) for headers.
   *
   * @example
   * const doc = pdfUtils.generateTeamStatisticsPDF({
   *   team_name: 'Eagles',
   *   total_players: 25,
   *   team_batting_average: 0.285,
   *   wins: 42,
   *   losses: 18,
   *   win_percentage: 0.700
   * });
   * pdfUtils.downloadPDF(doc, 'team-statistics');
   */
  generateTeamStatisticsPDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text('Team Statistics Summary', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Team: ${data.team_name}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      40,
      { align: 'center' }
    );

    // Team stats
    const teamStats = [
      ['Category', 'Value'],
      ['Total Players', data.total_players || 'N/A'],
      ['Team Batting Average', data.team_batting_average || 'N/A'],
      ['Team ERA', data.team_era || 'N/A'],
      ['Wins', data.wins || 'N/A'],
      ['Losses', data.losses || 'N/A'],
      ['Win Percentage', data.win_percentage || 'N/A']
    ];

    // Create table
    doc.autoTable({
      startY: 50,
      head: [['Category', 'Value']],
      body: teamStats.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 12 }
    });

    return doc;
  },

  /**
   * Generates a Scouting Analysis Report PDF
   *
   * @function generateScoutingAnalysisPDF
   * @memberof pdfUtils
   * @param {Object} data - Scouting analysis data
   * @param {Array<Object>} data.reports - Array of scouting report objects
   * @param {string} data.reports[].player_name - Player's full name
   * @param {string} data.reports[].position - Player's position
   * @param {string} data.reports[].overall_grade - Overall scouting grade
   * @param {string} data.reports[].hitting_grade - Hitting grade
   * @param {string} data.reports[].pitching_grade - Pitching grade
   * @param {string} data.reports[].fielding_grade - Fielding grade
   * @param {string} [data.reports[].overall_notes] - Scouting notes
   * @param {Object} [options={}] - Additional options for PDF generation (currently unused)
   * @returns {jsPDF} jsPDF document instance with scouting analysis report
   *
   * @description Creates a formatted PDF with a centered header and detailed scouting
   *              information for each player. Includes player name, position, grades,
   *              and notes. Automatically adds new pages when content exceeds 250 units
   *              on the y-axis. Notes are wrapped to fit page width.
   *
   * @example
   * const doc = pdfUtils.generateScoutingAnalysisPDF({
   *   reports: [
   *     {
   *       player_name: 'John Doe',
   *       position: 'SS',
   *       overall_grade: 'A',
   *       hitting_grade: 'A-',
   *       pitching_grade: 'N/A',
   *       fielding_grade: 'B+',
   *       overall_notes: 'Excellent bat speed and strong arm'
   *     }
   *   ]
   * });
   * pdfUtils.downloadPDF(doc, 'scouting-analysis');
   */
  generateScoutingAnalysisPDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text('Scouting Analysis Report', pageWidth / 2, 20, {
      align: 'center'
    });

    doc.setFontSize(12);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    let yPosition = 40;

    // Process each scouting report
    data.reports.forEach((report, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(`${report.player_name} - ${report.position}`, 20, yPosition);

      yPosition += 10;
      doc.setFontSize(10);
      doc.text(`Overall Grade: ${report.overall_grade}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Hitting Grade: ${report.hitting_grade}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Pitching Grade: ${report.pitching_grade}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Fielding Grade: ${report.fielding_grade}`, 20, yPosition);
      yPosition += 7;

      // Notes (truncated if too long)
      const notes = report.overall_notes || 'No notes available';
      const maxWidth = pageWidth - 40;
      const lines = doc.splitTextToSize(notes, maxWidth);
      doc.text('Notes:', 20, yPosition);
      yPosition += 5;
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 10;
    });

    return doc;
  },

  /**
   * Generates a Recruitment Pipeline Report PDF
   *
   * @function generateRecruitmentPipelinePDF
   * @memberof pdfUtils
   * @param {Object} data - Recruitment pipeline data
   * @param {Array<Object>} data.pipeline - Array of pipeline stage objects
   * @param {string} data.pipeline[].stage_name - Name of the recruitment stage
   * @param {number} data.pipeline[].player_count - Number of players in this stage
   * @param {string} data.pipeline[].avg_grade - Average scouting grade for this stage
   * @param {string} data.pipeline[].next_action - Recommended next action for this stage
   * @param {Object} [options={}] - Additional options for PDF generation (currently unused)
   * @returns {jsPDF} jsPDF document instance with recruitment pipeline report
   *
   * @description Creates a formatted PDF with a centered header and a table showing
   *              recruitment pipeline stages. The table displays stage name, player count,
   *              average grade, and next action for each stage. Uses blue theme colors
   *              (RGB: 59, 130, 246) for headers.
   *
   * @example
   * const doc = pdfUtils.generateRecruitmentPipelinePDF({
   *   pipeline: [
   *     { stage_name: 'Initial Contact', player_count: 45, avg_grade: 'B+', next_action: 'Schedule visit' },
   *     { stage_name: 'Campus Visit', player_count: 12, avg_grade: 'A-', next_action: 'Offer scholarship' }
   *   ]
   * });
   * pdfUtils.downloadPDF(doc, 'recruitment-pipeline');
   */
  generateRecruitmentPipelinePDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text('Recruitment Pipeline Report', pageWidth / 2, 20, {
      align: 'center'
    });

    doc.setFontSize(12);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    // Pipeline stages
    const pipelineData = data.pipeline.map((stage) => [
      stage.stage_name,
      stage.player_count,
      stage.avg_grade,
      stage.next_action
    ]);

    // Create table
    doc.autoTable({
      startY: 40,
      head: [['Stage', 'Players', 'Avg Grade', 'Next Action']],
      body: pipelineData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 }
    });

    return doc;
  },

  /**
   * Generates a Custom Report PDF with flexible sections
   *
   * @function generateCustomReportPDF
   * @memberof pdfUtils
   * @param {Object} data - Custom report data
   * @param {string} [data.title='Custom Report'] - Report title
   * @param {Array<Object>} data.sections - Array of section objects to include in the report
   * @param {string} data.sections[].title - Section title
   * @param {string} data.sections[].type - Section type ('table' or 'text')
   * @param {Array<Array>} [data.sections[].headers] - Table headers (required if type is 'table')
   * @param {Array<Array>} [data.sections[].data] - Table data rows (required if type is 'table')
   * @param {string} [data.sections[].content] - Text content (required if type is 'text')
   * @param {Object} [options={}] - Additional options for PDF generation (currently unused)
   * @returns {jsPDF} jsPDF document instance with custom report
   *
   * @description Creates a flexible PDF report that can contain multiple sections of different
   *              types (tables or text). Each section has a title and content. Tables are
   *              rendered using jsPDF-autotable with blue headers. Text content is wrapped to
   *              fit page width. Automatically adds new pages when content exceeds 250 units
   *              on the y-axis.
   *
   * @example
   * const doc = pdfUtils.generateCustomReportPDF({
   *   title: 'Season Summary Report',
   *   sections: [
   *     {
   *       title: 'Team Overview',
   *       type: 'text',
   *       content: 'This season showed significant improvement in all areas...'
   *     },
   *     {
   *       title: 'Top Performers',
   *       type: 'table',
   *       headers: [['Player', 'Position', 'Stats']],
   *       data: [['John Doe', 'P', '12 Wins'], ['Jane Smith', 'SS', '.315 AVG']]
   *     }
   *   ]
   * });
   * pdfUtils.downloadPDF(doc, 'custom-report');
   */
  generateCustomReportPDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text(data.title || 'Custom Report', pageWidth / 2, 20, {
      align: 'center'
    });

    doc.setFontSize(12);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    let yPosition = 40;

    // Process sections
    data.sections.forEach((section, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(section.title, 20, yPosition);
      yPosition += 10;

      if (section.type === 'table' && section.data) {
        doc.autoTable({
          startY: yPosition,
          head: section.headers || [],
          body: section.data,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          styles: { fontSize: 10 }
        });
        yPosition = doc.lastAutoTable.finalY + 10;
      } else if (section.type === 'text' && section.content) {
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(section.content, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 10;
      }
    });

    return doc;
  },

  /**
   * Downloads a jsPDF document as a PDF file
   *
   * @function downloadPDF
   * @memberof pdfUtils
   * @param {jsPDF} doc - The jsPDF document instance to download
   * @param {string} filename - Filename for the downloaded PDF (without .pdf extension)
   * @returns {void}
   *
   * @description Converts a jsPDF document to a blob and triggers a download using the
   *              file-saver library. The .pdf extension is automatically appended to the
   *              filename. This is a synchronous operation that immediately triggers the
   *              browser's download dialog.
   *
   * @example
   * const doc = new jsPDF();
   * doc.text('Hello World', 10, 10);
   * pdfUtils.downloadPDF(doc, 'my-report');
   * // Downloads as "my-report.pdf"
   */
  downloadPDF: (doc, filename) => {
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, `${filename}.pdf`);
  },

  /**
   * Generates and immediately downloads a report PDF based on report type
   *
   * @function generateAndDownloadReport
   * @memberof pdfUtils
   * @param {string} reportType - Type of report to generate ('player-performance', 'team-statistics', 'scouting-analysis', 'recruitment-pipeline', 'custom')
   * @param {Object} data - Data to include in the report (structure depends on reportType)
   * @param {string} filename - Filename for the downloaded PDF (without .pdf extension)
   * @returns {void}
   *
   * @throws {Error} Throws error if reportType is not recognized
   *
   * @description This is a convenience method that combines report generation and download
   *              into a single operation. It routes to the appropriate PDF generator based
   *              on reportType, generates the document, and triggers the download.
   *
   * Supported report types:
   * - 'player-performance': Uses generatePlayerPerformancePDF
   * - 'team-statistics': Uses generateTeamStatisticsPDF
   * - 'scouting-analysis': Uses generateScoutingAnalysisPDF
   * - 'recruitment-pipeline': Uses generateRecruitmentPipelinePDF
   * - 'custom': Uses generateCustomReportPDF
   *
   * @example
   * // Generate and download a player performance report
   * pdfUtils.generateAndDownloadReport('player-performance', {
   *   players: playersData
   * }, 'player-performance-2024');
   *
   * @example
   * // Generate and download a custom report
   * pdfUtils.generateAndDownloadReport('custom', {
   *   title: 'Season Summary',
   *   sections: [...]
   * }, 'season-summary');
   */
  generateAndDownloadReport: (reportType, data, filename) => {
    let doc;

    switch (reportType) {
      case 'player-performance':
        doc = pdfUtils.generatePlayerPerformancePDF(data);
        break;
      case 'team-statistics':
        doc = pdfUtils.generateTeamStatisticsPDF(data);
        break;
      case 'scouting-analysis':
        doc = pdfUtils.generateScoutingAnalysisPDF(data);
        break;
      case 'recruitment-pipeline':
        doc = pdfUtils.generateRecruitmentPipelinePDF(data);
        break;
      case 'custom':
        doc = pdfUtils.generateCustomReportPDF(data);
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    pdfUtils.downloadPDF(doc, filename);
  }
};

/**
 * Chart data generation utilities for reports visualization
 *
 * This object provides methods for converting raw report data into chart-ready
 * data structures compatible with chart visualization libraries (e.g., Chart.js,
 * Recharts). The generated data includes properly formatted labels, datasets,
 * and styling configurations.
 *
 * All chart data generators return objects with:
 * - labels: Array of x-axis labels
 * - datasets: Array of dataset objects with data values and styling
 *
 * Color Scheme:
 * - Blue (59, 130, 246) - Primary metrics
 * - Red (239, 68, 68) - Secondary metrics
 * - Green (34, 197, 94) - Wins/positive indicators
 * - Gray (156, 163, 175) - Neutral indicators
 *
 * @namespace chartUtils
 */
export const chartUtils = {
  /**
   * Creates chart data for player performance visualization
   *
   * @function createPerformanceChartData
   * @memberof chartUtils
   * @param {Array<Object>} players - Array of player objects with performance data
   * @param {string} players[].first_name - Player's first name
   * @param {string} players[].last_name - Player's last name
   * @param {number} [players[].batting_average=0] - Player's batting average
   * @param {number} [players[].home_runs=0] - Player's home run count
   * @returns {Object} Chart-ready data object
   * @returns {Array<string>} return.labels - Player names as x-axis labels
   * @returns {Array<Object>} return.datasets - Array of dataset objects
   * @returns {string} return.datasets[].label - Dataset label
   * @returns {Array<number>} return.datasets[].data - Data values for each player
   * @returns {string} return.datasets[].backgroundColor - Background color (RGBA)
   * @returns {string} return.datasets[].borderColor - Border color (RGBA)
   * @returns {number} return.datasets[].borderWidth - Border width
   *
   * @description Generates chart data comparing player batting averages and home runs.
   *              Returns two datasets: one for batting average (blue) and one for home
   *              runs (red). Missing values default to 0. Labels are formatted as
   *              "FirstName LastName".
   *
   * @example
   * const chartData = chartUtils.createPerformanceChartData([
   *   { first_name: 'John', last_name: 'Doe', batting_average: 0.315, home_runs: 12 },
   *   { first_name: 'Jane', last_name: 'Smith', batting_average: 0.290, home_runs: 8 }
   * ]);
   * // Use with Chart.js:
   * // new Chart(ctx, { type: 'bar', data: chartData });
   */
  createPerformanceChartData: (players) => {
    return {
      labels: players.map((p) => `${p.first_name} ${p.last_name}`),
      datasets: [
        {
          label: 'Batting Average',
          data: players.map((p) => p.batting_average || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: 'Home Runs',
          data: players.map((p) => p.home_runs || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        }
      ]
    };
  },

  /**
   * Creates chart data for team statistics visualization
   *
   * @function createTeamStatsChartData
   * @memberof chartUtils
   * @param {Object} stats - Team statistics object
   * @param {number} [stats.wins=0] - Number of wins
   * @param {number} [stats.losses=0] - Number of losses
   * @param {number} [stats.ties=0] - Number of ties
   * @returns {Object} Chart-ready data object for pie/doughnut chart
   * @returns {Array<string>} return.labels - Category labels ('Wins', 'Losses', 'Ties')
   * @returns {Array<Object>} return.datasets - Array containing single dataset
   * @returns {Array<number>} return.datasets[0].data - Data values for wins, losses, ties
   * @returns {Array<string>} return.datasets[0].backgroundColor - Background colors (RGBA)
   * @returns {Array<string>} return.datasets[0].borderColor - Border colors (RGBA)
   * @returns {number} return.datasets[0].borderWidth - Border width
   *
   * @description Generates chart data for team win/loss/tie record visualization.
   *              Returns a single dataset with three values (wins, losses, ties) and
   *              corresponding colors: green for wins, red for losses, gray for ties.
   *              Missing values default to 0. Suitable for pie or doughnut charts.
   *
   * @example
   * const chartData = chartUtils.createTeamStatsChartData({
   *   wins: 42,
   *   losses: 18,
   *   ties: 2
   * });
   * // Use with Chart.js:
   * // new Chart(ctx, { type: 'pie', data: chartData });
   */
  createTeamStatsChartData: (stats) => {
    return {
      labels: ['Wins', 'Losses', 'Ties'],
      datasets: [
        {
          data: [stats.wins || 0, stats.losses || 0, stats.ties || 0],
          backgroundColor: [
            'rgba(34, 197, 94, 0.5)',
            'rgba(239, 68, 68, 0.5)',
            'rgba(156, 163, 175, 0.5)'
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(156, 163, 175, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }
};
