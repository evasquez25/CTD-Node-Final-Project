const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./db/connect.js')
const authRouter = require('./routes/auth');
const debtRouter = require('./routes/debtRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const helmet = require('helmet');
const xss = require('xss-clean');

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}))
app.use(express.json())
app.use(helmet());
app.use(xss());

// Production security settings
if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
}


// Auth routes
app.use('/api/auth', authRouter);

// Debt routes
app.use('/api/debts', debtRouter);

// Payment routes
app.use('/api/payments', paymentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

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
