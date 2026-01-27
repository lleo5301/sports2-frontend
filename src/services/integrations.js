import api from './api';

export const integrationsService = {
  // PrestoSports Integration

  /**
   * Get PrestoSports integration status
   */
  getPrestoStatus: async () => {
    const response = await api.get('/integrations/presto/status');
    return response.data;
  },

  /**
   * Configure PrestoSports credentials
   */
  configurePresto: async (credentials) => {
    const response = await api.post('/integrations/presto/configure', credentials);
    return response.data;
  },

  /**
   * Test PrestoSports connection
   */
  testPrestoConnection: async (credentials) => {
    const response = await api.post('/integrations/presto/test', credentials);
    return response.data;
  },

  /**
   * Disconnect PrestoSports
   */
  disconnectPresto: async () => {
    const response = await api.delete('/integrations/presto/disconnect');
    return response.data;
  },

  /**
   * Get available seasons
   */
  getPrestoSeasons: async () => {
    const response = await api.get('/integrations/presto/seasons');
    return response.data;
  },

  /**
   * Get teams for a season
   */
  getPrestoSeasonTeams: async (seasonId) => {
    const response = await api.get(`/integrations/presto/seasons/${seasonId}/teams`);
    return response.data;
  },

  /**
   * Get user's accessible teams
   */
  getPrestoTeams: async () => {
    const response = await api.get('/integrations/presto/teams');
    return response.data;
  },

  /**
   * Update PrestoSports team/season selection
   */
  updatePrestoSettings: async (settings) => {
    const response = await api.put('/integrations/presto/settings', settings);
    return response.data;
  },

  /**
   * Sync schedule from PrestoSports
   */
  syncPrestoSchedule: async () => {
    const response = await api.post('/integrations/presto/sync/schedule');
    return response.data;
  },

  /**
   * Sync roster from PrestoSports
   */
  syncPrestoRoster: async () => {
    const response = await api.post('/integrations/presto/sync/roster');
    return response.data;
  },

  /**
   * Sync stats from PrestoSports
   */
  syncPrestoStats: async () => {
    const response = await api.post('/integrations/presto/sync/stats');
    return response.data;
  },

  /**
   * Sync all from PrestoSports (roster, schedule, stats)
   */
  syncPrestoAll: async () => {
    const response = await api.post('/integrations/presto/sync/all');
    return response.data;
  },

  /**
   * Sync team record (W-L) from PrestoSports
   */
  syncPrestoRecord: async () => {
    const response = await api.post('/integrations/presto/sync/record');
    return response.data;
  },

  /**
   * Sync season stats from PrestoSports
   */
  syncPrestoSeasonStats: async () => {
    const response = await api.post('/integrations/presto/sync/season-stats');
    return response.data;
  },

  /**
   * Sync career stats from PrestoSports
   */
  syncPrestoCareerStats: async () => {
    const response = await api.post('/integrations/presto/sync/career-stats');
    return response.data;
  }
};

export default integrationsService;
