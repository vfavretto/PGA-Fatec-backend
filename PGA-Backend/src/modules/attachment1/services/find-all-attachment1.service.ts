import { Injectable } from '@nestjs/common';
import { Attachment1Repository } from '../attachment1.repository';

@Injectable()
export class FindAllAttachment1Service {
  constructor(private readonly attachment1Repository: Attachment1Repository) {}

  async execute() {
    return this.attachment1Repository.findAll();
  }
}
