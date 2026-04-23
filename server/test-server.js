import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Test route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is working!' })
})

// Simple auth test
app.post('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth endpoint working', data: req.body })
})

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`)
})