import { PartialType } from "@nestjs/mapped-types";
import { CreateProject1Dto } from "./create-project1.dto";

export class UpdateProject1Dto extends PartialType(CreateProject1Dto) {}
