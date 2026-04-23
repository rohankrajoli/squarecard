import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDrag, useDrop } from 'react-dnd'
import { useGame } from '../contexts/GameContext'

const GameNode = ({ nodeId, value, delay = 0 }) => {
  const { applyMove } = useGame()

  const handleDrop = useCallback(
    (item) => {
      if (item.fromNode !== nodeId) {
        applyMove(item.fromNode, nodeId)
      }
    },
    [nodeId, applyMove]
  )

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'card',
      item: { fromNode: nodeId },
      canDrag: value > 1,
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [nodeId, value]
  )

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'card',
      drop: handleDrop,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [handleDrop]
  )

  const dragDropRef = useCallback(
    (node) => {
      drag(node)
      drop(node)
    },
    [drag, drop]
  )

  const getNodeStyle = () => {
    const corners = ['A', 'D', 'I', 'L']
    const isCorner = corners.includes(nodeId)

    let baseClasses =
      'relative flex h-full w-full select-none items-center justify-center rounded-xl text-lg font-bold transition-all duration-200 sm:rounded-2xl sm:text-2xl '

    if (isDragging) {
      baseClasses += 'scale-95 opacity-50 '
    }

    if (isOver && canDrop) {
      baseClasses += 'scale-105 ring-4 ring-primary-300 '
    }

    if (value <= 1) {
      baseClasses += 'cursor-not-allowed bg-gray-200 text-gray-400 '
    } else if (isCorner) {
      baseClasses += 'cursor-pointer bg-primary-600 text-white shadow-neu-lg hover:shadow-neu '
    } else {
      baseClasses += 'cursor-pointer bg-primary-400 text-white shadow-neu hover:shadow-neu-lg '
    }

    return baseClasses
  }

  return (
    <motion.div
      ref={dragDropRef}
      initial={{ opacity: 0, scale: 0.84, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: value > 1 ? 1.04 : 1 }}
      whileTap={{ scale: value > 1 ? 0.96 : 1 }}
      className={getNodeStyle()}
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 sm:-top-5">
        <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-500 sm:px-2 sm:py-1 sm:text-xs">
          {nodeId}
        </span>
      </div>

      <motion.span
        key={value}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.18 }}
      >
        {value}
      </motion.span>

      {value > 1 && !isDragging && (
        <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2">
          <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/20 text-[8px] sm:h-4 sm:w-4 sm:text-[9px]">
            ::
          </div>
        </div>
      )}

      {isOver && canDrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl border-2 border-dashed border-primary-400 bg-primary-200/30 sm:rounded-2xl"
        />
      )}
    </motion.div>
  )
}

export default GameNode
