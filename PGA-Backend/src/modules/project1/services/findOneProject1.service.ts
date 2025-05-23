import { Injectable } from "@nestjs/common";
import { Project1Repository } from "../project1.repository";

@Injectable()
export class FindOneProject1Service {
  constructor(private readonly project1Repository: Project1Repository) {}

  async execute(id: number) {
    return this.project1Repository.findOne(id);
  }
}
