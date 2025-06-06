import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';
import { StatusPGA } from '@prisma/client';

@Injectable()
export class PgaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePgaDto) {
    return this.prisma.pGA.create({
      data: {
        ...data,
        status: data.status ?? StatusPGA.EmElaboracao, // valor padrão do enum
      },
    });
  }

  async findAll() {
    return this.prisma.pGA.findMany();
  }

  async findOne(id: number) {
    return this.prisma.pGA.findUnique({ where: { pga_id: id } });
  }

  async update(id: number, data: UpdatePgaDto) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data: {
        ...data,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.pGA.delete({ where: { pga_id: id } });
  }
}