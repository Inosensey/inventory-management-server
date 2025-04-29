import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './user.schema';
import { CreateUserDTO, SelectUserDTO, UserCredentialsDTO } from './user.dto';
import { User_Roles } from '@modules/rolesModule/roles.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<Users>,
    @InjectModel('User_Roles') private userRoleModel: Model<User_Roles>,
  ) {}

  async getUsers() {
    return await this.userModel.find().exec();
  }

  async getUserRoles() {
    try {
      const roles = await this.userRoleModel.find().exec();
      return roles;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id }).lean();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signUp(user: CreateUserDTO) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUserInfo: CreateUserDTO = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: hashedPassword,
        roleId: user.roleId,
      };
      const newUser = new this.userModel(newUserInfo);
      return await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signIn(credentials: UserCredentialsDTO) {
    try {
      const user: Array<SelectUserDTO & { _id: string }> =
        await this.userModel.aggregate([
          {
            $match: { email: credentials.email },
          },
          {
            $lookup: {
              from: 'user_roles',
              localField: 'roleId',
              foreignField: '_id',
              as: 'role',
            },
          },
        ]);
      if (!user[0]) {
        throw new NotFoundException('Invalid Credentials!');
      }

      const passwordIsValid = await bcrypt.compare(
        credentials.password,
        user[0].password,
      );

      if (!passwordIsValid) {
        throw new NotFoundException('Invalid Credentials!');
      }

      const token = jwt.sign(
        {
          userId: user[0]._id.toString(),
          roleId:
            user[0].role && user[0].role[0] ? user[0].role[0].roleName : '',
        },
        process.env.JWT_SECRET ||
          '9c7708264b359ca23c76e30114cf405ec9c6c1c69230acbb1284a578cbe392a7',
        { expiresIn: '1d' },
      );

      return { user: user[0], token: token };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUserByEmail(email: string) {
    try {
      const result = await this.userModel.deleteOne({ email: email });
      if (!result.acknowledged) {
        throw new NotFoundException('User not found');
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async isValueUnique(fieldName: keyof Users, value: string) {
    const query = { [fieldName]: value };
    const user = await this.userModel.findOne(query);
    return !user;
  }
}
