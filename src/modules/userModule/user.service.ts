import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getUsers() {
    return await this.userModel.find().exec();
  }

  getUserById(id: string) {
    return { id, name: 'John Doe' };
  }

  async createUser(user: CreateUserDTO): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }
}
