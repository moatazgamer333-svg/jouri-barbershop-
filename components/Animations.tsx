import React from 'react';

export const ScissorsAnimation: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-16 h-16 ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-morocco-gold drop-shadow-lg">
        {/* Upper Handle & Blade - Drawn "Open" */}
        <path 
          className="scissor-upper" 
          d="M30 40 C 20 40, 10 50, 10 60 C 10 70, 20 80, 30 80 C 35 80, 40 75, 42 70 L 85 25 L 90 20" 
          stroke="currentColor" strokeWidth="5" strokeLinecap="round" 
        />
        {/* Lower Handle & Blade - Drawn "Open" */}
        <path 
          className="scissor-lower" 
          d="M30 60 C 20 60, 10 50, 10 40 C 10 30, 20 20, 30 20 C 35 20, 40 25, 42 30 L 85 75 L 90 80" 
          stroke="currentColor" strokeWidth="5" strokeLinecap="round" 
        />
        {/* Pivot Screw */}
        <circle cx="45" cy="50" r="3" fill="#121212" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
};

export const MoroccanTeaAnimation: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-32 h-32 ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Glass */}
        <path d="M35 60 L 40 90 L 60 90 L 65 60" stroke="#121212" strokeWidth="2" fill="rgba(212, 175, 55, 0.2)" />
        <path d="M35 60 L 65 60" stroke="#121212" strokeWidth="1" />
        
        {/* Tea Pot */}
        <g className="tea-pot">
            <path d="M60 20 Q 90 20 90 50 Q 90 80 60 80 L 60 20" fill="#C0C0C0" stroke="#121212" strokeWidth="2" className="hidden"/> 
            {/* Simplified Pot Shape for pouring */}
            <path d="M70 10 Q 95 15 95 45 Q 95 70 75 70 L 60 40 Z" fill="#E5E7EB" stroke="#121212" strokeWidth="2" transform="translate(10, -20)"/>
            <path d="M60 40 L 45 45 L 55 50 Z" fill="#E5E7EB" stroke="#121212" strokeWidth="2" transform="translate(10, -20)" />
        </g>

        {/* Stream */}
        <path className="tea-stream" d="M 60 25 L 50 75" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />

        {/* Steam */}
        <g transform="translate(50, 55)">
           <path className="steam-particle steam-1" d="M0 0 Q 5 -10 0 -20" stroke="#FFF" strokeWidth="2" opacity="0.5" />
           <path className="steam-particle steam-2" d="M-5 0 Q 0 -10 -5 -20" stroke="#FFF" strokeWidth="2" opacity="0.5" />
           <path className="steam-particle steam-3" d="M5 0 Q 10 -10 5 -20" stroke="#FFF" strokeWidth="2" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};