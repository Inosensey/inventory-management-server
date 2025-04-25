import { Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsMongoId,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsMongoId()
  roleId: string;
}

export class UpdateUserDTO {
  @IsMongoId()
  id: string;

  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsMongoId()
  roleId: string;
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

  @Expose()
  @Transform(({ obj }: { obj: { roleId: string } }) => obj.roleId.toString())
  roleId: string;
}

export class UserListResponseDto {
  @IsBoolean()
  success: boolean;

  @ValidateNested({ each: true })
  @Type(() => SelectUserDTO)
  data: SelectUserDTO[];

  @IsString()
  message: string;
}
