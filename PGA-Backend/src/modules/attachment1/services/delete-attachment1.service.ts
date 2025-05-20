import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeleteAttachment1Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string) {
    return this.prisma.attachment1.delete({ where: { id } });
  }
}
