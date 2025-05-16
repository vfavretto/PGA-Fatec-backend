import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Pessoa } from '@prisma/client';

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<Pessoa> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
