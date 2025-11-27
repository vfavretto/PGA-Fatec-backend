import { Injectable, NotFoundException } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { Unit } from '../entities/unit.entity';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class CreateUnitService {
  constructor(
    private readonly repository: UnitRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(data: CreateUnitDto): Promise<Unit> {
    const regional = await this.prisma.regional.findUnique({
      where: { regional_id: data.regional_id },
    });

    if (!regional) {
      throw new NotFoundException('Regional informada não encontrada');
    }

    return this.repository.create(data);
  }
}
