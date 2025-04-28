import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type product_categoriesDocument = HydratedDocument<product_categories>;

@Schema()
export class product_categories {
  @Prop({
    required: true,
  })
  categoryName: string;
}

export const product_categoriesSchema =
  SchemaFactory.createForClass(product_categories);
