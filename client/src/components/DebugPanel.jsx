import { useGame } from '../contexts/GameContext'

const DebugPanel = () => {
  const { nodes, level, calculateSideSum, getTargetSum, isBalanced } = useGame()

  const targetSum = getTargetSum()
  const topSum = calculateSideSum('top')
  const leftSum = calculateSideSum('left')
  const bottomSum = calculateSideSum('bottom')
  const rightSum = calculateSideSum('right')
  
  const totalCards = Object.values(nodes).reduce((sum, value) => sum + value, 0)

  return (
    <div className="neu-card p-4 bg-yellow-50 border border-yellow-200 text-xs">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <div>Level: {level}</div>
        <div>Target Sum: {targetSum}</div>
        <div>Total Cards: {totalCards}</div>
        <div>Top: {topSum} {topSum === targetSum ? '✓' : '✗'}</div>
        <div>Left: {leftSum} {leftSum === targetSum ? '✓' : '✗'}</div>
        <div>Bottom: {bottomSum} {bottomSum === targetSum ? '✓' : '✗'}</div>
        <div>Right: {rightSum} {rightSum === targetSum ? '✓' : '✗'}</div>
        <div>Is Balanced: {isBalanced ? 'YES' : 'NO'}</div>
        <div className="mt-2 text-gray-600">
          Node Values: {Object.entries(nodes).map(([key, value]) => `${key}:${value}`).join(', ')}
        </div>
      </div>
    </div>
  )
}

export default DebugPanel