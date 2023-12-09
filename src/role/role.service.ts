import {Injectable} from '@nestjs/common';
import {Branch, Role, RoleType} from '@prisma/client';
import {PrismaService} from 'src/prisma/prisma.service';
import {CreateRoleDto} from './dto/create-role.dto';
import {startCase} from 'lodash';
import {UserWithPermissions} from 'src/user/user.service';
import {Prisma} from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  findAll(filter?: string): Promise<Role[]> {
    return this.prismaService.role.findMany({
      include: {
        branch: true,
      },
      where: {
        name: {
          contains: filter,
        },
      },
    });
  }

  findByIdAndUser(
    id: string,
    user: UserWithPermissions,
  ): Promise<Prisma.RoleGetPayload<{include: {permissions: true}}>> {
    return this.prismaService.role.findFirst({
      where: {
        id,
        branchId: user.branchId,
      },
      include: {
        permissions: true,
      },
    });
  }

  findByBranchId(branchId: string, filter?: string): Promise<Role[]> {
    return this.prismaService.role.findMany({
      include: {
        branch: true,
      },
      where: {
        branchId,
        AND: {
          name: {
            contains: filter,
          },
        },
      },
    });
  }

  async deleteByIdAndUser(
    id: Role['id'],
    user: UserWithPermissions,
  ): Promise<void> {
    const foundRole = await this.prismaService.role.findFirst({
      where: {
        id,
        branchId: user.branchId,
        roleType: {
          not: RoleType.SUPER_ADMIN,
        },
      },
    });

    if (!foundRole) {
      // Silently return if the role is not found
      return;
    }

    await this.prismaService.role.delete({
      where: {
        id: foundRole.id,
      },
    });
  }

  create(roleDto: CreateRoleDto, branchId: Branch['id']): Promise<Role> {
    const role = CreateRoleDto.toPartialRole(roleDto);
    role.branchId = branchId;
    role.name = startCase(role.name);
    return this.prismaService.role.create({
      data: role as Role,
    });
  }
}
