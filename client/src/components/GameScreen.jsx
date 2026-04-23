import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'
import GameBoard from './GameBoard'
import GamePanel from './GamePanel'
import Header from './Header'

const GameScreen = () => {
  const { isBalanced, gameStarted, level, maxLevel, tutorialMode, startLevel } = useGame()
  const [searchParams] = useSearchParams()
  const queryLevel = Number(searchParams.get('level') || '1')
  const queryCap = Number(searchParams.get('cap') || '50')
  const requestedTutorialMode = searchParams.get('tutorial') === '1'
  const requestedLevel = Number.isNaN(queryLevel) ? 1 : Math.max(1, Math.min(queryLevel, 50))
  const requestedCap = Number.isNaN(queryCap) ? 50 : Math.max(1, Math.min(queryCap, 50))

  useEffect(() => {
    if (!gameStarted || level !== requestedLevel || maxLevel !== requestedCap || tutorialMode !== requestedTutorialMode) {
      startLevel(requestedLevel, requestedCap, requestedTutorialMode)
    }
  }, [gameStarted, level, maxLevel, tutorialMode, requestedLevel, requestedCap, requestedTutorialMode, startLevel])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.45fr)_360px] xl:grid-cols-[minmax(0,1.6fr)_380px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="neu-card p-3 sm:p-5"
          >
            <div className="mb-3 text-center sm:mb-4">
              <h2 className="mb-1 text-lg font-bold text-primary-700 sm:text-2xl">
                Square Card Balance
              </h2>
              <p className="text-xs text-gray-600 sm:text-sm">
                Drag cards between nodes to balance all sides to 12 while keeping at least one card in every node.
              </p>
            </div>

            <GameBoard />

            {isBalanced && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-center"
              >
                <div className="inline-block bg-primary-50 px-4 py-3 neu-card">
                  <div className="text-base font-semibold text-primary-600 sm:text-lg">
                    Perfect Balance Achieved!
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:self-start"
          >
            <GamePanel />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GameScreen
