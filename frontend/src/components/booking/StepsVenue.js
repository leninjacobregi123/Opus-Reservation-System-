import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading, TiltCard, OpusButton } from '../common/UI';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import FloorPlan from './FloorPlan';

export const Step4_VenueSelection = ({ 
  restaurants, 
  manifest, 
  updateManifest, 
  fetchEstateDetails, 
  setStep, 
  getRestaurantImage 
}) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step4" {...fadeUp} className="w-full">
      <div className="text-left flex justify-between items-end border-b border-white/5 pb-12">
        <SectionHeading step={3} title="Exclusive Vistas." subtitle={`Curated architectural spaces currently available in ${manifest.location}.`} />
        <button onClick={() => setStep(3)} className="text-white/20 hover:text-[#D4AF37] mb-12 text-[9px] tracking-widest font-bold uppercase border border-white/10 px-8 py-4 rounded-full">Adjust Coordinate</button>
      </div>
      <div className="grid md:grid-cols-3 gap-12 mt-16">
        {restaurants.map((r, idx) => (
          <TiltCard key={r.id}>
            <div onClick={() => { updateManifest('venue', r); fetchEstateDetails(r); setStep(5); }} className="group cursor-pointer bg-black rounded-[50px] overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all flex flex-col h-full shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative">
              <div className="relative aspect-[16/11] overflow-hidden m-2 rounded-[40px]">
                <img src={getRestaurantImage(idx)} className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[2000ms]" alt={r.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/><span className="text-[9px] uppercase tracking-widest font-bold text-white">Live</span></div>
              </div>
              <div className="p-10 text-left flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4"><span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.4em]">{r.city}</span><div className="w-8 h-[1px] bg-[#D4AF37]/30"></div><span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em]">{r.cuisine_type}</span></div>
                  <h4 className="text-4xl font-serif italic text-white leading-none mb-6">{r.name}</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed font-light line-clamp-2 italic">"An unparalleled atmosphere of elite networking and architectural dining."</p>
                </div>
                <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center"><div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.5em] text-[#D4AF37] uppercase">Initiate protocol</div><ArrowRight size={20} className="text-white/20 group-hover:text-[#D4AF37] transition-all" /></div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </motion.section>
  );
};

export const Step5_Blueprints = ({ BLUEPRINTS, manifest, updateManifest, setStep }) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step5" {...fadeUp} className="w-full">
      <div className="text-left flex justify-between items-end border-b border-white/5 pb-12">
        <SectionHeading step={4} title="Architectural Blueprint." subtitle={`Optimized spatial arrangements for ${manifest.dynamicCapacity ? 'your dynamic guest list' : `${manifest.guests} patrons`}.`} />
        <button onClick={() => setStep(4)} className="text-white/20 hover:text-[#D4AF37] mb-12 text-[9px] tracking-widest font-bold uppercase border border-white/10 px-8 py-4 rounded-full">Re-evaluate Estate</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-10 mt-16">
        {BLUEPRINTS.map(bp => (
          <div key={bp.id} onClick={() => updateManifest('blueprint', bp)} className={`cursor-pointer rounded-[50px] overflow-hidden border transition-all duration-700 bg-black/40 backdrop-blur-md flex flex-col ${manifest.blueprint?.id === bp.id ? 'border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.15)] transform -translate-y-4' : 'border-white/10 hover:border-white/30'}`}>
            <div className="relative h-64 overflow-hidden">
              <img src={bp.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000" alt={bp.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-6 left-8"><span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] bg-black/80 px-4 py-2 rounded-full border border-[#D4AF37]/30">{bp.cap}</span></div>
            </div>
            <div className="p-10 flex-1 text-left">
              <h4 className="font-serif text-3xl text-white mb-4 italic leading-none">{bp.name}</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light italic">"{bp.desc}"</p>
            </div>
            <div className="p-8 border-t border-white/5 flex justify-between items-center bg-white/5">
              <span className="text-[9px] uppercase tracking-[0.6em] text-white/30 font-bold">Secure Zone</span>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${manifest.blueprint?.id === bp.id ? 'border-[#D4AF37] shadow-lg' : 'border-white/10'}`}>{manifest.blueprint?.id === bp.id && <div className="w-4 h-4 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#E6B325]"/>}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 flex justify-center"><OpusButton onClick={() => setStep(5.5)} disabled={!manifest.blueprint} className="!px-24">Lock Architectural Manifest</OpusButton></div>
    </motion.section>
  );
};

export const Step5_5_TableSelection = ({ tables, manifest, updateManifest, setStep }) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step5_5" {...fadeUp} className="w-full">
      <div className="text-left flex justify-between items-end border-b border-white/5 pb-12 mb-12">
        <SectionHeading step={5} title="Spatial Selection." subtitle={`Identify your specific coordinate within the ${manifest.venue?.name} estate.`} />
        <button onClick={() => setStep(5)} className="text-white/20 hover:text-[#D4AF37] mb-12 text-[9px] tracking-widest font-bold uppercase border border-white/10 px-8 py-4 rounded-full flex items-center gap-2"><ArrowLeft size={14}/> Re-order Blueprint</button>
      </div>
      
      <FloorPlan 
        tables={tables} 
        selectedTable={manifest.selectedTable} 
        onSelectTable={(table) => updateManifest('selectedTable', table)} 
      />

      <div className="mt-16 flex justify-center">
        <OpusButton 
          onClick={() => setStep(6)} 
          disabled={!manifest.selectedTable} 
          className="!px-24"
        >
          Confirm Spatial Coordinate
        </OpusButton>
      </div>
    </motion.section>
  );
};
