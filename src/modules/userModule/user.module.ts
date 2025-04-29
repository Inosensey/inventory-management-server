import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import {
  IsEmailUniqueConstraint,
  IsUsernameUniqueConstraint,
} from 'src/customValidator/mongodb-input.validator';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { User_RolesSchema } from '@modules/rolesModule/roles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'User_Roles', schema: User_RolesSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, IsUsernameUniqueConstraint, IsEmailUniqueConstraint],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
