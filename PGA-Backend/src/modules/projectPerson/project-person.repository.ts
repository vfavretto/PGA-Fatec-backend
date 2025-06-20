import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { ProjetoPessoa } from '@prisma/client';
import { CreateProjectPersonDto } from './dto/create-project-person.dto';
import { UpdateProjectPersonDto } from './dto/update-project-person.dto';

@Injectable()
export class ProjectPersonRepository extends BaseRepository<ProjetoPessoa> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateProjectPersonDto) {
    return this.prisma.projetoPessoa.create({
      data
    });
  }

  async findAll() {
    return this.prisma.projetoPessoa.findMany({
      where: this.whereActive(),
      include: {
        pessoa: true,
        acaoProjeto: true,
        tipo_vinculo_hae: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.projetoPessoa.findFirst({
      where: this.whereActive({ projeto_pessoa_id: id }),
      include: {
        pessoa: true,
        acaoProjeto: true,
        tipo_vinculo_hae: true
      }
    });
  }

  async update(id: number, data: UpdateProjectPersonDto) {
    return this.prisma.projetoPessoa.update({
      where: { projeto_pessoa_id: id },
      data
    });
  }

  async delete(id: number) {
    return this.prisma.projetoPessoa.update({
      where: { projeto_pessoa_id: id },
      data: { ativo: false },
    });
  }

  async findByProjectId(projetoId: number) {
    return this.prisma.projetoPessoa.findMany({
      where: this.whereActive({ acao_projeto_id: projetoId }),
      include: {
        pessoa: true,
        tipo_vinculo_hae: true
      }
    });
  }
}