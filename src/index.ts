import app from './app.js';
import config from './config/index.js';
import { connectToDatabase } from './core/infra/database/mongodb.js';

const startServer = async () => {
  await connectToDatabase();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

startServer();
