import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProjectPersonDto } from './dto/create-project-person.dto';
import { UpdateProjectPersonDto } from './dto/update-project-person.dto';

@Injectable()
export class ProjectPersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProjectPersonDto) {
    return this.prisma.projetoPessoa.create({
      data: {
        acao_projeto_id: data.acao_projeto_id,
        pessoa_id: data.pessoa_id,
        papel: data.papel,
        carga_horaria_semanal: data.carga_horaria_semanal,
        tipo_vinculo_hae_id: data.tipo_vinculo_hae_id,
      },
    });
  }

  async findAll() {
    return this.prisma.projetoPessoa.findMany();
  }

  async findOne(id: number) {
    return this.prisma.projetoPessoa.findUnique({ where: { projeto_pessoa_id: id } });
  }

  async update(id: number, data: UpdateProjectPersonDto) {
    return this.prisma.projetoPessoa.update({
      where: { projeto_pessoa_id: id },
      data: {
        acao_projeto_id: data.acao_projeto_id,
        pessoa_id: data.pessoa_id,
        papel: data.papel,
        carga_horaria_semanal: data.carga_horaria_semanal,
        tipo_vinculo_hae_id: data.tipo_vinculo_hae_id,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.projetoPessoa.delete({ where: { projeto_pessoa_id: id } });
  }
}