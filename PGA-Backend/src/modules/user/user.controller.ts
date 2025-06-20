// src/user/user.controller.ts
import {  Controller,  Post,  Get,  Put,  Delete,  Param,  Body,  ParseIntPipe,  HttpCode,  HttpStatus, Request, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserService } from './services/create-user.service';
import { ListUsersService } from './services/list-users.service';
import { GetUserService } from './services/get-user.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetPasswordService } from './services/reset-password.service';
import { Prisma } from '@prisma/client';
import { Public } from '../auth/decorators/is-public.decorator';
import { RegisterDto } from '../auth/dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestAccessService } from './services/request-access.service';
import { RequestAccessDto } from './dto/request-access.dto';
import { ListAccessRequestsService } from './services/list-access-requests.service';
import { ProcessAccessRequestService } from './services/process-access-request.service';
import { ProcessAccessRequestDto } from './dto/process-access-request.dto';
import { GetUsersByUnitService } from './services/get-users-by-unit.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly listUsersService: ListUsersService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly listAccessRequestsService: ListAccessRequestsService,
    private readonly processAccessRequestService: ProcessAccessRequestService,
    private readonly requestAccessService: RequestAccessService,
    private readonly getUsersByUnitService: GetUsersByUnitService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar novo usuário', description: 'Cria um novo usuário no sistema' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() data: RegisterDto) {
    return this.createUserService.execute(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários', description: 'Retorna lista de todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  async findAll() {
    return this.listUsersService.execute();
  }

  @Get('access-requests')
  @ApiOperation({ summary: 'Listar solicitações de acesso', description: 'Retorna solicitações de acesso pendentes' })
  @ApiResponse({ status: 200, description: 'Lista de solicitações retornada com sucesso' })
  async getAccessRequests(@Request() req) {
    const usuarioId = Number(req.user.pessoa_id);
    const tipoUsuario = req.user.tipo_usuario;

    if (isNaN(usuarioId)) {
      throw new BadRequestException('ID do usuário inválido');
    }
    
    return this.listAccessRequestsService.execute(usuarioId, tipoUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna dados de um usuário específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getUserService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza dados de um usuário específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.PessoaUpdateInput,
  ) {
    return this.updateUserService.execute(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário', description: 'Remove um usuário do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do usuário' })
  @ApiResponse({ status: 204, description: 'Usuário excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUserService.execute(id);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Solicitar redefinição de senha', description: 'Envia email para redefinição de senha' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string', format: 'email' } } } })
  @ApiResponse({ status: 200, description: 'Email de redefinição enviado' })
  async resetPassword(@Body('email') email: string) {
    return this.forgotPasswordService.execute(email);
  }

  @Public()
  @Post('reset-password/confirm')
  @ApiOperation({ summary: 'Confirmar redefinição de senha', description: 'Redefine senha usando token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  async confirmResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordService.execute(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  @Public()
  @Post('request-access')
  @ApiOperation({ summary: 'Solicitar acesso', description: 'Cria solicitação de acesso ao sistema' })
  @ApiBody({ type: RequestAccessDto })
  @ApiResponse({ status: 201, description: 'Solicitação criada com sucesso' })
  async requestAccess(@Body() data: RequestAccessDto) {
    return this.requestAccessService.execute(data);
  }

  @Post('process-access-request/:id')
  @ApiOperation({ summary: 'Processar solicitação de acesso', description: 'Aprova ou rejeita solicitação de acesso' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da solicitação' })
  @ApiBody({ type: ProcessAccessRequestDto })
  @ApiResponse({ status: 200, description: 'Solicitação processada com sucesso' })
  async processAccessRequest(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() data: ProcessAccessRequestDto
  ) {
    const usuarioId = req.user.pessoa_id;
    
    return this.processAccessRequestService.execute(
      id, 
      usuarioId, 
      data.status, 
      data.tipo_usuario
    );
  }

  @Get('by-unidade/:id')
  @ApiOperation({ summary: 'Buscar usuários por unidade', description: 'Retorna usuários de uma unidade específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da unidade' })
  @ApiResponse({ status: 200, description: 'Usuários da unidade retornados com sucesso' })
  async findByUnidade(@Param('id', ParseIntPipe) id: number) {
    return this.getUsersByUnitService.execute(id);
  }
}
