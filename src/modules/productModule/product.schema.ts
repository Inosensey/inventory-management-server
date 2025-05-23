import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Schemas
import { product_categories } from '@modules/productCatModule/productCat.schema';

export type ProductDocument = HydratedDocument<Products>;

@Schema({ timestamps: true })
export class Products {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product_categories',
  })
  category: product_categories;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
