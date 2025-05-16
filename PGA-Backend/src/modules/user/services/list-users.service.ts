import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Pessoa } from '@prisma/client';

@Injectable()
export class ListUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<Pessoa[]> {
    return this.userRepository.findAll();
  }
}
