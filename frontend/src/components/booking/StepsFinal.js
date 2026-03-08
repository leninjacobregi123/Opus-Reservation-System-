import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading, OpusButton } from '../common/UI';
import OpusLogo from '../common/OpusLogo';
import { Mail, QrCode, CheckCircle2 } from 'lucide-react';

export const Step8_Invites = ({ 
  manifest, 
  updateManifest, 
  handleAddGuest, 
  handleFinalizeManifest 
}) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step8" {...fadeUp} className="w-full max-w-5xl mx-auto text-left">
      <SectionHeading step={7} title="Guest Accession." subtitle="Generate secure, encrypted digital invitations. Only patrons on this manifest will be granted entry." />
      <div className="grid lg:grid-cols-12 gap-20 mt-20">
        <div className="lg:col-span-7 space-y-12">
          <div className="lotus-panel p-12 space-y-10 bg-black/40 border-white/10 shadow-2xl">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-4"><Mail size={20}/> Add Guest to Protocol</h3>
            <div className="space-y-6">
              <input type="text" placeholder="Guest Full Legal Name" value={manifest.newGuestName} onChange={(e)=>updateManifest('newGuestName',e.target.value)} className="w-full bg-black/60 border border-white/5 rounded-2xl py-6 px-8 text-lg text-white focus:border-[#D4AF37] transition-all outline-none font-serif italic" />
              <div className="flex gap-6">
                <input type="email" placeholder="Encrypted Email Link" value={manifest.newGuestEmail} onChange={(e)=>updateManifest('newGuestEmail',e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter')handleAddGuest();}} className="w-full bg-black/60 border border-white/5 rounded-2xl py-6 px-8 text-lg text-white focus:border-[#D4AF37] transition-all outline-none" />
                <button onClick={handleAddGuest} className="bg-[#D4AF37] text-black px-10 rounded-2xl hover:bg-white transition-all font-black text-2xl shadow-2xl">+</button>
              </div>
            </div>
          </div>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-6 custom-scrollbar">
            <h3 className="text-[11px] uppercase tracking-[0.8em] text-white/20 font-bold ml-4">Current Protocol Manifest ({manifest.guestInvites.length} {manifest.dynamicCapacity ? 'Created' : `/ ${manifest.guests}`})</h3>
            {manifest.guestInvites.length === 0 ? (
              <div className="py-24 rounded-[40px] border-2 border-dashed border-white/5 text-center text-sm text-white/10 uppercase tracking-[1em] italic font-light">"No Patrons Identified"</div>
            ) : (
              manifest.guestInvites.map((g, idx) => (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={idx} className="p-8 rounded-[35px] bg-[#0A0A0A] border border-white/5 flex flex-col gap-6 shadow-3xl hover:border-[#D4AF37]/30 transition-all group">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-8 items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#BF953F] to-[#B38728] flex items-center justify-center text-black font-black text-xs">{g.name[0]}</div>
                      <div>
                        <p className="text-2xl font-serif text-white italic leading-none mb-2">{g.name}</p>
                        <p className="text-[10px] text-gray-500 tracking-[0.3em] font-bold uppercase">{g.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all">Token Verified</span>
                      <CheckCircle2 size={24} className="text-green-500/40" />
                    </div>
                  </div>
                  
                  <div className="bg-black/60 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-4">
                      <QrCode size={32} className="text-[#D4AF37] opacity-40" />
                      <code className="text-[10px] text-[#D4AF37] tracking-[0.2em] font-bold">{g.token}</code>
                    </div>
                    <span className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">Encrypted Access</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-b from-[#111] to-[#020202] p-16 rounded-[60px] border border-white/5 shadow-[0_60px_120px_rgba(0,0,0,1)] text-center sticky top-48 overflow-hidden group">
            <div className="absolute -inset-10 bg-[#D4AF37]/5 blur-[80px] group-hover:bg-[#D4AF37]/10 transition-all duration-1000"></div>
            <QrCode className="mx-auto text-[#D4AF37] mb-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]" size={80} />
            <h3 className="text-4xl font-serif italic text-white mb-4">Dispatch Invites.</h3>
            <p className="text-[11px] text-white/30 tracking-[0.5em] leading-relaxed mb-12 uppercase font-bold">Encrypting & Generating dynamic <br/> QR tokens for {manifest.guestInvites.length} patrons.</p>
            <OpusButton onClick={handleFinalizeManifest} className="w-full !py-10 !text-[11px] !tracking-[1em] !rounded-[35px] shadow-3xl">LOCK & DISPATCH PROTOCOL</OpusButton>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export const Step9_FinalDashboard = ({ RETAINER_FEE }) => (
  <motion.section key="step9" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto text-center relative">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none rounded-full"></div>
    <OpusLogo className="w-48 h-48 mx-auto mb-16 relative z-10 p-4" />
    <h2 className="text-[100px] font-serif mb-8 text-[#F4F1EB] leading-none glow-text">Manifest <span className="italic text-[#9B1B30] font-light">Secured.</span></h2>
    <p className="text-white/40 text-3xl leading-relaxed mb-20 max-w-xl mx-auto font-light italic italic">"The imperial manifest has been locked. Your guests have received their encrypted tokens. The high concierge awaits."</p>
    <div className="lotus-panel p-16 bg-black/80 shadow-3xl relative z-10 border-[#D4AF37]/20">
       <div className="flex justify-between items-end border-b border-white/5 pb-10 mb-10">
          <div className="text-left space-y-2"><span className="text-[11px] font-bold uppercase tracking-[0.8em] text-[#D4AF37]">Final Settlement</span><h3 className="text-4xl font-serif italic text-white">The Treasury Ledger</h3></div>
          <span className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Status: Partially Settle</span>
       </div>
       <div className="space-y-6 text-left mb-12">
          <div className="flex justify-between items-center text-sm font-light italic"><span className="text-white/40">Retainer Authenticated</span><span className="text-[#D4AF37] font-bold">- ₹{RETAINER_FEE.toLocaleString()}</span></div>
          <div className="flex justify-between items-center text-sm font-light italic"><span className="text-white/40">Curation Total (Inc. On-site)</span><span className="text-white font-bold">₹85,000</span></div>
          <div className="flex justify-between items-end border-t border-white/10 pt-8 mt-4"><span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.8em]">Balance to Settle</span><span className="text-5xl font-serif text-white glow-text">₹70,000</span></div>
       </div>
       <button onClick={() => window.location.reload()} className="btn-gold w-full py-10 rounded-full text-[11px] tracking-[1em] shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:scale-105 transition-all">RETURN TO CHRONICLES</button>
    </div>
  </motion.section>
);
