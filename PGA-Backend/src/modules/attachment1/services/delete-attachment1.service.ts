import { Injectable } from '@nestjs/common';
import { Attachment1Repository } from '../attachment1.repository';

@Injectable()
export class DeleteAttachment1Service {
  constructor(private readonly attachment1Repository: Attachment1Repository) {}

  async execute(id: string) {
    return this.attachment1Repository.delete(id);
  }
}
