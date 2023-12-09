import {Injectable} from '@nestjs/common';
import {Branch, Prisma, RoleType, User} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {PrismaService} from 'src/prisma/prisma.service';
import {CreateUserDto} from './dto/create-user.dto';
import {PaginatedService} from 'src/paginated/paginated.service';
import {PaginatedDto} from 'src/paginated/dto/paginated.dto';

export type UserWithPermissions = Prisma.UserGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
    email: true;
    roleId: true;
    branchId: true;
    branch: true;
    role: {
      select: {
        id: true;
        roleType: true;
        permissions: true;
      };
    };
  };
}>;

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private paginatedService: PaginatedService,
  ) {
    this.prismaService.branch.findMany({
      where: {
        AND: {},
      },
    });
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  create(userDto: CreateUserDto, branchId: Branch['id']): Promise<User> {
    const user = CreateUserDto.toPartialUser(userDto);
    user.branchId = branchId;
    return this.prismaService.user.create({
      data: user as User,
    });
  }

  findPaginatedByUser(
    user: UserWithPermissions,
    limit: number,
    page: number,
    filter: string,
  ): Promise<PaginatedDto<UserWithPermissions>> {
    const where: Prisma.UserWhereInput = {};

    if (user.role.roleType !== RoleType.SUPER_ADMIN) {
      where.branchId = user.branchId;
    }

    if (filter) {
      where.AND = [
        {
          OR: [
            {
              firstName: {
                contains: filter,
              },
            },
            {
              lastName: {
                contains: filter,
              },
            },
            {
              email: {
                contains: filter,
              },
            },
          ],
        },
      ];
    }

    return this.paginatedService.paginate('User', page, limit, {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        branchId: true,
        roleId: true,
        branch: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
      where,
    });
  }

  findById(
    id: User['id'],
    includePermissions?: boolean,
  ): Promise<UserWithPermissions> {
    return this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        branchId: true,
        roleId: true,
        branch: true,
        role: {
          include: {
            permissions: includePermissions,
          },
        },
      },
      where: {
        id,
      },
    }) as Promise<UserWithPermissions>;
  }

  findByIdAndUser(
    id: User['id'],
    user: UserWithPermissions,
    includePermissions?: boolean,
  ): Promise<any> {
    if (user.role.roleType === RoleType.SUPER_ADMIN) {
      return this.findById(
        id,
        includePermissions,
      ) as Promise<UserWithPermissions>;
    }
    return this.prismaService.user.findFirst({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        branchId: true,
        roleId: true,
        branch: true,
        role: {
          include: {
            permissions: includePermissions,
          },
        },
      },
      where: {
        id,
        branchId: user.branchId,
      },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  updateById(id: User['id'], data: Partial<User>): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  updateByIdAndUser(
    id: User['id'],
    user: UserWithPermissions,
    data: Partial<User>,
  ): Promise<User> {
    if (user.role.roleType === RoleType.SUPER_ADMIN) {
      return this.updateById(id, data);
    }
    return this.prismaService.user.update({
      where: {
        id,
        branchId: user.branchId,
      },
      data,
    });
  }

  async deleteByIdAndUser(id: User['id'], user: UserWithPermissions): Promise<void> {
    if (user.id === id) {
      return Promise.reject('You cannot delete yourself: ' + user.firstName + ' ' + user.lastName + ' (' + user.email + ')');
    }

    if (user.role.roleType === RoleType.SUPER_ADMIN) {
      // Super admin can delete all kinds of users...
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });
      return;
    }

    await this.prismaService.user.delete({
      where: {
        id,
        branchId: user.branchId,
      },
    });
  }
}
