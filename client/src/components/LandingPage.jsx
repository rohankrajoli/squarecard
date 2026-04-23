import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const previewCards = [
  { value: 4, className: 'bg-primary-600 text-white' },
  { value: 2, className: 'bg-primary-400 text-white' },
  { value: 2, className: 'bg-gray-300 text-gray-700' },
  { value: 4, className: 'bg-primary-500 text-white' }
]

const tutorialBoard = [
  ['A', 'B', 'C', 'D'],
  ['E', null, null, 'F'],
  ['G', null, null, 'H'],
  ['I', 'J', 'K', 'L']
]

const tutorialNodeStyles = {
  A: 'bg-primary-600 text-white',
  B: 'bg-primary-400 text-white ring-4 ring-primary-200',
  C: 'bg-primary-400 text-white',
  D: 'bg-primary-500 text-white',
  E: 'bg-primary-400 text-white',
  F: 'bg-primary-400 text-white',
  G: 'bg-primary-400 text-white',
  H: 'bg-primary-400 text-white',
  I: 'bg-primary-600 text-white',
  J: 'bg-gray-300 text-gray-700',
  K: 'bg-primary-400 text-white',
  L: 'bg-primary-500 text-white'
}

const tutorialNodeValues = {
  A: 4, B: 3, C: 2, D: 4,
  E: 2, F: 2, G: 2, H: 2,
  I: 4, J: 1, K: 2, L: 4
}

const tutorialSteps = [
  'Each side of the square must total 12.',
  'Corner nodes affect two sides at the same time.',
  'Edge nodes affect only one side, so they are best for fine-tuning.',
  'Try moving one card from B to J to understand how the board changes.'
]

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 shadow-neu">
              Logic puzzle with drag-and-drop play
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-primary-700 md:text-6xl">
                Square Card Balance
              </h1>
              <p className="max-w-xl text-lg leading-8 text-gray-600">
                Move cards between the nodes until the top, left, bottom, and right
                sides all total 12. Every move changes the board, so efficiency matters.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/levels')}
                className="rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-neu-lg transition-colors hover:bg-primary-600"
              >
                Start Playing
              </motion.button>
              <a
                href="#tutorial"
                className="rounded-xl bg-gray-100 px-6 py-3 text-center font-semibold text-gray-700 shadow-neu transition-colors hover:bg-gray-50"
              >
                Open Tutorial
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="neu-card p-4">
                <div className="text-sm font-medium text-gray-500">Target</div>
                <div className="mt-2 text-2xl font-bold text-primary-600">12</div>
              </div>
              <div className="neu-card p-4">
                <div className="text-sm font-medium text-gray-500">Nodes</div>
                <div className="mt-2 text-2xl font-bold text-primary-600">12</div>
              </div>
              <div className="neu-card p-4">
                <div className="text-sm font-medium text-gray-500">Moves</div>
                <div className="mt-2 text-2xl font-bold text-primary-600">Unlimited</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="neu-card p-6 md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                  Quick Preview
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-800">
                  Balance all four sides
                </div>
              </div>
              <div className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                Goal: 12
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {previewCards.map((card, index) => (
                <motion.div
                  key={`${card.value}-${index}`}
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className={`aspect-square rounded-3xl shadow-neu-lg ${card.className} flex items-center justify-center text-4xl font-bold`}
                >
                  {card.value}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-green-50 p-4 text-green-700 shadow-neu">
                <div className="text-sm font-semibold">Balanced side</div>
                <div className="mt-1 text-2xl font-bold">12</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 text-red-700 shadow-neu">
                <div className="text-sm font-semibold">Unbalanced side</div>
                <div className="mt-1 text-2xl font-bold">9</div>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-gray-500">
              Drag a card from one node to another. Corners affect two sides, edge
              nodes affect one side, and the board updates live after every move.
            </p>
          </motion.div>
        </div>

        <motion.section
          id="tutorial"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 grid gap-8 rounded-[2rem] bg-gradient-to-br from-primary-50 to-gray-100 p-6 shadow-neu lg:grid-cols-[1.15fr_0.85fr] lg:p-8"
        >
          <div className="space-y-5">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-primary-700">
                Tutorial
              </div>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                Learn the board before you start
              </h2>
              <p className="mt-3 max-w-2xl text-gray-600">
                This sample board shows the same layout used in the game. The highlighted
                top edge has one extra card, and the bottom edge has one fewer card, so
                the square is not balanced yet. Use it to understand how moving a single
                card can rebalance the board before entering the actual level path.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {tutorialSteps.map((step, index) => (
                <div key={step} className="rounded-2xl bg-white/70 p-4 shadow-neu">
                  <div className="text-sm font-semibold text-primary-700">Step {index + 1}</div>
                  <div className="mt-2 text-sm leading-6 text-gray-600">{step}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/tutorial-levels')}
                className="rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-neu-lg transition-colors hover:bg-primary-600"
              >
                Play After Tutorial
              </motion.button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/80 p-5 shadow-neu">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Tutorial Board</div>
                <div className="text-xl font-bold text-gray-800">One move to study</div>
              </div>
              <div className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                Goal: 12
              </div>
            </div>

            <div className="grid grid-cols-5 grid-rows-5 gap-2">
              <div className="col-start-2 col-span-3 rounded-2xl bg-red-50 px-4 py-2 text-center shadow-neu">
                <div className="text-xs font-medium text-gray-500">TOP</div>
                <div className="text-2xl font-bold text-red-700">13</div>
              </div>
              <div className="row-start-3 rounded-2xl bg-green-50 px-2 py-5 text-center shadow-neu">
                <div className="text-xs font-medium text-gray-500">LEFT</div>
                <div className="text-xl font-bold text-green-700">12</div>
              </div>
              <div className="col-start-2 col-span-3 row-start-2 row-span-3 rounded-[1.5rem] bg-gray-50 p-4 shadow-neu-inset">
                <div className="grid grid-cols-4 gap-3">
                  {tutorialBoard.map((row, rowIndex) =>
                    row.map((nodeId, colIndex) => (
                      <div key={`${rowIndex}-${colIndex}`} className="aspect-square">
                        {nodeId ? (
                          <div className="relative h-full w-full">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-gray-500 shadow-neu">
                              {nodeId}
                            </div>
                            <div className={`flex h-full w-full items-center justify-center rounded-2xl text-2xl font-bold shadow-neu-lg ${tutorialNodeStyles[nodeId]}`}>
                              {tutorialNodeValues[nodeId]}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="col-start-5 row-start-3 rounded-2xl bg-green-50 px-2 py-5 text-center shadow-neu">
                <div className="text-xs font-medium text-gray-500">RIGHT</div>
                <div className="text-xl font-bold text-green-700">12</div>
              </div>
              <div className="col-start-2 col-span-3 row-start-5 rounded-2xl bg-red-50 px-4 py-2 text-center shadow-neu">
                <div className="text-xs font-medium text-gray-500">BOTTOM</div>
                <div className="text-2xl font-bold text-red-700">11</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-primary-50 p-4 text-sm leading-6 text-gray-600 shadow-neu">
              Move one card from <span className="font-semibold text-primary-700">B</span> to
              <span className="font-semibold text-primary-700"> J</span>. That lowers the top
              side from 13 to 12 and raises the bottom side from 11 to 12.
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default LandingPage
