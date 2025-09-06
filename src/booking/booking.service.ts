import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './booking.schema';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).exec();
  }

  async update(id: string, updateBookingDto: CreateBookingDto): Promise<Booking | null> {
    return this.bookingModel.findByIdAndUpdate(id, updateBookingDto, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<Booking | null> {
    return this.bookingModel.findByIdAndDelete(id).exec();
  }

  async getCountByDate(date: string): Promise<number> {
    return this.bookingModel.countDocuments({ date }).exec();
  }
}
