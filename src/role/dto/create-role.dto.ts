import {Role, RoleType} from '@prisma/client';
import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  public static toPartialRole(role: CreateRoleDto): Partial<Role> {
    return {
      name: role.name,
      roleType: RoleType.COMMON,
    };
  }
}
