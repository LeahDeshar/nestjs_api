import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  salary: string;

  // role can be either 'admin' or 'user'
  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role?: string;
}
export const EmployeeSchema = SchemaFactory.createForClass(Employee);
