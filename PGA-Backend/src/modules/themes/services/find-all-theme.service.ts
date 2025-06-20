import { Injectable } from '@nestjs/common';
import { ThemesRepository } from '../themes.repository';

@Injectable()
export class FindAllThemeService {
  constructor(private readonly themesRepository: ThemesRepository) {}

  async execute() {
    return this.themesRepository.findAll();
  }
}
