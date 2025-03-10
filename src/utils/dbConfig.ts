import { Sequelize } from 'sequelize';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// for regular queries
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// sequelize setup
export const sequelize = new Sequelize(connectionString, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  retry: {
    max: 5,
    match: [ // if i get these errors, server will restart
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
    ],
  },
  dialectOptions: {
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  },
});

// PostgreSQL connection pool setup
export const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 3000,
});

// Test connection function
const connectWithRetry = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL');
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Error connecting to PostgreSQL', err);
    setTimeout(connectWithRetry, 5000);  // Retry connection every 5 seconds
  }
};

// Try to connect to PostgreSQL when not in production (for local dev)
if (!isProduction) {
  connectWithRetry();  // Initiates retry connection during app start
}
