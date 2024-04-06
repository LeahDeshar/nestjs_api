import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorator/roles.decorator';
import { ExpressRequest } from 'src/middleware/auth.middleware';

@Injectable()
export class RoleGaurd implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    console.log('RoleGaurd', request.user.role);
    const user = request.user;
    if (roles.every((role) => user.role.includes(role))) {
      return true;
    } else {
      return false;
    }
  }
}
