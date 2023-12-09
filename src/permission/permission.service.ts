import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Permission, PermissionCategory, RoleType} from '@prisma/client';
import {PrismaService} from 'src/prisma/prisma.service';
import {CreatePermissionDto} from './dto/create-permission.dto';
import {HttpErrorByCode} from '@nestjs/common/utils/http-error-by-code.util';
import {UpdatePermissionDto} from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prismaService: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const foundPermission = await this.prismaService.permission.findFirst({
      where: {
        AND: [
          {
            roleId: createPermissionDto.roleId,
            category: createPermissionDto.category,
          },
        ],
      },
    });

    if (foundPermission) {
      throw new HttpException('ALREADY_EXISTS', HttpStatus.CONFLICT);
    }

    return this.prismaService.permission.create({
      data: createPermissionDto,
    });
  }

  async getPermissionsCategories(): Promise<string[]> {
    return [
      PermissionCategory.BRANCH_MANAGEMENT,
      PermissionCategory.USER_MANAGEMENT,
      PermissionCategory.ROLE_MANAGEMENT,
      PermissionCategory.CUSTOMER_MANAGEMENT,
    ];
  }

  getPermissionsByRole(roleId: string): Promise<Permission[]> {
    return this.prismaService.permission.findMany({
      orderBy: {
        category: 'asc',
      },
      where: {
        roleId,
      },
    });
  }

  async deleteById(id: Permission['id']): Promise<void> {
    const permission = await this.prismaService.permission.findFirst({
      include: {
        role: true,
      },
      where: {
        id,
      },
    });

    if (
      permission.role?.roleType === RoleType.SUPER_ADMIN &&
      permission.category === PermissionCategory.ROLE_MANAGEMENT
    ) {
      // Silently not delete permission, this to prevent  closing the same place where role
      // permissions is being edited.
      return;
    }

    await this.prismaService.permission.deleteMany({
      where: {
        id,
      },
    });
  }

  updateById(
    id: Permission['id'],
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.prismaService.permission.update({
      where: {
        id,
      },
      data: updatePermissionDto,
    });
  }
}
