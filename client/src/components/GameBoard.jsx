import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'
import GameNode from './GameNode'

const GameBoard = () => {
  const { nodes, calculateSideSum, getTargetSum, level, puzzleMeta, tutorialMode } = useGame()

  const nodeLayout = [
    ['A', 'B', 'C', 'D'],
    ['E', null, null, 'F'],
    ['G', null, null, 'H'],
    ['I', 'J', 'K', 'L']
  ]

  const topSum = calculateSideSum('top')
  const leftSum = calculateSideSum('left')
  const bottomSum = calculateSideSum('bottom')
  const rightSum = calculateSideSum('right')
  const targetSum = getTargetSum()

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="grid grid-cols-5 grid-rows-5 gap-1.5 p-2 sm:gap-2 sm:p-3">
        <div className="row-start-1 col-start-1 flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600 neu-card sm:h-8 sm:w-8 sm:text-xs">
            {targetSum}
          </div>
        </div>

        <div className="row-start-1 col-start-2 col-span-3 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl px-4 py-2 text-base font-bold transition-all duration-300 neu-card sm:px-6 sm:text-xl ${
              topSum === targetSum ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            <div className="text-center">
              <div className="mb-1 text-[10px] text-gray-500 sm:text-xs">TOP</div>
              <div>{topSum}</div>
            </div>
          </motion.div>
        </div>

        <div className="row-start-1 col-start-5 flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600 neu-card sm:h-8 sm:w-8 sm:text-xs">
            {targetSum}
          </div>
        </div>

        <div className="row-start-3 col-start-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl px-2 py-4 text-base font-bold transition-all duration-300 neu-card sm:px-3 sm:py-6 sm:text-xl ${
              leftSum === targetSum ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            <div className="text-center">
              <div className="mb-1 text-[10px] text-gray-500 sm:text-xs">LEFT</div>
              <div>{leftSum}</div>
            </div>
          </motion.div>
        </div>

        <div className="row-start-2 col-start-2 col-span-3 row-span-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative grid h-full grid-cols-4 gap-2 rounded-[1.5rem] bg-gray-50 p-3 neu-card sm:gap-3 sm:p-4"
          >
            <div className="absolute right-2 top-2">
              <div className="flex flex-col items-end gap-2">
                <div className="rounded-full bg-primary-500 px-2 py-1 text-xs font-bold text-white">
                  L{level}
                </div>
                {!tutorialMode && (
                  <div className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-primary-700 shadow-neu">
                    {puzzleMeta.difficulty}
                  </div>
                )}
              </div>
            </div>

            {nodeLayout.map((row, rowIndex) =>
              row.map((nodeId, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="aspect-square">
                  {nodeId ? (
                    <GameNode
                      nodeId={nodeId}
                      value={nodes[nodeId]}
                      delay={rowIndex * 0.08 + colIndex * 0.04}
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>
              ))
            )}
          </motion.div>
        </div>

        <div className="row-start-3 col-start-5 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className={`rounded-2xl px-2 py-4 text-base font-bold transition-all duration-300 neu-card sm:px-3 sm:py-6 sm:text-xl ${
              rightSum === targetSum ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            <div className="text-center">
              <div className="mb-1 text-[10px] text-gray-500 sm:text-xs">RIGHT</div>
              <div>{rightSum}</div>
            </div>
          </motion.div>
        </div>

        <div className="row-start-5 col-start-1 flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600 neu-card sm:h-8 sm:w-8 sm:text-xs">
            {targetSum}
          </div>
        </div>

        <div className="row-start-5 col-start-2 col-span-3 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`rounded-2xl px-4 py-2 text-base font-bold transition-all duration-300 neu-card sm:px-6 sm:text-xl ${
              bottomSum === targetSum ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            <div className="text-center">
              <div className="mb-1 text-[10px] text-gray-500 sm:text-xs">BOTTOM</div>
              <div>{bottomSum}</div>
            </div>
          </motion.div>
        </div>

        <div className="row-start-5 col-start-5 flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600 neu-card sm:h-8 sm:w-8 sm:text-xs">
            {targetSum}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-3 text-center"
      >
        <div className="text-sm text-gray-600">
          Level {level}: each side must equal {targetSum} cards
        </div>
        <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary-700 sm:text-xs">
          {puzzleMeta.difficulty} puzzle • {puzzleMeta.scrambleMoves} setup moves • {puzzleMeta.affectedSides} affected sides
        </div>
      </motion.div>
    </div>
  )
}

export default GameBoard
