import express from 'express';
import cors from 'cors';
import * as helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import userRoutes from './modules/user/user.routes.js';
import characterRoutes from './modules/character/character.routes.js';
import gamestateRoutes from './modules/gamestate/gamestate.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import combatRoutes from './modules/combat/combat.routes.js';
import explorationRoutes from './modules/exploration/exploration.routes.js';

const app = express();

app.use(express.json());

// Configure CORS with whitelist
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('CORS Origin Check:', {
      origin,
      isProduction: config.isProduction,
      allowedOrigins: config.allowedOrigins,
      nodeEnv: process.env.NODE_ENV
    });
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check explicit allowed origins first
    if (config.allowedOrigins.includes(origin)) {
      console.log('CORS: Origin found in allowed origins');
      return callback(null, true);
    }
    
    // In production, also allow any vercel.app domain (for your deployed frontend)
    if (origin.endsWith('.vercel.app')) {
      console.log('CORS: Allowing vercel.app domain');
      return callback(null, true);
    }
    
    // For development, be more permissive with localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('CORS: Allowing localhost origin');
      return callback(null, true);
    }
    
    console.log('CORS: Origin not allowed:', origin);
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Use CORS with fallback for Vercel deployment issues
app.use(cors(corsOptions));

// Additional CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow all vercel.app domains and localhost
  if (origin && (origin.endsWith('.vercel.app') || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
// Handle helmet's default export in Vercel's build environment
app.use((helmet as any).default ? (helmet as any).default() : (helmet as any)());
app.use(morgan('dev'));

app.use('/api', userRoutes);
app.use('/api', characterRoutes);
app.use('/api', gamestateRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', combatRoutes);
app.use('/api', explorationRoutes);

// Global error handler that ensures CORS headers are set even on errors
app.use((error: any, req: any, res: any, next: any) => {
  const origin = req.headers.origin;
  
  // Always set CORS headers on errors
  if (origin && (origin.endsWith('.vercel.app') || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.error('Global error handler:', error);
  
  // Send error response
  res.status(500).json({
    message: 'Internal server error',
    error: error.message || 'Unknown error'
  });
});

app.get('/', (req, res) => {
  res.send('Hello from Axiomancer!');
});

export default app;
