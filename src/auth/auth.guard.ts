import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {UserService, UserWithPermissions} from 'src/user/user.service';
import {AuthConstants} from './auth.constants';
import {PERMISSIONS_KEY, PermissionsMap} from './permissions.decorator';
import {IS_PUBLIC_KEY} from './public.decorator';
import {SUPER_ADMIN_ONLY_KEY} from './super-admin-only.decorator';
import {RoleType} from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const permissions = this.reflector.getAllAndOverride<PermissionsMap>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );

      const superAdminOnly = this.reflector.getAllAndOverride<boolean>(
        SUPER_ADMIN_ONLY_KEY,
        [context.getHandler(), context.getClass()],
      );

      const payload = await this.jwtService.verifyAsync(token, {
        secret: AuthConstants.JWT_SECRET,
      });
      const user: UserWithPermissions = (await this.userService.findById(
        payload.sub,
        true,
      )) as UserWithPermissions;

      if (superAdminOnly && user?.role.roleType !== RoleType.SUPER_ADMIN) {
        // User is not super admin
        throw new UnauthorizedException();
      }

      this.validatePermissions(user, permissions);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private validatePermissions(
    user: UserWithPermissions,
    permissions: PermissionsMap,
  ) {
    const allowedPermissionKeys = Object.keys(permissions ?? {});

    if (!allowedPermissionKeys?.length) {
      // No permissions required
      return;
    }

    const allowed = allowedPermissionKeys.some((key: string) => {
      const permission = permissions[key];
      const userPermission = user?.role.permissions.find(
        (userPermission) => userPermission.category === key,
      );

      if (!userPermission) {
        // User does not have permission category
        return false;
      }

      return (
        (permission.includes('write') && userPermission.write) ||
        (permission.includes('read') && userPermission.read)
      );
    });

    if (!allowed) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.session?.['token']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
