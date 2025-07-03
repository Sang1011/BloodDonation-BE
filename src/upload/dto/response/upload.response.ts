import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';
export class UploadObject {
    @ApiProperty({ description: 'URL of the uploaded file' })
    url: string;

    @ApiProperty({ description: 'Cloudinary public_id of the uploaded file' })
    public_id: string;
}
export class UploadResponseDto extends ResponseData {
    @ApiProperty({ type: () => UploadObject, description: 'Uploaded file details' })
    data: UploadObject;
}


