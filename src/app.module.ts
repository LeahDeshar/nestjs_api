import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ImageController } from './image.controller';
import { CloudinaryService } from './cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import { User, UserSchema } from './schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://leahdesar:YIQsgaVrZBJhGUIL@cluster0.cnco2vy.mongodb.net/nest',
    ),
    UsersModule,
    PostsModule,
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, CloudinaryService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
