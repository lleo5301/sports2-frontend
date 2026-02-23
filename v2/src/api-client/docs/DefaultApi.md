# DefaultApi

All URIs are relative to *http://localhost:5000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AuthAdminUsersGet**](DefaultApi.md#apiv1authadminusersget) | **GET** /api/v1/auth/admin/users | List users (super_admin only) |
| [**apiV1AuthAdminUsersPost**](DefaultApi.md#apiv1authadminuserspostoperation) | **POST** /api/v1/auth/admin/users | Create user (super_admin only) |
| [**apiV1AuthAdminUsersUserIdDelete**](DefaultApi.md#apiv1authadminusersuseriddelete) | **DELETE** /api/v1/auth/admin/users/{userId} | Delete user (super_admin only) |
| [**apiV1AuthAdminUsersUserIdGet**](DefaultApi.md#apiv1authadminusersuseridget) | **GET** /api/v1/auth/admin/users/{userId} | Get user by ID (super_admin only) |
| [**apiV1AuthAdminUsersUserIdPut**](DefaultApi.md#apiv1authadminusersuseridputoperation) | **PUT** /api/v1/auth/admin/users/{userId} | Update user (super_admin only) |
| [**apiV1AuthAdminUsersUserIdResetPasswordPut**](DefaultApi.md#apiv1authadminusersuseridresetpasswordputoperation) | **PUT** /api/v1/auth/admin/users/{userId}/reset-password | Reset user password (super_admin only) |
| [**apiV1AuthChangePasswordPut**](DefaultApi.md#apiv1authchangepasswordputoperation) | **PUT** /api/v1/auth/change-password | Change password |
| [**apiV1AuthCsrfTokenGet**](DefaultApi.md#apiv1authcsrftokenget) | **GET** /api/v1/auth/csrf-token | Get CSRF token |
| [**apiV1AuthLoginPost**](DefaultApi.md#apiv1authloginpostoperation) | **POST** /api/v1/auth/login | User login |
| [**apiV1AuthLogoutPost**](DefaultApi.md#apiv1authlogoutpost) | **POST** /api/v1/auth/logout | User logout |
| [**apiV1AuthMeGet**](DefaultApi.md#apiv1authmeget) | **GET** /api/v1/auth/me | Get current user profile |
| [**apiV1AuthMePut**](DefaultApi.md#apiv1authmeputoperation) | **PUT** /api/v1/auth/me | Update current user profile |
| [**apiV1AuthPermissionsGet**](DefaultApi.md#apiv1authpermissionsget) | **GET** /api/v1/auth/permissions | Get current user permissions |
| [**apiV1AuthRegisterPost**](DefaultApi.md#apiv1authregisterpostoperation) | **POST** /api/v1/auth/register | User registration |
| [**apiV1AuthRevokeAllSessionsPost**](DefaultApi.md#apiv1authrevokeallsessionspost) | **POST** /api/v1/auth/revoke-all-sessions | Revoke all sessions for current user |
| [**apiV1CoachesGet**](DefaultApi.md#apiv1coachesget) | **GET** /api/v1/coaches | List coaches |
| [**apiV1CoachesIdDelete**](DefaultApi.md#apiv1coachesiddelete) | **DELETE** /api/v1/coaches/{id} | Delete coach |
| [**apiV1CoachesIdGet**](DefaultApi.md#apiv1coachesidget) | **GET** /api/v1/coaches/{id} | Get coach |
| [**apiV1CoachesIdPut**](DefaultApi.md#apiv1coachesidput) | **PUT** /api/v1/coaches/{id} | Update coach |
| [**apiV1CoachesPost**](DefaultApi.md#apiv1coachespostoperation) | **POST** /api/v1/coaches | Create coach |
| [**apiV1DepthChartsByIdIdDelete**](DefaultApi.md#apiv1depthchartsbyididdelete) | **DELETE** /api/v1/depth-charts/byId/{id} | Delete depth chart |
| [**apiV1DepthChartsByIdIdGet**](DefaultApi.md#apiv1depthchartsbyididget) | **GET** /api/v1/depth-charts/byId/{id} | Get depth chart |
| [**apiV1DepthChartsByIdIdPut**](DefaultApi.md#apiv1depthchartsbyididput) | **PUT** /api/v1/depth-charts/byId/{id} | Update depth chart |
| [**apiV1DepthChartsGet**](DefaultApi.md#apiv1depthchartsget) | **GET** /api/v1/depth-charts | List depth charts |
| [**apiV1DepthChartsIdAvailablePlayersGet**](DefaultApi.md#apiv1depthchartsidavailableplayersget) | **GET** /api/v1/depth-charts/{id}/available-players | Get available players for depth chart |
| [**apiV1DepthChartsIdDuplicatePost**](DefaultApi.md#apiv1depthchartsidduplicatepost) | **POST** /api/v1/depth-charts/{id}/duplicate | Duplicate depth chart |
| [**apiV1DepthChartsIdHistoryGet**](DefaultApi.md#apiv1depthchartsidhistoryget) | **GET** /api/v1/depth-charts/{id}/history | Get depth chart history |
| [**apiV1DepthChartsIdPositionsPost**](DefaultApi.md#apiv1depthchartsidpositionspost) | **POST** /api/v1/depth-charts/{id}/positions | Add position to depth chart |
| [**apiV1DepthChartsIdRecommendedPlayersPositionIdGet**](DefaultApi.md#apiv1depthchartsidrecommendedplayerspositionidget) | **GET** /api/v1/depth-charts/{id}/recommended-players/{positionId} | Get recommended players for position |
| [**apiV1DepthChartsPlayersAssignmentIdDelete**](DefaultApi.md#apiv1depthchartsplayersassignmentiddelete) | **DELETE** /api/v1/depth-charts/players/{assignmentId} | Remove player from position |
| [**apiV1DepthChartsPositionsPositionIdDelete**](DefaultApi.md#apiv1depthchartspositionspositioniddelete) | **DELETE** /api/v1/depth-charts/positions/{positionId} | Delete position |
| [**apiV1DepthChartsPositionsPositionIdPlayersPost**](DefaultApi.md#apiv1depthchartspositionspositionidplayerspostoperation) | **POST** /api/v1/depth-charts/positions/{positionId}/players | Assign player to position |
| [**apiV1DepthChartsPositionsPositionIdPut**](DefaultApi.md#apiv1depthchartspositionspositionidput) | **PUT** /api/v1/depth-charts/positions/{positionId} | Update position |
| [**apiV1DepthChartsPost**](DefaultApi.md#apiv1depthchartspostoperation) | **POST** /api/v1/depth-charts | Create depth chart |
| [**apiV1GamesByIdIdDelete**](DefaultApi.md#apiv1gamesbyididdelete) | **DELETE** /api/v1/games/byId/{id} | Delete game |
| [**apiV1GamesByIdIdGet**](DefaultApi.md#apiv1gamesbyididget) | **GET** /api/v1/games/byId/{id} | Get game by ID |
| [**apiV1GamesByIdIdPut**](DefaultApi.md#apiv1gamesbyididput) | **PUT** /api/v1/games/byId/{id} | Update game |
| [**apiV1GamesGameIdStatsGet**](DefaultApi.md#apiv1gamesgameidstatsget) | **GET** /api/v1/games/{gameId}/stats | Game statistics |
| [**apiV1GamesGet**](DefaultApi.md#apiv1gamesget) | **GET** /api/v1/games | List games |
| [**apiV1GamesLogGet**](DefaultApi.md#apiv1gameslogget) | **GET** /api/v1/games/log | Game log |
| [**apiV1GamesPlayerStatsPlayerIdGet**](DefaultApi.md#apiv1gamesplayerstatsplayeridget) | **GET** /api/v1/games/player-stats/{playerId} | Player stats |
| [**apiV1GamesPost**](DefaultApi.md#apiv1gamespostoperation) | **POST** /api/v1/games | Create game |
| [**apiV1GamesSeasonStatsGet**](DefaultApi.md#apiv1gamesseasonstatsget) | **GET** /api/v1/games/season-stats | Season statistics |
| [**apiV1GamesTeamStatsGet**](DefaultApi.md#apiv1gamesteamstatsget) | **GET** /api/v1/games/team-stats | Team stats |
| [**apiV1GamesUpcomingGet**](DefaultApi.md#apiv1gamesupcomingget) | **GET** /api/v1/games/upcoming | Upcoming games |
| [**apiV1HealthGet**](DefaultApi.md#apiv1healthget) | **GET** /api/v1/health | API health check |
| [**apiV1HighSchoolCoachesGet**](DefaultApi.md#apiv1highschoolcoachesget) | **GET** /api/v1/high-school-coaches | List high school coaches |
| [**apiV1HighSchoolCoachesIdDelete**](DefaultApi.md#apiv1highschoolcoachesiddelete) | **DELETE** /api/v1/high-school-coaches/{id} | Delete high school coach |
| [**apiV1HighSchoolCoachesIdGet**](DefaultApi.md#apiv1highschoolcoachesidget) | **GET** /api/v1/high-school-coaches/{id} | Get high school coach |
| [**apiV1HighSchoolCoachesIdPut**](DefaultApi.md#apiv1highschoolcoachesidput) | **PUT** /api/v1/high-school-coaches/{id} | Update high school coach |
| [**apiV1HighSchoolCoachesPost**](DefaultApi.md#apiv1highschoolcoachespostoperation) | **POST** /api/v1/high-school-coaches | Create high school coach |
| [**apiV1IntegrationsPrestoConfigurePost**](DefaultApi.md#apiv1integrationsprestoconfigurepostoperation) | **POST** /api/v1/integrations/presto/configure | Configure Presto integration |
| [**apiV1IntegrationsPrestoDisconnectDelete**](DefaultApi.md#apiv1integrationsprestodisconnectdelete) | **DELETE** /api/v1/integrations/presto/disconnect | Disconnect Presto integration |
| [**apiV1IntegrationsPrestoSeasonsGet**](DefaultApi.md#apiv1integrationsprestoseasonsget) | **GET** /api/v1/integrations/presto/seasons | List Presto seasons |
| [**apiV1IntegrationsPrestoSettingsPut**](DefaultApi.md#apiv1integrationsprestosettingsput) | **PUT** /api/v1/integrations/presto/settings | Update Presto settings |
| [**apiV1IntegrationsPrestoStatusGet**](DefaultApi.md#apiv1integrationsprestostatusget) | **GET** /api/v1/integrations/presto/status | Get Presto integration status |
| [**apiV1IntegrationsPrestoSyncAllPost**](DefaultApi.md#apiv1integrationsprestosyncallpost) | **POST** /api/v1/integrations/presto/sync/all | Full sync from Presto |
| [**apiV1IntegrationsPrestoSyncRosterPost**](DefaultApi.md#apiv1integrationsprestosyncrosterpost) | **POST** /api/v1/integrations/presto/sync/roster | Sync roster from Presto |
| [**apiV1IntegrationsPrestoSyncSchedulePost**](DefaultApi.md#apiv1integrationsprestosyncschedulepost) | **POST** /api/v1/integrations/presto/sync/schedule | Sync schedule from Presto |
| [**apiV1IntegrationsPrestoSyncStatsPost**](DefaultApi.md#apiv1integrationsprestosyncstatspost) | **POST** /api/v1/integrations/presto/sync/stats | Sync stats from Presto |
| [**apiV1IntegrationsPrestoTeamsGet**](DefaultApi.md#apiv1integrationsprestoteamsget) | **GET** /api/v1/integrations/presto/teams | List Presto teams |
| [**apiV1IntegrationsPrestoTestPost**](DefaultApi.md#apiv1integrationsprestotestpost) | **POST** /api/v1/integrations/presto/test | Test Presto connection |
| [**apiV1LocationsGet**](DefaultApi.md#apiv1locationsget) | **GET** /api/v1/locations | List locations |
| [**apiV1LocationsIdDelete**](DefaultApi.md#apiv1locationsiddelete) | **DELETE** /api/v1/locations/{id} | Delete location |
| [**apiV1LocationsIdGet**](DefaultApi.md#apiv1locationsidget) | **GET** /api/v1/locations/{id} | Get location |
| [**apiV1LocationsIdPut**](DefaultApi.md#apiv1locationsidput) | **PUT** /api/v1/locations/{id} | Update location |
| [**apiV1LocationsPost**](DefaultApi.md#apiv1locationspostoperation) | **POST** /api/v1/locations | Create location |
| [**apiV1PlayersBulkDeletePost**](DefaultApi.md#apiv1playersbulkdeletepostoperation) | **POST** /api/v1/players/bulk-delete | Bulk delete players |
| [**apiV1PlayersByIdIdDelete**](DefaultApi.md#apiv1playersbyididdelete) | **DELETE** /api/v1/players/byId/{id} | Delete player |
| [**apiV1PlayersByIdIdGet**](DefaultApi.md#apiv1playersbyididget) | **GET** /api/v1/players/byId/{id} | Get player by ID |
| [**apiV1PlayersByIdIdPut**](DefaultApi.md#apiv1playersbyididput) | **PUT** /api/v1/players/byId/{id} | Update player |
| [**apiV1PlayersByIdIdStatsGet**](DefaultApi.md#apiv1playersbyididstatsget) | **GET** /api/v1/players/byId/{id}/stats | Get player statistics |
| [**apiV1PlayersGet**](DefaultApi.md#apiv1playersget) | **GET** /api/v1/players | List players |
| [**apiV1PlayersPerformanceGet**](DefaultApi.md#apiv1playersperformanceget) | **GET** /api/v1/players/performance | Get player performance data |
| [**apiV1PlayersPost**](DefaultApi.md#apiv1playerspost) | **POST** /api/v1/players | Create player |
| [**apiV1PlayersStatsSummaryGet**](DefaultApi.md#apiv1playersstatssummaryget) | **GET** /api/v1/players/stats/summary | Get players stats summary |
| [**apiV1ProspectsGet**](DefaultApi.md#apiv1prospectsget) | **GET** /api/v1/prospects | List prospects |
| [**apiV1ProspectsIdDelete**](DefaultApi.md#apiv1prospectsiddelete) | **DELETE** /api/v1/prospects/{id} | Delete prospect |
| [**apiV1ProspectsIdGet**](DefaultApi.md#apiv1prospectsidget) | **GET** /api/v1/prospects/{id} | Get prospect by ID |
| [**apiV1ProspectsIdMediaMediaIdDelete**](DefaultApi.md#apiv1prospectsidmediamediaiddelete) | **DELETE** /api/v1/prospects/{id}/media/{mediaId} | Delete prospect media |
| [**apiV1ProspectsIdMediaPost**](DefaultApi.md#apiv1prospectsidmediapost) | **POST** /api/v1/prospects/{id}/media | Upload media or add external URL |
| [**apiV1ProspectsIdPut**](DefaultApi.md#apiv1prospectsidput) | **PUT** /api/v1/prospects/{id} | Update prospect (partial) |
| [**apiV1ProspectsIdScoutingReportsGet**](DefaultApi.md#apiv1prospectsidscoutingreportsget) | **GET** /api/v1/prospects/{id}/scouting-reports | List scouting reports for prospect |
| [**apiV1ProspectsIdScoutingReportsPost**](DefaultApi.md#apiv1prospectsidscoutingreportspost) | **POST** /api/v1/prospects/{id}/scouting-reports | Create scouting report for prospect |
| [**apiV1ProspectsPost**](DefaultApi.md#apiv1prospectspost) | **POST** /api/v1/prospects | Create prospect |
| [**apiV1RecruitsGet**](DefaultApi.md#apiv1recruitsget) | **GET** /api/v1/recruits | Recruiting board - list prospects |
| [**apiV1RecruitsPreferenceListsGet**](DefaultApi.md#apiv1recruitspreferencelistsget) | **GET** /api/v1/recruits/preference-lists | List preference lists |
| [**apiV1RecruitsPreferenceListsIdDelete**](DefaultApi.md#apiv1recruitspreferencelistsiddelete) | **DELETE** /api/v1/recruits/preference-lists/{id} | Remove from preference list |
| [**apiV1RecruitsPreferenceListsIdPut**](DefaultApi.md#apiv1recruitspreferencelistsidputoperation) | **PUT** /api/v1/recruits/preference-lists/{id} | Update preference list entry |
| [**apiV1RecruitsPreferenceListsPost**](DefaultApi.md#apiv1recruitspreferencelistspostoperation) | **POST** /api/v1/recruits/preference-lists | Add to preference list |
| [**apiV1ReportsByIdIdDelete**](DefaultApi.md#apiv1reportsbyididdelete) | **DELETE** /api/v1/reports/byId/{id} | Delete report |
| [**apiV1ReportsByIdIdGet**](DefaultApi.md#apiv1reportsbyididget) | **GET** /api/v1/reports/byId/{id} | Get report by ID (reports_view permission) |
| [**apiV1ReportsByIdIdPut**](DefaultApi.md#apiv1reportsbyididputoperation) | **PUT** /api/v1/reports/byId/{id} | Update report |
| [**apiV1ReportsCustomIdGet**](DefaultApi.md#apiv1reportscustomidget) | **GET** /api/v1/reports/custom/{id} | Get custom report by ID |
| [**apiV1ReportsExportExcelPost**](DefaultApi.md#apiv1reportsexportexcelpost) | **POST** /api/v1/reports/export-excel | Export to Excel |
| [**apiV1ReportsGeneratePdfPost**](DefaultApi.md#apiv1reportsgeneratepdfpostoperation) | **POST** /api/v1/reports/generate-pdf | Generate PDF report |
| [**apiV1ReportsGet**](DefaultApi.md#apiv1reportsget) | **GET** /api/v1/reports | List custom reports |
| [**apiV1ReportsPlayerPerformanceGet**](DefaultApi.md#apiv1reportsplayerperformanceget) | **GET** /api/v1/reports/player-performance | Player performance analytics |
| [**apiV1ReportsPost**](DefaultApi.md#apiv1reportspostoperation) | **POST** /api/v1/reports | Create custom report |
| [**apiV1ReportsRecruitmentPipelineGet**](DefaultApi.md#apiv1reportsrecruitmentpipelineget) | **GET** /api/v1/reports/recruitment-pipeline | Recruitment pipeline analytics |
| [**apiV1ReportsScoutingAnalysisGet**](DefaultApi.md#apiv1reportsscoutinganalysisget) | **GET** /api/v1/reports/scouting-analysis | Scouting analysis analytics |
| [**apiV1ReportsScoutingGet**](DefaultApi.md#apiv1reportsscoutingget) | **GET** /api/v1/reports/scouting | List scouting reports |
| [**apiV1ReportsScoutingIdGet**](DefaultApi.md#apiv1reportsscoutingidget) | **GET** /api/v1/reports/scouting/{id} | Get scouting report by ID |
| [**apiV1ReportsScoutingIdPut**](DefaultApi.md#apiv1reportsscoutingidput) | **PUT** /api/v1/reports/scouting/{id} | Update scouting report |
| [**apiV1ReportsScoutingPost**](DefaultApi.md#apiv1reportsscoutingpostoperation) | **POST** /api/v1/reports/scouting | Create scouting report |
| [**apiV1ReportsTeamStatisticsGet**](DefaultApi.md#apiv1reportsteamstatisticsget) | **GET** /api/v1/reports/team-statistics | Team statistics analytics |
| [**apiV1ScheduleEventsGet**](DefaultApi.md#apiv1scheduleeventsget) | **GET** /api/v1/schedule-events | List schedule events |
| [**apiV1ScheduleEventsIdDelete**](DefaultApi.md#apiv1scheduleeventsiddelete) | **DELETE** /api/v1/schedule-events/{id} | Delete schedule event |
| [**apiV1ScheduleEventsIdGet**](DefaultApi.md#apiv1scheduleeventsidget) | **GET** /api/v1/schedule-events/{id} | Get schedule event |
| [**apiV1ScheduleEventsIdPut**](DefaultApi.md#apiv1scheduleeventsidput) | **PUT** /api/v1/schedule-events/{id} | Update schedule event |
| [**apiV1ScheduleEventsPost**](DefaultApi.md#apiv1scheduleeventspostoperation) | **POST** /api/v1/schedule-events | Create schedule event |
| [**apiV1ScheduleTemplatesGet**](DefaultApi.md#apiv1scheduletemplatesget) | **GET** /api/v1/schedule-templates | List schedule templates |
| [**apiV1ScheduleTemplatesIdDelete**](DefaultApi.md#apiv1scheduletemplatesiddelete) | **DELETE** /api/v1/schedule-templates/{id} | Delete schedule template |
| [**apiV1ScheduleTemplatesIdDuplicatePost**](DefaultApi.md#apiv1scheduletemplatesidduplicatepost) | **POST** /api/v1/schedule-templates/{id}/duplicate | Duplicate schedule template |
| [**apiV1ScheduleTemplatesIdGet**](DefaultApi.md#apiv1scheduletemplatesidget) | **GET** /api/v1/schedule-templates/{id} | Get schedule template |
| [**apiV1ScheduleTemplatesIdPut**](DefaultApi.md#apiv1scheduletemplatesidputoperation) | **PUT** /api/v1/schedule-templates/{id} | Update schedule template |
| [**apiV1ScheduleTemplatesPost**](DefaultApi.md#apiv1scheduletemplatespostoperation) | **POST** /api/v1/schedule-templates | Create schedule template |
| [**apiV1SchedulesActivitiesActivityIdDelete**](DefaultApi.md#apiv1schedulesactivitiesactivityiddelete) | **DELETE** /api/v1/schedules/activities/{activityId} | Delete activity |
| [**apiV1SchedulesByIdIdDelete**](DefaultApi.md#apiv1schedulesbyididdelete) | **DELETE** /api/v1/schedules/byId/{id} | Delete (soft) schedule |
| [**apiV1SchedulesByIdIdGet**](DefaultApi.md#apiv1schedulesbyididget) | **GET** /api/v1/schedules/byId/{id} | Get schedule by ID |
| [**apiV1SchedulesByIdIdPut**](DefaultApi.md#apiv1schedulesbyididputoperation) | **PUT** /api/v1/schedules/byId/{id} | Update schedule |
| [**apiV1SchedulesExportPdfGet**](DefaultApi.md#apiv1schedulesexportpdfget) | **GET** /api/v1/schedules/export-pdf | Export schedule PDF |
| [**apiV1SchedulesGet**](DefaultApi.md#apiv1schedulesget) | **GET** /api/v1/schedules | List schedules |
| [**apiV1SchedulesIdSectionsPost**](DefaultApi.md#apiv1schedulesidsectionspostoperation) | **POST** /api/v1/schedules/{id}/sections | Add schedule section |
| [**apiV1SchedulesPost**](DefaultApi.md#apiv1schedulespostoperation) | **POST** /api/v1/schedules | Create schedule |
| [**apiV1SchedulesSectionsSectionIdActivitiesPost**](DefaultApi.md#apiv1schedulessectionssectionidactivitiespostoperation) | **POST** /api/v1/schedules/sections/{sectionId}/activities | Add activity to section |
| [**apiV1SchedulesSectionsSectionIdDelete**](DefaultApi.md#apiv1schedulessectionssectioniddelete) | **DELETE** /api/v1/schedules/sections/{sectionId} | Delete section (and activities) |
| [**apiV1SchedulesStatsGet**](DefaultApi.md#apiv1schedulesstatsget) | **GET** /api/v1/schedules/stats | Schedule statistics |
| [**apiV1ScoutsGet**](DefaultApi.md#apiv1scoutsget) | **GET** /api/v1/scouts | List scouts |
| [**apiV1ScoutsIdDelete**](DefaultApi.md#apiv1scoutsiddelete) | **DELETE** /api/v1/scouts/{id} | Delete scout |
| [**apiV1ScoutsIdGet**](DefaultApi.md#apiv1scoutsidget) | **GET** /api/v1/scouts/{id} | Get scout |
| [**apiV1ScoutsIdPut**](DefaultApi.md#apiv1scoutsidput) | **PUT** /api/v1/scouts/{id} | Update scout |
| [**apiV1ScoutsPost**](DefaultApi.md#apiv1scoutspost) | **POST** /api/v1/scouts | Create scout |
| [**apiV1SettingsAccountDelete**](DefaultApi.md#apiv1settingsaccountdelete) | **DELETE** /api/v1/settings/account | Delete account |
| [**apiV1SettingsAccountPut**](DefaultApi.md#apiv1settingsaccountput) | **PUT** /api/v1/settings/account | Update account settings |
| [**apiV1SettingsChangePasswordPut**](DefaultApi.md#apiv1settingschangepasswordput) | **PUT** /api/v1/settings/change-password | Change password |
| [**apiV1SettingsExportDataGet**](DefaultApi.md#apiv1settingsexportdataget) | **GET** /api/v1/settings/export-data | Export user data |
| [**apiV1SettingsGeneralPut**](DefaultApi.md#apiv1settingsgeneralput) | **PUT** /api/v1/settings/general | Update general settings |
| [**apiV1SettingsGet**](DefaultApi.md#apiv1settingsget) | **GET** /api/v1/settings | Get all settings |
| [**apiV1SettingsLoginHistoryGet**](DefaultApi.md#apiv1settingsloginhistoryget) | **GET** /api/v1/settings/login-history | Get login history |
| [**apiV1SettingsNotificationsPreferencesGet**](DefaultApi.md#apiv1settingsnotificationspreferencesget) | **GET** /api/v1/settings/notifications/preferences | Get notification preferences |
| [**apiV1SettingsNotificationsPreferencesPut**](DefaultApi.md#apiv1settingsnotificationspreferencesput) | **PUT** /api/v1/settings/notifications/preferences | Update notification preferences |
| [**apiV1SettingsNotificationsPut**](DefaultApi.md#apiv1settingsnotificationsput) | **PUT** /api/v1/settings/notifications | Update notification settings |
| [**apiV1SettingsNotificationsTestEmailPost**](DefaultApi.md#apiv1settingsnotificationstestemailpost) | **POST** /api/v1/settings/notifications/test-email | Send test email |
| [**apiV1SettingsPrivacyGet**](DefaultApi.md#apiv1settingsprivacyget) | **GET** /api/v1/settings/privacy | Get privacy settings |
| [**apiV1SettingsPrivacyPut**](DefaultApi.md#apiv1settingsprivacyput) | **PUT** /api/v1/settings/privacy | Update privacy settings |
| [**apiV1SettingsProfilePicturePut**](DefaultApi.md#apiv1settingsprofilepictureput) | **PUT** /api/v1/settings/profile-picture | Update profile picture |
| [**apiV1SettingsSecurityPut**](DefaultApi.md#apiv1settingssecurityput) | **PUT** /api/v1/settings/security | Update security settings |
| [**apiV1SettingsSessionsGet**](DefaultApi.md#apiv1settingssessionsget) | **GET** /api/v1/settings/sessions | Get active sessions |
| [**apiV1SettingsTwoFactorPut**](DefaultApi.md#apiv1settingstwofactorput) | **PUT** /api/v1/settings/two-factor | Enable/disable two-factor auth |
| [**apiV1SettingsTwoFactorQrGet**](DefaultApi.md#apiv1settingstwofactorqrget) | **GET** /api/v1/settings/two-factor/qr | Get 2FA QR code |
| [**apiV1SettingsTwoFactorVerifyPost**](DefaultApi.md#apiv1settingstwofactorverifypostoperation) | **POST** /api/v1/settings/two-factor/verify | Verify 2FA code |
| [**apiV1TeamsBrandingGet**](DefaultApi.md#apiv1teamsbrandingget) | **GET** /api/v1/teams/branding | Get team branding |
| [**apiV1TeamsBrandingPut**](DefaultApi.md#apiv1teamsbrandingputoperation) | **PUT** /api/v1/teams/branding | Update brand colors |
| [**apiV1TeamsByIdIdGet**](DefaultApi.md#apiv1teamsbyididget) | **GET** /api/v1/teams/byId/{id} | Get team by ID with users |
| [**apiV1TeamsGet**](DefaultApi.md#apiv1teamsget) | **GET** /api/v1/teams | List teams (public - for registration) |
| [**apiV1TeamsIdGet**](DefaultApi.md#apiv1teamsidget) | **GET** /api/v1/teams/{id} | Get team by ID |
| [**apiV1TeamsIdPut**](DefaultApi.md#apiv1teamsidput) | **PUT** /api/v1/teams/{id} | Update team |
| [**apiV1TeamsLogoDelete**](DefaultApi.md#apiv1teamslogodelete) | **DELETE** /api/v1/teams/logo | Remove team logo |
| [**apiV1TeamsLogoPost**](DefaultApi.md#apiv1teamslogopost) | **POST** /api/v1/teams/logo | Upload team logo |
| [**apiV1TeamsMeGet**](DefaultApi.md#apiv1teamsmeget) | **GET** /api/v1/teams/me | Get current user\&#39;s team |
| [**apiV1TeamsMePut**](DefaultApi.md#apiv1teamsmeputoperation) | **PUT** /api/v1/teams/me | Update current user\&#39;s team |
| [**apiV1TeamsPermissionsGet**](DefaultApi.md#apiv1teamspermissionsget) | **GET** /api/v1/teams/permissions | Get team permissions |
| [**apiV1TeamsPermissionsIdDelete**](DefaultApi.md#apiv1teamspermissionsiddelete) | **DELETE** /api/v1/teams/permissions/{id} | Revoke permission |
| [**apiV1TeamsPermissionsIdPut**](DefaultApi.md#apiv1teamspermissionsidputoperation) | **PUT** /api/v1/teams/permissions/{id} | Update permission |
| [**apiV1TeamsPermissionsPost**](DefaultApi.md#apiv1teamspermissionspostoperation) | **POST** /api/v1/teams/permissions | Grant permission |
| [**apiV1TeamsPost**](DefaultApi.md#apiv1teamspostoperation) | **POST** /api/v1/teams | Create team (team_management permission) |
| [**apiV1TeamsRecentSchedulesGet**](DefaultApi.md#apiv1teamsrecentschedulesget) | **GET** /api/v1/teams/recent-schedules | Recent past schedule events |
| [**apiV1TeamsRosterGet**](DefaultApi.md#apiv1teamsrosterget) | **GET** /api/v1/teams/roster | Roster by position group |
| [**apiV1TeamsStatsGet**](DefaultApi.md#apiv1teamsstatsget) | **GET** /api/v1/teams/stats | Team statistics |
| [**apiV1TeamsUpcomingSchedulesGet**](DefaultApi.md#apiv1teamsupcomingschedulesget) | **GET** /api/v1/teams/upcoming-schedules | Upcoming schedule events |
| [**apiV1TeamsUsersGet**](DefaultApi.md#apiv1teamsusersget) | **GET** /api/v1/teams/users | Get team users |
| [**apiV1VendorsGet**](DefaultApi.md#apiv1vendorsget) | **GET** /api/v1/vendors | List vendors |
| [**apiV1VendorsIdDelete**](DefaultApi.md#apiv1vendorsiddelete) | **DELETE** /api/v1/vendors/{id} | Delete vendor |
| [**apiV1VendorsIdGet**](DefaultApi.md#apiv1vendorsidget) | **GET** /api/v1/vendors/{id} | Get vendor |
| [**apiV1VendorsIdPut**](DefaultApi.md#apiv1vendorsidput) | **PUT** /api/v1/vendors/{id} | Update vendor |
| [**apiV1VendorsPost**](DefaultApi.md#apiv1vendorspost) | **POST** /api/v1/vendors | Create vendor |
| [**healthGet**](DefaultApi.md#healthget) | **GET** /health | Health check |



## apiV1AuthAdminUsersGet

> apiV1AuthAdminUsersGet(page, limit, search)

List users (super_admin only)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthAdminUsersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string (optional)
    search: search_example,
  } satisfies ApiV1AuthAdminUsersGetRequest;

  try {
    const data = await api.apiV1AuthAdminUsersGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated user list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthAdminUsersPost

> apiV1AuthAdminUsersPost(apiV1AuthAdminUsersPostRequest)

Create user (super_admin only)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthAdminUsersPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1AuthAdminUsersPostRequest
    apiV1AuthAdminUsersPostRequest: ...,
  } satisfies ApiV1AuthAdminUsersPostOperationRequest;

  try {
    const data = await api.apiV1AuthAdminUsersPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1AuthAdminUsersPostRequest** | [ApiV1AuthAdminUsersPostRequest](ApiV1AuthAdminUsersPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | User created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthAdminUsersUserIdDelete

> apiV1AuthAdminUsersUserIdDelete(userId)

Delete user (super_admin only)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthAdminUsersUserIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    userId: 56,
  } satisfies ApiV1AuthAdminUsersUserIdDeleteRequest;

  try {
    const data = await api.apiV1AuthAdminUsersUserIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthAdminUsersUserIdGet

> apiV1AuthAdminUsersUserIdGet(userId)

Get user by ID (super_admin only)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthAdminUsersUserIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    userId: 56,
  } satisfies ApiV1AuthAdminUsersUserIdGetRequest;

  try {
    const data = await api.apiV1AuthAdminUsersUserIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthAdminUsersUserIdPut

> apiV1AuthAdminUsersUserIdPut(userId, apiV1AuthAdminUsersUserIdPutRequest)

Update user (super_admin only)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthAdminUsersUserIdPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    userId: 56,
    // ApiV1AuthAdminUsersUserIdPutRequest (optional)
    apiV1AuthAdminUsersUserIdPutRequest: ...,
  } satisfies ApiV1AuthAdminUsersUserIdPutOperationRequest;

  try {
    const data = await api.apiV1AuthAdminUsersUserIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `number` |  | [Defaults to `undefined`] |
| **apiV1AuthAdminUsersUserIdPutRequest** | [ApiV1AuthAdminUsersUserIdPutRequest](ApiV1AuthAdminUsersUserIdPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthAdminUsersUserIdResetPasswordPut

> apiV1AuthAdminUsersUserIdResetPasswordPut(userId, apiV1AuthAdminUsersUserIdResetPasswordPutRequest)

Reset user password (super_admin only)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthAdminUsersUserIdResetPasswordPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    userId: 56,
    // ApiV1AuthAdminUsersUserIdResetPasswordPutRequest (optional)
    apiV1AuthAdminUsersUserIdResetPasswordPutRequest: ...,
  } satisfies ApiV1AuthAdminUsersUserIdResetPasswordPutOperationRequest;

  try {
    const data = await api.apiV1AuthAdminUsersUserIdResetPasswordPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `number` |  | [Defaults to `undefined`] |
| **apiV1AuthAdminUsersUserIdResetPasswordPutRequest** | [ApiV1AuthAdminUsersUserIdResetPasswordPutRequest](ApiV1AuthAdminUsersUserIdResetPasswordPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Password reset |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthChangePasswordPut

> apiV1AuthChangePasswordPut(apiV1AuthChangePasswordPutRequest)

Change password

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthChangePasswordPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1AuthChangePasswordPutRequest
    apiV1AuthChangePasswordPutRequest: ...,
  } satisfies ApiV1AuthChangePasswordPutOperationRequest;

  try {
    const data = await api.apiV1AuthChangePasswordPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1AuthChangePasswordPutRequest** | [ApiV1AuthChangePasswordPutRequest](ApiV1AuthChangePasswordPutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Password changed |  -  |
| **400** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthCsrfTokenGet

> ApiV1AuthCsrfTokenGet200Response apiV1AuthCsrfTokenGet()

Get CSRF token

Required before any POST/PUT/DELETE. Include token in x-csrf-token header.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthCsrfTokenGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiV1AuthCsrfTokenGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiV1AuthCsrfTokenGet200Response**](ApiV1AuthCsrfTokenGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | CSRF token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthLoginPost

> ModelApiResponse apiV1AuthLoginPost(apiV1AuthLoginPostRequest)

User login

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthLoginPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // ApiV1AuthLoginPostRequest
    apiV1AuthLoginPostRequest: ...,
  } satisfies ApiV1AuthLoginPostOperationRequest;

  try {
    const data = await api.apiV1AuthLoginPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1AuthLoginPostRequest** | [ApiV1AuthLoginPostRequest](ApiV1AuthLoginPostRequest.md) |  | |

### Return type

[**ModelApiResponse**](ModelApiResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Login successful |  -  |
| **401** | Invalid credentials or account locked/deactivated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthLogoutPost

> apiV1AuthLogoutPost()

User logout

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthLogoutPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1AuthLogoutPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Logout successful |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthMeGet

> ApiV1AuthMeGet200Response apiV1AuthMeGet()

Get current user profile

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthMeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1AuthMeGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiV1AuthMeGet200Response**](ApiV1AuthMeGet200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User profile |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthMePut

> apiV1AuthMePut(apiV1AuthMePutRequest)

Update current user profile

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthMePutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1AuthMePutRequest (optional)
    apiV1AuthMePutRequest: ...,
  } satisfies ApiV1AuthMePutOperationRequest;

  try {
    const data = await api.apiV1AuthMePut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1AuthMePutRequest** | [ApiV1AuthMePutRequest](ApiV1AuthMePutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthPermissionsGet

> apiV1AuthPermissionsGet()

Get current user permissions

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthPermissionsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1AuthPermissionsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthRegisterPost

> apiV1AuthRegisterPost(apiV1AuthRegisterPostRequest)

User registration

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthRegisterPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // ApiV1AuthRegisterPostRequest
    apiV1AuthRegisterPostRequest: ...,
  } satisfies ApiV1AuthRegisterPostOperationRequest;

  try {
    const data = await api.apiV1AuthRegisterPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1AuthRegisterPostRequest** | [ApiV1AuthRegisterPostRequest](ApiV1AuthRegisterPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Registration successful |  -  |
| **400** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AuthRevokeAllSessionsPost

> apiV1AuthRevokeAllSessionsPost()

Revoke all sessions for current user

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1AuthRevokeAllSessionsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1AuthRevokeAllSessionsPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sessions revoked |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CoachesGet

> apiV1CoachesGet(page, limit, search, status)

List coaches

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1CoachesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string (optional)
    search: search_example,
    // string (optional)
    status: status_example,
  } satisfies ApiV1CoachesGetRequest;

  try {
    const data = await api.apiV1CoachesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Coaches list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CoachesIdDelete

> apiV1CoachesIdDelete(id)

Delete coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1CoachesIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CoachesIdDeleteRequest;

  try {
    const data = await api.apiV1CoachesIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Coach deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CoachesIdGet

> apiV1CoachesIdGet(id)

Get coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1CoachesIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CoachesIdGetRequest;

  try {
    const data = await api.apiV1CoachesIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Coach details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CoachesIdPut

> apiV1CoachesIdPut(id, body)

Update coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1CoachesIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1CoachesIdPutRequest;

  try {
    const data = await api.apiV1CoachesIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Coach updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CoachesPost

> apiV1CoachesPost(apiV1CoachesPostRequest)

Create coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1CoachesPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1CoachesPostRequest
    apiV1CoachesPostRequest: ...,
  } satisfies ApiV1CoachesPostOperationRequest;

  try {
    const data = await api.apiV1CoachesPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1CoachesPostRequest** | [ApiV1CoachesPostRequest](ApiV1CoachesPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Coach created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsByIdIdDelete

> apiV1DepthChartsByIdIdDelete(id)

Delete depth chart

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsByIdIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DepthChartsByIdIdDeleteRequest;

  try {
    const data = await api.apiV1DepthChartsByIdIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Depth chart deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsByIdIdGet

> apiV1DepthChartsByIdIdGet(id)

Get depth chart

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DepthChartsByIdIdGetRequest;

  try {
    const data = await api.apiV1DepthChartsByIdIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Depth chart details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsByIdIdPut

> apiV1DepthChartsByIdIdPut(id, body)

Update depth chart

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsByIdIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1DepthChartsByIdIdPutRequest;

  try {
    const data = await api.apiV1DepthChartsByIdIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Depth chart updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsGet

> apiV1DepthChartsGet()

List depth charts

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1DepthChartsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Depth charts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsIdAvailablePlayersGet

> apiV1DepthChartsIdAvailablePlayersGet(id)

Get available players for depth chart

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsIdAvailablePlayersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DepthChartsIdAvailablePlayersGetRequest;

  try {
    const data = await api.apiV1DepthChartsIdAvailablePlayersGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Available players |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsIdDuplicatePost

> apiV1DepthChartsIdDuplicatePost(id)

Duplicate depth chart

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsIdDuplicatePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DepthChartsIdDuplicatePostRequest;

  try {
    const data = await api.apiV1DepthChartsIdDuplicatePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Depth chart duplicated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsIdHistoryGet

> apiV1DepthChartsIdHistoryGet(id)

Get depth chart history

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsIdHistoryGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DepthChartsIdHistoryGetRequest;

  try {
    const data = await api.apiV1DepthChartsIdHistoryGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | History |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsIdPositionsPost

> apiV1DepthChartsIdPositionsPost(id, body)

Add position to depth chart

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsIdPositionsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1DepthChartsIdPositionsPostRequest;

  try {
    const data = await api.apiV1DepthChartsIdPositionsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Position added |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsIdRecommendedPlayersPositionIdGet

> apiV1DepthChartsIdRecommendedPlayersPositionIdGet(id, positionId)

Get recommended players for position

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsIdRecommendedPlayersPositionIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // number
    positionId: 56,
  } satisfies ApiV1DepthChartsIdRecommendedPlayersPositionIdGetRequest;

  try {
    const data = await api.apiV1DepthChartsIdRecommendedPlayersPositionIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **positionId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Recommended players |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsPlayersAssignmentIdDelete

> apiV1DepthChartsPlayersAssignmentIdDelete(assignmentId)

Remove player from position

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsPlayersAssignmentIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    assignmentId: 56,
  } satisfies ApiV1DepthChartsPlayersAssignmentIdDeleteRequest;

  try {
    const data = await api.apiV1DepthChartsPlayersAssignmentIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **assignmentId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Player removed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsPositionsPositionIdDelete

> apiV1DepthChartsPositionsPositionIdDelete(positionId)

Delete position

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsPositionsPositionIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    positionId: 56,
  } satisfies ApiV1DepthChartsPositionsPositionIdDeleteRequest;

  try {
    const data = await api.apiV1DepthChartsPositionsPositionIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **positionId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Position deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsPositionsPositionIdPlayersPost

> apiV1DepthChartsPositionsPositionIdPlayersPost(positionId, apiV1DepthChartsPositionsPositionIdPlayersPostRequest)

Assign player to position

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsPositionsPositionIdPlayersPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    positionId: 56,
    // ApiV1DepthChartsPositionsPositionIdPlayersPostRequest (optional)
    apiV1DepthChartsPositionsPositionIdPlayersPostRequest: ...,
  } satisfies ApiV1DepthChartsPositionsPositionIdPlayersPostOperationRequest;

  try {
    const data = await api.apiV1DepthChartsPositionsPositionIdPlayersPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **positionId** | `number` |  | [Defaults to `undefined`] |
| **apiV1DepthChartsPositionsPositionIdPlayersPostRequest** | [ApiV1DepthChartsPositionsPositionIdPlayersPostRequest](ApiV1DepthChartsPositionsPositionIdPlayersPostRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Player assigned |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsPositionsPositionIdPut

> apiV1DepthChartsPositionsPositionIdPut(positionId)

Update position

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsPositionsPositionIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    positionId: 56,
  } satisfies ApiV1DepthChartsPositionsPositionIdPutRequest;

  try {
    const data = await api.apiV1DepthChartsPositionsPositionIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **positionId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Position updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DepthChartsPost

> apiV1DepthChartsPost(apiV1DepthChartsPostRequest)

Create depth chart

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1DepthChartsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1DepthChartsPostRequest
    apiV1DepthChartsPostRequest: ...,
  } satisfies ApiV1DepthChartsPostOperationRequest;

  try {
    const data = await api.apiV1DepthChartsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1DepthChartsPostRequest** | [ApiV1DepthChartsPostRequest](ApiV1DepthChartsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Depth chart created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesByIdIdDelete

> apiV1GamesByIdIdDelete(id)

Delete game

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesByIdIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1GamesByIdIdDeleteRequest;

  try {
    const data = await api.apiV1GamesByIdIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Game deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesByIdIdGet

> apiV1GamesByIdIdGet(id)

Get game by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1GamesByIdIdGetRequest;

  try {
    const data = await api.apiV1GamesByIdIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Game details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesByIdIdPut

> apiV1GamesByIdIdPut(id, body)

Update game

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesByIdIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1GamesByIdIdPutRequest;

  try {
    const data = await api.apiV1GamesByIdIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Game updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesGameIdStatsGet

> apiV1GamesGameIdStatsGet(gameId)

Game statistics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesGameIdStatsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    gameId: 56,
  } satisfies ApiV1GamesGameIdStatsGetRequest;

  try {
    const data = await api.apiV1GamesGameIdStatsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **gameId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Game stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesGet

> apiV1GamesGet(page, limit)

List games

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1GamesGetRequest;

  try {
    const data = await api.apiV1GamesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated games |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesLogGet

> apiV1GamesLogGet()

Game log

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesLogGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1GamesLogGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Game log |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesPlayerStatsPlayerIdGet

> apiV1GamesPlayerStatsPlayerIdGet(playerId)

Player stats

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesPlayerStatsPlayerIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    playerId: 56,
  } satisfies ApiV1GamesPlayerStatsPlayerIdGetRequest;

  try {
    const data = await api.apiV1GamesPlayerStatsPlayerIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **playerId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Player statistics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesPost

> apiV1GamesPost(apiV1GamesPostRequest)

Create game

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1GamesPostRequest
    apiV1GamesPostRequest: ...,
  } satisfies ApiV1GamesPostOperationRequest;

  try {
    const data = await api.apiV1GamesPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1GamesPostRequest** | [ApiV1GamesPostRequest](ApiV1GamesPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Game created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesSeasonStatsGet

> apiV1GamesSeasonStatsGet()

Season statistics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesSeasonStatsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1GamesSeasonStatsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Season stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesTeamStatsGet

> apiV1GamesTeamStatsGet()

Team stats

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesTeamStatsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1GamesTeamStatsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team statistics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1GamesUpcomingGet

> apiV1GamesUpcomingGet()

Upcoming games

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1GamesUpcomingGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1GamesUpcomingGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Upcoming games |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1HealthGet

> ApiV1HealthGet200Response apiV1HealthGet()

API health check

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1HealthGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiV1HealthGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiV1HealthGet200Response**](ApiV1HealthGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | API is healthy |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1HighSchoolCoachesGet

> apiV1HighSchoolCoachesGet(page, limit, search)

List high school coaches

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1HighSchoolCoachesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string (optional)
    search: search_example,
  } satisfies ApiV1HighSchoolCoachesGetRequest;

  try {
    const data = await api.apiV1HighSchoolCoachesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | High school coaches list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1HighSchoolCoachesIdDelete

> apiV1HighSchoolCoachesIdDelete(id)

Delete high school coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1HighSchoolCoachesIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1HighSchoolCoachesIdDeleteRequest;

  try {
    const data = await api.apiV1HighSchoolCoachesIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Coach deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1HighSchoolCoachesIdGet

> apiV1HighSchoolCoachesIdGet(id)

Get high school coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1HighSchoolCoachesIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1HighSchoolCoachesIdGetRequest;

  try {
    const data = await api.apiV1HighSchoolCoachesIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Coach details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1HighSchoolCoachesIdPut

> apiV1HighSchoolCoachesIdPut(id, body)

Update high school coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1HighSchoolCoachesIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1HighSchoolCoachesIdPutRequest;

  try {
    const data = await api.apiV1HighSchoolCoachesIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Coach updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1HighSchoolCoachesPost

> apiV1HighSchoolCoachesPost(apiV1HighSchoolCoachesPostRequest)

Create high school coach

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1HighSchoolCoachesPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1HighSchoolCoachesPostRequest
    apiV1HighSchoolCoachesPostRequest: ...,
  } satisfies ApiV1HighSchoolCoachesPostOperationRequest;

  try {
    const data = await api.apiV1HighSchoolCoachesPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1HighSchoolCoachesPostRequest** | [ApiV1HighSchoolCoachesPostRequest](ApiV1HighSchoolCoachesPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | High school coach created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoConfigurePost

> apiV1IntegrationsPrestoConfigurePost(apiV1IntegrationsPrestoConfigurePostRequest)

Configure Presto integration

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoConfigurePostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1IntegrationsPrestoConfigurePostRequest (optional)
    apiV1IntegrationsPrestoConfigurePostRequest: ...,
  } satisfies ApiV1IntegrationsPrestoConfigurePostOperationRequest;

  try {
    const data = await api.apiV1IntegrationsPrestoConfigurePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1IntegrationsPrestoConfigurePostRequest** | [ApiV1IntegrationsPrestoConfigurePostRequest](ApiV1IntegrationsPrestoConfigurePostRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Configuration updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoDisconnectDelete

> apiV1IntegrationsPrestoDisconnectDelete()

Disconnect Presto integration

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoDisconnectDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoDisconnectDelete();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Disconnected |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoSeasonsGet

> apiV1IntegrationsPrestoSeasonsGet()

List Presto seasons

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoSeasonsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoSeasonsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Available seasons |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoSettingsPut

> apiV1IntegrationsPrestoSettingsPut(body)

Update Presto settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoSettingsPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1IntegrationsPrestoSettingsPutRequest;

  try {
    const data = await api.apiV1IntegrationsPrestoSettingsPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Settings updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoStatusGet

> apiV1IntegrationsPrestoStatusGet()

Get Presto integration status

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoStatusGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoStatusGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Integration status |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoSyncAllPost

> apiV1IntegrationsPrestoSyncAllPost()

Full sync from Presto

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoSyncAllPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoSyncAllPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sync initiated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoSyncRosterPost

> apiV1IntegrationsPrestoSyncRosterPost()

Sync roster from Presto

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoSyncRosterPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoSyncRosterPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sync initiated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoSyncSchedulePost

> apiV1IntegrationsPrestoSyncSchedulePost()

Sync schedule from Presto

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoSyncSchedulePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoSyncSchedulePost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sync initiated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoSyncStatsPost

> apiV1IntegrationsPrestoSyncStatsPost()

Sync stats from Presto

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoSyncStatsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoSyncStatsPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sync initiated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoTeamsGet

> apiV1IntegrationsPrestoTeamsGet()

List Presto teams

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoTeamsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoTeamsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Available teams |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1IntegrationsPrestoTestPost

> apiV1IntegrationsPrestoTestPost()

Test Presto connection

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1IntegrationsPrestoTestPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1IntegrationsPrestoTestPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Connection test result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LocationsGet

> apiV1LocationsGet(page, limit)

List locations

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1LocationsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1LocationsGetRequest;

  try {
    const data = await api.apiV1LocationsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated locations |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LocationsIdDelete

> apiV1LocationsIdDelete(id)

Delete location

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1LocationsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1LocationsIdDeleteRequest;

  try {
    const data = await api.apiV1LocationsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Location deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LocationsIdGet

> apiV1LocationsIdGet(id)

Get location

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1LocationsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1LocationsIdGetRequest;

  try {
    const data = await api.apiV1LocationsIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Location details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LocationsIdPut

> apiV1LocationsIdPut(id, body)

Update location

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1LocationsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1LocationsIdPutRequest;

  try {
    const data = await api.apiV1LocationsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Location updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LocationsPost

> apiV1LocationsPost(apiV1LocationsPostRequest)

Create location

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1LocationsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1LocationsPostRequest
    apiV1LocationsPostRequest: ...,
  } satisfies ApiV1LocationsPostOperationRequest;

  try {
    const data = await api.apiV1LocationsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1LocationsPostRequest** | [ApiV1LocationsPostRequest](ApiV1LocationsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Location created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersBulkDeletePost

> apiV1PlayersBulkDeletePost(apiV1PlayersBulkDeletePostRequest)

Bulk delete players

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersBulkDeletePostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1PlayersBulkDeletePostRequest
    apiV1PlayersBulkDeletePostRequest: ...,
  } satisfies ApiV1PlayersBulkDeletePostOperationRequest;

  try {
    const data = await api.apiV1PlayersBulkDeletePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1PlayersBulkDeletePostRequest** | [ApiV1PlayersBulkDeletePostRequest](ApiV1PlayersBulkDeletePostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Players deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersByIdIdDelete

> apiV1PlayersByIdIdDelete(id)

Delete player

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersByIdIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PlayersByIdIdDeleteRequest;

  try {
    const data = await api.apiV1PlayersByIdIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Player deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersByIdIdGet

> apiV1PlayersByIdIdGet(id)

Get player by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PlayersByIdIdGetRequest;

  try {
    const data = await api.apiV1PlayersByIdIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Player details |  -  |
| **404** | Player not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersByIdIdPut

> apiV1PlayersByIdIdPut(id, firstName, lastName, position, schoolType, school, city, state, graduationYear, weight, height, email, phone, status)

Update player

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersByIdIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // string (optional)
    firstName: firstName_example,
    // string (optional)
    lastName: lastName_example,
    // string (optional)
    position: position_example,
    // string (optional)
    schoolType: schoolType_example,
    // string (optional)
    school: school_example,
    // string (optional)
    city: city_example,
    // string (optional)
    state: state_example,
    // number (optional)
    graduationYear: 56,
    // number (optional)
    weight: 56,
    // string (optional)
    height: height_example,
    // string (optional)
    email: email_example,
    // string (optional)
    phone: phone_example,
    // string (optional)
    status: status_example,
  } satisfies ApiV1PlayersByIdIdPutRequest;

  try {
    const data = await api.apiV1PlayersByIdIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **firstName** | `string` |  | [Optional] [Defaults to `undefined`] |
| **lastName** | `string` |  | [Optional] [Defaults to `undefined`] |
| **position** | `string` |  | [Optional] [Defaults to `undefined`] |
| **schoolType** | `string` |  | [Optional] [Defaults to `undefined`] |
| **school** | `string` |  | [Optional] [Defaults to `undefined`] |
| **city** | `string` |  | [Optional] [Defaults to `undefined`] |
| **state** | `string` |  | [Optional] [Defaults to `undefined`] |
| **graduationYear** | `number` |  | [Optional] [Defaults to `undefined`] |
| **weight** | `number` |  | [Optional] [Defaults to `undefined`] |
| **height** | `string` |  | [Optional] [Defaults to `undefined`] |
| **email** | `string` |  | [Optional] [Defaults to `undefined`] |
| **phone** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`, `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Player updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersByIdIdStatsGet

> apiV1PlayersByIdIdStatsGet(id)

Get player statistics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersByIdIdStatsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PlayersByIdIdStatsGetRequest;

  try {
    const data = await api.apiV1PlayersByIdIdStatsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Player stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersGet

> ApiV1PlayersGet200Response apiV1PlayersGet(page, limit, schoolType, position, status, search, orderBy, sortDirection)

List players

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // 'HS' | 'COLL' (optional)
    schoolType: schoolType_example,
    // 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'OF' | 'DH' (optional)
    position: position_example,
    // 'active' | 'inactive' | 'graduated' | 'transferred' (optional)
    status: status_example,
    // string (optional)
    search: search_example,
    // string (optional)
    orderBy: orderBy_example,
    // 'ASC' | 'DESC' (optional)
    sortDirection: sortDirection_example,
  } satisfies ApiV1PlayersGetRequest;

  try {
    const data = await api.apiV1PlayersGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **schoolType** | `HS`, `COLL` |  | [Optional] [Defaults to `undefined`] [Enum: HS, COLL] |
| **position** | `P`, `C`, `1B`, `2B`, `3B`, `SS`, `LF`, `CF`, `RF`, `OF`, `DH` |  | [Optional] [Defaults to `undefined`] [Enum: P, C, 1B, 2B, 3B, SS, LF, CF, RF, OF, DH] |
| **status** | `active`, `inactive`, `graduated`, `transferred` |  | [Optional] [Defaults to `undefined`] [Enum: active, inactive, graduated, transferred] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **orderBy** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sortDirection** | `ASC`, `DESC` |  | [Optional] [Defaults to `undefined`] [Enum: ASC, DESC] |

### Return type

[**ApiV1PlayersGet200Response**](ApiV1PlayersGet200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated player list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersPerformanceGet

> apiV1PlayersPerformanceGet()

Get player performance data

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersPerformanceGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1PlayersPerformanceGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Performance data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersPost

> apiV1PlayersPost(firstName, lastName, position, schoolType, school, city, state, graduationYear, weight, height, email, phone)

Create player

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    firstName: firstName_example,
    // string
    lastName: lastName_example,
    // string
    position: position_example,
    // string (optional)
    schoolType: schoolType_example,
    // string (optional)
    school: school_example,
    // string (optional)
    city: city_example,
    // string (optional)
    state: state_example,
    // number (optional)
    graduationYear: 56,
    // number (optional)
    weight: 56,
    // string (optional)
    height: height_example,
    // string (optional)
    email: email_example,
    // string (optional)
    phone: phone_example,
  } satisfies ApiV1PlayersPostRequest;

  try {
    const data = await api.apiV1PlayersPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **firstName** | `string` |  | [Defaults to `undefined`] |
| **lastName** | `string` |  | [Defaults to `undefined`] |
| **position** | `P`, `C`, `1B`, `2B`, `3B`, `SS`, `LF`, `CF`, `RF`, `OF`, `DH` |  | [Defaults to `undefined`] [Enum: P, C, 1B, 2B, 3B, SS, LF, CF, RF, OF, DH] |
| **schoolType** | `HS`, `COLL` |  | [Optional] [Defaults to `undefined`] [Enum: HS, COLL] |
| **school** | `string` |  | [Optional] [Defaults to `undefined`] |
| **city** | `string` |  | [Optional] [Defaults to `undefined`] |
| **state** | `string` |  | [Optional] [Defaults to `undefined`] |
| **graduationYear** | `number` |  | [Optional] [Defaults to `undefined`] |
| **weight** | `number` |  | [Optional] [Defaults to `undefined`] |
| **height** | `string` |  | [Optional] [Defaults to `undefined`] |
| **email** | `string` |  | [Optional] [Defaults to `undefined`] |
| **phone** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`, `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Player created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PlayersStatsSummaryGet

> apiV1PlayersStatsSummaryGet()

Get players stats summary

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1PlayersStatsSummaryGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1PlayersStatsSummaryGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Stats summary |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsGet

> ApiV1ProspectsGet200Response apiV1ProspectsGet(schoolType, primaryPosition, status, search, page, limit)

List prospects

Filter by school_type, primary_position, status, search. See docs/api/scouting-system-api.md

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // 'HS' | 'JUCO' | 'D1' | 'D2' | 'D3' | 'NAIA' | 'Independent' (optional)
    schoolType: schoolType_example,
    // 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'OF' | 'DH' | 'UTL' (optional)
    primaryPosition: primaryPosition_example,
    // 'identified' | 'evaluating' | 'contacted' | 'visiting' | 'offered' | 'committed' | 'signed' | 'passed' (optional)
    status: status_example,
    // string (optional)
    search: search_example,
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1ProspectsGetRequest;

  try {
    const data = await api.apiV1ProspectsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **schoolType** | `HS`, `JUCO`, `D1`, `D2`, `D3`, `NAIA`, `Independent` |  | [Optional] [Defaults to `undefined`] [Enum: HS, JUCO, D1, D2, D3, NAIA, Independent] |
| **primaryPosition** | `P`, `C`, `1B`, `2B`, `3B`, `SS`, `LF`, `CF`, `RF`, `OF`, `DH`, `UTL` |  | [Optional] [Defaults to `undefined`] [Enum: P, C, 1B, 2B, 3B, SS, LF, CF, RF, OF, DH, UTL] |
| **status** | `identified`, `evaluating`, `contacted`, `visiting`, `offered`, `committed`, `signed`, `passed` |  | [Optional] [Defaults to `undefined`] [Enum: identified, evaluating, contacted, visiting, offered, committed, signed, passed] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |

### Return type

[**ApiV1ProspectsGet200Response**](ApiV1ProspectsGet200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated prospect list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsIdDelete

> apiV1ProspectsIdDelete(id)

Delete prospect

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProspectsIdDeleteRequest;

  try {
    const data = await api.apiV1ProspectsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Prospect deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsIdGet

> apiV1ProspectsIdGet(id)

Get prospect by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProspectsIdGetRequest;

  try {
    const data = await api.apiV1ProspectsIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Prospect with media |  -  |
| **404** | Prospect not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsIdMediaMediaIdDelete

> apiV1ProspectsIdMediaMediaIdDelete(id, mediaId)

Delete prospect media

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsIdMediaMediaIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // number
    mediaId: 56,
  } satisfies ApiV1ProspectsIdMediaMediaIdDeleteRequest;

  try {
    const data = await api.apiV1ProspectsIdMediaMediaIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **mediaId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Media deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsIdMediaPost

> apiV1ProspectsIdMediaPost(id, file, title, description)

Upload media or add external URL

Two modes: 1. File upload (multipart/form-data): file, title?, description? 2. External URL (application/json): url, media_type (video|photo|document), title?, description? 

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsIdMediaPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // Blob (optional)
    file: BINARY_DATA_HERE,
    // string (optional)
    title: title_example,
    // string (optional)
    description: description_example,
  } satisfies ApiV1ProspectsIdMediaPostRequest;

  try {
    const data = await api.apiV1ProspectsIdMediaPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **file** | `Blob` |  | [Optional] [Defaults to `undefined`] |
| **title** | `string` |  | [Optional] [Defaults to `undefined`] |
| **description** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`, `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Media created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsIdPut

> apiV1ProspectsIdPut(id, prospectUpdateInput)

Update prospect (partial)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ProspectUpdateInput (optional)
    prospectUpdateInput: ...,
  } satisfies ApiV1ProspectsIdPutRequest;

  try {
    const data = await api.apiV1ProspectsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **prospectUpdateInput** | [ProspectUpdateInput](ProspectUpdateInput.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Prospect updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsIdScoutingReportsGet

> apiV1ProspectsIdScoutingReportsGet(id)

List scouting reports for prospect

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsIdScoutingReportsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProspectsIdScoutingReportsGetRequest;

  try {
    const data = await api.apiV1ProspectsIdScoutingReportsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scouting reports (newest first) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsIdScoutingReportsPost

> apiV1ProspectsIdScoutingReportsPost(id, scoutingReportProspectInput)

Create scouting report for prospect

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsIdScoutingReportsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ScoutingReportProspectInput
    scoutingReportProspectInput: ...,
  } satisfies ApiV1ProspectsIdScoutingReportsPostRequest;

  try {
    const data = await api.apiV1ProspectsIdScoutingReportsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **scoutingReportProspectInput** | [ScoutingReportProspectInput](ScoutingReportProspectInput.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Scouting report created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProspectsPost

> apiV1ProspectsPost(prospectCreateInput)

Create prospect

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ProspectsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ProspectCreateInput
    prospectCreateInput: ...,
  } satisfies ApiV1ProspectsPostRequest;

  try {
    const data = await api.apiV1ProspectsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **prospectCreateInput** | [ProspectCreateInput](ProspectCreateInput.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Prospect created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RecruitsGet

> apiV1RecruitsGet(schoolType, position, search, page, limit)

Recruiting board - list prospects

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1RecruitsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // 'HS' | 'JUCO' | 'D1' | 'D2' | 'D3' | 'NAIA' | 'Independent' (optional)
    schoolType: schoolType_example,
    // 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'OF' | 'DH' | 'UTL' (optional)
    position: position_example,
    // string (optional)
    search: search_example,
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1RecruitsGetRequest;

  try {
    const data = await api.apiV1RecruitsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **schoolType** | `HS`, `JUCO`, `D1`, `D2`, `D3`, `NAIA`, `Independent` |  | [Optional] [Defaults to `undefined`] [Enum: HS, JUCO, D1, D2, D3, NAIA, Independent] |
| **position** | `P`, `C`, `1B`, `2B`, `3B`, `SS`, `LF`, `CF`, `RF`, `OF`, `DH`, `UTL` |  | [Optional] [Defaults to `undefined`] [Enum: P, C, 1B, 2B, 3B, SS, LF, CF, RF, OF, DH, UTL] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Prospects for recruiting board |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RecruitsPreferenceListsGet

> apiV1RecruitsPreferenceListsGet(listType, page, limit)

List preference lists

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1RecruitsPreferenceListsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // 'new_players' | 'overall_pref_list' | 'hs_pref_list' | 'college_transfers' | 'pitchers_pref_list' (optional)
    listType: listType_example,
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1RecruitsPreferenceListsGetRequest;

  try {
    const data = await api.apiV1RecruitsPreferenceListsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **listType** | `new_players`, `overall_pref_list`, `hs_pref_list`, `college_transfers`, `pitchers_pref_list` |  | [Optional] [Defaults to `undefined`] [Enum: new_players, overall_pref_list, hs_pref_list, college_transfers, pitchers_pref_list] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Preference list entries (Player or Prospect) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RecruitsPreferenceListsIdDelete

> apiV1RecruitsPreferenceListsIdDelete(id)

Remove from preference list

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1RecruitsPreferenceListsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1RecruitsPreferenceListsIdDeleteRequest;

  try {
    const data = await api.apiV1RecruitsPreferenceListsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Entry removed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RecruitsPreferenceListsIdPut

> apiV1RecruitsPreferenceListsIdPut(id, apiV1RecruitsPreferenceListsIdPutRequest)

Update preference list entry

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1RecruitsPreferenceListsIdPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1RecruitsPreferenceListsIdPutRequest (optional)
    apiV1RecruitsPreferenceListsIdPutRequest: ...,
  } satisfies ApiV1RecruitsPreferenceListsIdPutOperationRequest;

  try {
    const data = await api.apiV1RecruitsPreferenceListsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1RecruitsPreferenceListsIdPutRequest** | [ApiV1RecruitsPreferenceListsIdPutRequest](ApiV1RecruitsPreferenceListsIdPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Entry updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RecruitsPreferenceListsPost

> apiV1RecruitsPreferenceListsPost(apiV1RecruitsPreferenceListsPostRequest)

Add to preference list

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1RecruitsPreferenceListsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1RecruitsPreferenceListsPostRequest
    apiV1RecruitsPreferenceListsPostRequest: ...,
  } satisfies ApiV1RecruitsPreferenceListsPostOperationRequest;

  try {
    const data = await api.apiV1RecruitsPreferenceListsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1RecruitsPreferenceListsPostRequest** | [ApiV1RecruitsPreferenceListsPostRequest](ApiV1RecruitsPreferenceListsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Added to preference list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsByIdIdDelete

> apiV1ReportsByIdIdDelete(id)

Delete report

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsByIdIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies ApiV1ReportsByIdIdDeleteRequest;

  try {
    const data = await api.apiV1ReportsByIdIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Report deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsByIdIdGet

> apiV1ReportsByIdIdGet(id)

Get report by ID (reports_view permission)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies ApiV1ReportsByIdIdGetRequest;

  try {
    const data = await api.apiV1ReportsByIdIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Report details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsByIdIdPut

> apiV1ReportsByIdIdPut(id, apiV1ReportsByIdIdPutRequest)

Update report

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsByIdIdPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    id: id_example,
    // ApiV1ReportsByIdIdPutRequest (optional)
    apiV1ReportsByIdIdPutRequest: ...,
  } satisfies ApiV1ReportsByIdIdPutOperationRequest;

  try {
    const data = await api.apiV1ReportsByIdIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **apiV1ReportsByIdIdPutRequest** | [ApiV1ReportsByIdIdPutRequest](ApiV1ReportsByIdIdPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Report updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsCustomIdGet

> apiV1ReportsCustomIdGet(id)

Get custom report by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsCustomIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies ApiV1ReportsCustomIdGetRequest;

  try {
    const data = await api.apiV1ReportsCustomIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Report details |  -  |
| **404** | Report not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsExportExcelPost

> apiV1ReportsExportExcelPost(apiV1ReportsGeneratePdfPostRequest)

Export to Excel

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsExportExcelPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1ReportsGeneratePdfPostRequest (optional)
    apiV1ReportsGeneratePdfPostRequest: ...,
  } satisfies ApiV1ReportsExportExcelPostRequest;

  try {
    const data = await api.apiV1ReportsExportExcelPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1ReportsGeneratePdfPostRequest** | [ApiV1ReportsGeneratePdfPostRequest](ApiV1ReportsGeneratePdfPostRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Excel file |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsGeneratePdfPost

> apiV1ReportsGeneratePdfPost(apiV1ReportsGeneratePdfPostRequest)

Generate PDF report

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsGeneratePdfPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1ReportsGeneratePdfPostRequest (optional)
    apiV1ReportsGeneratePdfPostRequest: ...,
  } satisfies ApiV1ReportsGeneratePdfPostOperationRequest;

  try {
    const data = await api.apiV1ReportsGeneratePdfPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1ReportsGeneratePdfPostRequest** | [ApiV1ReportsGeneratePdfPostRequest](ApiV1ReportsGeneratePdfPostRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | PDF generated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsGet

> apiV1ReportsGet()

List custom reports

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1ReportsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Custom reports list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsPlayerPerformanceGet

> apiV1ReportsPlayerPerformanceGet()

Player performance analytics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsPlayerPerformanceGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1ReportsPlayerPerformanceGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Performance data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsPost

> apiV1ReportsPost(apiV1ReportsPostRequest)

Create custom report

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1ReportsPostRequest
    apiV1ReportsPostRequest: ...,
  } satisfies ApiV1ReportsPostOperationRequest;

  try {
    const data = await api.apiV1ReportsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1ReportsPostRequest** | [ApiV1ReportsPostRequest](ApiV1ReportsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Report created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsRecruitmentPipelineGet

> apiV1ReportsRecruitmentPipelineGet()

Recruitment pipeline analytics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsRecruitmentPipelineGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1ReportsRecruitmentPipelineGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pipeline data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsScoutingAnalysisGet

> apiV1ReportsScoutingAnalysisGet()

Scouting analysis analytics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsScoutingAnalysisGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1ReportsScoutingAnalysisGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scouting analysis |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsScoutingGet

> apiV1ReportsScoutingGet(playerId, prospectId, startDate, endDate, page, limit)

List scouting reports

Supports player_id or prospect_id filter. Returns reports for both players and prospects.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsScoutingGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    playerId: 56,
    // number (optional)
    prospectId: 56,
    // Date (optional)
    startDate: 2013-10-20,
    // Date (optional)
    endDate: 2013-10-20,
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1ReportsScoutingGetRequest;

  try {
    const data = await api.apiV1ReportsScoutingGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **playerId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **prospectId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **startDate** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated scouting reports |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsScoutingIdGet

> apiV1ReportsScoutingIdGet(id)

Get scouting report by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsScoutingIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ReportsScoutingIdGetRequest;

  try {
    const data = await api.apiV1ReportsScoutingIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scouting report details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsScoutingIdPut

> apiV1ReportsScoutingIdPut(id, scoutingReportUpdateInput)

Update scouting report

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsScoutingIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ScoutingReportUpdateInput (optional)
    scoutingReportUpdateInput: ...,
  } satisfies ApiV1ReportsScoutingIdPutRequest;

  try {
    const data = await api.apiV1ReportsScoutingIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **scoutingReportUpdateInput** | [ScoutingReportUpdateInput](ScoutingReportUpdateInput.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scouting report updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsScoutingPost

> apiV1ReportsScoutingPost(apiV1ReportsScoutingPostRequest)

Create scouting report

Provide exactly one of player_id or prospect_id.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsScoutingPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1ReportsScoutingPostRequest
    apiV1ReportsScoutingPostRequest: ...,
  } satisfies ApiV1ReportsScoutingPostOperationRequest;

  try {
    const data = await api.apiV1ReportsScoutingPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1ReportsScoutingPostRequest** | [ApiV1ReportsScoutingPostRequest](ApiV1ReportsScoutingPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Scouting report created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ReportsTeamStatisticsGet

> apiV1ReportsTeamStatisticsGet()

Team statistics analytics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ReportsTeamStatisticsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1ReportsTeamStatisticsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleEventsGet

> apiV1ScheduleEventsGet(startDate, endDate)

List schedule events

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleEventsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // Date (optional)
    startDate: 2013-10-20,
    // Date (optional)
    endDate: 2013-10-20,
  } satisfies ApiV1ScheduleEventsGetRequest;

  try {
    const data = await api.apiV1ScheduleEventsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **startDate** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schedule events |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleEventsIdDelete

> apiV1ScheduleEventsIdDelete(id)

Delete schedule event

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleEventsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ScheduleEventsIdDeleteRequest;

  try {
    const data = await api.apiV1ScheduleEventsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Event deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleEventsIdGet

> apiV1ScheduleEventsIdGet(id)

Get schedule event

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleEventsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ScheduleEventsIdGetRequest;

  try {
    const data = await api.apiV1ScheduleEventsIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Event details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleEventsIdPut

> apiV1ScheduleEventsIdPut(id, body)

Update schedule event

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleEventsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1ScheduleEventsIdPutRequest;

  try {
    const data = await api.apiV1ScheduleEventsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Event updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleEventsPost

> apiV1ScheduleEventsPost(apiV1ScheduleEventsPostRequest)

Create schedule event

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleEventsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1ScheduleEventsPostRequest
    apiV1ScheduleEventsPostRequest: ...,
  } satisfies ApiV1ScheduleEventsPostOperationRequest;

  try {
    const data = await api.apiV1ScheduleEventsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1ScheduleEventsPostRequest** | [ApiV1ScheduleEventsPostRequest](ApiV1ScheduleEventsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Event created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleTemplatesGet

> apiV1ScheduleTemplatesGet(page, limit)

List schedule templates

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleTemplatesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1ScheduleTemplatesGetRequest;

  try {
    const data = await api.apiV1ScheduleTemplatesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schedule templates |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleTemplatesIdDelete

> apiV1ScheduleTemplatesIdDelete(id)

Delete schedule template

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleTemplatesIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ScheduleTemplatesIdDeleteRequest;

  try {
    const data = await api.apiV1ScheduleTemplatesIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Template deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleTemplatesIdDuplicatePost

> apiV1ScheduleTemplatesIdDuplicatePost(id)

Duplicate schedule template

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleTemplatesIdDuplicatePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ScheduleTemplatesIdDuplicatePostRequest;

  try {
    const data = await api.apiV1ScheduleTemplatesIdDuplicatePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Template duplicated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleTemplatesIdGet

> apiV1ScheduleTemplatesIdGet(id)

Get schedule template

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleTemplatesIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ScheduleTemplatesIdGetRequest;

  try {
    const data = await api.apiV1ScheduleTemplatesIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Template details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleTemplatesIdPut

> apiV1ScheduleTemplatesIdPut(id, apiV1ScheduleTemplatesIdPutRequest)

Update schedule template

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleTemplatesIdPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1ScheduleTemplatesIdPutRequest (optional)
    apiV1ScheduleTemplatesIdPutRequest: ...,
  } satisfies ApiV1ScheduleTemplatesIdPutOperationRequest;

  try {
    const data = await api.apiV1ScheduleTemplatesIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1ScheduleTemplatesIdPutRequest** | [ApiV1ScheduleTemplatesIdPutRequest](ApiV1ScheduleTemplatesIdPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Template updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScheduleTemplatesPost

> apiV1ScheduleTemplatesPost(apiV1ScheduleTemplatesPostRequest)

Create schedule template

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScheduleTemplatesPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1ScheduleTemplatesPostRequest
    apiV1ScheduleTemplatesPostRequest: ...,
  } satisfies ApiV1ScheduleTemplatesPostOperationRequest;

  try {
    const data = await api.apiV1ScheduleTemplatesPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1ScheduleTemplatesPostRequest** | [ApiV1ScheduleTemplatesPostRequest](ApiV1ScheduleTemplatesPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Template created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesActivitiesActivityIdDelete

> apiV1SchedulesActivitiesActivityIdDelete(activityId)

Delete activity

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesActivitiesActivityIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    activityId: 56,
  } satisfies ApiV1SchedulesActivitiesActivityIdDeleteRequest;

  try {
    const data = await api.apiV1SchedulesActivitiesActivityIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **activityId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Activity deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesByIdIdDelete

> apiV1SchedulesByIdIdDelete(id)

Delete (soft) schedule

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesByIdIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SchedulesByIdIdDeleteRequest;

  try {
    const data = await api.apiV1SchedulesByIdIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schedule deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesByIdIdGet

> apiV1SchedulesByIdIdGet(id)

Get schedule by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SchedulesByIdIdGetRequest;

  try {
    const data = await api.apiV1SchedulesByIdIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schedule with sections and activities |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesByIdIdPut

> apiV1SchedulesByIdIdPut(id, apiV1SchedulesByIdIdPutRequest)

Update schedule

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesByIdIdPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1SchedulesByIdIdPutRequest (optional)
    apiV1SchedulesByIdIdPutRequest: ...,
  } satisfies ApiV1SchedulesByIdIdPutOperationRequest;

  try {
    const data = await api.apiV1SchedulesByIdIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1SchedulesByIdIdPutRequest** | [ApiV1SchedulesByIdIdPutRequest](ApiV1SchedulesByIdIdPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schedule updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesExportPdfGet

> apiV1SchedulesExportPdfGet()

Export schedule PDF

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesExportPdfGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SchedulesExportPdfGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | PDF file |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesGet

> apiV1SchedulesGet(page, limit, date)

List schedules

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // Date (optional)
    date: 2013-10-20,
  } satisfies ApiV1SchedulesGetRequest;

  try {
    const data = await api.apiV1SchedulesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |
| **date** | `Date` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated schedules |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesIdSectionsPost

> apiV1SchedulesIdSectionsPost(id, apiV1SchedulesIdSectionsPostRequest)

Add schedule section

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesIdSectionsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1SchedulesIdSectionsPostRequest
    apiV1SchedulesIdSectionsPostRequest: ...,
  } satisfies ApiV1SchedulesIdSectionsPostOperationRequest;

  try {
    const data = await api.apiV1SchedulesIdSectionsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1SchedulesIdSectionsPostRequest** | [ApiV1SchedulesIdSectionsPostRequest](ApiV1SchedulesIdSectionsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Section created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesPost

> apiV1SchedulesPost(apiV1SchedulesPostRequest)

Create schedule

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1SchedulesPostRequest
    apiV1SchedulesPostRequest: ...,
  } satisfies ApiV1SchedulesPostOperationRequest;

  try {
    const data = await api.apiV1SchedulesPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1SchedulesPostRequest** | [ApiV1SchedulesPostRequest](ApiV1SchedulesPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Schedule created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesSectionsSectionIdActivitiesPost

> apiV1SchedulesSectionsSectionIdActivitiesPost(sectionId, apiV1SchedulesSectionsSectionIdActivitiesPostRequest)

Add activity to section

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesSectionsSectionIdActivitiesPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    sectionId: 56,
    // ApiV1SchedulesSectionsSectionIdActivitiesPostRequest
    apiV1SchedulesSectionsSectionIdActivitiesPostRequest: ...,
  } satisfies ApiV1SchedulesSectionsSectionIdActivitiesPostOperationRequest;

  try {
    const data = await api.apiV1SchedulesSectionsSectionIdActivitiesPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sectionId** | `number` |  | [Defaults to `undefined`] |
| **apiV1SchedulesSectionsSectionIdActivitiesPostRequest** | [ApiV1SchedulesSectionsSectionIdActivitiesPostRequest](ApiV1SchedulesSectionsSectionIdActivitiesPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Activity created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesSectionsSectionIdDelete

> apiV1SchedulesSectionsSectionIdDelete(sectionId)

Delete section (and activities)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesSectionsSectionIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    sectionId: 56,
  } satisfies ApiV1SchedulesSectionsSectionIdDeleteRequest;

  try {
    const data = await api.apiV1SchedulesSectionsSectionIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sectionId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Section deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SchedulesStatsGet

> apiV1SchedulesStatsGet()

Schedule statistics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SchedulesStatsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SchedulesStatsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schedule stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScoutsGet

> apiV1ScoutsGet(page, limit)

List scouts

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScoutsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1ScoutsGetRequest;

  try {
    const data = await api.apiV1ScoutsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scouts list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScoutsIdDelete

> apiV1ScoutsIdDelete(id)

Delete scout

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScoutsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ScoutsIdDeleteRequest;

  try {
    const data = await api.apiV1ScoutsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scout deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScoutsIdGet

> apiV1ScoutsIdGet(id)

Get scout

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScoutsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ScoutsIdGetRequest;

  try {
    const data = await api.apiV1ScoutsIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scout details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScoutsIdPut

> apiV1ScoutsIdPut(id, body)

Update scout

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScoutsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1ScoutsIdPutRequest;

  try {
    const data = await api.apiV1ScoutsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Scout updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ScoutsPost

> apiV1ScoutsPost(body)

Create scout

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1ScoutsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object
    body: Object,
  } satisfies ApiV1ScoutsPostRequest;

  try {
    const data = await api.apiV1ScoutsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Scout created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsAccountDelete

> apiV1SettingsAccountDelete()

Delete account

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsAccountDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsAccountDelete();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Account deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsAccountPut

> apiV1SettingsAccountPut(body)

Update account settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsAccountPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1SettingsAccountPutRequest;

  try {
    const data = await api.apiV1SettingsAccountPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Account updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsChangePasswordPut

> apiV1SettingsChangePasswordPut(apiV1AuthChangePasswordPutRequest)

Change password

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsChangePasswordPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1AuthChangePasswordPutRequest
    apiV1AuthChangePasswordPutRequest: ...,
  } satisfies ApiV1SettingsChangePasswordPutRequest;

  try {
    const data = await api.apiV1SettingsChangePasswordPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1AuthChangePasswordPutRequest** | [ApiV1AuthChangePasswordPutRequest](ApiV1AuthChangePasswordPutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Password changed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsExportDataGet

> apiV1SettingsExportDataGet()

Export user data

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsExportDataGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsExportDataGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Data export |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsGeneralPut

> apiV1SettingsGeneralPut(body)

Update general settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsGeneralPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1SettingsGeneralPutRequest;

  try {
    const data = await api.apiV1SettingsGeneralPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Settings updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsGet

> apiV1SettingsGet()

Get all settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User settings |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsLoginHistoryGet

> apiV1SettingsLoginHistoryGet()

Get login history

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsLoginHistoryGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsLoginHistoryGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Login history |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsNotificationsPreferencesGet

> apiV1SettingsNotificationsPreferencesGet()

Get notification preferences

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsNotificationsPreferencesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsNotificationsPreferencesGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Preferences |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsNotificationsPreferencesPut

> apiV1SettingsNotificationsPreferencesPut(body)

Update notification preferences

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsNotificationsPreferencesPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1SettingsNotificationsPreferencesPutRequest;

  try {
    const data = await api.apiV1SettingsNotificationsPreferencesPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Preferences updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsNotificationsPut

> apiV1SettingsNotificationsPut(body)

Update notification settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsNotificationsPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1SettingsNotificationsPutRequest;

  try {
    const data = await api.apiV1SettingsNotificationsPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Notifications updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsNotificationsTestEmailPost

> apiV1SettingsNotificationsTestEmailPost()

Send test email

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsNotificationsTestEmailPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsNotificationsTestEmailPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Test email sent |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsPrivacyGet

> apiV1SettingsPrivacyGet()

Get privacy settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsPrivacyGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsPrivacyGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Privacy settings |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsPrivacyPut

> apiV1SettingsPrivacyPut(body)

Update privacy settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsPrivacyPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1SettingsPrivacyPutRequest;

  try {
    const data = await api.apiV1SettingsPrivacyPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Privacy updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsProfilePicturePut

> apiV1SettingsProfilePicturePut(file)

Update profile picture

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsProfilePicturePutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // Blob (optional)
    file: BINARY_DATA_HERE,
  } satisfies ApiV1SettingsProfilePicturePutRequest;

  try {
    const data = await api.apiV1SettingsProfilePicturePut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **file** | `Blob` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile picture updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsSecurityPut

> apiV1SettingsSecurityPut(body)

Update security settings

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsSecurityPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1SettingsSecurityPutRequest;

  try {
    const data = await api.apiV1SettingsSecurityPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Security updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsSessionsGet

> apiV1SettingsSessionsGet()

Get active sessions

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsSessionsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsSessionsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active sessions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsTwoFactorPut

> apiV1SettingsTwoFactorPut(body)

Enable/disable two-factor auth

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsTwoFactorPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object (optional)
    body: Object,
  } satisfies ApiV1SettingsTwoFactorPutRequest;

  try {
    const data = await api.apiV1SettingsTwoFactorPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 2FA updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsTwoFactorQrGet

> apiV1SettingsTwoFactorQrGet()

Get 2FA QR code

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsTwoFactorQrGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1SettingsTwoFactorQrGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | QR code for authenticator |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SettingsTwoFactorVerifyPost

> apiV1SettingsTwoFactorVerifyPost(apiV1SettingsTwoFactorVerifyPostRequest)

Verify 2FA code

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1SettingsTwoFactorVerifyPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1SettingsTwoFactorVerifyPostRequest (optional)
    apiV1SettingsTwoFactorVerifyPostRequest: ...,
  } satisfies ApiV1SettingsTwoFactorVerifyPostOperationRequest;

  try {
    const data = await api.apiV1SettingsTwoFactorVerifyPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1SettingsTwoFactorVerifyPostRequest** | [ApiV1SettingsTwoFactorVerifyPostRequest](ApiV1SettingsTwoFactorVerifyPostRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 2FA verified |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsBrandingGet

> apiV1TeamsBrandingGet()

Get team branding

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsBrandingGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1TeamsBrandingGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Name, logo, colors |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsBrandingPut

> apiV1TeamsBrandingPut(apiV1TeamsBrandingPutRequest)

Update brand colors

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsBrandingPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1TeamsBrandingPutRequest (optional)
    apiV1TeamsBrandingPutRequest: ...,
  } satisfies ApiV1TeamsBrandingPutOperationRequest;

  try {
    const data = await api.apiV1TeamsBrandingPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1TeamsBrandingPutRequest** | [ApiV1TeamsBrandingPutRequest](ApiV1TeamsBrandingPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Branding updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsByIdIdGet

> apiV1TeamsByIdIdGet(id)

Get team by ID with users

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1TeamsByIdIdGetRequest;

  try {
    const data = await api.apiV1TeamsByIdIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team with users |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsGet

> apiV1TeamsGet()

List teams (public - for registration)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiV1TeamsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | All teams |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsIdGet

> apiV1TeamsIdGet(id)

Get team by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1TeamsIdGetRequest;

  try {
    const data = await api.apiV1TeamsIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsIdPut

> apiV1TeamsIdPut(id, apiV1TeamsMePutRequest)

Update team

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1TeamsMePutRequest (optional)
    apiV1TeamsMePutRequest: ...,
  } satisfies ApiV1TeamsIdPutRequest;

  try {
    const data = await api.apiV1TeamsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1TeamsMePutRequest** | [ApiV1TeamsMePutRequest](ApiV1TeamsMePutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsLogoDelete

> apiV1TeamsLogoDelete()

Remove team logo

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsLogoDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1TeamsLogoDelete();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Logo removed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsLogoPost

> apiV1TeamsLogoPost(file)

Upload team logo

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsLogoPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // Blob (optional)
    file: BINARY_DATA_HERE,
  } satisfies ApiV1TeamsLogoPostRequest;

  try {
    const data = await api.apiV1TeamsLogoPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **file** | `Blob` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Logo uploaded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsMeGet

> apiV1TeamsMeGet()

Get current user\&#39;s team

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsMeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1TeamsMeGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsMePut

> apiV1TeamsMePut(apiV1TeamsMePutRequest)

Update current user\&#39;s team

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsMePutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1TeamsMePutRequest (optional)
    apiV1TeamsMePutRequest: ...,
  } satisfies ApiV1TeamsMePutOperationRequest;

  try {
    const data = await api.apiV1TeamsMePut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1TeamsMePutRequest** | [ApiV1TeamsMePutRequest](ApiV1TeamsMePutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsPermissionsGet

> apiV1TeamsPermissionsGet()

Get team permissions

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsPermissionsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1TeamsPermissionsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsPermissionsIdDelete

> apiV1TeamsPermissionsIdDelete(id)

Revoke permission

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsPermissionsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1TeamsPermissionsIdDeleteRequest;

  try {
    const data = await api.apiV1TeamsPermissionsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Permission revoked |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsPermissionsIdPut

> apiV1TeamsPermissionsIdPut(id, apiV1TeamsPermissionsIdPutRequest)

Update permission

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsPermissionsIdPutOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1TeamsPermissionsIdPutRequest (optional)
    apiV1TeamsPermissionsIdPutRequest: ...,
  } satisfies ApiV1TeamsPermissionsIdPutOperationRequest;

  try {
    const data = await api.apiV1TeamsPermissionsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1TeamsPermissionsIdPutRequest** | [ApiV1TeamsPermissionsIdPutRequest](ApiV1TeamsPermissionsIdPutRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Permission updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsPermissionsPost

> apiV1TeamsPermissionsPost(apiV1TeamsPermissionsPostRequest)

Grant permission

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsPermissionsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1TeamsPermissionsPostRequest
    apiV1TeamsPermissionsPostRequest: ...,
  } satisfies ApiV1TeamsPermissionsPostOperationRequest;

  try {
    const data = await api.apiV1TeamsPermissionsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1TeamsPermissionsPostRequest** | [ApiV1TeamsPermissionsPostRequest](ApiV1TeamsPermissionsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Permission granted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsPost

> apiV1TeamsPost(apiV1TeamsPostRequest)

Create team (team_management permission)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // ApiV1TeamsPostRequest
    apiV1TeamsPostRequest: ...,
  } satisfies ApiV1TeamsPostOperationRequest;

  try {
    const data = await api.apiV1TeamsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1TeamsPostRequest** | [ApiV1TeamsPostRequest](ApiV1TeamsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Team created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsRecentSchedulesGet

> apiV1TeamsRecentSchedulesGet(limit)

Recent past schedule events

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsRecentSchedulesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    limit: 56,
  } satisfies ApiV1TeamsRecentSchedulesGetRequest;

  try {
    const data = await api.apiV1TeamsRecentSchedulesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` |  | [Optional] [Defaults to `5`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Flattened event list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsRosterGet

> apiV1TeamsRosterGet()

Roster by position group

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsRosterGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1TeamsRosterGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pitchers, catchers, infielders, outfielders, DH |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsStatsGet

> apiV1TeamsStatsGet()

Team statistics

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsStatsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1TeamsStatsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Player counts, reports, schedules, games, wins/losses |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsUpcomingSchedulesGet

> apiV1TeamsUpcomingSchedulesGet(limit)

Upcoming schedule events

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsUpcomingSchedulesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    limit: 56,
  } satisfies ApiV1TeamsUpcomingSchedulesGetRequest;

  try {
    const data = await api.apiV1TeamsUpcomingSchedulesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` |  | [Optional] [Defaults to `5`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Flattened event list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TeamsUsersGet

> apiV1TeamsUsersGet()

Get team users

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1TeamsUsersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiV1TeamsUsersGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Team members |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1VendorsGet

> apiV1VendorsGet(page, limit)

List vendors

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1VendorsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
  } satisfies ApiV1VendorsGetRequest;

  try {
    const data = await api.apiV1VendorsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Vendors list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1VendorsIdDelete

> apiV1VendorsIdDelete(id)

Delete vendor

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1VendorsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1VendorsIdDeleteRequest;

  try {
    const data = await api.apiV1VendorsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Vendor deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1VendorsIdGet

> apiV1VendorsIdGet(id)

Get vendor

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1VendorsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1VendorsIdGetRequest;

  try {
    const data = await api.apiV1VendorsIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Vendor details |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1VendorsIdPut

> apiV1VendorsIdPut(id, body)

Update vendor

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1VendorsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // number
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1VendorsIdPutRequest;

  try {
    const data = await api.apiV1VendorsIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` |  | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Vendor updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1VendorsPost

> apiV1VendorsPost(body)

Create vendor

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiV1VendorsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // object
    body: Object,
  } satisfies ApiV1VendorsPostRequest;

  try {
    const data = await api.apiV1VendorsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Vendor created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## healthGet

> HealthGet200Response healthGet()

Health check

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { HealthGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.healthGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**HealthGet200Response**](HealthGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Service is healthy |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

