import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'products', method: RequestMethod.GET },
      { path: 'products/add-product', method: RequestMethod.POST },
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
