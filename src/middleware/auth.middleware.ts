import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/schemas/User.schema';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

export interface ExpressRequest extends Request {
  user?: User;
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers['authorization'].split(' ')[1];
    try {
      const decoded = jwt.verify(token, '123456') as { email: string };
      const user = await this.userService.findByEmail(decoded.email);
      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
