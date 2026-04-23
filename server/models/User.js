import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const gameStateSchema = new mongoose.Schema({
  nodes: {
    A: { type: Number, default: 4 },
    B: { type: Number, default: 2 },
    C: { type: Number, default: 2 },
    D: { type: Number, default: 4 },
    E: { type: Number, default: 2 },
    F: { type: Number, default: 2 },
    G: { type: Number, default: 2 },
    H: { type: Number, default: 2 },
    I: { type: Number, default: 4 },
    J: { type: Number, default: 2 },
    K: { type: Number, default: 2 },
    L: { type: Number, default: 4 }
  },
  moves: { type: Number, default: 0 },
  status: { type: String, enum: ['balanced', 'unbalanced'], default: 'balanced' }
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gameState: {
    type: gameStateSchema,
    default: () => ({})
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)