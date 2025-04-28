import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';

// Service
import { UserService } from './user.service';

// Dto
import {
  CreateUserDTO,
  UserCredentialsDTO,
  UserListResponseDto,
} from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    const response = plainToInstance(
      UserListResponseDto,
      {
        success: true,
        data: [users],
        message: '',
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return response;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    const response = plainToInstance(
      UserListResponseDto,
      {
        success: true,
        data: [user],
        message: '',
      },
      {
        excludeExtraneousValues: true,
      },
    );

    return response;
  }

  @Post('/sign-up')
  async createUser(
    @Body()
    user: CreateUserDTO,
  ) {
    const result = await this.userService.signUp(user);

    const response = plainToInstance(
      UserListResponseDto,
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

  @Post('auth/sign-in')
  async signInUser(
    @Body() credentials: UserCredentialsDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.signIn(credentials);

    response.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 3600000,
    });

    const resultDTO = plainToInstance(
      UserListResponseDto,
      {
        success: true,
        data: [result.user],
        message: '',
        token: result.token,
      },
      {
        excludeExtraneousValues: true,
      },
    );

    return resultDTO;
  }

  @Post('auth/sign-out')
  signOutUser(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    const result = plainToInstance(
      UserListResponseDto,
      {
        success: true,
        data: [],
        message: 'User signed out successfully',
      },
      {
        excludeExtraneousValues: true,
      },
    );

    return result;
  }

  @Delete('/delete-user')
  async deleteUserByEmail(@Body('email') email: string) {
    const result = await this.userService.deleteUserByEmail(email);
    const response = plainToInstance(
      UserListResponseDto,
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
