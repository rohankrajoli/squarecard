# Square Card Balance

A full-stack puzzle game built with React.js, Node.js, and MongoDB. Balance cards across a 4x4 grid where each side must equal 12 cards.

## 🎯 Game Concept

The game features a square puzzle with 12 nodes arranged in a 4x4 grid:
```
[A]---[B]---[C]---[D]
 |               |
[E]             [F]
 |               |
[G]             [H]
 |               |
[I]---[J]---[K]---[L]
```

### Rules
- Each side must equal 12 cards:
  - Top: A + B + C + D = 12
  - Left: A + E + G + I = 12
  - Bottom: I + J + K + L = 12
  - Right: D + F + H + L = 12
- Corners start with 4 cards, edges with 2 cards
- Drag cards between nodes to rebalance after random imbalance

## 🚀 Features

- **Neumorphism UI Design** - Soft, modern interface with subtle shadows
- **Drag & Drop Gameplay** - Intuitive card movement between nodes
- **Real-time Balance Checking** - Instant feedback on side totals
- **JWT Authentication** - Secure user registration and login
- **Auto-save Progress** - Game state persists across sessions
- **Hint System** - Strategic suggestions for optimal moves
- **Smooth Animations** - Framer Motion powered transitions

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS (Neumorphism styling)
- Framer Motion (animations)
- React DnD (drag and drop)
- React Router (navigation)
- Axios (API calls)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd square-card-balance
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in `server/.env`

4. **Configure environment variables**
   ```bash
   # server/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/square-card-balance
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This runs both frontend (port 3000) and backend (port 5000) concurrently.

## 🎮 How to Play

1. **Register/Login** - Create an account or sign in
2. **Start Game** - Click "Start Game" to add random imbalance
3. **Drag Cards** - Move cards between nodes to balance all sides
4. **Check Progress** - Monitor side totals in real-time
5. **Use Hints** - Get strategic suggestions when stuck
6. **Win** - Balance all four sides to 12 cards each

## 🏗️ Project Structure

```
square-card-balance/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth, Game)
│   │   └── main.jsx        # App entry point
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── server.js           # Server entry point
└── package.json            # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Game
- `GET /api/game` - Get user's game state
- `POST /api/game/save` - Save game state
- `POST /api/game/reset` - Reset game to initial state

## 🎨 Design Features

- **Neumorphism Style** - Soft UI with inset/outset shadows
- **Responsive Layout** - Works on desktop and mobile
- **Color Scheme** - Primary green with gray neutrals
- **Smooth Animations** - Spring-based transitions
- **Visual Feedback** - Hover states and drag indicators

## 🔒 Security

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## 📱 Responsive Design

The game adapts to different screen sizes:
- Desktop: Side-by-side game board and control panel
- Mobile: Stacked layout with touch-friendly controls

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy with Node.js buildpack
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- Multiplayer mode
- Leaderboards
- Different difficulty levels
- Sound effects
- Mobile app version
- Tournament system