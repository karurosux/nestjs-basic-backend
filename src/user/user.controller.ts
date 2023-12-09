import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {User} from '@prisma/client';
import {AuthenticatedUser} from 'src/auth/authenticated-user.decorator';
import {Permissions} from 'src/auth/permissions.decorator';
import {Public} from 'src/auth/public.decorator';
import {Endpoints} from 'src/endpoints';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserService, UserWithPermissions} from './user.service';
import {PaginatedDto} from 'src/paginated/dto/paginated.dto';

@Controller(Endpoints.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions({
    USER_MANAGEMENT: ['write'],
  })
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @AuthenticatedUser() user: User,
  ): Promise<User> {
    return this.userService.create(createUserDto, user.branchId);
  }

  @Permissions({
    USER_MANAGEMENT: ['read'],
  })
  @Get()
  async findAll(
    @AuthenticatedUser() user: UserWithPermissions,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('filter') filter: string = '',
  ): Promise<PaginatedDto<UserWithPermissions>> {
    return this.userService.findPaginatedByUser(user, +limit, +page, filter);
  }

  @Public()
  @Get('exist-by-email/:email')
  async findByEmail(@Param('email') email: string): Promise<boolean> {
    return this.userService.findByEmail(email).then((user) => !!user);
  }

  @Get('me')
  me(@AuthenticatedUser() user: UserWithPermissions): UserWithPermissions {
    return user;
  }

  @Permissions({
    USER_MANAGEMENT: ['read'],
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('includePermissions') includePermissions: boolean,
    @AuthenticatedUser() user: UserWithPermissions,
  ): Promise<User> {
    return this.userService.findByIdAndUser(id, user, includePermissions);
  }

  @Permissions({
    USER_MANAGEMENT: ['write'],
  })
  @Patch(':id')
  update(
    @AuthenticatedUser() user: UserWithPermissions,
    @Param('id') id: User['id'],
    @Body() userDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateByIdAndUser(id, user, userDto);
  }

  @Delete(':id')
  deleteById(
    @AuthenticatedUser() user: UserWithPermissions,
    @Param('id') id: User['id'],
  ): Promise<void> {
    return this.userService.deleteByIdAndUser(id, user);
  }
}
