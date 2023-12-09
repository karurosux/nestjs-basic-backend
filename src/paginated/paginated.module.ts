import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {PaginatedService} from './paginated.service';

@Module({
  providers: [PaginatedService],
  imports: [PrismaModule],
  exports: [PaginatedService],
})
export class PaginatedModule {}
