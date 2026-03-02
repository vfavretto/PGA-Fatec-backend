import { Injectable } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';

@Injectable()
export class FindRegionalByResponsavelService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(pessoaId: number) {
    return this.repository.findRegionalByResponsavelId(pessoaId);
  }
}
