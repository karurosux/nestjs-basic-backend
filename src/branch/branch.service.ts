import {Injectable} from '@nestjs/common';
import {Branch} from '@prisma/client';
import {PrismaService} from 'src/prisma/prisma.service';

@Injectable()
export class BranchService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<Branch[]> {
    return this.prismaService.branch.findMany();
  }

  findById(id: Branch['id']): Promise<Branch> {
    return this.prismaService.branch.findUnique({
      where: {
        id,
      },
    });
  }

  deleteById(id: Branch['id']): Promise<Branch> {
    return this.prismaService.branch.delete({
      where: {
        id,
      },
    });
  }

  patchById(id: Branch['id'], data: Partial<Branch>): Promise<Branch> {
    return this.prismaService.branch.update({
      where: {
        id,
      },
      data,
    });
  }
}
