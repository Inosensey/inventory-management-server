import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { ProductSchema } from './product.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'products', method: RequestMethod.GET },
      { path: 'products/search-product', method: RequestMethod.GET },
      { path: 'products/add-product', method: RequestMethod.POST },
      { path: 'products/bulk-add-products', method: RequestMethod.POST },
      {
        path: 'products/update-product',
        method: RequestMethod.PUT,
      },
      {
        path: 'products/delete-product',
        method: RequestMethod.DELETE,
      },
    );
  }
}
