import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

// Guards
import { RoleGuard } from 'src/guards/auth.guard';

// Services
import { ProductService } from './product.service';
import {
  CreateProductDTO,
  ProductResponseDto,
  UpdateProductDTO,
} from './product.dto';
import { plainToInstance } from 'class-transformer';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Post('/add-product')
  async addProduct(@Body() product: CreateProductDTO) {
    const result = await this.productService.createProduct(product);

    const response = plainToInstance(
      ProductResponseDto,
      {
        success: true,
        data: [result],
        message: '',
      },
      {
        excludeExtraneousValues: true,
      },
    );

    return response;
  }

  @Put('/update-product')
  @UseGuards(RoleGuard)
  updateProduct(@Body() product: UpdateProductDTO) {
    const result = this.productService.updateProduct(product);
    const response = plainToInstance(
      ProductResponseDto,
      {
        success: true,
        data: [result],
        message: '',
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return response;
  }

  @Delete('/delete-product')
  @UseGuards(RoleGuard)
  deleteProduct(@Param('productId') productId: string) {
    const test = `delete product ${productId}`;
    return test;
  }
}
