import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Prisma, Pessoa } from '@prisma/client';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: Prisma.PessoaCreateInput): Promise<Pessoa> {
    return this.userRepository.create(data);
  }
}

