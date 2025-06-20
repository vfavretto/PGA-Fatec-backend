import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UpdateAttachment1Dto } from './dto/update-attachment1.dto';
import { CreateAttachment1Dto } from './dto/create-attachment1.dto';
import { Prisma, Attachment1 } from '@prisma/client';

@Injectable()
export class Attachment1Repository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAttachment1Dto): Promise<Attachment1> {
    const data: Prisma.Attachment1CreateInput = {
      item: dto.item,
      denominacaoOuEspecificacao: dto.denominacaoOuEspecificacao,
      quantidade: dto.quantidade,
      precoTotalEstimado: dto.precoTotalEstimado,
      flag: dto.flag,
      projeto: {
        connect: dto.projetoId ? { acao_projeto_id: parseInt(dto.projetoId) } : undefined
      }
    };

    return this.prisma.attachment1.create({ data });
  }

  async findAll() {
    return this.prisma.attachment1.findMany({
      include: {
        projeto: true
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.attachment1.findUnique({ 
      where: { id },
      include: {
        projeto: true
      }
    });
  }

  async update(id: string, dto: UpdateAttachment1Dto) {
    const data: Prisma.Attachment1UpdateInput = {};
    
    if (dto.item !== undefined) data.item = dto.item;
    if (dto.denominacaoOuEspecificacao !== undefined) data.denominacaoOuEspecificacao = dto.denominacaoOuEspecificacao;
    if (dto.quantidade !== undefined) data.quantidade = dto.quantidade;
    if (dto.precoTotalEstimado !== undefined) data.precoTotalEstimado = dto.precoTotalEstimado;
    if (dto.flag !== undefined) data.flag = dto.flag;
    
    if (dto.projetoId) {
      data.projeto = {
        connect: { acao_projeto_id: parseInt(dto.projetoId) }
      };
    }

    return this.prisma.attachment1.update({
      where: { id },
      data,
      include: {
        projeto: true
      }
    });
  }

  async delete(id: string) {
    return this.prisma.attachment1.delete({ 
      where: { id },
      include: {
        projeto: true
      }
    });
  }
}
