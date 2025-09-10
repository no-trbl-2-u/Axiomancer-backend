import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from '../../../config/index.js';

let mongod: MongoMemoryServer;

export const connectToDatabase = async () => {
  try {
    // Use in-memory MongoDB for development if DB_CONNECTION is not set or connection fails
    if (!config.dbConnection || config.dbConnection.includes('mongodb+srv://')) {
      console.log('Starting MongoDB Memory Server for development...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Successfully connected to MongoDB Memory Server');
    } else {
      await mongoose.connect(config.dbConnection);
      console.log('Successfully connected to MongoDB');
    }
  } catch (_error) {
    console.error('Error occurred:', _error);
    console.log('Falling back to MongoDB Memory Server...');
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Successfully connected to MongoDB Memory Server');
    } catch (memoryError) {
      console.error('Failed to start MongoDB Memory Server:', memoryError);
      process.exit(1);
    }
  }
};

export const disconnectFromDatabase = async () => {
  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
  }
};
