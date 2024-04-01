import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { User } from 'src/schemas/User.schema';

export class CreateImage {
  image: { public_id: string; url: string };

  @ValidateNested()
  @Type(() => User)
  userId: User;
}
