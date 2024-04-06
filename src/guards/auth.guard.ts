import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpressRequest } from 'src/middleware/auth.middleware';

@Injectable()
export class AuthGaurd implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('AuthGaurd');
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (request.user) return true;
    else return false;
    // return request.isAuthenticated();
  }
}
