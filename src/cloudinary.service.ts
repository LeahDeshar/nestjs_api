import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as cloudinary from 'cloudinary';
// import { User } from './schemas/User.schema';
import { Image } from './schemas/Image.schema';
import { Model } from 'mongoose';
import { CreateImage } from './dto/CreateImage.dto';
@Injectable()
export class CloudinaryService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {
    cloudinary.v2.config({
      cloud_name: 'dsffxncgo',
      api_key: '887724156877453',
      api_secret: 'X0tF6zTCwcr9_1SmDTXdO1TO7I4',
    });
  }

  //   async uploadImage(
  //     filePath: string,
  //   ): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse> {
  //     return new Promise((resolve, reject) => {
  //       cloudinary.v2.uploader.upload(
  //         filePath,
  //         { folder: 'images' },
  //         (error, result) => {
  //           if (error) {
  //             reject(error);
  //           }
  //           resolve(result);
  //         },
  //       );
  //     });
  //   }
  //   async uploadImage(
  //     createImageDto: CreateImage,
  //     filePath: string,
  //   ): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse> {
  //     try {
  //       const cloudinaryResult =
  //         await this.CloudinaryService.uploadImage(filePath);
  //       const { public_id, url } = cloudinaryResult;

  //       const newImage = new this.imageModel({
  //         image: { public_id, url },
  //         userId: createImageDto.userId._id, // Assuming userId is populated in createImageDto
  //       });

  //       return newImage.save();
  //     } catch (error) {
  //       throw new Error('Failed to upload image');
  //     }
  //   }

  async uploadImage(createImage: CreateImage) {
    try {
      const result = await cloudinary.v2.uploader.upload(
        createImage.image.url,
        {
          folder: 'images',
        },
      );

      // Save image data to the database
      const image = new this.imageModel({
        image: { public_id: result.public_id, url: result.url },
        userId: createImage.userId,
      });
      const savedImage = await image.save();

      return savedImage;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  }
}
