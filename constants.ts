import { Barber, Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'The Jouri Signature',
    description: 'A complete transformation. Precision haircut, beard sculpting, hot towel, and Moroccan clay mask.',
    price: 250,
    durationMin: 60,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 's2',
    title: 'Marrakech Fade',
    description: 'Ultra-sharp skin fade with detailed razor lineup and texture styling.',
    price: 150,
    durationMin: 45,
    image: 'https://images.unsplash.com/photo-1593414220184-c8c227918a1a?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 's3',
    title: 'Atlas Beard Sculpt',
    description: 'Expert beard shaping with oud oil treatment and straight razor outline.',
    price: 100,
    durationMin: 30,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 's4',
    title: 'Royal Scissor Cut',
    description: 'Classic gentleman\'s cut using only scissors for a natural, flowing look.',
    price: 200,
    durationMin: 50,
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop'
  }
];

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Karim',
    specialty: 'Master Barber',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1583341612074-cce5df641c3c?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'b2',
    name: 'Youssef',
    specialty: 'Fade Specialist',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=2080&auto=format&fit=crop'
  },
  {
    id: 'b3',
    name: 'Hassan',
    specialty: 'Beard Expert',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1590549460555-5386053358c9?q=80&w=1827&auto=format&fit=crop'
  }
];

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];