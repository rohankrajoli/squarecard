import { motion } from 'framer-motion'

const SideIndicator = ({ side, sum }) => {
  const isBalanced = sum === 12
  
  const getSideLabel = () => {
    switch (side) {
      case 'top': return 'Top'
      case 'left': return 'Left'
      case 'bottom': return 'Bottom'
      case 'right': return 'Right'
      default: return side
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
        isBalanced 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-red-100 text-red-700 border border-red-200'
      }`}
    >
      <div className="flex items-center space-x-2">
        <span>{getSideLabel()}:</span>
        <motion.span
          key={sum}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="font-bold"
        >
          {sum}
        </motion.span>
        <span className={`text-xs ${isBalanced ? 'text-green-500' : 'text-red-500'}`}>
          {isBalanced ? '✓' : '✗'}
        </span>
      </div>
    </motion.div>
  )
}

export default SideIndicator