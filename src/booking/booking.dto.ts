export class CreateBookingDto {
  readonly date: string;
  readonly name: string;
  readonly email: string;
  readonly lesson: string;
  readonly course: string;
  readonly branch: string;
}

export class CalendarInvitationDto {
  readonly to: string;
  readonly bookingData: {
    name: string;
    email: string;
    course: string;
    lesson: string;
    date: string;
    time: string;
    duration: number;
    center: {
      title: string;
      org: string;
      address: string;
    };
  };
  readonly scheduledData: any;
}
