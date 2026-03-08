import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpusLogo from './OpusLogo';
import { LogOut } from 'lucide-react';

export const Navbar = ({ step, currentUser, setStep, logout, setCurrentUser }) => (
  <AnimatePresence>
    {step > 0 && (
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 w-full z-50 px-12 py-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-[#000] to-transparent backdrop-blur-md border-b border-white/5 gap-4">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setStep(currentUser ? 2 : 1)}>
          <OpusLogo className="w-16 h-16 md:w-20 md:h-20" showText={true} userName={currentUser?.full_name} />
        </div>
        {step > 1 && step < 9 && (
          <div className="flex gap-3 items-center">
            {[2, 3, 4, 5, 5.5, 6, 7, 8].map(i => (
              <div key={i} className={`h-[2px] rounded-full transition-all duration-700 ${step >= i ? 'w-10 bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)]' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        )}
        {currentUser && <button onClick={() => { logout(); setCurrentUser(null); setStep(1); }} className="text-[9px] font-bold text-white/20 hover:text-[#9B1B30] uppercase tracking-widest flex items-center gap-2">Log Out <LogOut size={12}/></button>}
      </motion.nav>
    )}
  </AnimatePresence>
);

export const Footer = () => (
  <footer className="fixed bottom-0 w-full px-16 py-8 flex justify-between items-center text-[10px] font-bold text-white/20 tracking-[0.8em] uppercase bg-[#020202]/80 backdrop-blur-3xl border-t border-white/5 z-50">
    <span>IMPERIAL SOVEREIGN PROTOCOL EST. 2024</span>
    <div className="flex gap-20">
      <span className="hover:text-[#D4AF37] transition-all cursor-pointer">The Decrees</span>
      <span className="hover:text-[#D4AF37] transition-all cursor-pointer">Treasury</span>
      <span className="hover:text-[#D4AF37] transition-all cursor-pointer">The High Court</span>
    </div>
  </footer>
);
