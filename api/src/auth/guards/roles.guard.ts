import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { map, Observable } from 'rxjs';
import { IUser } from '../../user/models/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user: IUser = request.user.user;

    return this.userService.findUser(user.id).pipe(
      map((user: IUser) => {
        const hasRole = roles.includes(user.role);
        let hasPermission = false;

        if (hasRole) {
          hasPermission = true;
        }

        return user && hasPermission;
      })
    );
  }
}
