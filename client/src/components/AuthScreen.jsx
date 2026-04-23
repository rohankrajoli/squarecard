import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password)
      }

      if (result.success) {
        navigate('/game')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="grid grid-cols-2 gap-1 w-16 h-16 mx-auto mb-4">
            <div className="neu-card bg-primary-600 flex items-center justify-center text-white text-sm font-bold rounded-lg">4</div>
            <div className="neu-card bg-primary-400 flex items-center justify-center text-white text-sm font-bold rounded-lg">2</div>
            <div className="neu-card bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold rounded-lg">2</div>
            <div className="neu-card bg-primary-500 flex items-center justify-center text-white text-sm font-bold rounded-lg">4</div>
          </div>
          <h1 className="text-2xl font-bold text-primary-700">Square Card Balance</h1>
        </div>

        {/* Auth Form */}
        <div className="neu-card p-8">
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-l-xl transition-all ${
                isLogin 
                  ? 'bg-primary-500 text-white shadow-neu-pressed' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-r-xl transition-all ${
                !isLogin 
                  ? 'bg-primary-500 text-white shadow-neu-pressed' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-xl neu-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl neu-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl neu-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-primary-500 text-white rounded-xl neu-button hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthScreen