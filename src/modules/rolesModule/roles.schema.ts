import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RolesDocument = HydratedDocument<Roles>;

@Schema()
export class Roles {
  @Prop()
  id: number;

  @Prop({
    required: true,
  })
  role_name: string;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
