import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  dbConnection: process.env.DB_CONNECTION,
  jwtSecret: process.env.JWT_SECRET || 'axiomancer-development-secret-key-change-in-production',
};

export default config;
