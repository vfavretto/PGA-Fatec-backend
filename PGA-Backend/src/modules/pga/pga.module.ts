import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { PgaController } from './pga.controller';
import { PgaRepository } from './pga.repository';
import { CreatePgaService } from './services/create-pga.service';
import { FindAllPgaService } from './services/find-all-pga.service';
import { FindOnePgaService } from './services/find-one-pga.service';
import { UpdatePgaService } from './services/update-pga.service';
import { DeletePgaService } from './services/delete-pga.service';
import { ExportPgaCsvService } from './services/export-pga-csv.service';
import { ExportPgaPdfService } from './services/export-pga-pdf.service';

@Module({
  imports: [PrismaModule],
  controllers: [PgaController],
  providers: [
    PgaRepository,
    CreatePgaService,
    FindAllPgaService,
    FindOnePgaService,
    UpdatePgaService,
    DeletePgaService,
    ExportPgaCsvService,
    ExportPgaPdfService,
  ],
  exports: [
    PgaRepository,
    CreatePgaService,
    FindAllPgaService,
    FindOnePgaService,
    UpdatePgaService,
    DeletePgaService,
    ExportPgaCsvService,
    ExportPgaPdfService,
  ],
})
export class PgaModule {}
