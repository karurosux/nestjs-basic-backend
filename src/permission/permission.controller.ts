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
import {Permission} from '@prisma/client';
import {Permissions} from 'src/auth/permissions.decorator';
import {Endpoints} from 'src/endpoints';
import {PermissionService} from './permission.service';
import {CreatePermissionDto} from './dto/create-permission.dto';
import {UpdatePermissionDto} from './dto/update-permission.dto';

@Controller(Endpoints.PERMISSION)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  @Permissions({
    ROLE_MANAGEMENT: ['write'],
  })
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get('category')
  @Permissions({
    ROLE_MANAGEMENT: ['read'],
  })
  getPermissionCategories(): Promise<string[]> {
    return this.permissionService.getPermissionsCategories();
  }

  @Get()
  @Permissions({
    ROLE_MANAGEMENT: ['read'],
  })
  getPermissionsByRole(@Query('roleId') roleId: string): Promise<Permission[]> {
    return roleId
      ? this.permissionService.getPermissionsByRole(roleId)
      : Promise.resolve([]);
  }

  @Delete(':id')
  @Permissions({
    ROLE_MANAGEMENT: ['write'],
  })
  deleteById(@Param('id') id: Permission['id']): Promise<void> {
    return this.permissionService.deleteById(id);
  }

  @Patch(':id')
  @Permissions({
    ROLE_MANAGEMENT: ['write'],
  })
  updateById(
    @Param('id') id: Permission['id'],
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.updateById(id, updatePermissionDto);
  }
}
