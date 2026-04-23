import { Routes, Route } from 'react-router-dom'
import { GameProvider } from './contexts/GameContext'
import LandingPage from './components/LandingPage'
import LoadingScreen from './components/LoadingScreen'
import GameScreen from './components/GameScreen'
import LevelsScreen from './components/LevelsScreen'

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/levels" element={<LevelsScreen />} />
          <Route
            path="/tutorial-levels"
            element={
              <LevelsScreen
                maxLevels={12}
                tutorialMode
                heading="Training Platform"
                subheading="Learn the board through 12 guided puzzle levels."
                description="This path is for new players. It keeps the same drag-and-drop rules, but the progression is capped at 12 training levels so players can understand the board before entering the full campaign."
              />
            }
          />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/game" element={<GameScreen />} />
        </Routes>
      </div>
    </GameProvider>
  )
}

export default App
