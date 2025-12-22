export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMin: number;
  image: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export enum AppView {
  HOME = 'HOME',
  BOOKING = 'BOOKING',
  AI_CONSULTANT = 'AI_CONSULTANT',
  SUCCESS = 'SUCCESS'
}

export interface BookingState {
  service: Service | null;
  barber: Barber | null;
  date: Date | null;
  time: string | null;
  customerName: string;
  customerPhone: string;
}