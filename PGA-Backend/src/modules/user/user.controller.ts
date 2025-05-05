// src/user/user.controller.ts
import {Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus} from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import { ListUsersService } from './services/list-users.service';
import { GetUserService } from './services/get-user.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { Prisma } from '@prisma/client';
import { Public } from '../auth/decorators/is-public.decorator';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserService,
    private readonly listUsers: ListUsersService,
    private readonly getUser: GetUserService,
    private readonly updateUser: UpdateUserService,
    private readonly deleteUser: DeleteUserService,
  ) {}

  @Public()
  @Post()
  async create(@Body() data: RegisterDto) {
    return this.createUser.execute(data);
  }

  @Get()
  async findAll() {
    return this.listUsers.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getUser.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.PessoaUpdateInput,
  ) {
    return this.updateUser.execute(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUser.execute(id);
  }
}
