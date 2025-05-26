import { Injectable } from '@nestjs/common';
import { ThematicAxisRepository } from '../thematicAxis.repository';

@Injectable()
export class FindOneThematicAxisService {
  constructor(private readonly repo: ThematicAxisRepository) {}

  async execute(id: number) {
    return this.repo.findOne(id);
  }
}