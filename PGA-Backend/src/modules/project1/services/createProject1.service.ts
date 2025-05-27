import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Project1Repository } from "../project1.repository";

@Injectable()
export class CreateProject1Service {
  constructor(private readonly project1Repository: Project1Repository) {}

  async execute(data: Prisma.AcaoProjetoUncheckedCreateInput) {
    return this.project1Repository.create(data);
  }
}
