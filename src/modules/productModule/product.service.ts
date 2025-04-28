import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Products } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Products') private productModel: Model<Products>) {}
  getProducts() {
    return [
      { id: 1, name: 'Product A', price: 100 },
      { id: 2, name: 'Product B', price: 200 },
    ];
  }

  async createProduct(product: CreateProductDTO) {
    try {
      const newProduct = new this.productModel(product);
      return await newProduct.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProduct(product: UpdateProductDTO) {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        product.id,
        product,
      );
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
