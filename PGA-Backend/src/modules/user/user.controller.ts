import {  Controller,  Post,  Get,  Put,  Delete,  Param,  Body,  ParseIntPipe,  HttpCode,  HttpStatus, Request, BadRequestException,
} from '@nestjs/common';
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
  async create(@Body() data: RegisterDto) {
    return this.createUserService.execute(data);
  }

  @Get()
  async findAll() {
    return this.listUsersService.execute();
  }

  @Get('access-requests')
  async getAccessRequests(@Request() req) {
    const usuarioId = Number(req.user.pessoa_id);
    const tipoUsuario = req.user.tipo_usuario;

    if (isNaN(usuarioId)) {
      throw new BadRequestException('ID do usuário inválido');
    }
    
    return this.listAccessRequestsService.execute(usuarioId, tipoUsuario);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getUserService.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.PessoaUpdateInput,
  ) {
    return this.updateUserService.execute(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUserService.execute(id);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    return this.forgotPasswordService.execute(email);
  }

  @Public()
  @Post('reset-password/confirm')
  async confirmResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordService.execute(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  @Public()
  @Post('request-access')
  async requestAccess(@Body() data: RequestAccessDto) {
    return this.requestAccessService.execute(data);
  }

  @Post('process-access-request/:id')
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
  async findByUnidade(@Param('id', ParseIntPipe) id: number) {
    return this.getUsersByUnitService.execute(id);
  }
}
