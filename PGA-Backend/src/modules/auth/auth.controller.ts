import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Request, Get } from '@nestjs/common';
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
    description:
      'Autentica o usuário e retorna um token JWT para acesso às rotas protegidas',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de login do usuário',
    examples: {
      exemplo1: {
        summary: 'Login de exemplo',
        value: {
          email: 'usuario@fatec.sp.gov.br',
          senha: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Token JWT para autenticação',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: any) {
    return this.loginService.execute(req.user);
  }

  @Get('contexts')
  @UseGuards(JwtAuthGuard)
  async contexts(@Request() req: any) {
    return this.contextService.getAvailableContexts(req.user);
  }

  @Post('select-context')
  @UseGuards(JwtAuthGuard)
  async selectContext(@Request() req: any, @Body() body: SelectContextDto) {
    const { tipo, id } = body;
    return this.contextService.selectContext(req.user, tipo, id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Validar token e retornar usuário autenticado',
    description: 'Retorna os dados básicos do usuário associado ao token JWT enviado',
  })
  @ApiResponse({ status: 200, description: 'Token válido - retorna usuário' })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  me(@CurrentUser() user: any) {
    return user;
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Trocar refresh token por novo access token' })
  @ApiResponse({ status: 200, description: 'Novo access token emitido' })
  @ApiResponse({ status: 400, description: 'Refresh token inválido' })
  refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      return { error: 'refresh_token é obrigatório' };
    }
    try {
      const payload: any = this.jwtService.verify(refreshToken);
      const access = this.jwtService.sign(payload, { expiresIn: '24h' });
      return { access_token: access };
    } catch (e) {
      return { error: 'refresh_token inválido' };
    }
  }
}
