import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { User } from 'src/schemas/User.schema';

export class CreateImage {
  @IsNotEmpty()
  image: { public_id: string; url: string };

  @ValidateNested()
  @Type(() => User)
  userId: User;
}
