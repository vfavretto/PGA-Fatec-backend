import { Module } from '@nestjs/common';
import { PrismaModule } from '@/config/prisma.module';
import { ThemesRepository } from './themes.repository';
import { CreateThemeService } from './services/create-theme.service';
import { FindAllThemeService } from './services/find-all-theme.service';
import { FindOneThemeService } from './services/find-one-theme.service';
import { UpdateThemeService } from './services/update-theme.service';
import { DeleteThemeService } from './services/delete-theme.service';
import { ThemesController } from './themes.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    ThemesRepository,
    CreateThemeService,
    FindAllThemeService,
    FindOneThemeService,
    UpdateThemeService,
    DeleteThemeService,
  ],
  controllers: [ThemesController],
})
export class ThemesModule {}
