// Opus Dining - Sovereign Concierge Protocol (Production Edition)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Users, 
  ChevronRight, ArrowRight, ArrowLeft,
  GlassWater, Utensils, CreditCard, 
  Smartphone, Banknote, CheckCircle2,
  Sparkles, Camera, Lock, User,
  Music, Star, LocateFixed, Plus, 
  SkipForward, Mail, QrCode, PenTool, X,
  Diamond, Award, Landmark, Building2, Waves,
  Shield, Heart, Briefcase, PartyPopper, Gem, LogOut
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// --- Resilience Engine ---
axios.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) return Promise.reject(error);
  config.retryCount = config.retryCount || 0;
  if (config.retryCount >= config.retry) return Promise.reject(error);
  config.retryCount += 1;
  const backoff = new Promise((resolve) => setTimeout(() => resolve(), config.retryDelay || 1000));
  await backoff;
  return axios(config);
});

// --- UI Error Boundary ---
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center text-center p-10 font-sans">
          <div className="max-w-md">
            <OpusLogo className="w-24 h-24 mx-auto mb-10" />
            <h2 className="text-4xl font-serif italic mb-4 text-[#D4AF37]">Interface Disruption</h2>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase tracking-[0.4em]">Re-Initialize</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auth helpers
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); };
// --- Reimagined 3D Metallic Opus Logo ---
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

const getRestaurantImage = (id) => {
  const images = [
    "/assets/images/venue_lively.jpg",
    "/assets/images/hero_main.jpg",
    "/assets/images/venue_corporate.jpg",
    "/assets/images/venue_wedding.jpg",
    "/assets/images/venue_private.jpg",
    "/assets/images/venue_rooftop.jpg"
  ];
  return images[id % images.length];
};

// --- 3D Interaction Wrapper ---
const TiltCard = ({ children, className }) => {
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

// --- Shared UI ---
const OpusButton = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const styles = {
    primary: "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:brightness-110 disabled:opacity-50 disabled:grayscale",
    outline: "bg-[#050505] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10",
  };
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} disabled={disabled} className={`px-10 py-5 rounded-full text-[9px] font-bold uppercase tracking-[0.5em] transition-all duration-300 flex items-center justify-center gap-4 ${styles[variant]} ${className}`}>{children}</motion.button>
  );
};

const SectionHeading = ({ step, title, subtitle }) => (
  <header className="mb-12 relative z-10 text-center md:text-left">
    <div className="flex items-center justify-center md:justify-start gap-4 mb-6"><span className="w-8 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent hidden md:block" /><span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">Phase 0{step}</span></div>
    <h2 className="text-4xl lg:text-6xl font-serif font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 leading-tight mb-4 drop-shadow-xl">{title}</h2>
    <p className="text-xs font-light tracking-widest uppercase text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0">{subtitle}</p>
  </header>
);

const LOCAL_IMAGES = {
  hero: "/assets/images/hero_main.jpg",
  corporate: "/assets/images/venue_corporate.jpg",
  wedding: "/assets/images/venue_wedding.jpg",
  private: "/assets/images/venue_private.jpg",
  rooftop: "/assets/images/venue_rooftop.jpg",
  food: "/assets/images/food_1.jpg",
  beverage: "/assets/images/beverage_1.jpg",
  blueprint_axis: "/assets/images/blueprint_axis.jpg",
  blueprint_perimeter: "/assets/images/blueprint_perimeter.jpg",
  blueprint_constellation: "/assets/images/blueprint_constellation.jpg",
  event_corporate: "/assets/images/event_corporate.jpg",
  event_romance: "/assets/images/event_romance.jpg",
  event_wedding: "/assets/images/event_wedding.jpg",
  event_private: "/assets/images/event_private.jpg"
};

const EVENT_TYPES = [
  { id: 'corporate', label: 'Corporate Gala', icon: <Briefcase size={18}/>, img: LOCAL_IMAGES.event_corporate },
  { id: 'romance', label: 'Intimate Anniversary', icon: <Heart size={18}/>, img: LOCAL_IMAGES.event_romance },
  { id: 'wedding', label: 'Wedding Reception', icon: <PartyPopper size={18}/>, img: LOCAL_IMAGES.event_wedding },
  { id: 'private', label: 'Private Reserve', icon: <Shield size={18}/>, img: LOCAL_IMAGES.event_private }
];

const BLUEPRINTS = [
  { id: 'B1', name: 'The Imperial Axis', cap: '10-50 Guests', desc: 'A grand central table alignment maximizing conversational flow.', image: LOCAL_IMAGES.blueprint_axis },
  { id: 'B2', name: 'Secluded Perimeter', cap: '2-12 Guests', desc: 'Discreet alcove arrangements prioritizing acoustic privacy.', image: LOCAL_IMAGES.blueprint_perimeter },
  { id: 'B3', name: 'Gala Constellation', cap: '50+ Guests', desc: 'Distributed cluster seating fostering a dynamic, roaming networking environment.', image: LOCAL_IMAGES.blueprint_constellation }
];

