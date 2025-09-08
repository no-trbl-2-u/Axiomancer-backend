import express from 'express';
import cors from 'cors';
import * as helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './modules/user/user.routes.js';
import characterRoutes from './modules/character/character.routes.js';
import gamestateRoutes from './modules/gamestate/gamestate.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import combatRoutes from './modules/combat/combat.routes.js';
import explorationRoutes from './modules/exploration/exploration.routes.js';

const app = express();

app.use(express.json());
app.use(cors());
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
