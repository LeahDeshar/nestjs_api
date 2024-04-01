import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './User.schema';
@Schema()
export class Image {
  @Prop({
    type: {
      public_id: { type: String },
      url: { type: String },
    },
  })
  image: { public_id: string; url: string };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
