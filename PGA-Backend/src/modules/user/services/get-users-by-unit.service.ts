import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Pessoa } from '@prisma/client';

@Injectable()
export class GetUsersByUnitService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(unidadeId: number): Promise<Pessoa[]> {
    return this.userRepository.findByUnidadeId(unidadeId);
  }
}