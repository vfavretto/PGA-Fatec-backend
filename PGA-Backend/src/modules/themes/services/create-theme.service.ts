import { Injectable } from '@nestjs/common';
import { ThemesRepository } from '../themes.repository';
import { CreateThemeDto } from '../dto/create-theme.dto';

@Injectable()
export class CreateThemeService {
  constructor(private readonly themesRepository: ThemesRepository) {}

  async execute(data: CreateThemeDto) {
    return this.themesRepository.create(data);
  }
}
