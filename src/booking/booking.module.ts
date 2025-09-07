import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { EmailService } from './email.service';
import { Booking, BookingSchema } from './booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService, EmailService],
  exports: [BookingService, EmailService],
})
export class BookingModule {}
