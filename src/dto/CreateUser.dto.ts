import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateUserSettingDto {
  @IsOptional()
  receiveNotifications?: boolean;

  @IsOptional()
  receiveEmails?: boolean;

  @IsOptional()
  receiveSMS?: boolean;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  settings?: CreateUserSettingDto;
}
