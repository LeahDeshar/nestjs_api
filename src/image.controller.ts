import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpressRequest,
  ) {
    try {
      if (!request.user) {
        throw new HttpException(
          `${request.user}Unauthorized`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const createImageDto: CreateImage = {
        image: { public_id: file.filename, url: file.path },
        userId: request.user,
      };
      const result = await this.cloudinaryService.uploadImage(createImageDto);
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to upload image', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  async getAllImage(@Request() request: ExpressRequest) {
    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.cloudinaryService.getAllImage();
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Request() request: ExpressRequest) {
    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const images = await this.cloudinaryService.getById(id);
    if (!images) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return images;
  }

  @Delete(':id')
  async deleteImage(
    @Param('id') id: string,
    @Request() request: ExpressRequest,
  ) {
    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const findImage = await this.cloudinaryService.getById(id);
    if (!findImage) {
      throw new HttpException(
        'Image not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.cloudinaryService.deleteImage(id);
  }
}
