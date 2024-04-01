import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as cloudinary from 'cloudinary';
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
  async uploadImage(createImage: CreateImage) {
    try {
      const result = await cloudinary.v2.uploader.upload(
        createImage.image.url,
        {
          folder: 'images',
        },
      );
      const image = new this.imageModel({
        image: { public_id: result.public_id, url: result.url },
        userId: createImage.userId,
      });
      const savedImage = await image.save();

      return savedImage;
    } catch (error) {
      throw new Error(`'Failed to upload image' ${error}`);
    }
  }

  //   get all the image
  async getAllImage() {
    const images = await this.imageModel.find();
    return images;
  }

  //   get image by id
  async getById(id: string) {
    return await this.imageModel.findById(id);
  }

  // delete the image
  async deleteImage(id: string) {
    return await this.imageModel.findByIdAndDelete(id);
  }
}
