import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDTO, UserListResponseDto } from './user.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('getUserById', () => {
    it('should return a user wrapped in UserListResponseDto', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roleId: 'role123',
      };

      jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser as any);

      const result = await controller.getUserById('123');

      expect(result).toBeInstanceOf(UserListResponseDto);
      expect(result.success).toBe(true);
      expect(result.data[0]).toMatchObject({
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roleId: 'role123',
      });
      expect(result.message).toBe('');
    });
  });

  describe('getUsers', () => {
    it('should return users wrapped in UserListResponseDto', async () => {
      const mockUsers = [
        {
          _id: '123',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roleId: 'role123',
        },
        {
          _id: '123',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roleId: 'role123',
        },
      ];
      jest.spyOn(service, 'getUsers').mockResolvedValueOnce(mockUsers as any);

      const result = await controller.getUsers();

      expect(result).toBeInstanceOf(UserListResponseDto);
      expect(result.success).toBe(true);
      expect(result.message).toBe('');
      expect(result.data[0]).toMatchObject([
        {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roleId: 'role123',
        },
        {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roleId: 'role123',
        },
      ]);
    });
  });

  describe('addUsers', () => {
    it('should create a user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'JohnDoe123',
        password: 'JohnDoe123',
        email: 'JohnDoe123@gmail.com',
        roleId: '680b6b9d3e1a8056021603ce',
      };
      const resultUser = {
        _id: '680ba297b6010171fed1af2g',
        firstName: 'John',
        lastName: 'Doe',
        username: 'JohnDoe123',
        email: 'JohnDoe123@gmail.com',
        roleId: '680b6b9d3e1a8056021603ce',
      };

      jest.spyOn(service, 'signUp').mockResolvedValueOnce(resultUser as any);

      const result = await controller.createUser(newUser);
      expect(result).toBeInstanceOf(UserListResponseDto);
      expect(result.success).toBe(true);
      expect(result.data[0]).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        username: 'JohnDoe123',
        email: 'JohnDoe123@gmail.com',
        roleId: '680b6b9d3e1a8056021603ce',
      });
    });
  });

  it('should not create a user and should throw a BadRequestException', async () => {
    const newUser: CreateUserDTO = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      email: '',
      roleId: '',
    };

    // Mocking service to throw a BadRequestException
    jest.spyOn(service, 'signUp').mockRejectedValueOnce(
      new BadRequestException({
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
      }),
    );

    await expect(controller.createUser(newUser)).rejects.toThrow(
      BadRequestException,
    );
  });
});
