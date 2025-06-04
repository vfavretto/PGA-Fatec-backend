import { Injectable, NotFoundException } from '@nestjs/common';
import { ThemesRepository } from '../themes.repository';
import { UpdateThemeDto } from '../dto/update-theme.dto';

@Injectable()
export class UpdateThemeService {
  constructor(private readonly themesRepository: ThemesRepository) {}

  async execute(id: number, data: UpdateThemeDto) {
    const tema = await this.themesRepository.findOne(id);

    if (!tema) throw new NotFoundException('Tema não encontrado');

    return this.themesRepository.update(id, data);
  }
}
