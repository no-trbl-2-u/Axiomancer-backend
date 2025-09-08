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
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check explicit allowed origins first
    if (config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In production, also allow any vercel.app domain (for your deployed frontend)
    if (config.isProduction && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
// Handle helmet's default export in Vercel's build environment
app.use((helmet as any).default ? (helmet as any).default() : (helmet as any)());
app.use(morgan('dev'));

app.use('/api', userRoutes);
app.use('/api', characterRoutes);
app.use('/api', gamestateRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', combatRoutes);
app.use('/api', explorationRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Axiomancer!');
});

export default app;
