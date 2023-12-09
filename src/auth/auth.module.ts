import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserModule} from 'src/user/user.module';
import {AuthController} from './auth.controller';
import {APP_GUARD} from '@nestjs/core';
import {AuthGuard} from './auth.guard';
import {JwtModule} from '@nestjs/jwt';
import {AuthConstants} from './auth.constants';

@Module({
  controllers: [AuthController],
  exports: [],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: AuthConstants.JWT_SECRET,
      signOptions: {expiresIn: AuthConstants.JWT_EXPIRATION_TIME},
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
