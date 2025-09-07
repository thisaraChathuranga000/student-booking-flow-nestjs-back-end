import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookingService } from './booking.service';
import { EmailService } from './email.service';
import { CreateBookingDto, CalendarInvitationDto } from './booking.dto';
import { Booking } from './booking.schema';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking | null> {
    return this.bookingService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: CreateBookingDto,
  ): Promise<Booking | null> {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Booking | null> {
    return this.bookingService.delete(id);
  }

  @Get('count/:date')
  async getCountByDate(@Param('date') date: string): Promise<{ date: string; count: number }> {
    const count = await this.bookingService.getCountByDate(date);
    return { date, count };
  }

  @Post('send-invitation')
  async sendCalendarInvitation(@Body() invitationData: CalendarInvitationDto): Promise<{ message: string }> {
    try {
      await this.emailService.sendCalendarInvitation(invitationData);
      return { message: 'Calendar invitation sent successfully' };
    } catch (error) {
      throw new Error('Failed to send calendar invitation: ' + error.message);
    }
  }
}
