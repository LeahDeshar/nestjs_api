import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/Post.schema';
import { CreatePost } from './dto/CreatePost.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost({ userId, ...createPostDto }: CreatePost) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);
    const newPost = new this.postModel(createPostDto);
    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: { posts: savedPost._id },
    });
    return savedPost;
  }
}
