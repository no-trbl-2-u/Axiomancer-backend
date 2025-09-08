import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  dbConnection: process.env.DB_CONNECTION,
  jwtSecret: process.env.JWT_SECRET || 'axiomancer-development-secret-key-change-in-production',
  // CORS configuration
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'], // Default for development
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