// --- Main App ---
function App() {
  const [step, setStep] = useState(0); 
  const [currentUser, setCurrentUser] = useState(getUser());
  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const [manifest, setManifest] = useState({
    user: 'leninjacob891@gmail.com', fullName: '', password: '', eventType: '', customEvent: '', location: 'Mumbai', venue: null,
    guests: 4, dynamicCapacity: false, blueprint: null, cart: [], customDish: '', skipMenu: false,
    paymentProtocol: 'retainer', guestInvites: [], newGuestName: '', newGuestEmail: '', rating: 0,
    bookingTime: '20:30', bookingDate: 'today'
  });

  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const axiosConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` }, retry: 2, retryDelay: 1000 });

  useEffect(() => {
    fetchRestaurants();
    if (currentUser) fetchMyBookings();
    if (step === 0) { const timer = setTimeout(() => setStep(currentUser ? 2 : 1), 3000); return () => clearTimeout(timer); }
  }, [step, currentUser]);

  const fetchRestaurants = async () => {
    try { const res = await axios.get(`${BACKEND_URL}/restaurants`); setRestaurants(res.data.data || []); } catch (err) { console.error(err); }
  };

  const fetchEstateDetails = async (venue) => {
    setLoading(true);
    try {
      const [tableRes, menuRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/restaurants/${venue.id}/tables`),
        axios.get(`${BACKEND_URL}/restaurants/${venue.id}/menu`)
      ]);
      setTables(tableRes.data.data || []);
      setMenuItems(menuRes.data.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchMyBookings = async () => {
    try {
      const url = currentUser?.role === 'admin' ? `${BACKEND_URL}/bookings` : `${BACKEND_URL}/bookings/my-bookings`;
      const res = await axios.get(url, axiosConfig());
      setMyBookings(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, { email: manifest.user, password: manifest.password });
      setToken(res.data.data.token);
      setUser(res.data.data.user);
      setCurrentUser(res.data.data.user);
      setStep(2);
    } catch (err) { setMessage('Identity unverified.'); }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, { 
        email: manifest.user, 
        password: manifest.password, 
        full_name: manifest.fullName, 
        phone: '0000000000' 
      });
      setToken(res.data.data.token);
      setUser(res.data.data.user);
      setCurrentUser(res.data.data.user);
      setStep(2);
    } catch (err) { setMessage('Lineage establishment failed.'); }
    setLoading(false);
  };

  const handleFinalizeManifest = async () => {
    setLoading(true);
    const date = manifest.bookingDate === 'today' ? new Date().toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0];
    try {
      await axios.post(`${BACKEND_URL}/bookings`, {
        restaurant_id: manifest.venue.id,
        table_id: tables[0]?.id || 1, 
        booking_date: date,
        booking_time: manifest.bookingTime,
        guest_count: manifest.guests,
        notes: `Event: ${manifest.eventType}. Protocol: ${manifest.paymentProtocol}. Menu: ${manifest.cart.map(m => m.name).join(', ')}`
      }, axiosConfig());
      setStep(9);
      fetchMyBookings();
    } catch (err) { setMessage('Protocol Collision Detected.'); }
    setLoading(false);
  };

  const handleCancelBooking = async (id) => {
    try { await axios.delete(`${BACKEND_URL}/bookings/${id}`, axiosConfig()); fetchMyBookings(); } catch (err) { console.error(err); }
  };

  const updateManifest = (key, value) => setManifest(prev => ({ ...prev, [key]: value }));
  const toggleCartItem = (item) => {
    setManifest(prev => ({ ...prev, cart: prev.cart.some(i => i.id === item.id) ? prev.cart.filter(i => i.id !== item.id) : [...prev.cart, item] }));
  };
  const handleAddGuest = () => {
    if(manifest.newGuestName && manifest.newGuestEmail) {
      const guestToken = `OPUS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const updatedInvites = [...manifest.guestInvites, { 
        name: manifest.newGuestName, 
        email: manifest.newGuestEmail,
        token: guestToken // Proprietary Access Token
      }];
      setManifest(prev => ({ 
        ...prev, 
        guestInvites: updatedInvites, 
        guests: prev.dynamicCapacity ? updatedInvites.length : prev.guests, 
        newGuestName: '', 
        newGuestEmail: '' 
      }));
    }
  };

  const cartTotal = manifest.cart.reduce((sum, item) => sum + item.price, 0);
  const RETAINER_FEE = 15000; 
  const settlementAmount = manifest.paymentProtocol === 'retainer' ? RETAINER_FEE : (RETAINER_FEE + cartTotal);
  const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(2,2,2,0.6)_0%,_rgba(0,0,0,0.95)_100%)]" />
        <motion.div animate={{ rotateZ: 360, rotateX: 20 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }} className="w-[150vw] h-[150vw] absolute rounded-full border border-[#D4AF37]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d', perspective: 1000 }} />
      </div>

      <AnimatePresence>
        {step > 0 && (
          <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 w-full z-50 px-12 py-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-[#000] to-transparent backdrop-blur-md border-b border-white/5 gap-4">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setStep(currentUser ? 2 : 1)}>
              <OpusLogo className="w-16 h-16 md:w-20 md:h-20" showText={true} userName={currentUser?.full_name} />
            </div>
            {step > 1 && step < 9 && (
              <div className="flex gap-3 items-center">
                {[2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className={`h-[2px] rounded-full transition-all duration-700 ${step >= i ? 'w-10 bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)]' : 'w-2 bg-white/10'}`} />
                ))}
              </div>
            )}
            {currentUser && <button onClick={() => { logout(); setCurrentUser(null); setStep(1); }} className="text-[9px] font-bold text-white/20 hover:text-[#9B1B30] uppercase tracking-widest flex items-center gap-2">Log Out <LogOut size={12}/></button>}
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">

          {/* STEP 0: SPLASH */}
          {step === 0 && (
            <motion.section key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} className="flex flex-col items-center justify-center w-full text-center">
              <OpusLogo className="w-80 h-80 mb-16" />
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] font-bold tracking-[0.8em] uppercase text-[#D4AF37] glow-text">Initializing Sovereign Protocol</motion.div>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section key="step1" {...fadeUp} className="w-full max-w-md">
              <div className="bg-[#0A0A0A] rounded-[50px] p-12 border border-white/10 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <div className="text-center mb-12 relative z-10">
                  <OpusLogo className="w-20 h-20 mx-auto mb-6" />
                  
                  {/* Auth Mode Tabs */}
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
          )}
{/* STEP 2: EVENT */}
{step === 2 && currentUser && (
  <motion.section key="step2" {...fadeUp} className="w-full max-w-5xl text-left">
    <SectionHeading 
      step={1} 
      title={`Greetings, ${currentUser?.full_name?.split(' ')[0] || 'Patron'}.`} 
      subtitle="Tell us, what is the special event you are planning to organize, so we may curate the appropriate atmosphere?" 
    />
              />              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                {EVENT_TYPES.map(type => (
                  <motion.div whileHover={{ y: -10 }} key={type.id} onClick={() => { updateManifest('eventType', type.label); setStep(3); }} className={`relative aspect-[4/5] rounded-[40px] border cursor-pointer overflow-hidden group transition-all ${manifest.eventType === type.label ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'border-white/5'}`}>
                    <img src={type.img} alt={type.label} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-10 left-10 text-left">
                      <div className="text-[#D4AF37] mb-4">{type.icon}</div>
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
          )}

          {/* STEP 3: COORDINATES & CAPACITY */}
          {step === 3 && (
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
          )}

          {/* STEP 4: VENUE SELECTION */}
          {step === 4 && (
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
          )}

          {/* STEP 5: BLUEPRINTS */}
          {step === 5 && (
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
              <div className="mt-16 flex justify-center"><OpusButton onClick={() => setStep(6)} disabled={!manifest.blueprint} className="!px-24">Lock Architectural Manifest</OpusButton></div>
            </motion.section>
          )}

          {/* STEP 6: GASTRONOMY */}
          {step === 6 && (
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
          )}

          {/* STEP 7: SETTLEMENT */}
          {step === 7 && (
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
                  <OpusButton onClick={() => setStep(8)} disabled={loading} className="w-full !py-10 !rounded-[35px] !text-[11px] !tracking-[1em] !mt-12">{loading ? 'ENCRYPTING...' : 'AFFIX ROYAL SEAL'}</OpusButton>
                </div>
              </div>
            </motion.section>
          )}

          {/* STEP 8: INVITES */}
          {step === 8 && (
            <motion.section key="step8" {...fadeUp} className="w-full max-w-5xl mx-auto text-left">
              <SectionHeading step={7} title="Guest Accession." subtitle="Generate secure, encrypted digital invitations. Only patrons on this manifest will be granted entry." />
              <div className="grid lg:grid-cols-12 gap-20 mt-20">
                <div className="lg:col-span-7 space-y-12">
                  <div className="lotus-panel p-12 space-y-10 bg-black/40 border-white/10 shadow-2xl">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.6em] text-[#D4AF37] flex items-center gap-4"><Mail size={20}/> Add Guest to Protocol</h3>
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
                          
                          {/* Visual Token Representation */}
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
          )}

          {/* STEP 9: FINAL DASHBOARD */}
          {step === 9 && (
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
          )}

        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 w-full px-16 py-8 flex justify-between items-center text-[10px] font-bold text-white/20 tracking-[0.8em] uppercase bg-[#020202]/80 backdrop-blur-3xl border-t border-white/5 z-50">
        <span>IMPERIAL SOVEREIGN PROTOCOL EST. 2024</span>
        <div className="flex gap-20">
          <span className="hover:text-[#D4AF37] transition-all cursor-pointer">The Decrees</span>
          <span className="hover:text-[#D4AF37] transition-all cursor-pointer">Treasury</span>
          <span className="hover:text-[#D4AF37] transition-all cursor-pointer">The High Court</span>
        </div>
      </footer>
    </div>
  );
}

function RootApp() { return ( <ErrorBoundary> <App /> </ErrorBoundary> ); }
export default RootApp;
