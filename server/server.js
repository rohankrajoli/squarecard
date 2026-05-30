import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import gameRoutes from './routes/game.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/game', gameRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Square Card Balance API is running!' })
})

// Connect to MongoDB with fallback
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    console.log('Trying to connect to local MongoDB...')

    try {
      await mongoose.connect('mongodb://localhost:27017/square-card-balance')
      console.log('Connected to local MongoDB')
    } catch (localError) {
      console.error('Local MongoDB connection failed:', localError.message)
      console.log('Please install MongoDB or use MongoDB Atlas')
      process.exit(1)
    }
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})