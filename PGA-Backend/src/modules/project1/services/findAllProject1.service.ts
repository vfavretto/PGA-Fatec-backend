import { Injectable } from '@nestjs/common';
import { Project1Repository } from '../project1.repository';

@Injectable()
export class FindAllProject1Service {
  constructor(private readonly project1Repository: Project1Repository) {}

  async execute() {
    return this.project1Repository.findAll();
  }
}
