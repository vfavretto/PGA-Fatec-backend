import { Injectable } from '@nestjs/common';
import { ThemesRepository } from '../themes.repository';

@Injectable()
export class FindOneThemeService {
  constructor(private readonly themesRepository: ThemesRepository) {}

  async execute(id: number) {
    return this.themesRepository.findOne(id);
  }
}
