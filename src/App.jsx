import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Teams from './pages/Teams';
import Scouting from './pages/Scouting';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import PlayerDetail from './pages/PlayerDetail';
import TeamDetail from './pages/TeamDetail';
import CreateTeam from './pages/CreateTeam';
import ScoutingReport from './pages/ScoutingReport';
import CreatePlayer from './pages/CreatePlayer';
import EditPlayer from './pages/EditPlayer';
import ScoutingReports from './pages/ScoutingReports';
import CreateScoutingReport from './pages/CreateScoutingReport';
import CreateCustomReport from './pages/CreateCustomReport';
import DepthChart from './pages/DepthChart';
import TeamSchedule from './pages/TeamSchedule';
import ScheduleTemplates from './pages/ScheduleTemplates';
import OAuthCallback from './pages/OAuthCallback';
import NotFound from './pages/NotFound';
import RecruitingBoard from './pages/RecruitingBoard';
import PerformanceList from './pages/PerformanceList';
import NewPlayers from './pages/NewPlayers';
import OverallPrefList from './pages/OverallPrefList';
import HSPrefList from './pages/HSPrefList';
import CollegePortal from './pages/CollegePortal';
import Coaches from './pages/Coaches';
import Scouts from './pages/Scouts';
import Vendors from './pages/Vendors';
import HighSchoolCoaches from './pages/HighSchoolCoaches';

function App() {
  return (
    <div className="bg-base-100">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/players" element={
          <ProtectedRoute>
            <Layout>
              <Players />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/players/:id" element={
          <ProtectedRoute>
            <Layout>
              <PlayerDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/players/create" element={
          <ProtectedRoute>
            <Layout>
              <CreatePlayer />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/players/:id/edit" element={
          <ProtectedRoute>
            <Layout>
              <EditPlayer />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/performance" element={
          <ProtectedRoute>
            <Layout>
              <PerformanceList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/pref-list/new-players" element={
          <ProtectedRoute>
            <Layout>
              <NewPlayers />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/pref-list/overall" element={
          <ProtectedRoute>
            <Layout>
              <OverallPrefList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/pref-list/high-school" element={
          <ProtectedRoute>
            <Layout>
              <HSPrefList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/pref-list/college-portal" element={
          <ProtectedRoute>
            <Layout>
              <CollegePortal />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/teams" element={
          <ProtectedRoute>
            <Layout>
              <Teams />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/teams/:id" element={
          <ProtectedRoute>
            <Layout>
              <TeamDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/teams/create" element={
          <ProtectedRoute>
            <Layout>
              <CreateTeam />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/scouting" element={
          <ProtectedRoute>
            <Layout>
              <Scouting />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/scouting/:id" element={
          <ProtectedRoute>
            <Layout>
              <ScoutingReport />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/scouting/create" element={
          <ProtectedRoute>
            <Layout>
              <CreateScoutingReport />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/recruiting" element={
          <ProtectedRoute>
            <Layout>
              <RecruitingBoard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/coaches" element={
          <ProtectedRoute>
            <Layout>
              <Coaches />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/scouts" element={
          <ProtectedRoute>
            <Layout>
              <Scouts />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendors" element={
          <ProtectedRoute>
            <Layout>
              <Vendors />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/high-school-coaches" element={
          <ProtectedRoute>
            <Layout>
              <HighSchoolCoaches />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/depth-chart" element={
          <ProtectedRoute>
            <Layout>
              <DepthChart />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/team-schedule" element={
          <ProtectedRoute>
            <Layout>
              <TeamSchedule />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/schedule-templates" element={
          <ProtectedRoute>
            <Layout>
              <ScheduleTemplates />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports/create-custom" element={
          <ProtectedRoute>
            <Layout>
              <CreateCustomReport />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App; 