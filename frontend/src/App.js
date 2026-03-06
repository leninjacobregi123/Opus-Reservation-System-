// Book My Seat - Client Application
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Clock, MapPin, 
  ChevronRight, Star, Wine, ShieldCheck, 
  CreditCard, BellOff, Sparkles, Navigation,
  Award, ArrowRight, X, User, ArrowLeft,
  ChevronDown, GlassWater, UtensilsCrossed,
  Search, LogOut, CheckCircle, Palmtree,
  Building2, Waves, Tent, Landmark
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// --- API Client Configuration with Retry Logic ---
axios.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) return Promise.reject(error);
  config.retryCount = config.retryCount || 0;
  if (config.retryCount >= config.retry) return Promise.reject(error);
  config.retryCount += 1;
  const backoff = new Promise((resolve) => {
    setTimeout(() => resolve(), config.retryDelay || 1000);
  });
  await backoff;
  return axios(config);
});

// --- UI Error Boundary ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070708] text-white flex items-center justify-center text-center p-10 font-sans">
          <div className="max-w-md">
            <div className="w-20 h-20 border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-8 text-[#D4AF37]">
              <X size={32} />
            </div>
            <h2 className="text-4xl font-serif italic mb-4">Protocol Interrupted</h2>
            <p className="text-white/40 mb-8 font-light">The architectural interface encountered an unexpected state. Please re-initialize the session.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C4A030] transition-all">
              Re-initialize Interface
            </button>
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
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const IMAGES = {
  hero: "/assets/images/hero.jpg",
  interior: "/assets/images/interior.jpg",
  privateVault: "/assets/images/private.jpg",
  rooftop: "/assets/images/rooftop.jpg",
  balcony: "/assets/images/bistro.jpg",
  window: "/assets/images/window.jpg"
};

const restaurantImages = [
  "/assets/images/hero.jpg",
  "/assets/images/private.jpg",
  "/assets/images/rooftop.jpg",
  "/assets/images/window.jpg",
  "/assets/images/interior.jpg",
  "/assets/images/bistro.jpg",
  "/assets/images/gourmet.jpg"
];

const getRestaurantImage = (id) => restaurantImages[id % restaurantImages.length];

const VenueIcon = ({ type, size = 24 }) => {
  const icons = {
    'Italian': <UtensilsCrossed size={size} />,
    'Bistro': <Wine size={size} />,
    'Coastal': <Waves size={size} />,
    'Heritage': <Landmark size={size} />,
    'Rooftop': <Building2 size={size} />,
    'Default': <Navigation size={size} />
  };
  return icons[type] || icons['Default'];
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="w-full h-full flex flex-col items-center justify-center"
  >
    {children}
  </motion.div>
);

const GoldButton = ({ children, onClick, variant = "solid", className = "", disabled = false }) => {
  const styles = {
    solid: "bg-[#D4AF37] text-black hover:bg-[#C4A030]",
    outline: "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
    ghost: "text-white/60 hover:text-white"
  };
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Header = ({ currentUser, setStep, setAuthMode, setView, onLogout }) => (
  <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setStep('discovery')}>
      <div className="w-10 h-10 border border-[#D4AF37] rounded-full flex items-center justify-center text-[#D4AF37] font-serif italic text-xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all">B</div>
      <div>
        <span className="block text-sm font-serif font-bold tracking-widest uppercase">BOOK MY SEAT</span>
        <span className="block text-[8px] text-[#D4AF37] tracking-[0.3em] font-bold uppercase">Digital Protocol</span>
      </div>
    </div>
    
    <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
      <span className="hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => setStep('discovery')}>Discovery</span>
      <span className="hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => setView('reservations')}>My Archive</span>
      {currentUser ? (
        <div className="flex items-center gap-4 border-l border-white/10 pl-10">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold">
            {currentUser.full_name?.charAt(0)}
          </div>
          <button onClick={onLogout} className="hover:text-[#D4AF37] transition-colors"><LogOut size={14}/></button>
        </div>
      ) : (
        <button onClick={() => setAuthMode('login')} className="hover:text-[#D4AF37] transition-colors">Sign In</button>
      )}
    </div>
  </nav>
);

