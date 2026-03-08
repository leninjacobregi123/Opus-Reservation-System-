import React from 'react';
import { motion } from 'framer-motion';
import OpusLogo from '../common/OpusLogo';
import { User, Mail, Lock } from 'lucide-react';
import { OpusButton } from '../common/UI';

export const Step0_Splash = () => (
  <motion.section key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} className="flex flex-col items-center justify-center w-full text-center">
    <OpusLogo className="w-80 h-80 mb-16" />
    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] font-bold tracking-[0.8em] uppercase text-[#D4AF37] glow-text">Initializing Sovereign Protocol</motion.div>
  </motion.section>
);

export const Step1_Auth = ({ 
  authMode, 
  setAuthMode, 
  handleLogin, 
  handleRegister, 
  manifest, 
  updateManifest, 
  loading, 
  message 
}) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step1" {...fadeUp} className="w-full max-w-md">
      <div className="bg-[#0A0A0A] rounded-[50px] p-12 border border-white/10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        <div className="text-center mb-12 relative z-10">
          <OpusLogo className="w-20 h-20 mx-auto mb-6" />
          
          <div className="flex justify-center gap-8 mb-8 border-b border-white/5 pb-4">
            <button 
              onClick={() => setAuthMode('login')}
              className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${authMode === 'login' ? 'text-[#D4AF37] glow-text' : 'text-white/20 hover:text-white/40'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode('register')}
              className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${authMode === 'register' ? 'text-[#D4AF37] glow-text' : 'text-white/20 hover:text-white/40'}`}
            >
              Register
            </button>
          </div>

          <h2 className="text-4xl font-serif italic text-white leading-none">{authMode === 'login' ? 'Unseal Passage' : 'Establish Lineage'}</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mt-4">{authMode === 'login' ? 'Identity Verification Required' : 'Forge Your Royal Identity'}</p>
        </div>
        <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-8 relative z-10">
          {authMode === 'register' && (
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37]/40" size={18} />
              <input type="text" placeholder="Full Legal Name" value={manifest.fullName} onChange={(e) => updateManifest('fullName', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:border-[#D4AF37] transition-all" required />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37]/40" size={18} />
            <input type="email" placeholder="Digital Missive (Email)" value={manifest.user} onChange={(e) => updateManifest('user', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:border-[#D4AF37] transition-all" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37]/40" size={18} />
            <input type="password" placeholder="Sovereign Cipher" value={manifest.password} onChange={(e) => updateManifest('password', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:border-[#D4AF37] transition-all" required />
          </div>
          <OpusButton type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'Decrypting...' : authMode === 'login' ? 'Break Seal' : 'Forge Seal'}
          </OpusButton>
        </form>
        <button 
          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          className="w-full text-center mt-10 text-[9px] text-white/30 uppercase tracking-[0.2em] hover:text-[#E6B325] transition-colors duration-300 font-bold border-t border-white/5 pt-8"
        >
          {authMode === 'login' ? "Not a patron? Establish Lineage" : "Existing Member? Return to Passage"}
        </button>
        {message && <p className="text-[#9B1B30] text-center mt-6 text-[10px] tracking-widest font-bold uppercase bg-[#9B1B30]/10 py-3 rounded-lg border border-[#9B1B30]/20">{message}</p>}
      </div>
    </motion.section>
  );
};
