// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const { user }: any = context.switchToHttp().getRequest();

    // Check if the user has any of the required roles
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
