import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token as string;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ||
          '9c7708264b359ca23c76e30114cf405ec9c6c1c69230acbb1284a578cbe392a7',
      );
      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
