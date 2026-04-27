import { Injectable } from '@nestjs/common';
import { ThemesRepository } from '../themes.repository';

@Injectable()
export class FindOneThemeService {
  constructor(private readonly themesRepository: ThemesRepository) {}

  async execute(id: string) {
    return this.themesRepository.findOne(id);
  }
}
