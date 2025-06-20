import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe,} from "@nestjs/common";
import { CreateProject1Service } from "../project1/services/createProject1.service";
import { DeleteProject1Service } from "../project1/services/deleteProject1.service";
import { FindAllProject1Service } from "../project1/services/findAllProject1.service";
import { FindOneProject1Service } from "../project1/services/findOneProject1.service";
import { UpdateProject1Service } from "../project1/services/updateProject1.service";
import { Prisma } from "@prisma/client";
import { CreateProject1Dto } from './dto/create-project1.dto';
import { UpdateProject1Dto } from './dto/update-project1.dto';

@Controller("project1")
export class Project1Controller {
  constructor(
    private readonly createProject1Service: CreateProject1Service,
    private readonly deleteProject1Service: DeleteProject1Service,
    private readonly findAllProject1Service: FindAllProject1Service,
    private readonly findOneProject1Service: FindOneProject1Service,
    private readonly updateProject1Service: UpdateProject1Service,
  ) {}

  @Get()
  async findAll() {
    return this.findAllProject1Service.execute();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.findOneProject1Service.execute(id);
  }

  @Post()
  async create(@Body() data: CreateProject1Dto) {
    return this.createProject1Service.execute(data);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateProject1Dto,
  ) {
    return this.updateProject1Service.execute(id, data);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.deleteProject1Service.execute(id);
  }
}
