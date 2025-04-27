import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import {
  IsEmailUniqueConstraint,
  IsUsernameUniqueConstraint,
} from 'src/customValidator/mongodb-input.validator';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, IsUsernameUniqueConstraint, IsEmailUniqueConstraint],
})
export class UserModule {}
