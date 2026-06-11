import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

// Ensure environment variables are loaded when this module is imported
dotenv.config();

// If MongoDB SRV DNS resolution is blocked or misconfigured, use public DNS servers.
if (process.env.MONGODB_URI?.startsWith('mongodb+srv://')) {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

export const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not defined. Skipping MongoDB connection. Create a .env in backend/ from .env.example and set MONGODB_URI to enable DB features.');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose v7 no longer requires these options, but leaving for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.warn('Continuing without database connection. Some features will be disabled until MONGODB_URI is configured correctly.');
    return null;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(`Error while disconnecting MongoDB: ${error.message}`);
    // Do not exit process on disconnect failures
  }
};
