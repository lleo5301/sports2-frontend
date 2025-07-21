import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import PlayerDetail from './pages/PlayerDetail'
import CreatePlayer from './pages/CreatePlayer'
import RecruitingBoard from './pages/RecruitingBoard'
import PreferenceLists from './pages/PreferenceLists'
import DailyReports from './pages/DailyReports'
import ScoutingReports from './pages/ScoutingReports'
import DepthChart from './pages/DepthChart'
import TeamSettings from './pages/TeamSettings'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/create" element={<CreatePlayer />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
        <Route path="/recruiting" element={<RecruitingBoard />} />
        <Route path="/preference-lists" element={<PreferenceLists />} />
        <Route path="/daily-reports" element={<DailyReports />} />
        <Route path="/scouting-reports" element={<ScoutingReports />} />
        <Route path="/depth-chart" element={<DepthChart />} />
        <Route path="/team-settings" element={<TeamSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App 