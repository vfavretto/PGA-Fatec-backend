import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UpdateAttachment1Dto } from './dto/update-attachment1.dto';
import { Prisma, Attachment1} from '@prisma/client';

@Injectable()
export class Attachment1Repository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.Attachment1CreateInput): Promise<Attachment1> {
    return this.prisma.attachment1.create({ data });
  }

  async findAll() {
    return this.prisma.attachment1.findMany();
  }

  async findOne(id: string) {
    return this.prisma.attachment1.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateAttachment1Dto) {
    return this.prisma.attachment1.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.attachment1.delete({ where: { id } });
  }
}
