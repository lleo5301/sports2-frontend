/**
 * @fileoverview Team management service module providing CRUD operations,
 * statistics, and roster management for teams.
 *
 * This service handles all team-related API calls including:
 * - Listing all teams
 * - Fetching individual team details
 * - Getting current user's team information
 * - Creating new team records
 * - Updating current user's team information
 * - Retrieving team statistics
 * - Accessing team roster data
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings, null,
 * and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/teams
 * @requires ./api
 */

import api from './api'

/**
 * Team management service object containing all team-related API methods
 *
 * @namespace teamsService
 */
export const teamsService = {
  /**
   * Retrieves a list of all teams in the system
   *
   * @async
   * @function getAllTeams
   * @memberof teamsService
   * @returns {Promise<Object>} Response containing array of team objects
   * @returns {Array<Object>} return.data - Array of team objects
   * @returns {string} return.data[].id - Team's unique identifier
   * @returns {string} return.data[].name - Team's name
   * @returns {string} [return.data[].city] - Team's city
   * @returns {string} [return.data[].state] - Team's state
   * @returns {string} [return.data[].conference] - Team's conference
   * @returns {string} [return.data[].division] - Team's division
   * @returns {string} return.data[].createdAt - ISO timestamp of team record creation
   * @returns {string} return.data[].updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const teams = await teamsService.getAllTeams();
   * console.log('Total teams:', teams.data.length);
   * teams.data.forEach(team => console.log(team.name));
   */
  getAllTeams: async () => {
    const response = await api.get('/teams')
    return response.data
  },

  /**
   * Retrieves detailed information for a single team by ID
   *
   * @async
   * @function getTeam
   * @memberof teamsService
   * @param {string} id - The unique identifier of the team to retrieve
   * @returns {Promise<Object>} The team object with complete details
   * @returns {string} return.id - Team's unique identifier
   * @returns {string} return.name - Team's name
   * @returns {string} [return.city] - Team's city
   * @returns {string} [return.state] - Team's state
   * @returns {string} [return.conference] - Team's conference
   * @returns {string} [return.division] - Team's division
   * @returns {string} [return.mascot] - Team's mascot
   * @returns {string} [return.colors] - Team's colors
   * @returns {string} [return.logoUrl] - URL to team's logo image
   * @returns {string} return.createdAt - ISO timestamp of team record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if team not found
   *
   * @example
   * const team = await teamsService.getTeam('team-123');
   * console.log('Team name:', team.name);
   * console.log('Conference:', team.conference);
   */
  getTeam: async (id) => {
    const response = await api.get(`/teams/byId/${id}`)
    return response.data
  },

  /**
   * Retrieves the team information for the currently authenticated user
   *
   * @async
   * @function getMyTeam
   * @memberof teamsService
   * @returns {Promise<Object>} The current user's team object
   * @returns {string} return.id - Team's unique identifier
   * @returns {string} return.name - Team's name
   * @returns {string} [return.city] - Team's city
   * @returns {string} [return.state] - Team's state
   * @returns {string} [return.conference] - Team's conference
   * @returns {string} [return.division] - Team's division
   * @returns {string} [return.mascot] - Team's mascot
   * @returns {string} [return.colors] - Team's colors
   * @returns {string} [return.logoUrl] - URL to team's logo image
   * @returns {string} return.createdAt - ISO timestamp of team record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if current user is not associated with a team
   * @throws {Error} Throws 401 error if user is not authenticated
   *
   * @example
   * const myTeam = await teamsService.getMyTeam();
   * console.log('My team:', myTeam.name);
   */
  getMyTeam: async () => {
    const response = await api.get('/teams/me')
    return response.data
  },

  /**
   * Creates a new team record
   *
   * @async
   * @function createTeam
   * @memberof teamsService
   * @param {Object} teamData - Data for the new team
   * @param {string} teamData.name - Team's name (required)
   * @param {string} [teamData.city] - Team's city
   * @param {string} [teamData.state] - Team's state
   * @param {string} [teamData.conference] - Team's conference
   * @param {string} [teamData.division] - Team's division
   * @param {string} [teamData.mascot] - Team's mascot
   * @param {string} [teamData.colors] - Team's colors
   * @param {string} [teamData.logoUrl] - URL to team's logo image
   * @param {string} [teamData.website] - Team's website URL
   * @param {string} [teamData.email] - Team's contact email
   * @param {string} [teamData.phone] - Team's contact phone number
   * @returns {Promise<Object>} The newly created team object
   * @returns {string} return.id - Team's unique identifier
   * @returns {string} return.name - Team's name
   * @returns {string} [return.city] - Team's city
   * @returns {string} [return.state] - Team's state
   * @returns {string} return.createdAt - ISO timestamp of team record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the teamData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newTeam = await teamsService.createTeam({
   *   name: 'Eagles',
   *   city: 'Philadelphia',
   *   state: 'PA',
   *   conference: 'NFC',
   *   division: 'East'
   * });
   * console.log('Created team:', newTeam.id);
   */
  createTeam: async (teamData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(teamData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/teams', filteredData)
    return response.data
  },

  /**
   * Updates the current user's team information
   *
   * @async
   * @function updateMyTeam
   * @memberof teamsService
   * @param {Object} teamData - Team fields to update (only include fields you want to change)
   * @param {string} [teamData.name] - Updated team name
   * @param {string} [teamData.city] - Updated city
   * @param {string} [teamData.state] - Updated state
   * @param {string} [teamData.conference] - Updated conference
   * @param {string} [teamData.division] - Updated division
   * @param {string} [teamData.mascot] - Updated mascot
   * @param {string} [teamData.colors] - Updated colors
   * @param {string} [teamData.logoUrl] - Updated logo URL
   * @param {string} [teamData.website] - Updated website URL
   * @param {string} [teamData.email] - Updated contact email
   * @param {string} [teamData.phone] - Updated contact phone number
   * @returns {Promise<Object>} The updated team object with all current data
   * @returns {string} return.id - Team's unique identifier
   * @returns {string} return.name - Updated team name
   * @returns {string} [return.city] - Updated city
   * @returns {string} [return.state] - Updated state
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if current user is not associated with a team
   * @throws {Error} Throws 401 error if user is not authenticated
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the teamData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedTeam = await teamsService.updateMyTeam({
   *   mascot: 'Wildcats',
   *   colors: 'Blue and Gold'
   * });
   * console.log('Updated team:', updatedTeam.name);
   */
  updateMyTeam: async (teamData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(teamData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put('/teams/me', filteredData)
    return response.data
  },

  /**
   * Retrieves comprehensive statistics for teams
   *
   * @async
   * @function getTeamStats
   * @memberof teamsService
   * @returns {Promise<Object>} Team statistics object
   * @returns {Array<Object>} return.teams - Array of team statistics
   * @returns {string} return.teams[].teamId - Team's unique identifier
   * @returns {string} return.teams[].teamName - Team's name
   * @returns {number} return.teams[].gamesPlayed - Total number of games played
   * @returns {number} return.teams[].wins - Total wins
   * @returns {number} return.teams[].losses - Total losses
   * @returns {number} return.teams[].ties - Total ties
   * @returns {number} [return.teams[].pointsScored] - Total points scored
   * @returns {number} [return.teams[].pointsAllowed] - Total points allowed
   * @returns {Object} [return.teams[].seasonStats] - Statistics broken down by season
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const stats = await teamsService.getTeamStats();
   * stats.teams.forEach(team => {
   *   console.log(`${team.teamName}: ${team.wins}-${team.losses}`);
   * });
   */
  getTeamStats: async () => {
    const response = await api.get('/teams/stats')
    return response.data
  },

  /**
   * Retrieves the roster (list of players) for teams
   *
   * @async
   * @function getTeamRoster
   * @memberof teamsService
   * @returns {Promise<Object>} Response containing team roster data
   * @returns {Array<Object>} return.roster - Array of player objects
   * @returns {string} return.roster[].playerId - Player's unique identifier
   * @returns {string} return.roster[].playerName - Player's full name
   * @returns {string} return.roster[].position - Player's position
   * @returns {string} return.roster[].jerseyNumber - Player's jersey number
   * @returns {string} [return.roster[].height] - Player's height
   * @returns {string} [return.roster[].weight] - Player's weight
   * @returns {string} [return.roster[].year] - Player's academic year (Freshman, Sophomore, etc.)
   * @returns {string} [return.teamId] - Team's unique identifier
   * @returns {string} [return.teamName] - Team's name
   *
   * @throws {Error} Throws 404 error if team not found
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const roster = await teamsService.getTeamRoster();
   * console.log(`Roster has ${roster.roster.length} players`);
   * roster.roster.forEach(player => {
   *   console.log(`#${player.jerseyNumber} ${player.playerName} (${player.position})`);
   * });
   */
  getTeamRoster: async () => {
    const response = await api.get('/teams/roster')
    return response.data
  }
}
