import {User} from '@prisma/client';
import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  roleId: string;

  public static toPartialUser(createUserDto: CreateUserDto): Partial<User> {
    return {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      roleId: createUserDto.roleId,
    };
  }
}
