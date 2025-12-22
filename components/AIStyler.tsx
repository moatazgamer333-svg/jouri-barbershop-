import React, { useState } from 'react';
import { getStyleRecommendation } from '../services/geminiService';
import { Button } from './ui';

interface AIStylerProps {
  onClose: () => void;
  onBookNow: () => void;
}

export const AIStyler: React.FC<AIStylerProps> = ({ onClose, onBookNow }) => {
  const [description, setDescription] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConsult = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const result = await getStyleRecommendation(description);
      setRecommendation(result);
    } catch (e) {
      console.error(e);
      setRecommendation("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-morocco-sand w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-morocco-teal p-6 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold">The Royal AI Consultant</h2>
            <p className="text-teal-100 text-sm">Expert advice tailored to your visage</p>
          </div>
          <button onClick={onClose} className="relative z-10 text-white hover:text-morocco-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {!recommendation ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-morocco-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-morocco-dark">Describe Your Style</h3>
                <p className="text-gray-600">Tell us about your face shape, hair texture, or desired look (e.g., "Oval face, curly hair, want something modern but low maintenance").</p>
              </div>
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., I have a square face jawline and thick straight hair. I want a look that is professional but stylish..."
                className="w-full p-4 rounded-xl border-2 border-morocco-gold/30 focus:border-morocco-gold focus:ring-2 focus:ring-morocco-gold/20 outline-none min-h-[120px] bg-white text-gray-800 placeholder-gray-400"
              />

              <div className="flex justify-center">
                <Button 
                  onClick={handleConsult} 
                  disabled={loading || !description.trim()}
                  className="w-full md:w-auto min-w-[200px]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Consulting Spirits...
                    </span>
                  ) : "Get Expert Advice"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-white p-6 rounded-xl border-l-4 border-morocco-gold shadow-sm">
                <h4 className="text-sm uppercase tracking-wider text-morocco-gold font-bold mb-2">Recommendation</h4>
                <p className="text-gray-800 leading-relaxed font-serif text-lg">
                  {recommendation}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="outline" onClick={() => setRecommendation('')}>
                  Ask Again
                </Button>
                <Button onClick={() => { onClose(); onBookNow(); }}>
                  Book This Look
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};