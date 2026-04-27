import { Injectable } from '@nestjs/common';
import { ThematicAxisRepository } from '../thematicAxis.repository';

@Injectable()
export class FindOneThematicAxisService {
  constructor(private readonly repo: ThematicAxisRepository) {}

  async execute(id: string) {
    return this.repo.findOne(id);
  }
}
