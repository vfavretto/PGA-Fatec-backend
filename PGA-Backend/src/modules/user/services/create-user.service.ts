import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Prisma, Pessoa } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<Pessoa> {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }
    return this.userRepository.create(data);
  }
}

