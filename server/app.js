const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./db/connect.js')
const authRouter = require('./routes/auth');

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(cors())
app.use(express.json())

// Production security settings
if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
}

// Auth routes
app.use('/api/auth', authRouter);

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
