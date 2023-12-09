import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {BranchModule} from './branch/branch.module';
import {RoleModule} from './role/role.module';
import {UserModule} from './user/user.module';
import { PaginatedModule } from './paginated/paginated.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    UserModule,
    BranchModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    PaginatedModule,
    PermissionModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
