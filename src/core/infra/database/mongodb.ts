import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from '../../../config/index.js';

let mongod: MongoMemoryServer;

export const connectToDatabase = async () => {
  try {
    // In production, require a real database connection
    if (config.isProduction) {
      if (!config.dbConnection) {
        console.error('🚨 PRODUCTION ERROR: DB_CONNECTION environment variable is required in production');
        process.exit(1);
      }
      
      console.log('Connecting to production MongoDB...');
      await mongoose.connect(config.dbConnection);
      console.log('✅ Successfully connected to production MongoDB');
      return;
    }
    
    // Development: Use in-memory MongoDB if DB_CONNECTION is not set
    if (!config.dbConnection) {
      console.log('🔧 Development mode: Starting MongoDB Memory Server...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ Successfully connected to MongoDB Memory Server');
    } else {
      console.log('🔧 Development mode: Connecting to provided database...');
      await mongoose.connect(config.dbConnection);
      console.log('✅ Successfully connected to MongoDB');
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    
    // In production, don't fall back to memory server
    if (config.isProduction) {
      console.error('🚨 PRODUCTION ERROR: Cannot connect to database. Exiting...');
      process.exit(1);
    }
    
    // Development fallback
    console.log('🔧 Development fallback: Starting MongoDB Memory Server...');
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ Successfully connected to MongoDB Memory Server (fallback)');
    } catch (memoryError) {
      console.error('❌ Failed to start MongoDB Memory Server:', memoryError);
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
