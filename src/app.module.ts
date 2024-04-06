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
import { Image, ImageSchema } from './schemas/Image.schema';
import { EmployeeModule } from './employee/employee.module';
import { Employee, EmployeeSchema } from './employee/entities/employee.scheme';

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
      {
        name: Image.name,
        schema: ImageSchema,
      },
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
    ]),
    EmployeeModule,
  ],
  controllers: [AppController, ImageController],
  providers: [
    AppService,
    CloudinaryService,
    {
      provide: 'Image',
      useValue: MongooseModule.forFeature([
        { name: Image.name, schema: ImageSchema },
      ]),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
