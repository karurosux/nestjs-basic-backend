import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {PaginatedModule} from 'src/paginated/paginated.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaModule, PaginatedModule],
})
export class UserModule {}
