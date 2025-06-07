import { Module } from '@nestjs/common';
import { CloudinaryProvider } from 'src/shared/providers/cloudinary';

@Module({
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
