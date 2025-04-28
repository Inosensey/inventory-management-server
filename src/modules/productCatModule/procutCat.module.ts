import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { product_categoriesSchema } from './productCat.schema';
import { ProductCatService } from './productCat.service';
import { ProductCatController } from './productCat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product_categories', schema: product_categoriesSchema },
    ]),
  ],
  controllers: [ProductCatController],
  providers: [ProductCatService],
})
export class ProductCatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'product-categories', method: RequestMethod.GET });
  }
}
