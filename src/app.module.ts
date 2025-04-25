import { Module, OnApplicationBootstrap } from '@nestjs/common';
import mongoose from 'mongoose';
import { mongooseConfig } from './config/mongoose.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@modules/userModule/user.module';
import { ProductModule } from '@modules/productModule/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mongooseConfig,
    }),
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    mongoose.connection.on('connected', () => {
      console.log('✅ Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  }
}
