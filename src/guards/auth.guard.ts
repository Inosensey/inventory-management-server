import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

// Types
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    roleId: string;
  };
}

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;
    const method = request.method;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    if (method === 'PUT') {
      if (user.roleId !== 'Admin') {
        throw new ForbiddenException('Only Admins can update a product.');
      }
    }

    if (method === 'DELETE') {
      if (user.roleId !== 'Auditor') {
        throw new ForbiddenException('Only Auditor can delete a product.');
      }
    }

    return true;
  }
}
