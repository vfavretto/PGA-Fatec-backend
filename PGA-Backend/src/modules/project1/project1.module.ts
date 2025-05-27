import { Module } from "@nestjs/common";
import { Project1Repository } from "./project1.repository";
import { CreateProject1Service } from "./services/createProject1.service";
import { DeleteProject1Service } from "./services/deleteProject1.service";
import { FindAllProject1Service } from "./services/findAllProject1.service";
import { FindOneProject1Service } from "./services/findOneProject1.service";
import { UpdateProject1Service } from "./services/updateProject1.service";
import { Project1Controller } from "./project1.controller";

@Module({
  controllers: [Project1Controller],
  providers: [
    Project1Repository,
    CreateProject1Service,
    DeleteProject1Service,
    FindAllProject1Service,
    FindOneProject1Service,
    UpdateProject1Service,
  ],
})
export class Project1Module {}
