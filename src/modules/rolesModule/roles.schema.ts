import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type User_RolesDocument = HydratedDocument<User_Roles>;

@Schema()
export class User_Roles {
  @Prop({
    required: true,
  })
  roleName: string;
}

export const User_RolesSchema = SchemaFactory.createForClass(User_Roles);
