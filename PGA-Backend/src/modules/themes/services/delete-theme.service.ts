import { Injectable, NotFoundException } from '@nestjs/common';
import { ThemesRepository } from '../themes.repository';

@Injectable()
export class DeleteThemeService {
  constructor(private readonly repo: ThemesRepository) {}

  async execute(id: number, usuario_id?: number) {
    const theme = await this.repo.findOne(id);
    if (!theme) throw new NotFoundException('Tema não encontrado');
    
    return this.repo.delete(id);
  }
}