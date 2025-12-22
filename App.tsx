import React, { useState } from 'react';
import { AppView, BookingState } from './types';
import { Button } from './components/ui';
import { BookingWizard } from './components/BookingWizard';
import { ChatBot } from './components/ChatBot';
import { LiveReceptionist } from './components/LiveReceptionist';
import { MoroccanTeaAnimation } from './components/Animations';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingState | null>(null);
  const [isReceptionistOpen, setIsReceptionistOpen] = useState(false);

  const handleBookingComplete = (booking: BookingState) => {
    setConfirmedBooking(booking);
    setView(AppView.SUCCESS);
  };

  const renderHome = () => (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image - Vivid Brick aesthetic */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=2070&auto=format&fit=crop" 
            alt="Jouri Barbershop Interior" 
            className="w-full h-full object-cover"
          />
          {/* Vivid Overlay to enhance the brick red/orange tones */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-morocco-brick/20 to-black/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="mb-6 animate-fade-in-down">
            <div className="inline-block border-2 border-morocco-gold px-6 py-2 bg-black/50 backdrop-blur-sm rounded-sm">
              <span className="text-morocco-gold uppercase tracking-[0.3em] text-sm font-bold">Gueliz • Marrakech</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-extrabold text-white mb-4 drop-shadow-2xl animate-fade-in-up tracking-tight">
            JOURI
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-200 mb-8 tracking-[0.2em] animate-fade-in-up delay-75">
            BARBERSHOP
          </h2>
          
          <p className="text-gray-100 max-w-xl text-lg md:text-xl mb-12 font-light leading-relaxed drop-shadow-md animate-fade-in-up delay-100">
            Where authentic Moroccan aesthetic meets modern precision. <br/>
            <span className="text-morocco-gold font-serif italic">Walk in as a guest, leave as a king.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up delay-200">
            <Button onClick={() => setView(AppView.BOOKING)} className="min-w-[220px] text-lg py-4 bg-morocco-red border-none hover:bg-red-700">
              Book Appointment
            </Button>
            <Button variant="outline" onClick={() => setIsReceptionistOpen(true)} className="min-w-[220px] text-lg py-4 border-2 border-white text-white hover:bg-white hover:text-black flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call Reception
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </div>
      
      {/* Info Strip */}
      <div id="footer" className="bg-morocco-dark text-morocco-sand py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-morocco-gold"></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left relative z-10">
          <div>
            <h4 className="font-serif font-bold text-2xl mb-6 text-morocco-gold flex items-center justify-center md:justify-start gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Location
            </h4>
            <p className="text-lg">12 Avenue Mohammed V</p>
            <p className="text-lg text-gray-400">Gueliz, Marrakech 40000</p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-2xl mb-6 text-morocco-gold flex items-center justify-center md:justify-start gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Hours
            </h4>
            <p className="text-lg">Mon - Sat: 09:00 - 20:00</p>
            <p className="text-lg text-gray-400">Sunday: 10:00 - 16:00</p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-2xl mb-6 text-morocco-gold flex items-center justify-center md:justify-start gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              Contact
            </h4>
            <p className="text-lg">+212 524 000 000</p>
            <p className="text-lg text-gray-400">booking@jouri.ma</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="min-h-screen bg-morocco-sand/20 pb-20 relative">
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-morocco-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-serif font-bold text-2xl text-morocco-dark cursor-pointer tracking-wider" onClick={() => setView(AppView.HOME)}>
            JOURI.
          </div>
          <Button variant="outline" onClick={() => setView(AppView.HOME)} className="px-4 py-2 text-sm border-gray-300 hover:border-morocco-red hover:text-morocco-red">
            Exit Booking
          </Button>
        </div>
      </header>
      <div className="relative z-10 pt-8">
        <BookingWizard onComplete={handleBookingComplete} onCancel={() => setView(AppView.HOME)} />
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="min-h-screen bg-morocco-dark flex items-center justify-center p-4 relative overflow-hidden">
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
       <div className="glass-panel max-w-md w-full rounded-2xl overflow-hidden shadow-2xl relative animate-fade-in-up backdrop-blur-xl bg-white/95 z-10">
         <div className="h-2 bg-morocco-gold w-full"></div>
         
         <div className="p-8 text-center">
           
           <div className="flex justify-center mb-6">
             <MoroccanTeaAnimation />
           </div>
           
           <h2 className="text-3xl font-serif font-bold text-morocco-dark mb-2">Marhba!</h2>
           <p className="text-gray-600 mb-8 font-serif italic">"Your royal session is confirmed, {confirmedBooking?.customerName}."</p>
           
           <div className="bg-morocco-sand/20 p-6 rounded-xl border border-morocco-gold/30 mb-8 text-left">
             <div className="space-y-4">
               <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                 <span className="text-sm text-gray-500 uppercase tracking-widest">Service</span>
                 <span className="font-bold text-morocco-dark">{confirmedBooking?.service?.title}</span>
               </div>
               <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                 <span className="text-sm text-gray-500 uppercase tracking-widest">Time</span>
                 <span className="font-bold text-morocco-red text-lg">{confirmedBooking?.time}</span>
               </div>
             </div>
           </div>

           <Button onClick={() => setView(AppView.HOME)} className="w-full bg-morocco-dark hover:bg-black text-white">
             Return to Lobby
           </Button>
         </div>
      </div>
    </div>
  );

  return (
    <main className="font-sans text-gray-900 bg-morocco-sand bg-opacity-10 min-h-screen">
      {view === AppView.HOME && renderHome()}
      {view === AppView.BOOKING && renderBooking()}
      {view === AppView.SUCCESS && renderSuccess()}
      
      {/* Voice Receptionist Modal */}
      {isReceptionistOpen && <LiveReceptionist onClose={() => setIsReceptionistOpen(false)} />}

      {/* Floating ChatBot is always available except in success screen and when reception is open */}
      {view !== AppView.SUCCESS && !isReceptionistOpen && <ChatBot />}
    </main>
  );
}