import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserService } from './services/create-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { GetUserService } from './services/get-user.service';
import { ListUsersService } from './services/list-users.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@/config/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    UserRepository,
    CreateUserService,
    DeleteUserService,
    GetUserService,
    ListUsersService,
    UpdateUserService,
  ],
  controllers: [UserController],
})
export class UserModule { }
