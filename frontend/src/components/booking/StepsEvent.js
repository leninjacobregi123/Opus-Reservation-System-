import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading, OpusButton } from '../common/UI';
import { 
  Briefcase, Heart, PartyPopper, Shield, Plus, 
  ArrowLeft, MapPin, LocateFixed, Users, CheckCircle2, ArrowRight 
} from 'lucide-react';

const iconMap = {
  Briefcase: <Briefcase size={18}/>,
  Heart: <Heart size={18}/>,
  PartyPopper: <PartyPopper size={18}/>,
  Shield: <Shield size={18}/>
};

export const Step2_EventSelection = ({ currentUser, EVENT_TYPES, manifest, updateManifest, setStep }) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step2" {...fadeUp} className="w-full max-w-5xl text-left">
      <SectionHeading 
        step={1} 
        title={`Greetings, ${currentUser?.full_name?.split(' ')[0] || 'Patron'}.`} 
        subtitle="Tell us, what is the special event you are planning to organize, so we may curate the appropriate atmosphere?" 
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {EVENT_TYPES.map(type => (
          <motion.div whileHover={{ y: -10 }} key={type.id} onClick={() => { updateManifest('eventType', type.label); setStep(3); }} className={`relative aspect-[4/5] rounded-[40px] border cursor-pointer overflow-hidden group transition-all ${manifest.eventType === type.label ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'border-white/5'}`}>
            <img src={type.img} alt={type.label} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-10 left-10 text-left">
              <div className="text-[#D4AF37] mb-4">{iconMap[type.icon]}</div>
              <h3 className="text-2xl font-serif italic text-white leading-none">{type.label}</h3>
            </div>
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.02 }} className="relative aspect-[4/5] rounded-[40px] border border-white/10 hover:border-white/30 bg-[#0A0A0A] flex flex-col p-8 justify-end transition-all text-left">
          <Plus className="mb-4 text-gray-500" size={24} /><h3 className="text-2xl font-serif text-white mb-2">Custom Protocol</h3>
          <input type="text" placeholder="Describe Event..." value={manifest.customEvent} onChange={(e) => updateManifest('customEvent', e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { updateManifest('eventType', manifest.customEvent); setStep(3); } }} className="bg-transparent border-b border-white/20 text-sm text-[#D4AF37] outline-none pb-2 placeholder-gray-600 focus:border-[#D4AF37]" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export const Step3_CoordinatesCapacity = ({ manifest, updateManifest, setStep }) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step3" {...fadeUp} className="w-full max-w-2xl text-left">
      <button onClick={() => setStep(2)} className="text-white/20 hover:text-white mb-12 flex items-center gap-2 text-[10px] tracking-widest font-bold"><ArrowLeft size={14}/> RE-ORDER INTENT</button>
      <SectionHeading step={2} title="Coordinates & Capacity." subtitle="Establish the location and exact guest count for spatial blueprinting." />
      <div className="space-y-10 mt-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#BF953F] to-[#B38728] rounded-full blur opacity-20 group-focus-within:opacity-50 transition duration-1000" />
          <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center px-8 py-6 shadow-2xl">
            <MapPin className="text-[#D4AF37] mr-4" size={24} />
            <input type="text" placeholder="Enter Imperial Coordinate..." value={manifest.location} onChange={(e) => updateManifest('location', e.target.value)} className="w-full bg-transparent border-none text-xl text-white outline-none placeholder-gray-600" />
            <button onClick={() => updateManifest('location', 'Bandra West, Mumbai')} className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#D4AF37] ml-4 bg-white/5 px-6 py-3 rounded-full whitespace-nowrap"><LocateFixed size={14}/> Detect</button>
          </div>
        </div>
        <div className="bg-black/60 backdrop-blur-md rounded-[40px] border border-white/10 p-10 shadow-xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3"><Users size={18} className="text-[#D4AF37]"/> Guest Capacity Protocol</h3>
          <AnimatePresence mode="wait">
            {!manifest.dynamicCapacity ? (
              <motion.div key="manual" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#050505] p-6 rounded-[30px] border border-white/5">
                  <div className="text-left">
                    <span className="text-lg font-serif text-white block">Fixed Headcount</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">Seal specific number of patrons</span>
                  </div>
                  <div className="flex items-center gap-8 bg-white/5 p-3 rounded-full border border-white/5">
                    <button onClick={() => updateManifest('guests', Math.max(1, manifest.guests - 1))} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-2xl text-white transition-all shadow-inner">-</button>
                    <span className="w-8 text-center font-bold text-3xl text-white font-serif">{manifest.guests}</span>
                    <button onClick={() => updateManifest('guests', manifest.guests + 1)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-2xl text-white transition-all shadow-inner">+</button>
                  </div>
                </div>
                <button onClick={() => updateManifest('dynamicCapacity', true)} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] hover:text-white transition-colors bg-[#D4AF37]/5 px-8 py-4 rounded-full border border-[#D4AF37]/20 w-full justify-center">SKIP & DISPATCH LATER</button>
              </motion.div>
            ) : (
              <motion.div key="dynamic" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-6">
                 <div className="flex items-center justify-between bg-[#111] p-6 rounded-[30px] border border-[#D4AF37]/40 shadow-2xl">
                   <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]"><CheckCircle2 size={24}/></div><div><span className="text-sm text-[#D4AF37] font-bold block tracking-[0.3em] uppercase leading-none mb-1">Dynamic Dispatch Active</span><span className="text-[9px] text-gray-400 uppercase tracking-widest">Headcount currently bypassed</span></div></div>
                   <button onClick={() => updateManifest('dynamicCapacity', false)} className="text-[9px] uppercase tracking-widest text-gray-500 hover:text-white underline underline-offset-8">Revert to Fixed</button>
                 </div>
                 <p className="text-[11px] text-gray-500 leading-relaxed italic border-l-2 border-[#D4AF37] pl-6 py-2">Blueprint will automatically scale based on the exact number of encrypted digital invites dispatched in Phase 07.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex justify-end pt-4"><OpusButton disabled={!manifest.location} onClick={() => setStep(4)}>Analyze Availability <ArrowRight size={14}/></OpusButton></div>
      </div>
    </motion.section>
  );
};
