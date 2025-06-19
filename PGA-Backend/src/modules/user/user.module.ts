import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { CreateUserService } from './services/create-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { GetUserService } from './services/get-user.service';
import { ListUsersService } from './services/list-users.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@/config/prisma.module';
import { MailModule } from '../mail/mail.module';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetPasswordService } from './services/reset-password.service';
import { ListAccessRequestsService } from './services/list-access-requests.service';
import { ProcessAccessRequestService } from './services/process-access-request.service';
import { RequestAccessService } from './services/request-access.service';
import { GetUsersByUnitService } from './services/get-users-by-unit.service';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    UserRepository,
    CreateUserService,
    DeleteUserService,
    GetUserService,
    ListUsersService,
    UpdateUserService,
    ForgotPasswordService,
    ResetPasswordService,
    ListAccessRequestsService,
    ProcessAccessRequestService,
    RequestAccessService,
    GetUsersByUnitService,
  ],
  controllers: [UserController],
})
export class UserModule {}
