import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import {Endpoints} from 'src/endpoints';
import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto';
import {Public} from './public.decorator';

@Controller(Endpoints.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    const token = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    session.token = `Bearer ${token}`;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Session() session: Record<string, any>) {
    session.token = null;
  }
}
