import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorator/roles.decorator';

@Injectable()
export class RoleGaurd implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('RoleGaurd');
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;
    // if (roles.every((role) => role)) return true;
    // const request = context.switchToHttp().getRequest<Request>();
    return true;
    // return request.isAuthenticated();
  }
}
