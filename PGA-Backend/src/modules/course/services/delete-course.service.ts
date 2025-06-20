import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CourseRepository } from '../course.repository';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeleteCourseService {
  constructor(
    private readonly repository: CourseRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const course = await this.repository.findOne(id);
    if (!course) throw new NotFoundException('Curso não encontrado');

    const rotinasVinculadas = await this.prisma.rotinaInstitucional.count({
      where: {
        curso_id: id,
        ativo: true
      }
    });
    
    if (rotinasVinculadas > 0) {
      throw new ConflictException('Este curso possui rotinas institucionais ativas e não pode ser excluído');
    }
    
    return this.repository.softDelete(id);
  }
}