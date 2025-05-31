import { PartialType } from "@nestjs/swagger";
import { CreateCentralBloodDto } from "./create.dto";

export class UpdateCentralBloodDto extends PartialType(CreateCentralBloodDto) {}
