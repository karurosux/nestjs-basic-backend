import {PermissionCategory, Role} from '@prisma/client';
import {IsBoolean, IsNotEmpty, IsString} from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  category: PermissionCategory;

  @IsBoolean()
  write: boolean;

  @IsBoolean()
  read: boolean;

  @IsString()
  @IsNotEmpty()
  roleId: Role['id'];
}
