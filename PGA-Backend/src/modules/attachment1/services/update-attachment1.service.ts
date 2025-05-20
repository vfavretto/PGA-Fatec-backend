import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { UpdateAttachment1Dto } from '../dto/update-attachment1.dto';

@Injectable()
export class UpdateAttachment1Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, dto: UpdateAttachment1Dto) {
    return this.prisma.attachment1.update({ where: { id }, data: dto });
  }
}
