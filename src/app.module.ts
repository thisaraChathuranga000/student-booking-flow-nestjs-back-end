import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';

dotenv.config();

const mongoUrl = `mongodb+srv://${process.env.MONGODB_URI}`;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    BookingModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
