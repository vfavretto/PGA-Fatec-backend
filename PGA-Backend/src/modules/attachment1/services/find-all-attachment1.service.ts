import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class FindAllAttachment1Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.attachment1.findMany();
  }
}
