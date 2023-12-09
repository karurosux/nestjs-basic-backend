import {Module} from '@nestjs/common';
import {PermissionService} from './permission.service';
import {PermissionController} from './permission.controller';
import {PrismaModule} from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
