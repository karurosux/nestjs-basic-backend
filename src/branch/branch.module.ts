import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {BranchService} from './branch.service';
import {BranchController} from './branch.controller';

@Module({
  controllers: [BranchController],
  imports: [PrismaModule],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
