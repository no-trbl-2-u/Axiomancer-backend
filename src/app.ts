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

// NUCLEAR CORS SOLUTION - Allow everything in production until we debug
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  // Strict CORS for development
  const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
  app.use(cors(corsOptions));
} else {
  // PERMISSIVE CORS for production debugging
  console.log('🚨 PRODUCTION MODE: Using permissive CORS for debugging');
  app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));
}

// ADDITIONAL CORS HEADERS - Nuclear option
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers manually as backup
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle all OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    console.log('🚀 Handling OPTIONS request for:', req.url);
    return res.status(200).end();
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
  
  console.error('🚨 GLOBAL ERROR HANDLER TRIGGERED:');
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request origin:', origin);
  console.error('Error details:', error);
  console.error('Error stack:', error.stack);
  
  // ALWAYS set CORS headers on errors
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Send error response with CORS headers
  res.status(500).json({
    message: 'Internal server error',
    error: error.message || 'Unknown error',
    url: req.url,
    method: req.method
  });
});

app.get('/', (req, res) => {
  res.send('Hello from Axiomancer!');
});

export default app;
