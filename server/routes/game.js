import express from 'express'
import User from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user's game state
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    res.json({
      message: 'Game state retrieved successfully',
      gameState: user.gameState
    })
  } catch (error) {
    console.error('Get game state error:', error)
    res.status(500).json({ message: 'Server error retrieving game state' })
  }
})

// Save game state
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { nodes, moves, status } = req.body

    // Validation
    if (!nodes || typeof moves !== 'number' || !status) {
      return res.status(400).json({ message: 'Invalid game state data' })
    }

    // Validate nodes structure
    const requiredNodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    const nodeKeys = Object.keys(nodes)
    
    if (!requiredNodes.every(node => nodeKeys.includes(node))) {
      return res.status(400).json({ message: 'Invalid nodes structure' })
    }

    // Validate that every node keeps at least one card
    const nodeValues = Object.values(nodes)
    if (!nodeValues.every(value => typeof value === 'number' && value >= 1)) {
      return res.status(400).json({ message: 'Each node must contain at least one card' })
    }

    // Validate total cards remain constant (should be 32)
    const totalCards = nodeValues.reduce((sum, value) => sum + value, 0)
    if (totalCards !== 32) {
      return res.status(400).json({ message: 'Total cards must remain 32' })
    }

    // Update user's game state
    const user = await User.findById(req.user._id)
    user.gameState = { nodes, moves, status }
    await user.save()

    res.json({
      message: 'Game state saved successfully',
      gameState: user.gameState
    })
  } catch (error) {
    console.error('Save game state error:', error)
    res.status(500).json({ message: 'Server error saving game state' })
  }
})

// Reset game state
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const initialGameState = {
      nodes: {
        A: 4, B: 2, C: 2, D: 4,
        E: 2, F: 2, G: 2, H: 2,
        I: 4, J: 2, K: 2, L: 4
      },
      moves: 0,
      status: 'balanced'
    }

    const user = await User.findById(req.user._id)
    user.gameState = initialGameState
    await user.save()

    res.json({
      message: 'Game state reset successfully',
      gameState: user.gameState
    })
  } catch (error) {
    console.error('Reset game state error:', error)
    res.status(500).json({ message: 'Server error resetting game state' })
  }
})

export default router
