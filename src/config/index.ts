import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_CONNECTION', 'JWT_SECRET', 'ALLOWED_ORIGINS'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  dbConnection: process.env.DB_CONNECTION!,
  jwtSecret: process.env.JWT_SECRET!,
  allowedOrigins: process.env.ALLOWED_ORIGINS!.split(',').map(origin => origin.trim()),
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
