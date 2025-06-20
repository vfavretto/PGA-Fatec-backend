import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Attachment1 } from '@prisma/client';
import { CreateAttachment1Dto } from './dto/create-attachment1.dto';
import { UpdateAttachment1Dto } from './dto/update-attachment1.dto';

@Injectable()
export class Attachment1Repository extends BaseRepository<Attachment1> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateAttachment1Dto) {
    return this.prisma.attachment1.create({
      data
    });
  }

  async findAll() {
    return this.prisma.attachment1.findMany({
      where: this.whereActive(),
      include: {
        projeto: {
          where: this.whereActive()
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.attachment1.findFirst({
      where: this.whereActive({ id }),
      include: {
        projeto: {
          where: this.whereActive()
        }
      }
    });
  }

  async update(id: string, data: UpdateAttachment1Dto) {
    return this.prisma.attachment1.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return this.prisma.attachment1.update({
      where: { id },
      data: { ativo: false }
    });
  }
}
