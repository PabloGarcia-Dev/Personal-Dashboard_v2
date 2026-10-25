import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import StatsPage from './pages/StatsPage'

export default function App(){
  return(
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stats" element={<StatsPage />} />
    </Routes>
  )
}