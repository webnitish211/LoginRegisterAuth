import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route files
import auth from './routes/auth.js';
import reports from './routes/reportRoutes.js';

const app = express();

// --- Middleware Setup ---
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Mount Routes ---
app.use('/api/v1/auth', auth);
app.use('/api/reports', reports);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
