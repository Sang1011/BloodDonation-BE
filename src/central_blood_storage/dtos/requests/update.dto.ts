import { PartialType } from "@nestjs/swagger";
import { CreateCentralBloodStorageDto } from "./create.dto";

export class UpdateCentralBloodStorageDto extends PartialType(CreateCentralBloodStorageDto) {}
