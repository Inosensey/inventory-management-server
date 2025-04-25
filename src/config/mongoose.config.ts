import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

export const mongooseConfig = (configService: ConfigService) => {
  const uri = configService.get<string>('MONGO_DB_CONNECTION');

  console.log('🌐 Connecting to MongoDB...');

  return {
    uri,
    connectionFactory: (connection: mongoose.Connection) => {
      console.log('✅ Connected to MongoDB');

      connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      return connection;
    },
  };
};
