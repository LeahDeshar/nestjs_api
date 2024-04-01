import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: 'dsffxncgo',
      api_key: '887724156877453',
      api_secret: 'X0tF6zTCwcr9_1SmDTXdO1TO7I4',
    });
  }

  async uploadImage(
    filePath: string,
  ): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        filePath,
        { folder: 'images' },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    });
  }
}
