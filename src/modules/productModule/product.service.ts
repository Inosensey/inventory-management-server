import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Products } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateProductDTO,
  SelectProductDTO,
  UpdateProductDTO,
} from './product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Products') private productModel: Model<Products>) {}
  async getProducts(currentPage?: string, setPageSize?: string) {
    const page = currentPage ? parseInt(currentPage) : 1;
    const pageSize = setPageSize ? parseInt(setPageSize) : 10;
    console.log(pageSize);
    const products = (await this.productModel
      .aggregate([
        {
          $lookup: {
            from: 'product_categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
      ])
      .skip((page - 1) * pageSize)
      .limit(pageSize)) as SelectProductDTO[];
    return products;
  }

  async bulkCreateProducts(products: CreateProductDTO[]) {
    try {
      const buildAddProducts = await this.productModel.insertMany(products);
      return buildAddProducts;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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

  async deleteProduct(id: string) {
    try {
      const deletedProduct = await this.productModel.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchProduct(
    search: string,
    description: string,
    currentPage?: string,
    setPageSize?: string,
  ) {
    const page = currentPage ? parseInt(currentPage) : 1;
    const pageSize = setPageSize ? parseInt(setPageSize) : 10;
    try {
      const products = (await this.productModel
        .aggregate([
          {
            $match: {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: description, $options: 'i' } },
              ],
            },
          },
          {
            $lookup: {
              from: 'product_categories',
              localField: 'category',
              foreignField: '_id',
              as: 'categoryInfo',
            },
          },
        ])
        .skip((page - 1) * pageSize)
        .limit(pageSize)) as SelectProductDTO[];
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
