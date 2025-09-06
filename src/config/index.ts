import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbConnection: process.env.DB_CONNECTION,
};

export default config;
