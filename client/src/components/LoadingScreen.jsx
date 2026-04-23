import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const LoadingScreen = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showContent, setShowContent] = useState(false)
  const requestedLevel = Number(searchParams.get('level') || '1')
  const requestedCap = Number(searchParams.get('cap') || '50')
  const tutorialMode = searchParams.get('tutorial') === '1'
  const selectedLevel = Number.isNaN(requestedLevel) ? 1 : Math.max(1, Math.min(requestedLevel, 50))
  const selectedCap = Number.isNaN(requestedCap) ? 50 : Math.max(1, Math.min(requestedCap, 50))

  useEffect(() => {
    // Show loading animation for at least 2 seconds
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showContent) {
      // Navigate to game after loading animation
      const timer = setTimeout(() => {
        navigate(`/game?level=${selectedLevel}&cap=${selectedCap}&tutorial=${tutorialMode ? 1 : 0}`)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [showContent, navigate, selectedLevel, selectedCap, tutorialMode])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative mx-auto w-32 h-32 mb-6">
            {/* Logo recreation based on the image */}
            <div className="grid grid-cols-2 gap-2 w-full h-full">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="neu-card bg-primary-600 flex items-center justify-center text-white text-2xl font-bold rounded-2xl"
              >
                4
              </motion.div>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="neu-card bg-primary-400 flex items-center justify-center text-white text-2xl font-bold rounded-2xl"
              >
                2
              </motion.div>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="neu-card bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold rounded-2xl"
              >
                2
              </motion.div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="neu-card bg-primary-500 flex items-center justify-center text-white text-2xl font-bold rounded-2xl"
              >
                4
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mb-3 text-3xl font-bold text-primary-700"
        >
          Preparing the board
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.25 }}
          className="mb-6 text-gray-600"
        >
          Loading level {selectedLevel} and setting up the game board.
        </motion.p>

        <div className="mx-auto h-3 w-64 overflow-hidden rounded-full bg-gray-200 shadow-neu-inset">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: showContent ? '100%' : '82%' }}
            transition={{ duration: showContent ? 0.4 : 2, ease: 'easeInOut' }}
            className="h-full rounded-full bg-primary-500"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.4 }}
          className="mt-4 text-sm font-medium text-gray-500"
        >
          {showContent ? `Starting level ${selectedLevel}...` : 'Syncing cards...'}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
