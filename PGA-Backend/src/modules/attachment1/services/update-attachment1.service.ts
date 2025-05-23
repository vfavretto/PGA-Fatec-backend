import { Injectable } from '@nestjs/common';
import { Attachment1Repository } from '../attachment1.repository';
import { UpdateAttachment1Dto } from '../dto/update-attachment1.dto';

@Injectable()
export class UpdateAttachment1Service {
  constructor(private readonly attachment1Repository: Attachment1Repository) {}

  async execute(id: string, data: UpdateAttachment1Dto) {
    return this.attachment1Repository.update(id, data);
  }
}
