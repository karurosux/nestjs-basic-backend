import {SetMetadata} from '@nestjs/common';
import {PermissionCategory} from '@prisma/client';

export type PermissionsMap = Partial<
  Record<PermissionCategory, Array<'write' | 'read'>>
>;
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (permissions: PermissionsMap) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
