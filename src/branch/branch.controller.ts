import {Controller, Delete, Get, Param, Patch} from '@nestjs/common';
import {Endpoints} from 'src/endpoints';
import {BranchService} from './branch.service';
import {Branch} from '@prisma/client';
import {Permissions} from 'src/auth/permissions.decorator';
import {SuperAdminOnly} from 'src/auth/super-admin-only.decorator';

@Controller(Endpoints.BRANCH)
export class BranchController {
  constructor(private branchService: BranchService) {}

  @Permissions({
    BRANCH_MANAGEMENT: ['read'],
  })
  @SuperAdminOnly()
  @Get()
  findAll(): Promise<Branch[]> {
    return this.branchService.findAll();
  }

  @Permissions({
    BRANCH_MANAGEMENT: ['read'],
  })
  @SuperAdminOnly()
  @Get(':id')
  findById(@Param('id') id: Branch['id']): Promise<Branch> {
    return this.branchService.findById(id);
  }

  @Permissions({
    BRANCH_MANAGEMENT: ['write'],
  })
  @SuperAdminOnly()
  @Delete(':id')
  deleteById(@Param('id') id: Branch['id']): Promise<Branch> {
    return this.branchService.deleteById(id);
  }

  @Permissions({
    BRANCH_MANAGEMENT: ['write'],
  })
  @SuperAdminOnly()
  @Patch(':id')
  patchById(
    @Param('id') id: Branch['id'],
    @Param('data') data: Partial<Branch>,
  ): Promise<Branch> {
    return this.branchService.patchById(id, data);
  }
}
