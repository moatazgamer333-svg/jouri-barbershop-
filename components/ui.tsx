import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  className = '', 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-serif font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-morocco-red text-white hover:bg-red-800 shadow-lg shadow-red-900/20",
    secondary: "bg-morocco-teal text-white hover:bg-teal-800 shadow-lg shadow-teal-900/20",
    outline: "border-2 border-morocco-gold text-morocco-dark hover:bg-morocco-gold hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; selected?: boolean }> = ({ 
  children, 
  className = '', 
  onClick,
  selected = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden bg-white rounded-xl shadow-md transition-all duration-300
        ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}
        ${selected ? 'ring-4 ring-morocco-gold ring-offset-2' : 'border border-gray-100'}
        ${className}
      `}
    >
      {selected && (
        <div className="absolute top-0 right-0 bg-morocco-gold text-white px-3 py-1 rounded-bl-lg font-bold text-xs z-10">
          SELECTED
        </div>
      )}
      {children}
    </div>
  );
};

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-serif font-bold text-morocco-dark mb-3 relative inline-block">
      {title}
      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-morocco-gold rounded-full"></span>
    </h2>
    {subtitle && <p className="text-gray-600 max-w-lg mx-auto mt-4">{subtitle}</p>}
  </div>
);