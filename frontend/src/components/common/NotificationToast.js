import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const NotificationToast = ({ notification, onClear }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClear(notification.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onClear]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-[#D4AF37]" size={20} />,
    warning: <AlertCircle className="text-orange-500" size={20} />
  };

  const colors = {
    success: 'border-green-500/30 bg-green-500/5',
    error: 'border-red-500/30 bg-red-500/5',
    info: 'border-[#D4AF37]/30 bg-[#D4AF37]/5',
    warning: 'border-orange-500/30 bg-orange-500/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        w-80 p-6 rounded-[25px] border backdrop-blur-xl shadow-2xl flex gap-4 relative overflow-hidden group
        ${colors[notification.type || 'info']}
      `}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-transparent opacity-50" />
      
      <div className="flex-shrink-0 mt-1">
        {icons[notification.type] || icons.info}
      </div>
      
      <div className="flex-1 text-left">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-1">
          {notification.title}
        </h4>
        <p className="text-[11px] text-white/60 leading-relaxed font-light italic">
          "{notification.message}"
        </p>
        <span className="text-[7px] text-white/20 uppercase tracking-widest mt-3 block font-bold">
          {new Date(notification.created_at).toLocaleTimeString()}
        </span>
      </div>

      <button 
        onClick={() => onClear(notification.id)}
        className="absolute top-4 right-4 text-white/10 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const NotificationCenter = ({ notifications, setNotifications }) => {
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-12 right-12 z-[100] flex flex-col gap-4">
      <AnimatePresence>
        {notifications.map(notification => (
          <NotificationToast 
            key={notification.id} 
            notification={notification} 
            onClear={clearNotification} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
