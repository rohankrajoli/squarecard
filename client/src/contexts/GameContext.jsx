import { createContext, useContext, useEffect, useState } from 'react'
import { generatePuzzleForLevel, INITIAL_NODES, TARGET_SUM } from '../utils/puzzleGenerator'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

const ABSOLUTE_MAX_LEVEL = 50

const hasMinimumOneCardPerNode = (nodeMap) =>
  Object.values(nodeMap).every((value) => value >= 1)

const defaultPuzzleMeta = {
  difficulty: 'Easy',
  optimalMoves: 1,
  scrambleMoves: 1,
  sideDiffs: { top: 0, left: 0, bottom: 0, right: 0 },
  affectedSides: 0,
  maxImbalance: 0,
  tutorial: false
}

const getScoringConfig = (difficulty, tutorialMode) => {
  if (tutorialMode || difficulty === 'Tutorial' || difficulty === 'Easy') {
    return { baseScore: 100, penalty: 10 }
  }

  if (difficulty === 'Medium') {
    return { baseScore: 200, penalty: 15 }
  }

  return { baseScore: 300, penalty: 20 }
}

export const GameProvider = ({ children }) => {
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [isBalanced, setIsBalanced] = useState(true)
  const [isProcessingMove, setIsProcessingMove] = useState(false)
  const [level, setLevel] = useState(1)
  const [maxLevel, setMaxLevel] = useState(ABSOLUTE_MAX_LEVEL)
  const [tutorialMode, setTutorialMode] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [levelStartNodes, setLevelStartNodes] = useState(INITIAL_NODES)
  const [puzzleMeta, setPuzzleMeta] = useState(defaultPuzzleMeta)

  const persistGameState = ({
    nodes: nodesToSave,
    moves: movesToSave,
    gameStarted: gameStartedToSave,
    level: levelToSave,
    maxLevel: maxLevelToSave,
    tutorialMode: tutorialModeToSave,
    totalScore: totalScoreToSave,
    levelStartNodes: levelStartNodesToSave,
    puzzleMeta: puzzleMetaToSave
  }) => {
    localStorage.setItem(
      'gameState',
      JSON.stringify({
        nodes: nodesToSave,
        moves: movesToSave,
        gameStarted: gameStartedToSave,
        level: levelToSave,
        maxLevel: maxLevelToSave,
        tutorialMode: tutorialModeToSave,
        totalScore: totalScoreToSave,
        levelStartNodes: levelStartNodesToSave,
        puzzleMeta: puzzleMetaToSave
      })
    )
  }

  const calculateSideSum = (side) => {
    switch (side) {
      case 'top':
        return nodes.A + nodes.B + nodes.C + nodes.D
      case 'left':
        return nodes.A + nodes.E + nodes.G + nodes.I
      case 'bottom':
        return nodes.I + nodes.J + nodes.K + nodes.L
      case 'right':
        return nodes.D + nodes.F + nodes.H + nodes.L
      default:
        return 0
    }
  }

  const getTargetSum = () => TARGET_SUM

  const getLevelScore = (playerMoves = moves, meta = puzzleMeta, useTutorialMode = tutorialMode) => {
    const optimalMoves = meta.optimalMoves ?? meta.scrambleMoves ?? 1
    const extraMoves = Math.max(0, playerMoves - optimalMoves)
    const scoring = getScoringConfig(meta.difficulty, useTutorialMode)

    return Math.max(0, scoring.baseScore - extraMoves * scoring.penalty)
  }

  const checkBalance = () => {
    const targetSum = getTargetSum()
    const sides = ['top', 'left', 'bottom', 'right']
    return sides.every((side) => calculateSideSum(side) === targetSum)
  }

  const applyMove = (fromNode, toNode) => {
    if (isProcessingMove) return false

    if (nodes[fromNode] > 1 && fromNode !== toNode) {
      setIsProcessingMove(true)

      const newNodes = {
        ...nodes,
        [fromNode]: nodes[fromNode] - 1,
        [toNode]: nodes[toNode] + 1
      }

      const newMoves = moves + 1

      setNodes(newNodes)
      setMoves(newMoves)

      persistGameState({
        nodes: newNodes,
        moves: newMoves,
        gameStarted: true,
        level,
        maxLevel,
        tutorialMode,
        totalScore,
        levelStartNodes,
        puzzleMeta
      })

      setTimeout(() => {
        setIsProcessingMove(false)
      }, 100)

      return true
    }

    return false
  }

  const loadGeneratedLevel = (
    selectedLevel,
    levelCap = ABSOLUTE_MAX_LEVEL,
    preservedScore = null,
    useTutorialMode = false
  ) => {
    const safeCap = Math.max(1, Math.min(levelCap, ABSOLUTE_MAX_LEVEL))
    const safeLevel = Math.max(1, Math.min(selectedLevel, safeCap))
    const generatedPuzzle = generatePuzzleForLevel(safeLevel, { tutorialMode: useTutorialMode })
    const seededScore = preservedScore ?? (safeLevel - 1) * 100

    setNodes(generatedPuzzle.nodes)
    setMoves(0)
    setGameStarted(true)
    setLevel(safeLevel)
    setMaxLevel(safeCap)
    setTutorialMode(useTutorialMode)
    setTotalScore(seededScore)
    setLevelStartNodes(generatedPuzzle.nodes)
    setPuzzleMeta(generatedPuzzle.meta)

    persistGameState({
      nodes: generatedPuzzle.nodes,
      moves: 0,
      gameStarted: true,
      level: safeLevel,
      maxLevel: safeCap,
      tutorialMode: useTutorialMode,
      totalScore: seededScore,
      levelStartNodes: generatedPuzzle.nodes,
      puzzleMeta: generatedPuzzle.meta
    })
  }

  const startGame = (levelCap = maxLevel, useTutorialMode = tutorialMode) => {
    loadGeneratedLevel(1, levelCap, 0, useTutorialMode)
  }

  const startLevel = (selectedLevel, levelCap = maxLevel, useTutorialMode = tutorialMode) => {
    loadGeneratedLevel(selectedLevel, levelCap, null, useTutorialMode)
  }

  const nextLevel = () => {
    if (!isBalanced || level >= maxLevel) return false

    const levelScore = getLevelScore()
    const newTotalScore = totalScore + levelScore
    loadGeneratedLevel(level + 1, maxLevel, newTotalScore, tutorialMode)
    return true
  }

  const resetGame = () => {
    setNodes(levelStartNodes)
    setMoves(0)
    setGameStarted(true)

    persistGameState({
      nodes: levelStartNodes,
      moves: 0,
      gameStarted: true,
      level,
      maxLevel,
      tutorialMode,
      totalScore,
      levelStartNodes,
      puzzleMeta
    })
  }

  const loadGameState = () => {
    try {
      const savedState = localStorage.getItem('gameState')
      if (!savedState) return

      const {
        nodes: savedNodes,
        moves: savedMoves,
        gameStarted: savedGameStarted,
        level: savedLevel = 1,
        maxLevel: savedMaxLevel = ABSOLUTE_MAX_LEVEL,
        tutorialMode: savedTutorialMode = false,
        totalScore: savedTotalScore = 0,
        levelStartNodes: savedLevelStartNodes = savedNodes,
        puzzleMeta: savedPuzzleMeta
      } = JSON.parse(savedState)

      if (
        hasMinimumOneCardPerNode(savedNodes) &&
        hasMinimumOneCardPerNode(savedLevelStartNodes)
      ) {
        const safeCap = Math.max(1, Math.min(savedMaxLevel, ABSOLUTE_MAX_LEVEL))
        setNodes(savedNodes)
        setMoves(savedMoves)
        setGameStarted(savedGameStarted)
        setLevel(Math.min(savedLevel, safeCap))
        setMaxLevel(safeCap)
        setTutorialMode(savedTutorialMode)
        setTotalScore(savedTotalScore)
        setLevelStartNodes(savedLevelStartNodes)
        setPuzzleMeta(savedPuzzleMeta ?? generatePuzzleForLevel(savedLevel, { tutorialMode: savedTutorialMode }).meta)
      } else {
        localStorage.removeItem('gameState')
      }
    } catch (error) {
      console.error('Failed to load game state:', error)
    }
  }

  const getHint = () => {
    const hints = []
    const nodePositions = {
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

    const targetSum = getTargetSum()

    Object.keys(nodePositions).forEach((node) => {
      if (nodePositions[node].length === 1) {
        const side = nodePositions[node][0]
        const sideSum = calculateSideSum(side)
        if (sideSum !== targetSum) {
          hints.push({
            node,
            side,
            currentSum: sideSum,
            targetSum,
            needed: sideSum > targetSum ? 'remove' : 'add'
          })
        }
      }
    })

    return hints.length > 0 ? hints[0] : null
  }

  useEffect(() => {
    loadGameState()
  }, [])

  useEffect(() => {
    setIsBalanced(checkBalance())
  }, [nodes, level])

  const value = {
    nodes,
    moves,
    gameStarted,
    isBalanced,
    level,
    maxLevel,
    tutorialMode,
    totalScore,
    puzzleMeta,
    getLevelScore,
    calculateSideSum,
    checkBalance,
    applyMove,
    startGame,
    startLevel,
    nextLevel,
    resetGame,
    loadGameState,
    getHint,
    getTargetSum
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
