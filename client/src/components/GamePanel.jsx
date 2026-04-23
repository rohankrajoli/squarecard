import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'

const GamePanel = () => {
  const navigate = useNavigate()
  const {
    moves,
    isBalanced,
    gameStarted,
    level,
    maxLevel,
    tutorialMode,
    totalScore,
    puzzleMeta,
    getLevelScore,
    calculateSideSum,
    startGame,
    resetGame,
    getHint,
    getTargetSum
  } = useGame()

  const [hint, setHint] = useState(null)

  const handleHint = () => {
    setHint(getHint())
  }

  const handleNextLevel = () => {
    if (!isBalanced || level >= maxLevel) return
    navigate(`/loading?level=${level + 1}&cap=${maxLevel}&tutorial=${tutorialMode ? 1 : 0}`)
  }

  const handleNewGame = () => {
    startGame(maxLevel, tutorialMode)
  }

  const targetSum = getTargetSum()
  const isFinalLevel = level >= maxLevel
  const optimalMoves = puzzleMeta.optimalMoves ?? puzzleMeta.scrambleMoves ?? 1
  const extraMoves = Math.max(0, moves - optimalMoves)
  const currentLevelScore = getLevelScore()
  const sides = [
    { name: 'Top', key: 'top' },
    { name: 'Left', key: 'left' },
    { name: 'Bottom', key: 'bottom' },
    { name: 'Right', key: 'right' }
  ]

  return (
    <div className="space-y-3">
      <div className="neu-card p-4 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-700/70">
          Score
        </div>
        <div className="mt-2 text-3xl font-bold text-yellow-600">{currentLevelScore}</div>
        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">
          Current Level Score
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-xl font-bold text-primary-600">{moves}/{optimalMoves}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Moves / Optimal</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-xl font-bold text-yellow-600">{totalScore}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Total Score</div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className={`text-xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
              {isBalanced ? 'Yes' : 'No'}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Balanced</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-xl font-bold text-slate-700">{extraMoves}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Extra Moves</div>
          </div>
        </div>
      </div>

      <div className="neu-card border border-white/60 bg-white/90 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.07)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-700/70">
              Quick Actions
            </div>
            <div className="mt-1 text-lg font-bold text-gray-800">
              Level {level}/{maxLevel}
            </div>
          </div>
          <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
            {tutorialMode ? 'Tutorial' : puzzleMeta.difficulty}
          </div>
        </div>

        <div className="grid gap-2">
          {!gameStarted ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleNewGame}
              className="rounded-xl bg-primary-500 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-600"
            >
              Start Game
            </motion.button>
          ) : (
            <>
              {isBalanced ? (
                isFinalLevel ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center font-medium text-green-700">
                    Final Level Complete
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleNextLevel}
                    className="rounded-xl bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600"
                  >
                    Next Level ({level + 1})
                  </motion.button>
                )
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={resetGame}
                  className="rounded-xl bg-gray-500 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-600"
                >
                  Reset Level
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleNewGame}
                className="rounded-xl bg-primary-500 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-600"
              >
                New Game
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleHint}
            disabled={!gameStarted || isBalanced}
            className="rounded-xl bg-yellow-500 px-4 py-3 font-medium text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hint
          </motion.button>
        </div>
      </div>

      <div className="neu-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">Board Status</div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary-700">
            Target {targetSum}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sides.map((side) => {
            const sum = calculateSideSum(side.key)
            const sideBalanced = sum === targetSum

            return (
              <div key={side.key} className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{side.name}</div>
                <div className={`mt-1 text-lg font-bold ${sideBalanced ? 'text-green-700' : 'text-red-700'}`}>
                  {sum}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-lg font-bold text-slate-700">{puzzleMeta.scrambleMoves}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Setup</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-lg font-bold text-slate-700">{puzzleMeta.maxImbalance}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Imbalance</div>
          </div>
        </div>
      </div>

      {isBalanced && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
          {isFinalLevel ? 'You reached the final level.' : `Level ${level} complete. Continue when ready.`}
        </div>
      )}

      {hint && !isBalanced && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="neu-card border border-yellow-200 bg-yellow-50 p-4"
        >
          <div className="text-center text-sm text-yellow-700">
            Node <strong>{hint.node}</strong> affects the <strong>{hint.side}</strong> side.
            Current: {hint.currentSum}, target: {hint.targetSum}. You need to {hint.needed} cards.
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default GamePanel
