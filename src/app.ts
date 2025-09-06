import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './modules/user/user.routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Axiomancer!');
});

export default app;
