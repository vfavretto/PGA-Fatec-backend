import { Injectable } from '@nestjs/common';
import { ThematicAxisRepository } from '../thematicAxis.repository';

@Injectable()
export class FindAllThematicAxisService {
  constructor(private readonly repo: ThematicAxisRepository) {}

  async execute() {
    return this.repo.findAll();
  }
}
