import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "src/shared/dtos/responses/data.response";

export class DeleteByIdCentralDTOPartial {
    @ApiProperty({ example: 1, description: 'Number of deleted records (0 or 1)' })
    deleted: number;
}

export class DeleteByIdCentralDTO extends ResponseData {
    @ApiProperty({ type: DeleteByIdCentralDTOPartial })
    data: DeleteByIdCentralDTOPartial;
}