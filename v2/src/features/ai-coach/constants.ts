/**
 * Maps backend MCP tool names to user-friendly labels
 * shown in ToolIndicator during tool execution.
 */
export const TOOL_LABELS: Record<string, string> = {
  search_players: 'Searching players',
  get_player_stats: 'Looking up stats',
  get_player_splits: 'Analyzing splits',
  get_player_trend: 'Checking trends',
  compare_players: 'Comparing players',
  get_game_boxscore: 'Loading box score',
  get_play_by_play: 'Reading play-by-play',
  get_team_record: 'Getting team record',
  get_team_stats: 'Loading team stats',
  get_season_leaders: 'Finding leaders',
  get_scouting_reports: 'Pulling scouting reports',
  get_prospect_pipeline: 'Checking pipeline',
  get_recruiting_board: 'Loading recruiting board',
  get_depth_chart: 'Getting depth chart',
  get_schedule: 'Checking schedule',
  get_roster: 'Loading roster',
  get_daily_reports: 'Reading reports',
  get_matchup_analysis: 'Analyzing matchup',
}

/**
 * Insight category display labels and colors.
 */
export const INSIGHT_CATEGORY_LABELS: Record<string, string> = {
  player_performance: 'Player Performance',
  pitching_analysis: 'Pitching Analysis',
  recruiting: 'Recruiting',
  lineup: 'Lineup',
  scouting: 'Scouting',
  game_recap: 'Game Recap',
  weekly_digest: 'Weekly Digest',
}

export const INSIGHT_CATEGORY_COLORS: Record<string, string> = {
  player_performance:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  pitching_analysis:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  recruiting:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  lineup:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  scouting:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  game_recap: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  weekly_digest:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

/**
 * Prompt template category labels for tab headers.
 */
export const PROMPT_CATEGORY_LABELS: Record<string, string> = {
  player_performance: 'Player Performance',
  game_prep: 'Game Prep',
  recruiting: 'Recruiting',
  season_analysis: 'Season Analysis',
}

/**
 * Available AI models the user can select.
 */
export const AI_MODELS = [
  {
    value: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4 (Default)',
    description: 'Best balance of speed and quality',
  },
  {
    value: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fastest, lower cost',
  },
] as const
