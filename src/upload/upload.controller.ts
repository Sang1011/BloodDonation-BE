import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadRequestDto } from './dto/request/upload.request';
import { UploadResponseDto } from './dto/response/upload.response';
import { ResponseMessage } from 'src/shared/decorators/message.decorator';
import { IUser } from 'src/shared/interfaces/user.interface';
import { User } from 'src/shared/decorators/users.decorator';
import { Express } from 'express';
@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadRequestDto })
  @ApiOperation({ summary: 'Upload file to Cloudinary' })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UploadResponseDto,
  })
  @ResponseMessage('File uploaded successfully')
  async uploadFile(@User() user: IUser, @UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadToCloudinary(user, file);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }
}