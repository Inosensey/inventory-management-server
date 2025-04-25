import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

// Service
import { UserService } from './user.service';

// Dto
import { CreateUserDTO, SelectUserDTO, UserListResponseDto } from './user.dto';

// Types
import { response, userInfo } from 'src/types/genericTypes';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return plainToInstance(SelectUserDTO, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() user: CreateUserDTO) {
    const result = await this.userService.createUser(user);

    const userInfo: response<userInfo[]> = {
      success: true,
      data: [
        {
          id: result._id instanceof Types.ObjectId ? result._id.toString() : '',
          roleId:
            result.roleId instanceof Types.ObjectId
              ? result.roleId.toString()
              : '',
          email: result.email,
          username: result.username,
          firstName: result.firstName,
          lastName: result.lastName,
        },
      ],
      message: '',
    };

    return plainToInstance(UserListResponseDto, userInfo, {
      excludeExtraneousValues: true,
    });
  }
}
