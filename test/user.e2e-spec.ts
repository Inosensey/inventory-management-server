import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UserModule } from './../src/modules/userModule/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateUserDTO } from '@modules/userModule/user.dto';
import { useContainer } from 'class-validator';
import { AllExceptionsFilter } from 'src/ExceptionFilter';
import * as cookieParser from 'cookie-parser';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let newUser: CreateUserDTO;
  let cookie: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          `mongodb+srv://dingcongbae:IBfqfA14eAId3SzL@inventory-management.b88yifl.mongodb.net/inventory-management?retryWrites=true&w=majority&appName=inventory-management`,
        ),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    useContainer(app.select(UserModule), { fallbackOnErrors: true });
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

  it('(url: /users) (GET) returns all users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
      });
  });

  it('url: /users/:id (GET) returns user by id', () => {
    return request(app.getHttpServer())
      .get('/users/680ba297b6010171fed1af2e')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
      });
  });
  it('url: /users/{wrongUserId} (GET) should not return a user', () => {
    return request(app.getHttpServer())
      .get('/users/680ba297b6010171fed1af2a')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data', [null]);
        expect(res.body).toHaveProperty('message', '');
      });
  });

  it('url: /users/sign-up (POST) should create a new user', () => {
    newUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'JohnDoe123',
      password: 'JohnDoe123',
      email: 'JohnDoe123@gmail.com',
      roleId: '680b6b9d3e1a8056021603ce',
    };

    request(app.getHttpServer())
      .post('/users/sign-up')
      .send(newUser)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
        // isNewUserCreated = true;
      });

    return request(app.getHttpServer())
      .delete('/users/delete-user')
      .send({ email: newUser.email })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', '');
      });
  });

  it('url: /users/sign-up (POST) should not create a new user and return validation errors', () => {
    const user: CreateUserDTO = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      email: '',
      roleId: '',
    };

    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('data', {
          error: 'Bad Request',
          message: [
            'username should not be empty',
            'password should not be empty',
            'email must be an email',
            'email should not be empty',
            'firstName should not be empty',
            'lastName should not be empty',
            'roleId must be a mongodb id',
            'roleId should not be empty',
          ],
          statusCode: 400,
        });
        expect(res.body).toHaveProperty(
          'message',
          'Bad request: Bad Request Exception',
        );
      });
  });

  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
  });
});
