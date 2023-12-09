import {Role} from '@prisma/client';
import {IsString} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  roleId?: Role['id'];
}
