import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Project1Repository } from "../project1.repository";
import { UpdateProject1Dto } from "../dto/update-project1.dto";

@Injectable()
export class UpdateProject1Service {
  constructor(private readonly project1Repository: Project1Repository) {}

  async execute(id: number, data: UpdateProject1Dto) {
    return this.project1Repository.update(id, data);
  }
}
