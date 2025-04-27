import { Module } from '@nestjs/common';
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
export class AppModule {}
