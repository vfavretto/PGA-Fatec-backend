import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Prisma, Pessoa } from '@prisma/client';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, data: Prisma.PessoaUpdateInput): Promise<Pessoa> {
    return this.userRepository.update(id, data);
  }
}
