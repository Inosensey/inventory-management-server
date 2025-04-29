import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
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
  async getProducts(
    @Query()
    query: {
      currentPage?: string;
      setPageSize?: string;
    },
  ) {
    const result = await this.productService.getProducts(
      query.currentPage,
      query.setPageSize,
    );

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

  @Post('/add-product')
  @UseGuards(RoleGuard)
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

  @Post('/bulk-add-products')
  @UseGuards(RoleGuard)
  async bulkAddProducts(@Body() products: CreateProductDTO[]) {
    const result = await this.productService.bulkCreateProducts(products);
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
  deleteProduct(@Body() body: { productId: string }) {
    const result = this.productService.deleteProduct(body.productId);
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

  @Get('/search-product')
  async searchProduct(
    @Query()
    query: {
      name?: string;
      description?: string;
      currentPage?: string;
      setPageSize?: string;
    },
  ) {
    const result = await this.productService.searchProduct(
      query.name || '',
      query.description || '',
      query.currentPage,
      query.setPageSize,
    );
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
}
