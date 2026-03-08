import React from 'react';

const OpusLogo = ({ className = "", showText = false, userName = "" }) => (
  <div className={`flex items-center justify-center gap-6 ${className}`}>
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Outer Glowing Rings */}
      <div className="absolute inset-[-20px] bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute inset-[-2px] border border-[#D4AF37]/20 rounded-full animate-[spin_10s_linear_infinite]"></div>

      {/* Main Circle Container */}
      <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.3)] bg-black flex items-center justify-center">
        <img 
          src="/assets/logo.jpeg" 
          alt="Opus Logo" 
          className="w-full h-full object-cover scale-100 brightness-110 contrast-110" 
        />
      </div>
    </div>
    {showText && (
      <div className="text-left">
        <h1 className="text-2xl font-serif font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]">
          {userName ? userName.split(' ')[0].toUpperCase() : 'OPUS'}
        </h1>
        <p className="text-[8px] font-bold tracking-[0.4em] text-gray-400 uppercase mt-1">Concierge Protocol</p>
      </div>
    )}
  </div>
);

export default OpusLogo;
