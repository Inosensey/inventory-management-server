import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsMongoId,
  IsBoolean,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import {
  IsEmailUnique,
  IsUsernameUnique,
} from '../../customValidator/mongodb-input.validator';

export class CreateUserDTO {
  @IsUsernameUnique()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmailUnique()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsMongoId()
  roleId: string;
}

export class UserCredentialsDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDTO {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsMongoId()
  roleId: string;
}

class RoleDTO {
  @Expose()
  roleName: string;
}

export class SelectUserDTO {
  @Expose()
  @Transform(({ obj }: { obj: { _id: string } }) => obj._id.toString())
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Exclude()
  password: string;

  @Expose()
  @Transform(({ obj }: { obj: { roleId: string } }) => obj.roleId.toString())
  roleId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RoleDTO)
  @Expose()
  role?: RoleDTO[];
}

export class UserListResponseDto {
  @Expose()
  @IsBoolean()
  success: boolean;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => SelectUserDTO)
  data: SelectUserDTO[];

  @Expose()
  @IsString()
  message: string;

  @Expose()
  @IsOptional()
  @IsString()
  token?: string;
}
