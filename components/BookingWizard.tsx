import React, { useState } from 'react';
import { SERVICES, BARBERS, TIME_SLOTS } from '../constants';
import { BookingState, Service, Barber } from '../types';
import { Button, Card, SectionTitle } from './ui';
import { ScissorsAnimation } from './Animations';

interface BookingWizardProps {
  onComplete: (booking: BookingState) => void;
  onCancel: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>({
    service: null,
    barber: null,
    date: new Date(),
    time: null,
    customerName: '',
    customerPhone: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderServiceStep = () => (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex justify-center mb-4">
        <ScissorsAnimation />
      </div>
      <SectionTitle title="Select Your Ritual" subtitle="Premium grooming services designed for the modern gentleman." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES.map(service => (
          <Card 
            key={service.id} 
            onClick={() => setBooking({ ...booking, service })}
            selected={booking.service?.id === service.id}
            className="group hover:border-morocco-gold/50"
          >
            <div className="flex h-full flex-col">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif font-bold text-xl text-morocco-dark">{service.title}</h3>
                  <span className="text-morocco-red font-bold text-lg">{service.price} <span className="text-xs text-gray-500">MAD</span></span>
                </div>
                <p className="text-gray-600 text-sm mb-4 flex-1 leading-relaxed">{service.description}</p>
                <div className="flex items-center text-morocco-teal text-xs font-bold uppercase tracking-wide">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {service.durationMin} Minutes
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-end pt-6 sticky bottom-4 z-20">
        <Button onClick={nextStep} disabled={!booking.service} className="shadow-2xl">
          Next: Choose Master Barber
        </Button>
      </div>
    </div>
  );

  const renderBarberStep = () => (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Select Your Master" subtitle="Our artisans are skilled in the ancient arts of Moroccan grooming." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {BARBERS.map(barber => (
          <Card 
            key={barber.id}
            onClick={() => setBooking({ ...booking, barber })}
            selected={booking.barber?.id === barber.id}
            className="text-center p-8 group"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-morocco-sand group-hover:border-morocco-gold transition-colors shadow-lg">
              <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif font-bold text-2xl mb-2 text-morocco-dark">{barber.name}</h3>
            <p className="text-morocco-teal font-medium mb-3 uppercase text-xs tracking-widest">{barber.specialty}</p>
            <div className="flex justify-center items-center text-morocco-gold text-sm gap-1">
              {'★'.repeat(Math.floor(barber.rating))}
              <span className="text-gray-400 ml-1">({barber.rating})</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!booking.barber}>Next: Select Time</Button>
      </div>
    </div>
  );

  const renderTimeStep = () => (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Choose Your Time" subtitle="We value your time. Select a slot that fits your schedule." />
      <div className="bg-white p-8 rounded-xl shadow-md border border-morocco-sand/50">
        <h4 className="font-serif font-bold text-lg mb-6 text-center text-gray-400 uppercase tracking-widest text-xs">Today's Availability</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {TIME_SLOTS.map(time => (
            <button
              key={time}
              onClick={() => setBooking({ ...booking, time })}
              className={`
                py-4 px-2 rounded-lg text-sm font-bold transition-all border
                ${booking.time === time 
                  ? 'bg-morocco-gold border-morocco-gold text-white shadow-lg scale-105' 
                  : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-white hover:border-morocco-gold/50'}
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!booking.time}>Next: Final Details</Button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      <SectionTitle title="Final Details" subtitle="Almost done. We just need to know who to expect." />
      
      <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-morocco-gold">
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              value={booking.customerName}
              onChange={(e) => setBooking({...booking, customerName: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-morocco-gold focus:border-transparent outline-none transition-all font-serif"
              placeholder="e.g. Omar Benjelloun"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={booking.customerPhone}
              onChange={(e) => setBooking({...booking, customerPhone: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-morocco-gold focus:border-transparent outline-none transition-all font-serif"
              placeholder="+212 6..."
            />
          </div>
        </div>

        <div className="bg-morocco-sand/30 p-6 rounded-lg mb-8 space-y-3 border border-morocco-gold/20">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service</span>
            <span className="font-bold text-morocco-dark">{booking.service?.title}</span>
          </div>
           <div className="flex justify-between text-sm">
            <span className="text-gray-600">Barber</span>
            <span className="font-bold text-morocco-dark">{booking.barber?.name}</span>
          </div>
           <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time</span>
            <span className="font-bold text-morocco-dark">{booking.time}, Today</span>
          </div>
          <div className="border-t border-morocco-gold/20 pt-3 mt-3 flex justify-between items-center">
            <span className="font-serif font-bold text-morocco-dark">Total</span>
            <span className="text-xl font-bold text-morocco-red">{booking.service?.price} <span className="text-xs">MAD</span></span>
          </div>
        </div>

        <Button 
          onClick={() => onComplete(booking)} 
          disabled={!booking.customerName || !booking.customerPhone}
          className="w-full text-lg py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          Confirm Reservation
        </Button>
      </div>

      <div className="flex justify-start">
        <Button variant="outline" onClick={prevStep} className="border-none hover:bg-transparent hover:text-gray-600 pl-0">← Go Back</Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {step === 1 && renderServiceStep()}
      {step === 2 && renderBarberStep()}
      {step === 3 && renderTimeStep()}
      {step === 4 && renderDetailsStep()}
    </div>
  );
};