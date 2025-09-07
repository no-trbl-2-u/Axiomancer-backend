import mongoose from 'mongoose';
import config from '../../../config/index.js';

export const connectToDatabase = async () => {
  if (!config.dbConnection) {
    throw new Error('DB_CONNECTION must be defined in your environment variables');
  }

  try {
    await mongoose.connect(config.dbConnection);
    console.log('Successfully connected to MongoDB');
  } catch (_error) {
    console.error('Error occurred:', _error);
    process.exit(1);
  }
};
