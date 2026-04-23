export const TARGET_SUM = 12

export const INITIAL_NODES = {
  A: 4,
  B: 2,
  C: 2,
  D: 4,
  E: 2,
  F: 2,
  G: 2,
  H: 2,
  I: 4,
  J: 2,
  K: 2,
  L: 4
}

const NODE_SIDES = {
  A: ['top', 'left'],
  B: ['top'],
  C: ['top'],
  D: ['top', 'right'],
  E: ['left'],
  F: ['right'],
  G: ['left'],
  H: ['right'],
  I: ['bottom', 'left'],
  J: ['bottom'],
  K: ['bottom'],
  L: ['bottom', 'right']
}

const CORNERS = new Set(['A', 'D', 'I', 'L'])
const SIDE_KEYS = ['top', 'left', 'bottom', 'right']
const NODE_KEYS = Object.keys(INITIAL_NODES)

const TUTORIAL_EDGE_NODES = ['B', 'C', 'E', 'F', 'G', 'H', 'J', 'K']

const createSeededRandom = (seed) => {
  let state = seed % 2147483647

  if (state <= 0) state += 2147483646

  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

const cloneNodes = (nodes) => ({ ...nodes })

const calculateSideSums = (nodes) => ({
  top: nodes.A + nodes.B + nodes.C + nodes.D,
  left: nodes.A + nodes.E + nodes.G + nodes.I,
  bottom: nodes.I + nodes.J + nodes.K + nodes.L,
  right: nodes.D + nodes.F + nodes.H + nodes.L
})

const analyzeNodes = (nodes) => {
  const sideSums = calculateSideSums(nodes)
  const sideDiffs = Object.fromEntries(SIDE_KEYS.map((side) => [side, sideSums[side] - TARGET_SUM]))
  const imbalanceCount = SIDE_KEYS.filter((side) => sideDiffs[side] !== 0).length
  const maxAbsDiff = Math.max(...SIDE_KEYS.map((side) => Math.abs(sideDiffs[side])))

  return {
    sideSums,
    sideDiffs,
    imbalanceCount,
    maxAbsDiff
  }
}

const createMoveDescriptor = (from, to) => {
  const deltas = { top: 0, left: 0, bottom: 0, right: 0 }

  NODE_SIDES[from].forEach((side) => {
    deltas[side] -= 1
  })

  NODE_SIDES[to].forEach((side) => {
    deltas[side] += 1
  })

  const nonZeroSides = SIDE_KEYS.filter((side) => deltas[side] !== 0)
  const maxAbsDelta = Math.max(...SIDE_KEYS.map((side) => Math.abs(deltas[side])))

  return {
    from,
    to,
    deltas,
    nonZeroSides,
    maxAbsDelta,
    cornerInvolved: CORNERS.has(from) || CORNERS.has(to),
    singleSideShift: nonZeroSides.length === 1 && maxAbsDelta === 1,
    multiSideShift: nonZeroSides.length >= 2
  }
}

const ALL_MOVES = NODE_KEYS.flatMap((from) =>
  NODE_KEYS.filter((to) => to !== from).map((to) => createMoveDescriptor(from, to))
)

const applyMoveToNodes = (nodes, move) => {
  if (nodes[move.from] <= 1) return null

  const nextNodes = cloneNodes(nodes)
  nextNodes[move.from] -= 1
  nextNodes[move.to] += 1
  return nextNodes
}

const applySequence = (sequence) => {
  let nodes = cloneNodes(INITIAL_NODES)
  const history = []

  for (const [from, to] of sequence) {
    const descriptor = createMoveDescriptor(from, to)
    const nextNodes = applyMoveToNodes(nodes, descriptor)

    if (!nextNodes) return null

    nodes = nextNodes
    history.push(descriptor)
  }

  return { nodes, history }
}

const isImmediateReverse = (move, previousMove) =>
  previousMove && move.from === previousMove.to && move.to === previousMove.from

const pickOne = (items, random) => items[Math.floor(random() * items.length)]

const getDifficultyConfig = (level) => {
  if (level <= 15) {
    return {
      name: 'Easy',
      minMoves: level <= 8 ? 1 : 2,
      maxMoves: 2,
      allowMove: (move) => move.singleSideShift,
      validate: ({ imbalanceCount, maxAbsDiff, history, sideDiffs }) => {
        const positiveOneSideOnly = Object.values(sideDiffs).every((value) => value >= 0 && value <= 1)

        return (
          history.length >= 1 &&
          history.length <= 2 &&
          imbalanceCount >= 1 &&
          imbalanceCount <= 2 &&
          maxAbsDiff <= 1 &&
          positiveOneSideOnly &&
          history.every((move) => move.singleSideShift)
        )
      }
    }
  }

  if (level <= 35) {
    return {
      name: 'Medium',
      minMoves: 3,
      maxMoves: 4,
      allowMove: (move) => move.singleSideShift || move.multiSideShift,
      validate: ({ imbalanceCount, maxAbsDiff, history, sideDiffs }) => {
        const positiveRange = Object.values(sideDiffs).every((value) => value >= 0 && value <= 3)

        return (
          history.length >= 3 &&
          history.length <= 4 &&
          imbalanceCount >= 2 &&
          maxAbsDiff >= 2 &&
          maxAbsDiff <= 3 &&
          positiveRange &&
          history.some((move) => move.multiSideShift || move.cornerInvolved)
        )
      }
    }
  }

  return {
    name: 'Hard',
    minMoves: 5,
    maxMoves: 6,
    allowMove: (move) => move.cornerInvolved || move.multiSideShift,
    validate: ({ imbalanceCount, maxAbsDiff, history, sideDiffs }) => {
      const positiveRange = Object.values(sideDiffs).every((value) => value >= 0 && value <= 5)

      return (
        history.length >= 5 &&
        history.length <= 6 &&
        imbalanceCount >= 3 &&
        maxAbsDiff >= 2 &&
        positiveRange &&
        history.filter((move) => move.cornerInvolved).length >= 2 &&
        history.some((move) => move.nonZeroSides.length >= 3)
      )
    }
  }
}

const summarizePuzzle = (difficulty, history, analysis, extra = {}) => ({
  difficulty: difficulty.name,
  optimalMoves: history.length,
  scrambleMoves: history.length,
  sideDiffs: analysis.sideDiffs,
  affectedSides: analysis.imbalanceCount,
  maxImbalance: analysis.maxAbsDiff,
  ...extra
})

const summarizeTutorialPuzzle = (level, history, analysis) => {
  return {
    difficulty: 'Tutorial',
    optimalMoves: history.length,
    scrambleMoves: history.length,
    sideDiffs: analysis.sideDiffs,
    affectedSides: analysis.imbalanceCount,
    maxImbalance: analysis.maxAbsDiff,
    tutorial: true
  }
}

const generateAttempt = (difficulty, random) => {
  const targetMoveCount =
    difficulty.minMoves + Math.floor(random() * (difficulty.maxMoves - difficulty.minMoves + 1))

  let nodes = cloneNodes(INITIAL_NODES)
  const history = []

  for (let step = 0; step < targetMoveCount; step += 1) {
    const previousMove = history[history.length - 1]
    const validMoves = ALL_MOVES.filter(
      (move) =>
        nodes[move.from] > 1 &&
        !isImmediateReverse(move, previousMove) &&
        difficulty.allowMove(move)
    )

    if (validMoves.length === 0) return null

    const move = pickOne(validMoves, random)
    const nextNodes = applyMoveToNodes(nodes, move)

    if (!nextNodes) return null

    nodes = nextNodes
    history.push(move)
  }

  const analysis = analyzeNodes(nodes)
  if (analysis.imbalanceCount === 0 || !difficulty.validate({ ...analysis, history })) return null

  return {
    nodes,
    meta: summarizePuzzle(difficulty, history, analysis)
  }
}

const createFallbackPuzzle = (difficulty, level) => {
  const templates = {
    Easy: [['B', 'A'], ['J', 'I']],
    Medium: [['B', 'A'], ['K', 'L'], ['E', 'A']],
    Hard: [['A', 'F'], ['J', 'I'], ['C', 'D'], ['L', 'H'], ['E', 'A']]
  }

  const applied = applySequence(templates[difficulty.name])
  const nodes = applied?.nodes ?? cloneNodes(INITIAL_NODES)
  const history = applied?.history ?? []
  const analysis = analyzeNodes(nodes)

  return {
    nodes,
    meta: {
      ...summarizePuzzle(difficulty, history, analysis),
      fallback: true,
      level
    }
  }
}

export const generateTutorialPuzzle = (level) => {
  const safeLevel = Math.max(1, Math.min(level, 12))
  const random = createSeededRandom(safeLevel * 1613 + 29)
  const history = []
  let nodes = cloneNodes(INITIAL_NODES)

  for (let step = 0; step < safeLevel; step += 1) {
    const targetNode = TUTORIAL_EDGE_NODES[Math.floor(random() * TUTORIAL_EDGE_NODES.length)]
    nodes[targetNode] += 1
    history.push({
      to: targetNode,
      addedCard: true
    })
  }

  const analysis = analyzeNodes(nodes)

  return {
    nodes,
    meta: summarizeTutorialPuzzle(safeLevel, history, analysis)
  }
}

export const generatePuzzleForLevel = (level, options = {}) => {
  if (options.tutorialMode) {
    return generateTutorialPuzzle(level)
  }

  const difficulty = getDifficultyConfig(level)
  const random = createSeededRandom(level * 7919 + 17)

  for (let attempt = 0; attempt < 600; attempt += 1) {
    const generated = generateAttempt(difficulty, random)
    if (generated) return generated
  }

  return createFallbackPuzzle(difficulty, level)
}
