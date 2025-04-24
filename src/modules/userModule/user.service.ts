import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserById(id: string) {
    return { id, name: 'John Doe' };
  }
}
