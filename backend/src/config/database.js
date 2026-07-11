import dotenv from 'dotenv';

dotenv.config();

export const connectDatabase = async () => {
  console.log('Using file-backed storage for local deployment. No external database required.');
  return { connected: true };
};

export const disconnectDatabase = async () => {
  console.log('File-backed storage disconnected');
};
