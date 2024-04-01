import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpressRequest } from './middleware/auth.middleware';
import { CreateImage } from './dto/CreateImage.dto';

@Controller('images')
export class ImageController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  //   async uploadImage(@UploadedFile() file: Express.Multer.File) {
  //     try {
  //       const result = await this.cloudinaryService.uploadImage(file.path);
  //       return result;
  //     } catch (error) {}
  //   }
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpressRequest,
  ) {
    try {
      if (!request.user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const createImageDto: CreateImage = {
        image: { public_id: file.filename, url: file.path },
        userId: request.user,
      };
      const result = await this.cloudinaryService.uploadImage(createImageDto);
      return result;
    } catch (error) {
      // Handle errors
    }
  }
}
