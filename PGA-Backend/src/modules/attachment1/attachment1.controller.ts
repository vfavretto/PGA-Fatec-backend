import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateAttachment1Dto } from '../attachment1/dto/create-attachment1.dto';
import { UpdateAttachment1Dto } from '../attachment1/dto/update-attachment1.dto';
import { CreateAttachment1Service } from '../attachment1/services/create-attachment1.service';
import { FindAllAttachment1Service } from '../attachment1/services/find-all-attachment1.service';
import { FindOneAttachment1Service } from '../attachment1/services/find-one-attachment1.service';
import { UpdateAttachment1Service } from '../attachment1/services/update-attachment1.service';
import { DeleteAttachment1Service } from '../attachment1/services/delete-attachment1.service';
import { Public } from '../auth/decorators/is-public.decorator';

@Controller('attachment1')
export class Attachment1Controller {
  constructor(
    private readonly createService: CreateAttachment1Service,
    private readonly findAllService: FindAllAttachment1Service,
    private readonly findOneService: FindOneAttachment1Service,
    private readonly updateService: UpdateAttachment1Service,
    private readonly deleteService: DeleteAttachment1Service,
  ) {}

  @Public()
  @Post()
  create(@Body() dto: CreateAttachment1Dto) {
    return this.createService.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAttachment1Dto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteService.execute(id);
  }
}
