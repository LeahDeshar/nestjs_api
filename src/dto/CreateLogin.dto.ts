import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateLogin {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
