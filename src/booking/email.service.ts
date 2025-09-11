import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CalendarInvitationDto } from './booking.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private generateICSContent(bookingData: CalendarInvitationDto['bookingData']): string {
    const { name, email, course, lesson, date, time, duration, center } = bookingData;
    
    // Parse the date and time
    const bookingDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create start time
    const startTime = new Date(bookingDate);
    startTime.setHours(hours, minutes || 0, 0, 0);
    
    // Create end time (add duration hours)
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + duration);
    
    // Format dates for ICS (YYYYMMDDTHHMMSSZ format)
    const formatICSDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    const startICS = formatICSDate(startTime);
    const endICS = formatICSDate(endTime);
    const nowICS = formatICSDate(new Date());
    
    // Generate unique UID
    const uid = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@sugar-studio.com`;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sugar Studio//Booking System//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowICS}`,
      `DTSTART:${startICS}`,
      `DTEND:${endICS}`,
      `SUMMARY:${course} - ${center.title}`,
      `DESCRIPTION:Learning Session\\n\\nStudent: ${name}\\nCourse: ${course}\\nLesson: ${lesson}\\nDuration: ${duration} hours\\n\\nLocation: ${center.address}`,
      `LOCATION:${center.address}`,
      `ORGANIZER;CN=${center.org}:MAILTO:${process.env.EMAIL_USER}`,
      `ATTENDEE;CN=${name};RSVP=TRUE:MAILTO:${email}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  }

  async sendCalendarInvitation(invitationData: CalendarInvitationDto): Promise<void> {
    const { to, bookingData } = invitationData;
    const icsContent = this.generateICSContent(bookingData);
    
    const formatTimeToAMPM = (timeString: string): string => {
      const [hourStr, minuteStr = "00"] = timeString.split(":");
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, "0");
      
      return `${displayHour}:${displayMinute} ${period}`;
    };

    const formattedDate = new Date(bookingData.date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long", 
      day: "numeric",
      year: "numeric"
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">🎓 Learning Session Confirmed</h1>
          <p style="color: #64748b; font-size: 16px;">Your booking has been successfully scheduled</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #10b981;">
          <h2 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">Session Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">Organization:</td>
              <td style="padding: 8px 0; color: #1e293b;">${bookingData.center.org}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Branch:</td>
              <td style="padding: 8px 0; color: #1e293b;">${bookingData.branch}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Date:</td>
              <td style="padding: 8px 0; color: #1e293b;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Time:</td>
              <td style="padding: 8px 0; color: #1e293b;">${formatTimeToAMPM(bookingData.time)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Duration:</td>
              <td style="padding: 8px 0; color: #1e293b;">${bookingData.duration} hours</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Location:</td>
              <td style="padding: 8px 0; color: #1e293b;">${bookingData.center.address}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Course:</td>
              <td style="padding: 8px 0; color: #1e293b;">${bookingData.course}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Lesson:</td>
              <td style="padding: 8px 0; color: #1e293b;">${bookingData.lesson}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 10px;">📅 Calendar Invitation</h3>
          <p style="color: #475569; margin-bottom: 15px;">
            A calendar invitation (.ics file) is attached to this email. Click on the attachment to add this event to your calendar.
          </p>
          <p style="color: #475569; font-size: 14px; margin: 0;">
            You can also add this event to your calendar using these links:<br>
            • <a href="https://calendar.google.com" style="color: #3b82f6;">Google Calendar</a><br>
            • <a href="https://outlook.live.com" style="color: #3b82f6;">Outlook Calendar</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #3b82f6;">${process.env.EMAIL_USER}</a>
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${bookingData.center.org}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Calendar Invitation: ${bookingData.course} - ${bookingData.center.title}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'booking-invitation.ics',
          content: icsContent,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Calendar invitation sent successfully to ${to}`);
    } catch (error) {
      console.error('Error sending calendar invitation:', error);
      throw new Error('Failed to send calendar invitation');
    }
  }
}
