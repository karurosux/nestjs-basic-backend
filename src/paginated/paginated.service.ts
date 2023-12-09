import {Injectable} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {PrismaService} from 'src/prisma/prisma.service';
import {PaginatedDto} from './dto/paginated.dto';

export type FindArgs<T extends Prisma.ModelName> = T extends 'User'
  ? Prisma.UserFindManyArgs
  : T extends 'Branch'
  ? Prisma.BranchFindManyArgs
  : T extends 'Role'
  ? Prisma.RoleFindManyArgs
  : T extends 'Permission'
  ? Prisma.PermissionFindManyArgs
  : never;

export type PaginatedDataType<T extends Prisma.ModelName> = T extends 'User'
  ? Prisma.UserGetPayload<{}>
  : T extends 'Branch'
  ? Prisma.BranchGetPayload<{}>
  : T extends 'Role'
  ? Prisma.RoleGetPayload<{}>
  : T extends 'Permission'
  ? Prisma.PermissionGetPayload<{}>
  : never;

@Injectable()
export class PaginatedService {
  constructor(private prismaService: PrismaService) {
    this.prismaService.branch.findMany({});
  }

  async paginate<T extends Prisma.ModelName, I = PaginatedDataType<T>>(
    model: T,
    page: number = 1,
    limit: number = 10,
    args?: FindArgs<T>,
  ): Promise<PaginatedDto<I>> {
    const dao = this.prismaService[model.toLowerCase()];
    const skip = page > 0 ? limit * (page - 1) : 0;

    args = {
      ...args,
      skip,
      take: limit,
    };

    const data = await dao.findMany(args);
    const total = await dao.count({where: args.where});
    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        currentPage: page,
        lastPage,
        perPage: limit,
        total,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  }
}
