import { IsNotEmpty, IsString } from 'class-validator';
export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  salary: string;
}
