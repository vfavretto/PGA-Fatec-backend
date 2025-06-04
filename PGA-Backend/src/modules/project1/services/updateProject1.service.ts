import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Project1Repository } from "../project1.repository";

@Injectable()
export class UpdateProject1Service {
  constructor(private readonly project1Repository: Project1Repository) {}

  async execute(id: number, data: Prisma.AcaoProjetoUncheckedUpdateInput) {
    return this.project1Repository.update(id, data);
  }
}
