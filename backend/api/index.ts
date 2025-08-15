import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoute from '../src/routes/auth';
import memeRoute from '../src/routes/meme';

// Load environment variables
dotenv.config();

const app = express();

const healthCheck = {
  status: 200,
  message: "OK"
};

// CORS configuration for Vercel
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000', 
    process.env.NEXTAUTH_URL || '',
    /\.vercel\.app$/
  ],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json(healthCheck);
});

// Auth endpoints
app.use('/api/auth', authRoute);

// Meme endpoint
app.use('/api/meme', memeRoute);

// Handle all other routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the Express app as a Vercel function
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};