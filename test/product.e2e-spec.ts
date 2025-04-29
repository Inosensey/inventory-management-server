import { ProductModule } from '@modules/productModule/product.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { AllExceptionsFilter } from 'src/ExceptionFilter';
import * as request from 'supertest';
import { App } from 'supertest/types';
import * as cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { UserModule } from '@modules/userModule/user.module';
import {
  ProductResponseDto,
  UpdateProductDTO,
} from '@modules/productModule/product.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let cookie: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          `mongodb+srv://dingcongbae:IBfqfA14eAId3SzL@inventory-management.b88yifl.mongodb.net/inventory-management?retryWrites=true&w=majority&appName=inventory-management`,
        ),
        ProductModule,
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    useContainer(app.select(ProductModule), { fallbackOnErrors: true });
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/users/auth/sign-in')
      .send({
        email: 'dingcong.bae@gmail.com',
        password: 'Inosensey/99',
      })
      .expect(200);
    cookie = response.headers['set-cookie'][0];
  });

  it('(url: /products) (GET) returns all products', () => {
    return request(app.getHttpServer())
      .get('/products')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
      });
  });

  it('(url: /products) (GET) should not return all products', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message');
      });
  });

  it('(url: /products/search-product?name=Air) (GET) return all products that has `Air` in there name', () => {
    return request(app.getHttpServer())
      .get('/products/search-product?name=Air')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
      });
  });

  it('(url: /products/search-product?name=Air) (GET) should not return all products', () => {
    return request(app.getHttpServer())
      .get('/products/search-product?name=Air')
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message');
      });
  });

  it('(url: /products/add-product) (POST) should create a new product', async () => {
    const newProduct = {
      name: 'test',
      description: 'test.',
      category: '680f5de726140259831013bb',
      price: 799.99,
    };
    const addProductResult = await request(app.getHttpServer())
      .post('/products/add-product')
      .set('Cookie', cookie)
      .send(newProduct)
      .expect(201);

    expect(addProductResult.body).toHaveProperty('success', true);
    expect(addProductResult.body).toHaveProperty('data');
    expect(addProductResult.body).toHaveProperty('message', '');

    const productId = (addProductResult.body as ProductResponseDto).data[0].id;

    // Delete the test product
    return request(app.getHttpServer())
      .delete('/products/delete-product')
      .set('Cookie', cookie)
      .send({ productId: productId })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
      });
  });

  it('(url: /products/add-product) (POST) should not create a new product', async () => {
    // Auditor account
    const response = await request(app.getHttpServer())
      .post('/users/auth/sign-in')
      .send({
        email: 'dingong.baeaud@gmail.com',
        password: 'Inosensey/99',
      })
      .expect(200);
    const audCookie = response.headers['set-cookie'][0];

    const newProduct = {
      name: 'test99',
      description: 'test99.',
      category: '680f5de726140259831013bb',
      price: 799.99,
    };
    return request(app.getHttpServer())
      .post('/products/add-product')
      .set('Cookie', audCookie)
      .send(newProduct)
      .expect(403)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message');
      });
  });

  it('(url: /products/update-product) (PUT) it should update a product', async () => {
    // Auditor account
    const response = await request(app.getHttpServer())
      .post('/users/auth/sign-in')
      .send({
        email: 'dingong.baeaud@gmail.com',
        password: 'Inosensey/99',
      })
      .expect(200);
    const audCookie = response.headers['set-cookie'][0];

    const productToBeUpdated: UpdateProductDTO = {
      id: '68104430b5f74370fa68e97b',
      name: 'test product 1',
      category: '680f5de726140259831013bb',
      description: 'test description 1.',
      price: 99999999,
    };
    return request(app.getHttpServer())
      .put('/products/update-product')
      .set('Cookie', audCookie)
      .send(productToBeUpdated)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
      });
  });

  it('(url: /products/update-product) (PUT) it should not update a product', async () => {
    const productToBeUpdated: UpdateProductDTO = {
      id: '68104430b5f74370fa68e97b',
      name: 'test product 1',
      category: '680f5de726140259831013bb',
      description: 'test description 1.',
      price: 99999999,
    };
    return request(app.getHttpServer())
      .put('/products/update-product')
      .set('Cookie', cookie)
      .send(productToBeUpdated)
      .expect(403)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message');
      });
  });

  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
  });
});
