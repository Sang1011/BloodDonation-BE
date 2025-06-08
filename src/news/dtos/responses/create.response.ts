import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";
import { NewsResponseDto } from "./get.response";

export class CreateNewsResponse extends ResponseData {
    @ApiProperty({ type: NewsResponseDto })
    data: NewsResponseDto;
}