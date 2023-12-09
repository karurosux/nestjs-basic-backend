import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {Prisma, Role, RoleType, User} from '@prisma/client';
import {AuthenticatedUser} from 'src/auth/authenticated-user.decorator';
import {Permissions} from 'src/auth/permissions.decorator';
import {Endpoints} from 'src/endpoints';
import {UserWithPermissions} from 'src/user/user.service';
import {CreateRoleDto} from './dto/create-role.dto';
import {RoleService} from './role.service';

@Controller(Endpoints.ROLE)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Permissions({
    ROLE_MANAGEMENT: ['read'],
  })
  @Get()
  findAll(
    @AuthenticatedUser() user: UserWithPermissions,
    @Query('filter') filter = '',
  ): Promise<Role[]> {
    if (user.role?.roleType === RoleType.SUPER_ADMIN) {
      return this.roleService.findAll(filter);
    }

    return this.roleService.findByBranchId(user.branchId, filter);
  }

  @Get(':id')
  @Permissions({
    ROLE_MANAGEMENT: ['read'],
  })
  findById(
    @Param('id') id: Role['id'],
    @AuthenticatedUser() user: UserWithPermissions,
  ): Promise<Prisma.RoleGetPayload<{include: {permissions: true}}>> {
    return this.roleService.findByIdAndUser(id, user);
  }

  @Permissions({
    ROLE_MANAGEMENT: ['write'],
  })
  @Delete(':id')
  async deleteById(
    @Param('id') id: string,
    @AuthenticatedUser() user: UserWithPermissions,
  ): Promise<void> {
    await this.roleService.deleteByIdAndUser(id, user);
  }

  @Permissions({
    ROLE_MANAGEMENT: ['write'],
  })
  @Post()
  async create(
    @Body() role: CreateRoleDto,
    @AuthenticatedUser() user: User,
  ): Promise<Role> {
    return this.roleService.create(role, user.branchId);
  }
}
