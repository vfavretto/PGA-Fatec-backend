import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { CreateAttachment1Dto } from '../dto/create-attachment1.dto';

@Injectable()
export class CreateAttachment1Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateAttachment1Dto) {
    return this.prisma.attachment1.create({ data: dto });
  }
}
