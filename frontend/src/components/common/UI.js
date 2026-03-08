import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0), y = useMotionValue(0);
  const mouseXSpring = useSpring(x), mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div style={{ perspective: 1200 }} className="w-full h-full">
      <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`w-full h-full ${className}`}>
        <div style={{ transform: "translateZ(20px)" }} className="w-full h-full relative z-10">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export const OpusButton = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const styles = {
    primary: "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:brightness-110 disabled:opacity-50 disabled:grayscale",
    outline: "bg-[#050505] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10",
  };
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} disabled={disabled} type={type} className={`px-10 py-5 rounded-full text-[9px] font-bold uppercase tracking-[0.5em] transition-all duration-300 flex items-center justify-center gap-4 ${styles[variant]} ${className}`}>{children}</motion.button>
  );
};

export const SectionHeading = ({ step, title, subtitle }) => (
  <header className="mb-12 relative z-10 text-center md:text-left">
    <div className="flex items-center justify-center md:justify-start gap-4 mb-6"><span className="w-8 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent hidden md:block" /><span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">Phase 0{step}</span></div>
    <h2 className="text-4xl lg:text-6xl font-serif font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 leading-tight mb-4 drop-shadow-xl">{title}</h2>
    <p className="text-xs font-light tracking-widest uppercase text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0">{subtitle}</p>
  </header>
);
