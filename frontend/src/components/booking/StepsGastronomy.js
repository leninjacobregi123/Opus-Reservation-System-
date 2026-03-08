import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading, OpusButton } from '../common/UI';
import { 
  SkipForward, PenTool, CheckCircle2, Plus, Gem, X, 
  ArrowLeft, CreditCard, Smartphone 
} from 'lucide-react';
import StripePayment from './StripePayment';

export const Step6_Gastronomy = ({ 
  menuItems, 
  manifest, 
  updateManifest, 
  toggleCartItem, 
  setStep, 
  LOCAL_IMAGES, 
  cartTotal 
}) => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step6" {...fadeUp} className="w-full">
       <div className="text-left flex justify-between items-end border-b border-white/5 pb-12 mb-16">
         <SectionHeading step={5} title="Culinary Curation." subtitle="Select from our heritage inventory or defer selection to arrival." />
         <div className="flex gap-6 mb-12">
           <button onClick={() => setStep(5)} className="text-white/20 hover:text-white text-[10px] tracking-widest font-bold uppercase border border-white/10 px-8 py-4 rounded-full transition-all">Previous Phase</button>
           <button onClick={() => { updateManifest('skipMenu', true); setStep(7); }} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] hover:text-white bg-[#D4AF37]/10 px-10 py-4 rounded-full border border-[#D4AF37]/30 shadow-2xl transition-all">Defer Selection <SkipForward size={16}/></button>
         </div>
       </div>
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-8 h-[700px] overflow-y-auto pr-8 custom-scrollbar">
          <div className="bg-black/40 border border-white/10 rounded-[40px] p-8 flex items-center gap-6 focus-within:border-[#D4AF37]/50 transition-all group">
            <PenTool className="text-white/20 group-focus-within:text-[#D4AF37]" size={24} />
            <input type="text" placeholder="Request a bespoke off-menu provision..." value={manifest.customDish} onChange={(e) => updateManifest('customDish', e.target.value)} className="w-full bg-transparent text-lg text-white outline-none placeholder-gray-700 italic font-light" />
          </div>
          {menuItems.map(item => {
            const isSelected = manifest.cart.some(i => i.id === item.id);
            return (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item.id} onClick={() => { toggleCartItem(item); updateManifest('skipMenu', false); }} className={`p-8 rounded-[45px] border cursor-pointer flex justify-between items-center transition-all group ${isSelected ? 'bg-[#D4AF37]/5 border-[#D4AF37]/40 shadow-3xl' : 'bg-black/40 border-white/5 hover:border-white/10'}`}>
                 <div className="flex items-center gap-10 text-left">
                   <div className="w-24 h-24 rounded-[30px] overflow-hidden border border-white/5 group-hover:border-[#D4AF37]/30 transition-all"><img src={item.price > 2000 ? LOCAL_IMAGES.food : LOCAL_IMAGES.beverage} className={`w-full h-full object-cover transition-all duration-[2000ms] ${isSelected ? 'scale-110 grayscale-0' : 'grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0'}`} alt={item.name} /></div>
                   <div>
                     <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#D4AF37] mb-2 block">{item.category}</span>
                     <h4 className="text-4xl font-serif text-white italic leading-none group-hover:text-[#D4AF37] transition-all">{item.name}</h4>
                     <p className="text-[11px] text-white/30 font-light mt-3 max-w-sm line-clamp-1 italic">"{item.description}"</p>
                   </div>
                 </div>
                 <div className="text-right flex items-center gap-12 pr-6">
                   <span className="text-2xl font-serif text-white font-light italic">₹{item.price.toLocaleString()}</span>
                   <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-2xl' : 'bg-white/5 border-white/10 text-white/20'}`}>{isSelected ? <CheckCircle2 size={24} /> : <Plus size={20} />}</div>
                 </div>
              </motion.div>
            )
          })}
        </div>
        <div className="lg:col-span-5 h-fit sticky top-48">
          <div className="lotus-panel p-16 space-y-12 bg-black/80 shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-6 text-[#E6B325] border-b border-white/5 pb-10"><Gem size={32}/><h3 className="text-5xl font-serif italic text-white">The Manifest.</h3></div>
            <div className="space-y-8 max-h-[300px] overflow-y-auto pr-6 custom-scrollbar">
              {manifest.cart.length === 0 && !manifest.customDish ? <p className="text-sm text-white/20 uppercase tracking-[0.6em] text-center py-20 italic">"Registry Empty"</p> : (
                manifest.cart.map((item, i) => (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex justify-between items-center group">
                    <span className="text-[#F4F1EB] text-lg font-light italic leading-none group-hover:text-[#D4AF37] transition-all">"{item.name}"</span>
                    <div className="flex items-center gap-10">
                      <span className="text-lg font-bold tracking-widest text-[#D4AF37]/60">₹{item.price.toLocaleString()}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleCartItem(item); }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#9B1B30] hover:bg-[#9B1B30] hover:text-white shadow-xl transition-all"><X size={18}/></button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="pt-12 border-t border-white/10 flex justify-between items-end">
              <div className="flex flex-col text-left"><span className="text-[11px] text-[#D4AF37] uppercase tracking-[0.8em] font-bold mb-3">Total Estimated Tribute</span><span className="text-6xl font-serif text-[#F4F1EB] glow-text leading-none">₹{cartTotal.toLocaleString()}</span></div>
              <OpusButton onClick={() => setStep(7)} disabled={manifest.cart.length === 0 && !manifest.customDish} className="!px-16 !py-8 !text-[11px]">Finalize Curation</OpusButton>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export const Step7_Settlement = ({ 
  manifest, 
  updateManifest, 
  setStep, 
  cartTotal, 
  RETAINER_FEE, 
  settlementAmount, 
  currentUser, 
  loading,
  axiosConfig,
  BACKEND_URL
}) => {
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <motion.section key="step7" {...fadeUp} className="w-full max-w-5xl text-center space-y-24">
      <div className="space-y-8">
        <button onClick={() => setStep(6)} className="text-white/20 hover:text-[#D4AF37] mb-12 text-[10px] tracking-[0.6em] font-bold uppercase border border-white/10 px-10 py-5 rounded-full transition-all mx-auto flex items-center gap-3"><ArrowLeft size={16}/> RE-CURATE GASTRONOMY</button>
        <SectionHeading step={6} title="The Settlement." subtitle="Settle the reservation retainer now. Final adjustments will be processed at the conclusion of the event." />
      </div>
      <div className="grid lg:grid-cols-12 gap-20 mt-16 text-left items-start">
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-10">
            {[
              { id: 'retainer', label: 'Reservation Retainer Only', desc: 'Secure the venue & spatial blueprint. Balance paid post-event.', amt: RETAINER_FEE },
              { id: 'full', label: 'Total Estimated Settlement', desc: 'Includes retainer and pre-ordered provisions.', amt: RETAINER_FEE + cartTotal },
            ].map(method => (
              <div key={method.id} onClick={() => updateManifest('paymentProtocol', method.id)} className={`p-10 rounded-[45px] border-2 cursor-pointer transition-all duration-700 relative group flex justify-between items-center ${manifest.paymentProtocol === method.id ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_60px_rgba(212,175,55,0.1)]' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                <div className="space-y-3">
                  <span className="text-2xl font-serif italic text-white group-hover:text-[#D4AF37] transition-all">{method.label}</span>
                  <p className="text-[11px] text-white/30 uppercase tracking-[0.4em] font-bold">{method.desc}</p>
                  <span className="text-4xl font-serif text-[#D4AF37] block mt-6">₹{method.amt.toLocaleString()}</span>
                </div>
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${manifest.paymentProtocol === method.id ? 'border-[#D4AF37] shadow-xl' : 'border-white/10'}`}>{manifest.paymentProtocol === method.id && <div className="w-6 h-6 bg-[#D4AF37] rounded-full shadow-[0_0_20px_#E6B325]"/>}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-10 items-center pl-10 border-l-2 border-white/5">
            <span className="text-[11px] font-bold uppercase tracking-[0.8em] text-[#D4AF37]">Method:</span>
            <button className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-4 hover:text-[#D4AF37] transition-all"><CreditCard size={20}/> BLACK CARD</button>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <button className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-4 hover:text-[#D4AF37] transition-all"><Smartphone size={20}/> ENCRYPTED UPI</button>
          </div>
        </div>
        <div className="lg:col-span-5 lotus-panel p-16 space-y-12 bg-black/80 shadow-3xl relative">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <h3 className="text-3xl font-serif italic text-[#F4F1EB] border-b border-white/5 pb-8">Decree Summary</h3>
          <div className="space-y-8">
            {[
              { l: 'Patron', v: currentUser?.full_name },
              { l: 'Estate', v: manifest.venue?.name },
              { l: 'Blueprint', v: manifest.blueprint?.name },
              { l: 'Capacity', v: manifest.dynamicCapacity ? 'Dynamic Protocol' : `${manifest.guests} Patrons` },
              { l: 'Intent', v: manifest.eventType },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-bold">{row.l}</span><span className="text-lg font-serif italic text-[#F4F1EB]">{row.v}</span></div>
            ))}
            <div className="pt-12 mt-12 border-t border-white/5 flex justify-between items-end"><div className="flex flex-col"><span className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37] font-bold mb-2">Due Now</span><span className="text-6xl font-serif text-[#F4F1EB] glow-text leading-none">₹{settlementAmount.toLocaleString()}</span></div></div>
          </div>
          
          {!paymentInitiated ? (
            <OpusButton 
              onClick={() => setPaymentInitiated(true)} 
              disabled={loading} 
              className="w-full !py-10 !rounded-[35px] !text-[11px] !tracking-[1em] !mt-12"
            >
              INITIALIZE GATEWAY
            </OpusButton>
          ) : (
            <div className="mt-12">
               <StripePayment 
                  amount={settlementAmount} 
                  bookingId={manifest.venue?.id} // Placeholder
                  onPaymentSuccess={() => setStep(8)}
                  axiosConfig={axiosConfig}
                  BACKEND_URL={BACKEND_URL}
               />
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
