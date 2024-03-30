import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePost } from './dto/CreatePost.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  createPost(@Body() createPostDto: CreatePost) {
    return this.postService.createPost(createPostDto);
  }
}
