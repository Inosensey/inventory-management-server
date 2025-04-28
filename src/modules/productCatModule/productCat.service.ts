import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { product_categories } from './productCat.schema';
import { ProductCatInfoDTO } from './productCat.dto';
@Injectable()
export class ProductCatService {
  constructor(
    @InjectModel('product_categories')
    private productCatModel: Model<product_categories>,
  ) {}

  async getCategories() {
    try {
      const categories = await this.productCatModel.find().lean();
      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async bulkAddCategories(products: ProductCatInfoDTO[]) {
    try {
      const buildAddProducts = await this.productCatModel.insertMany(products);
      return buildAddProducts;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
