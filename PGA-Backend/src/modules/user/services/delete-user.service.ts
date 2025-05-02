import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Pessoa } from '@prisma/client';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<Pessoa> {
    return this.userRepository.delete(id);
  }
}
