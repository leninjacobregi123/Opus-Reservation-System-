// Opus Dining - Sovereign Concierge Protocol (Production Edition)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Utils & Constants
import { getToken, setToken, getUser, setUser, logout } from './utils/auth';
import { getRestaurantImage } from './utils/images';
import { LOCAL_IMAGES, EVENT_TYPES, BLUEPRINTS } from './constants';
import { initSocket, disconnectSocket } from './utils/socket';

// Common Components
import OpusLogo from './components/common/OpusLogo';
import { Navbar, Footer } from './components/common/Layout';
import { NotificationCenter } from './components/common/NotificationToast';

// Step Components
import { Step0_Splash, Step1_Auth } from './components/booking/StepsAuth';
import { Step2_EventSelection, Step3_CoordinatesCapacity } from './components/booking/StepsEvent';
import { Step4_VenueSelection, Step5_Blueprints, Step5_5_TableSelection } from './components/booking/StepsVenue';
import { Step6_Gastronomy, Step7_Settlement } from './components/booking/StepsGastronomy';
import { Step8_Invites, Step9_FinalDashboard } from './components/booking/StepsFinal';

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

function App() {
  const [step, setStep] = useState(0); 
  const [currentUser, setCurrentUser] = useState(getUser());
  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  
  const [manifest, setManifest] = useState({
    user: 'leninjacob891@gmail.com', fullName: '', password: '', eventType: '', customEvent: '', location: 'Mumbai', venue: null,
    guests: 4, dynamicCapacity: false, blueprint: null, selectedTable: null, cart: [], customDish: '', skipMenu: false,
    paymentProtocol: 'retainer', guestInvites: [], newGuestName: '', newGuestEmail: '', rating: 0,
    bookingTime: '20:30', bookingDate: 'today'
  });

  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const axiosConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` }, retry: 2, retryDelay: 1000 });

  // Socket setup
  useEffect(() => {
    if (currentUser) {
      const socket = initSocket(currentUser.id);
      socket.on('notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
      });
      return () => disconnectSocket();
    }
  }, [currentUser]);

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
        table_id: manifest.selectedTable?.id || tables[0]?.id || 1, 
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
        token: guestToken 
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

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(2,2,2,0.6)_0%,_rgba(0,0,0,0.95)_100%)]" />
        <motion.div animate={{ rotateZ: 360, rotateX: 20 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }} className="w-[150vw] h-[150vw] absolute rounded-full border border-[#D4AF37]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d', perspective: 1000 }} />
      </div>

      <Navbar step={step} currentUser={currentUser} setStep={setStep} logout={logout} setCurrentUser={setCurrentUser} />
      <NotificationCenter notifications={notifications} setNotifications={setNotifications} />

      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && <Step0_Splash />}
          {step === 1 && (
            <Step1_Auth 
              authMode={authMode} 
              setAuthMode={setAuthMode} 
              handleLogin={handleLogin} 
              handleRegister={handleRegister} 
              manifest={manifest} 
              updateManifest={updateManifest} 
              loading={loading} 
              message={message} 
            />
          )}
          {step === 2 && currentUser && (
            <Step2_EventSelection 
              currentUser={currentUser} 
              EVENT_TYPES={EVENT_TYPES} 
              manifest={manifest} 
              updateManifest={updateManifest} 
              setStep={setStep} 
            />
          )}
          {step === 3 && (
            <Step3_CoordinatesCapacity 
              manifest={manifest} 
              updateManifest={updateManifest} 
              setStep={setStep} 
            />
          )}
          {step === 4 && (
            <Step4_VenueSelection 
              restaurants={restaurants} 
              manifest={manifest} 
              updateManifest={updateManifest} 
              fetchEstateDetails={fetchEstateDetails} 
              setStep={setStep} 
              getRestaurantImage={getRestaurantImage} 
            />
          )}
          {step === 5 && (
            <Step5_Blueprints 
              BLUEPRINTS={BLUEPRINTS} 
              manifest={manifest} 
              updateManifest={updateManifest} 
              setStep={setStep} 
            />
          )}
          {step === 5.5 && (
            <Step5_5_TableSelection 
              tables={tables}
              manifest={manifest} 
              updateManifest={updateManifest} 
              setStep={setStep} 
            />
          )}
          {step === 6 && (
            <Step6_Gastronomy 
              menuItems={menuItems} 
              manifest={manifest} 
              updateManifest={updateManifest} 
              toggleCartItem={toggleCartItem} 
              setStep={setStep} 
              LOCAL_IMAGES={LOCAL_IMAGES} 
              cartTotal={cartTotal} 
            />
          )}
          {step === 7 && (
            <Step7_Settlement 
              manifest={manifest} 
              updateManifest={updateManifest} 
              setStep={setStep} 
              cartTotal={cartTotal} 
              RETAINER_FEE={RETAINER_FEE} 
              settlementAmount={settlementAmount} 
              currentUser={currentUser} 
              loading={loading} 
              axiosConfig={axiosConfig}
              BACKEND_URL={BACKEND_URL}
            />
          )}
          {step === 8 && (
            <Step8_Invites 
              manifest={manifest} 
              updateManifest={updateManifest} 
              handleAddGuest={handleAddGuest} 
              handleFinalizeManifest={handleFinalizeManifest} 
            />
          )}
          {step === 9 && (
            <Step9_FinalDashboard 
              RETAINER_FEE={RETAINER_FEE} 
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function RootApp() { return ( <ErrorBoundary> <App /> </ErrorBoundary> ); }
export default RootApp;
