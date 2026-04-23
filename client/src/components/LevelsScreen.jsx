import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'

const orbAnimations = [
  { className: 'left-[6%] top-20 h-36 w-36 bg-primary-200/35', duration: 14, x: [0, 18, -10, 0], y: [0, -12, 8, 0] },
  { className: 'right-[8%] top-56 h-48 w-48 bg-emerald-100/65', duration: 16, x: [0, -22, 8, 0], y: [0, 14, -10, 0] }
]

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: 'easeOut' }
  }
}

const levelCopy = (levelNumber, currentLevel, tutorialMode) => {
  if (levelNumber === currentLevel) {
    return {
      title: tutorialMode ? 'Current Lesson' : 'Current Mission',
      subtitle: levelNumber === 1 ? 'Introduction' : `Stage ${levelNumber}`
    }
  }

  if (levelNumber < currentLevel) {
    return {
      title: tutorialMode ? 'Learned' : 'Cleared',
      subtitle:
        levelNumber === 2 ? 'Balance Point' : levelNumber === 3 ? 'The Pivot' : `Stage ${levelNumber}`
    }
  }

  return { title: tutorialMode ? 'Upcoming Lesson' : 'Locked', subtitle: `Stage ${levelNumber}` }
}

const LevelsScreen = ({
  maxLevels,
  tutorialMode = false,
  heading = 'Level Platform',
  subheading = 'Choose the next node on your puzzle route.',
  description = 'The path is centered on your current progress, with quick jump buttons and a cleaner scroll rail. Finished levels stay accessible, while future levels remain locked.'
}) => {
  const navigate = useNavigate()
  const { level, gameStarted } = useGame()
  const scrollContainerRef = useRef(null)
  const currentLevelRef = useRef(null)
  const topRef = useRef(null)
  const bottomRef = useRef(null)

  const levelCap = maxLevels ?? 50
  const currentLevel = gameStarted ? Math.max(1, Math.min(level, levelCap)) : 1

  const levels = useMemo(
    () =>
      Array.from({ length: levelCap }, (_, index) => {
        const levelNumber = index + 1
        const status =
          levelNumber < currentLevel ? 'completed' : levelNumber === currentLevel ? 'current' : 'locked'
        const copy = levelCopy(levelNumber, currentLevel, tutorialMode)

        return {
          id: levelNumber,
          status,
          isLeft: levelNumber % 2 === 0,
          ...copy
        }
      }),
    [currentLevel, levelCap, tutorialMode]
  )

  useEffect(() => {
    const container = scrollContainerRef.current
    const target = currentLevelRef.current
    if (!container || !target) return

    const timer = setTimeout(() => {
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const nextTop =
        container.scrollTop +
        (targetRect.top - containerRect.top) -
        container.clientHeight / 2 +
        target.clientHeight / 2

      container.scrollTo({ top: Math.max(nextTop, 0), behavior: 'smooth' })
    }, 250)

    return () => clearTimeout(timer)
  }, [currentLevel])

  const scrollToRef = (targetRef) => {
    const container = scrollContainerRef.current
    const target = targetRef.current
    if (!container || !target) return

    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextTop =
      container.scrollTop +
      (targetRect.top - containerRect.top) -
      container.clientHeight / 2 +
      target.clientHeight / 2

    container.scrollTo({ top: Math.max(nextTop, 0), behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(238,247,244,0.95)_40%,_rgba(224,238,233,0.92)_100%)]">
      <div className="pointer-events-none absolute inset-0">
        {orbAnimations.map((orb, index) => (
          <motion.div
            key={index}
            animate={{ x: orb.x, y: orb.y }}
            transition={{ duration: orb.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            className={`absolute rounded-full blur-3xl ${orb.className}`}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-4 flex flex-col gap-3 rounded-[2rem] border border-white/70 bg-white/75 px-4 py-4 shadow-[0_18px_50px_rgba(37,99,84,0.12)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-700 text-lg font-bold text-white shadow-[0_16px_30px_rgba(31,102,65,0.22)]"
            >
              4
            </button>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-700/70">
                Tactical Serenity
              </div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{heading}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => scrollToRef(topRef)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-neu transition-transform hover:-translate-y-0.5"
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => scrollToRef(currentLevelRef)}
              className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 shadow-neu transition-transform hover:-translate-y-0.5"
            >
              Current Level {currentLevel}
            </button>
            <button
              type="button"
              onClick={() => scrollToRef(bottomRef)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-neu transition-transform hover:-translate-y-0.5"
            >
              Bottom
            </button>
          </div>
        </motion.div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:sticky lg:top-4 lg:h-fit"
          >
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-700/70">
              {tutorialMode ? 'Training Route' : 'Mission Brief'}
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900">
              {subheading}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
                <div className="text-xs uppercase tracking-[0.25em] text-white/60">Current Position</div>
                <div className="mt-2 text-4xl font-bold">{currentLevel}</div>
                <div className="mt-2 text-sm text-white/75">
                  {tutorialMode
                    ? 'Move through the first 12 lessons to learn how each board behaves.'
                    : 'Tap the glowing node to resume immediately.'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-3xl bg-emerald-50 p-4 shadow-neu">
                  <div className="text-2xl font-bold text-emerald-700">{Math.max(0, currentLevel - 1)}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700/70">
                    {tutorialMode ? 'Learned' : 'Cleared'}
                  </div>
                </div>
                <div className="rounded-3xl bg-cyan-50 p-4 shadow-neu">
                  <div className="text-2xl font-bold text-cyan-700">{currentLevel}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-700/70">
                    Current
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4 shadow-neu">
                  <div className="text-2xl font-bold text-slate-700">{levelCap - currentLevel}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    {tutorialMode ? 'Lessons Left' : 'Locked'}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/65 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl"
          >
            <div className="sticky top-0 z-10 border-b border-white/60 bg-white/75 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-700/70">
                    {tutorialMode ? 'Tutorial Route' : 'Route Map'}
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    Levels 1 to {levelCap}
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="smooth-scroll hide-scrollbar relative h-[70vh] overflow-y-auto overscroll-contain px-3 py-6 sm:h-[76vh] sm:px-5"
            >
              <div className="pointer-events-none absolute left-1/2 top-8 bottom-8 w-[5px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100 via-primary-300 to-primary-100 shadow-[0_0_30px_rgba(52,158,99,0.16)]" />
              <div ref={topRef} className="h-1" />

              <div className="relative mx-auto flex max-w-xl flex-col gap-4 py-4">
                {levels.map((item) => {
                  const isLocked = item.status === 'locked'
                  const isCurrent = item.status === 'current'
                  const isCompleted = item.status === 'completed'

                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.2 }}
                      ref={isCurrent ? currentLevelRef : null}
                      className={`relative flex snap-center scroll-mt-28 ${
                        item.isLeft ? 'justify-start pr-[calc(50%+1.25rem)]' : 'justify-end pl-[calc(50%+1.25rem)]'
                      }`}
                    >
                      <motion.button
                        type="button"
                        disabled={isLocked}
                        whileHover={isLocked ? {} : { y: -4, scale: 1.02 }}
                        whileTap={isLocked ? {} : { scale: 0.98 }}
                        onClick={() => navigate(`/loading?level=${item.id}&cap=${levelCap}&tutorial=${tutorialMode ? 1 : 0}`)}
                        className={`group relative w-full max-w-[220px] rounded-[1.6rem] border px-5 py-4 text-left transition-all duration-250 ${
                          isCurrent
                            ? 'border-primary-300 bg-white text-slate-900 shadow-[0_0_0_1px_rgba(52,158,99,0.16),0_18px_40px_rgba(52,158,99,0.18)]'
                            : isCompleted
                              ? 'border-primary-700/10 bg-primary-700 text-white shadow-[0_16px_28px_rgba(31,102,65,0.18)]'
                              : 'border-slate-200/70 bg-white/70 text-slate-400'
                        } ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-[0_20px_38px_rgba(15,23,42,0.12)]'}`}
                      >
                        <div
                          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-white shadow-[0_0_0_6px_rgba(255,255,255,0.55)] ${
                            item.isLeft ? '-right-[2.1rem]' : '-left-[2.1rem]'
                          }`}
                        >
                          <div className={`h-full w-full rounded-full ${isCurrent ? 'bg-primary-500' : isCompleted ? 'bg-emerald-300' : 'bg-slate-300'}`} />
                        </div>

                        <div
                          className={`absolute top-1/2 hidden h-px w-10 -translate-y-1/2 from-primary-200 to-primary-400 sm:block ${
                            item.isLeft ? '-right-10 bg-gradient-to-r' : '-left-10 bg-gradient-to-l'
                          }`}
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${isCompleted ? 'text-white/70' : isCurrent ? 'text-primary-700/70' : 'text-slate-400'}`}>
                              {item.title}
                            </div>
                            <div className={`mt-2 text-4xl font-black leading-none ${isLocked ? 'text-slate-300' : ''}`}>
                              {item.id}
                            </div>
                          </div>

                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${isCurrent ? 'bg-primary-700 text-white' : isCompleted ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {isLocked ? 'L' : isCompleted ? 'OK' : 'GO'}
                          </div>
                        </div>

                        <div className={`mt-4 text-xs font-semibold uppercase tracking-[0.24em] ${isCompleted ? 'text-white/75' : isCurrent ? 'text-slate-500' : 'text-slate-400'}`}>
                          {item.subtitle}
                        </div>

                        {isCurrent && (
                          <motion.div
                            animate={{ opacity: [0.4, 0.95, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-[1.6rem] border border-primary-300/80"
                          />
                        )}
                      </motion.button>
                    </motion.div>
                  )
                })}
              </div>

              <div ref={bottomRef} className="h-8" />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default LevelsScreen
