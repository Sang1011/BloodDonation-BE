import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinaryType } from 'cloudinary';
import { IUser } from 'src/shared/interfaces/user.interface';
import { Readable } from 'stream';

type Cloudinary = typeof cloudinaryType;
@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary: Cloudinary) {}

  async uploadToCloudinary(user : IUser, file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new Error('File is required for upload');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'Blood-Donation-System',
          resource_type: 'auto',
          public_id: `${user.user_id}/${Date.now()}-${file.originalname}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'], 
          overwrite: true, 
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