function App() {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [view, setView] = useState('main'); 
  const [step, setStep] = useState('discovery'); 
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingDate, setBookingDate] = useState('today');
  const [bookingTime, setBookingTime] = useState('20:30');
  const [guestCount, setGuestCount] = useState(2);
  const [protocols, setProtocols] = useState({ ghostPay: true, surprise: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const axiosConfig = () => ({ 
    headers: { Authorization: `Bearer ${getToken()}` },
    retry: 2, 
    retryDelay: 1000 
  });

  useEffect(() => {
    fetchRestaurants();
    if (currentUser) fetchMyBookings();
  }, [currentUser]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/restaurants`);
      setRestaurants(res.data.data || []);
    } catch (err) { console.error("Venue fetch error", err); }
  };

  const fetchTables = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/restaurants/${id}/tables`);
      setTables(res.data.data || []);
    } catch (err) { console.error("Table fetch error", err); }
    setLoading(false);
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/bookings/my-bookings`, axiosConfig());
      setMyBookings(res.data.data || []);
    } catch (err) { console.error("Bookings fetch error", err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
      setToken(res.data.data.token);
      setUser(res.data.data.user);
      setCurrentUser(res.data.data.user);
      setStep('discovery');
    } catch (err) { setMessage(err.response?.data?.message || 'Access Denied'); }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, { 
        email, password, full_name: fullName, phone: phone || '0000000000' 
      });
      setToken(res.data.data.token);
      setUser(res.data.data.user);
      setCurrentUser(res.data.data.user);
      setStep('discovery');
    } catch (err) { setMessage(err.response?.data?.message || 'Registration Failed'); }
    setLoading(false);
  };

  const handleVenueSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchTables(restaurant.id);
    setStep('selection');
  };

  const handleCreateBooking = async () => {
    if (!currentUser) { setAuthMode('login'); return; }
    setLoading(true);
    const date = bookingDate === 'today' ? new Date().toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0];
    try {
      await axios.post(`${BACKEND_URL}/bookings`, {
        restaurant_id: selectedRestaurant.id,
        table_id: selectedTable.id,
        booking_date: date,
        booking_time: bookingTime,
        guest_count: guestCount,
        is_surprise: protocols.surprise,
        notes: protocols.ghostPay ? "Ghost Pay Protocol enabled." : ""
      }, axiosConfig());
      setStep('success');
      fetchMyBookings();
    } catch (err) { setMessage(err.response?.data?.message || 'Booking Failed'); }
    setLoading(false);
  };

  const handleCancelBooking = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/bookings/${id}`, axiosConfig());
      fetchMyBookings();
    } catch (err) { console.error("Cancel failed", err); }
  };

  const resetFlow = () => {
    setStep('discovery');
    setView('main');
    setSelectedTable(null);
    setSelectedRestaurant(null);
  };

  const AuthView = () => (
    <PageTransition>
      <div className="grid lg:grid-cols-2 w-full max-w-6xl gap-16 items-center">
        <div className="hidden lg:block space-y-8 text-left">
          <header>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em]">Secure Key No. 004</span>
            <h2 className="text-8xl font-serif italic mt-4 leading-tight text-white">Elite <br/> Access.</h2>
          </header>
          <p className="text-white/40 max-w-md leading-loose text-sm font-light">
            Authenticate to synchronize your dining manifests and digital table keys.
          </p>
        </div>
        <div className="bg-[#111112] p-12 rounded-[40px] border border-white/5 shadow-2xl w-full max-w-md mx-auto">
          <h3 className="text-3xl font-serif italic mb-8 text-white">{authMode === 'login' ? 'Sign In' : 'Join Membership'}</h3>
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-6">
            {authMode === 'register' && (
              <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:border-[#D4AF37] outline-none text-white" value={fullName} onChange={e => setFullName(e.target.value)} required />
            )}
            <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:border-[#D4AF37] outline-none text-white" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:border-[#D4AF37] outline-none text-white" value={password} onChange={e => setPassword(e.target.value)} required />
            <GoldButton className="w-full py-5" disabled={loading}>{loading ? 'Authenticating...' : authMode === 'login' ? 'Enter' : 'Create Account'}</GoldButton>
          </form>
          {message && <p className="text-[#D4AF37] text-center mt-4 text-[10px] tracking-widest">{message}</p>}
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full text-center mt-8 text-[10px] text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors">
            {authMode === 'login' ? "Don't have an account? Join us" : "Already a member? Sign In"}
          </button>
        </div>
      </div>
    </PageTransition>
  );

  return (
    <div className="min-h-screen bg-[#070708] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      <Header currentUser={currentUser} setStep={setStep} setAuthMode={setAuthMode} setView={setView} onLogout={() => { logout(); setCurrentUser(null); }} />
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 'discovery' && view === 'main' && (
            <PageTransition key="discovery">
              <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                <div className="space-y-8 text-left">
                  <header>
                    <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em]">The Discovery Suite</span>
                    <h2 className="text-7xl md:text-8xl font-serif italic mt-4 leading-tight">Curated <br/> Venues.</h2>
                  </header>
                  <p className="text-white/40 max-w-md leading-loose text-sm font-light">Every venue in our digital collection offers architectural precision. Select a destination to initiate your reservation protocol.</p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {restaurants.map((r, idx) => (
                      <div key={r.id} onClick={() => handleVenueSelect(r)} className="relative group bg-[#111112] border border-white/10 rounded-[30px] cursor-pointer hover:border-[#D4AF37] transition-all overflow-hidden aspect-[4/3]">
                        <img src={getRestaurantImage(idx)} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={r.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        <div className="absolute top-6 right-6 text-[#D4AF37] opacity-40 group-hover:opacity-100 transition-opacity z-20"><VenueIcon type={r.cuisine_type} /></div>
                        <div className="absolute bottom-6 left-6 z-20 text-left">
                          <h4 className="font-serif italic text-xl group-hover:text-[#D4AF37]">{r.name}</h4>
                          <span className="text-[10px] text-white/40 tracking-widest uppercase">{r.city}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative group hidden lg:block">
                  <div className="absolute inset-0 border border-[#D4AF37]/30 translate-x-4 translate-y-4 rounded-[40px] transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl flex flex-col items-center justify-center bg-[#070708]">
                     <img src={IMAGES.hero} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Hero" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                     <div className="relative z-10 text-center">
                       <Sparkles size={60} className="text-[#D4AF37] opacity-40 mb-6 mx-auto" />
                       <h3 className="text-3xl font-serif italic text-white/40 uppercase tracking-widest">The Royal Standard</h3>
                     </div>
                  </div>
                </div>
              </div>
            </PageTransition>
          )}
          {step === 'selection' && selectedRestaurant && (
            <PageTransition key="selection">
              <div className="text-center mb-12">
                <button onClick={() => setStep('discovery')} className="text-white/30 hover:text-white flex items-center gap-2 mx-auto mb-6 transition-colors"><ArrowLeft size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Venues</span></button>
                <h2 className="text-4xl font-serif italic mb-2">Claim your perspective</h2>
                <p className="text-white/40 text-sm font-light">Select an architectural asset within {selectedRestaurant.name}.</p>
              </div>
              <div className="grid md:grid-cols-4 gap-6 w-full">
                {tables.map((t, idx) => (
                  <motion.div key={t.id} whileHover={{ y: -10 }} onClick={() => { if(t.is_available) { setSelectedTable(t); setStep('protocols'); } }} className={`relative aspect-[3/4] rounded-[30px] overflow-hidden group cursor-pointer border ${t.is_available ? 'border-white/5' : 'border-red-500/20 opacity-40 grayscale'}`}>
                    <img src={t.location_type === 'private' ? IMAGES.privateVault : t.location_type === 'rooftop' ? IMAGES.rooftop : t.location_type === 'window' ? IMAGES.window : t.location_type === 'balcony' ? IMAGES.balcony : IMAGES.interior} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt={t.table_number} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-left">
                      <span className="text-[#D4AF37] text-[10px] font-bold tracking-widest mb-1">{t.location_type.toUpperCase()}</span>
                      <h3 className="text-xl font-serif italic mb-1">Asset {t.table_number}</h3>
                      <p className="text-white/40 text-[10px] mb-4">{t.capacity} Guests • {t.is_available ? 'Available' : 'Reserved'}</p>
                      <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black group-hover:border-[#D4AF37] transition-all">{t.is_available ? <ArrowRight size={14} /> : <X size={14} />}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PageTransition>
          )}
          {step === 'protocols' && selectedTable && (
            <PageTransition key="protocols">
              <div className="max-w-2xl mx-auto w-full">
                <button onClick={() => setStep('selection')} className="text-white/30 hover:text-white flex items-center gap-2 mb-10 transition-colors"><ArrowLeft size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Assets</span></button>
                <header className="mb-12 text-left">
                  <h2 className="text-5xl font-serif italic mb-4">Luxury Protocols</h2>
                  <p className="text-white/40 font-light leading-relaxed">Customize your arrival at {selectedRestaurant.name}. Every detail is handled with absolute discretion.</p>
                </header>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                    <span className="text-[8px] text-[#D4AF37] tracking-widest uppercase mb-2 block">Schedule</span>
                    <select className="bg-transparent text-sm outline-none w-full text-white" value={bookingDate} onChange={e => setBookingDate(e.target.value)}>
                      <option value="today">Today</option><option value="tomorrow">Tomorrow</option>
                    </select>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                    <span className="text-[8px] text-[#D4AF37] tracking-widest uppercase mb-2 block">Arrival</span>
                    <select className="bg-transparent text-sm outline-none w-full text-white" value={bookingTime} onChange={e => setBookingTime(e.target.value)}>
                      <option value="19:30">19:30</option><option value="20:00">20:00</option><option value="20:30">20:30</option><option value="21:00">21:00</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div onClick={() => setProtocols(p => ({...p, ghostPay: !p.ghostPay}))} className={`p-6 rounded-[24px] border transition-all cursor-pointer flex justify-between items-center ${protocols.ghostPay ? 'bg-[#D4AF37]/5 border-[#D4AF37]' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex gap-4 items-center">
                      <CreditCard size={20} className={protocols.ghostPay ? 'text-[#D4AF37]' : 'text-white/20'} />
                      <div className="text-left">
                        <h4 className="font-bold tracking-widest uppercase text-[10px] mb-0.5">Ghost Pay Protocol</h4>
                        <p className="text-[9px] text-white/40 uppercase tracking-wider">Discreet settlement prior to arrival</p>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setProtocols(p => ({...p, surprise: !p.surprise}))} className={`p-6 rounded-[24px] border transition-all cursor-pointer flex justify-between items-center ${protocols.surprise ? 'bg-[#D4AF37]/5 border-[#D4AF37]' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex gap-4 items-center">
                      <BellOff size={20} className={protocols.surprise ? 'text-[#D4AF37]' : 'text-white/20'} />
                      <div className="text-left">
                        <h4 className="font-bold tracking-widest uppercase text-[10px] mb-0.5">Surprise Seating</h4>
                        <p className="text-[9px] text-white/40 uppercase tracking-wider">Private notification protocol</p>
                      </div>
                    </div>
                  </div>
                </div>
                <GoldButton className="w-full mt-10 py-5" onClick={() => setStep('manifest')}>Review Manifest <ChevronRight size={18} /></GoldButton>
              </div>
            </PageTransition>
          )}
          {step === 'manifest' && selectedTable && (
            <PageTransition key="manifest">
              <div className="max-w-md mx-auto relative w-full">
                <div className="absolute -inset-10 bg-[#D4AF37]/10 blur-[100px] pointer-events-none rounded-full" />
                <div className="relative bg-[#111112] border border-white/10 rounded-[40px] p-10 shadow-3xl text-center overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                  <div className="w-16 h-16 border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-8 text-[#D4AF37]"><Award size={28} /></div>
                  <h2 className="text-3xl font-serif italic mb-2">Final Manifest</h2>
                  <p className="text-[10px] text-[#D4AF37] font-bold tracking-[0.4em] uppercase mb-10">Verification Pending</p>
                  <div className="space-y-4 text-left mb-10">
                    <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-[9px] text-white/30 uppercase tracking-widest">Venue</span><span className="text-xs italic font-serif">{selectedRestaurant.name}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-[9px] text-white/30 uppercase tracking-widest">Asset</span><span className="text-xs font-serif italic">Table {selectedTable.table_number} ({selectedTable.location_type})</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-[9px] text-white/30 uppercase tracking-widest">Schedule</span><span className="text-xs uppercase tracking-wider">{bookingDate} • {bookingTime}</span></div>
                  </div>
                  <GoldButton className="w-full" onClick={handleCreateBooking} disabled={loading}>{loading ? 'Processing...' : 'Confirm Digital Key'}</GoldButton>
                </div>
              </div>
            </PageTransition>
          )}
          {step === 'success' && (
            <PageTransition key="success">
              <div className="max-w-md mx-auto w-full text-center">
                <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(212,175,55,0.4)]"><CheckCircle size={48} className="text-black" /></div>
                <h2 className="text-5xl font-serif italic mb-4">Access Granted.</h2>
                <p className="text-white/40 text-sm leading-loose mb-10">Your reservation manifest is encrypted. Your digital key is now active in the archive.</p>
                <div className="flex gap-4">
                  <GoldButton className="flex-1" onClick={() => { setView('reservations'); setStep('discovery'); }}>Archive</GoldButton>
                  <GoldButton variant="outline" className="flex-1" onClick={resetFlow}>Home</GoldButton>
                </div>
              </div>
            </PageTransition>
          )}
          {view === 'reservations' && (
            <PageTransition key="reservations">
              <div className="w-full max-w-4xl">
                <header className="flex justify-between items-end mb-12 text-left">
                  <div><span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em]">Dashboard</span><h2 className="text-6xl font-serif italic mt-4 leading-tight text-white">Your <br/> Archive.</h2></div>
                  <GoldButton variant="outline" onClick={() => { setView('main'); setStep('discovery'); }}><ArrowLeft size={14} /> Back</GoldButton>
                </header>
                <div className="space-y-6">
                  {myBookings.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-[40px]"><p className="text-white/20 uppercase tracking-[0.3em] text-[10px]">No active manifests found</p></div>
                  ) : (
                    myBookings.map(b => (
                      <div key={b.id} className="bg-[#111112] border border-white/10 p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-8 text-left">
                        <div className="flex gap-8 items-center">
                          <div className="text-center px-6 py-4 border-r border-white/10"><span className="block text-2xl font-serif italic text-[#D4AF37]">{new Date(b.booking_date).getDate()}</span><span className="block text-[8px] uppercase tracking-widest text-white/30">{new Date(b.booking_date).toLocaleString('en', { month: 'short' })}</span></div>
                          <div><h4 className="text-2xl font-serif italic text-white">{b.restaurant_name}</h4><p className="text-[10px] text-white/40 uppercase tracking-widest">{b.city} • Asset {b.table_number}</p></div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right"><span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${b.status === 'confirmed' ? 'text-green-500' : 'text-[#D4AF37]'}`}>{b.status}</span><p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">Protocol Active</p></div>
                          <button onClick={() => handleCancelBooking(b.id)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 text-white/20 hover:text-red-500 transition-all"><X size={16} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </PageTransition>
          )}
          {!currentUser && step !== 'discovery' && view === 'main' && <AuthView />}
        </AnimatePresence>
      </div>
      <footer className="fixed bottom-8 w-full px-12 flex justify-between items-center text-[9px] font-bold text-white/20 tracking-[0.3em] uppercase"><span>EST. 2024</span><div className="flex gap-8"><span className="hover:text-white transition-colors cursor-pointer">Protocol terms</span><span className="hover:text-white transition-colors cursor-pointer">Encryption</span><span className="hover:text-white transition-colors cursor-pointer">Concierge</span></div></footer>
    </div>
  );
}

function RootApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default RootApp;
