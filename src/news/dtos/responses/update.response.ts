import { ResponseData } from "src/shared/dtos/responses/data.response";
import { NewsResponseDto } from "./get.response";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNewsDTO extends ResponseData {
  @ApiProperty({ type: NewsResponseDto })
  data: NewsResponseDto;
}