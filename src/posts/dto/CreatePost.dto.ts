import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePost {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
