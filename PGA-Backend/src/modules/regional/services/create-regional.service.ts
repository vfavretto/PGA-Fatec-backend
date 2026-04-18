import { Injectable } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';
import { CreateRegionalDto } from '../dto/create-regional.dto';

@Injectable()
export class CreateRegionalService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(data: CreateRegionalDto) {
    return this.repository.create(data);
  }
}
