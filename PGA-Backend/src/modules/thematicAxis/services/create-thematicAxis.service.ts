import { Injectable } from '@nestjs/common';
import { ThematicAxisRepository } from '../thematicAxis.repository';
import { CreateThematicAxisDto } from '../dto/create-thematicAxis.dto';

@Injectable()
export class CreateThematicAxisService {
  constructor(private readonly repo: ThematicAxisRepository) {}

  async execute(data: CreateThematicAxisDto) {
    return this.repo.create(data);
  }
}
