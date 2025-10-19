import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { PointSystemProvider } from './contexts/PointSystemContext'
import OnlPage from './pages/OnlPage'
import WeatherPage from './pages/WeatherPage'
import FortunePage from './pages/FortunePage'
import NewsPage from './pages/NewsPage'
import CommunityPage from './pages/CommunityPage'
import './App.css'

function App() {
  return (
    <PointSystemProvider>
      <Router>
        <Routes>
          <Route path="/" element={<OnlPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/fortune" element={<FortunePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </Router>
    </PointSystemProvider>
  )
}

export default App