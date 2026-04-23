import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className="bg-gray-100 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="grid grid-cols-2 gap-1 w-8 h-8">
              <div className="neu-card bg-primary-600 flex items-center justify-center text-white text-xs font-bold rounded">4</div>
              <div className="neu-card bg-primary-400 flex items-center justify-center text-white text-xs font-bold rounded">2</div>
              <div className="neu-card bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold rounded">2</div>
              <div className="neu-card bg-primary-500 flex items-center justify-center text-white text-xs font-bold rounded">4</div>
            </div>
            <h1 className="text-xl font-bold text-primary-700">Square Card Balance</h1>
          </div>

          {/* Game Info */}
          <div className="flex items-center space-x-4">
            <span className="hidden text-gray-600 sm:inline">Welcome to the game!</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="rounded-xl bg-white px-4 py-2 font-medium text-primary-700 shadow-neu transition-colors hover:bg-gray-50"
            >
              Home
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
