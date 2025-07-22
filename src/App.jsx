import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
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
import ScoutingReport from './pages/ScoutingReport';
import CreatePlayer from './pages/CreatePlayer';
import ScoutingReports from './pages/ScoutingReports';
import OAuthCallback from './pages/OAuthCallback';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-base-100">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navigation />
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navigation />
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/players" element={
          <ProtectedRoute>
            <Navigation />
            <Players />
          </ProtectedRoute>
        } />
        <Route path="/players/:id" element={
          <ProtectedRoute>
            <Navigation />
            <PlayerDetail />
          </ProtectedRoute>
        } />
        <Route path="/players/create" element={
          <ProtectedRoute>
            <Navigation />
            <CreatePlayer />
          </ProtectedRoute>
        } />
        <Route path="/teams" element={
          <ProtectedRoute>
            <Navigation />
            <Teams />
          </ProtectedRoute>
        } />
        <Route path="/teams/:id" element={
          <ProtectedRoute>
            <Navigation />
            <TeamDetail />
          </ProtectedRoute>
        } />
        <Route path="/scouting" element={
          <ProtectedRoute>
            <Navigation />
            <Scouting />
          </ProtectedRoute>
        } />
        <Route path="/scouting/:id" element={
          <ProtectedRoute>
            <Navigation />
            <ScoutingReport />
          </ProtectedRoute>
        } />
        <Route path="/scouting/create" element={
          <ProtectedRoute>
            <Navigation />
            <ScoutingReports />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Navigation />
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Navigation />
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navigation />
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App; 