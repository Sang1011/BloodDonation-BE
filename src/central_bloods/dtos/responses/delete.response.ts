import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdCentralDTOPartial {
    @ApiProperty({ example: "true"})
    acknowledged: boolean;

    @ApiProperty({ example: "1"})
    detetedCount: number;
}

export class DeleteByIdCentralDTO extends ResponseData {
    @ApiProperty({ type: DeleteByIdCentralDTOPartial })
    data: DeleteByIdCentralDTOPartial;
}