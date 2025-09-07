import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Booking extends Document {

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  lesson: string;

  @Prop({ required: true })
  course: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
