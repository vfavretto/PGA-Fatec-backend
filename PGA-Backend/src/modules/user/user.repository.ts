import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.pessoa.create({ data });
  }

  async findAll() {
    return this.prisma.pessoa.findMany();
  }

  async findById(id: number) {
    return this.prisma.pessoa.findUnique({ where: { pessoa_id: id } });
  }
}
