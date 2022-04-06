import { AuthDto } from './dto/auth.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }
}
