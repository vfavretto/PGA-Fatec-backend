import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Request, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginService } from './services/login.service';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ContextService } from './services/context.service';
import { SelectContextDto } from './dto/select-context.dto';

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

function setAuthCookies(res: Response, access_token: string, refresh_token?: string) {
  res.cookie('access_token', access_token, { ...COOKIE_BASE, maxAge: 24 * 60 * 60 * 1000 });
  if (refresh_token) {
    res.cookie('refresh_token', refresh_token, { ...COOKIE_BASE, maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
}

function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', { ...COOKIE_BASE });
  res.clearCookie('refresh_token', { ...COOKIE_BASE });
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly jwtService: JwtService,
    private readonly contextService: ContextService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Realizar login no sistema',
    description: 'Autentica o usuário e seta cookies HttpOnly com os tokens JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.loginService.execute(req.user);
    setAuthCookies(res, tokens.access_token, tokens.refresh_token);
    return { user: req.user };
  }

  @Get('contexts')
  @UseGuards(JwtAuthGuard)
  async contexts(@Request() req: any) {
    return this.contextService.getAvailableContexts(req.user);
  }

  @Post('select-context')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async selectContext(
    @Request() req: any,
    @Body() body: SelectContextDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tipo, id } = body;
    const tokens = await this.contextService.selectContext(req.user, tipo, id);
    setAuthCookies(res, tokens.access_token, tokens.refresh_token);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna dados do usuário autenticado pelo token/cookie atual' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  me(@CurrentUser() user: any) {
    return user;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renova o access token usando o refresh token (cookie)' })
  @ApiResponse({ status: 200, description: 'Novo access token emitido' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou ausente' })
  refresh(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      res.status(401);
      return { error: 'Refresh token ausente' };
    }
    try {
      const payload: any = this.jwtService.verify(refreshToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...cleanPayload } = payload;
      const access = this.jwtService.sign(cleanPayload, { expiresIn: '24h' });
      setAuthCookies(res, access);
      return { ok: true };
    } catch {
      res.status(401);
      return { error: 'Refresh token inválido' };
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout — remove cookies de autenticação' })
  logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res);
    return { ok: true };
  }
}
