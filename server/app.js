const express = require('express')
const cors = require('cors')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const dotenv = require('dotenv')
const connectDB = require('./db/connect.js')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(cors())
app.use(express.json())

// Database
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions'
})

store.on('error', (error) => {
  console.error('MongoDB session store error:', error)
})

const sessionParams = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: 'strict' }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sessionParams.cookie.secure = true
};

// Session middleware
app.use(session(sessionParams))

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    })
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

start();
