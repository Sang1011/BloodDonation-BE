import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";
import { GetCentralResponse } from "./get.response";

export class CreateCentralDTO extends ResponseData {
    @ApiProperty({ type: GetCentralResponse })
    data: GetCentralResponse;
}