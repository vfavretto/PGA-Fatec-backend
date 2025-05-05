import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { LoginService } from './services/login.service';
import { Public } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.loginService.execute(req.user);
  }
}