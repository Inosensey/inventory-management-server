import { Body, Controller, Get, Post } from '@nestjs/common';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';

// Service
import { ProductCatService } from './productCat.service';

// Dto
import { ProductCatInfoDTO, ProductCatResponseDto } from './productCat.dto';

@Controller('product-categories')
export class ProductCatController {
  constructor(private readonly ProductCatService: ProductCatService) {}

  @Get()
  async getCategories() {
    const categories = await this.ProductCatService.getCategories();
    const response = plainToInstance(
      ProductCatResponseDto,
      {
        success: true,
        data: [categories],
        message: '',
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return response;
  }

  @Post('/bulk-add-products')
  async bulkAddProducts(@Body() products: ProductCatInfoDTO[]) {
    const productCat = await this.ProductCatService.bulkAddCategories(products);
    const response = plainToInstance(
      ProductCatResponseDto,
      {
        success: true,
        data: [productCat],
        message: 'Products added successfully',
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return response;
  }
}
