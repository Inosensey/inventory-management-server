import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/userModule/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string) {
    return this.userService.isValueUnique('email', email);
  }

  defaultMessage(args: ValidationArguments) {
    return `Email ${args.value} already exists`;
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernameUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  async validate(username: string) {
    return this.userService.isValueUnique('username', username);
  }

  defaultMessage(args: ValidationArguments) {
    return `Username ${args.value} already exists`;
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailUniqueConstraint,
    });
  };
}

export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUsernameUniqueConstraint,
    });
  };
}
