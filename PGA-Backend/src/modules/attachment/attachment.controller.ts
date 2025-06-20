import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { CreateAttachmentService } from './services/create-attachment.service';
import { FindAllAttachmentService } from './services/find-all-attachment.service';
import { FindOneAttachmentService } from './services/find-one-attachment.service';
import { UpdateAttachmentService } from './services/update-attachment.service';
import { DeleteAttachmentService } from './services/delete-attachment.service';
import { FindByProcessStepService } from './services/find-by-process-step.service';
import { FindByDeliverableService } from './services/find-by-deliverable.service';
import { Public } from '../auth/decorators/is-public.decorator';

@Controller('attachments')
export class AttachmentController {
  constructor(
    private readonly createService: CreateAttachmentService,
    private readonly findAllService: FindAllAttachmentService,
    private readonly findOneService: FindOneAttachmentService,
    private readonly updateService: UpdateAttachmentService,
    private readonly deleteService: DeleteAttachmentService,
    private readonly findByEtapaProcessoService: FindByProcessStepService,
    private readonly findByEntregavelService: FindByDeliverableService,
  ) {}

  @Public()
  @Post()
  create(@Body() dto: CreateAttachmentDto) {
    return this.createService.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllService.execute();
  }

  @Get('etapa-processo/:id')
  findByEtapaProcesso(@Param('id') id: string) {
    return this.findByEtapaProcessoService.execute(Number(id));
  }

  @Get('entregavel/:id')
  findByEntregavel(@Param('id') id: string) {
    return this.findByEntregavelService.execute(Number(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneService.execute(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAttachmentDto) {
    return this.updateService.execute(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteService.execute(Number(id));
  }
}
