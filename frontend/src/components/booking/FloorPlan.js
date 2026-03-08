import React from 'react';
import { motion } from 'framer-motion';
import { Users, Info } from 'lucide-react';

const FloorPlan = ({ tables, selectedTable, onSelectTable }) => {
  // Find the bounds of the floor plan
  const maxX = Math.max(...tables.map(t => t.position_x || 0), 800);
  const maxY = Math.max(...tables.map(t => t.position_y || 0), 400);

  // Padding
  const width = maxX + 100;
  const height = maxY + 100;

  return (
    <div className="relative w-full bg-[#050505] rounded-[40px] border border-white/10 p-10 overflow-hidden shadow-2xl">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />
      
      <div className="relative w-full overflow-auto custom-scrollbar" style={{ maxHeight: '600px' }}>
        <div style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }} className="mx-auto">
          {/* Legend/Labels for zones */}
          <div className="absolute top-4 left-4 flex gap-6 text-[9px] uppercase tracking-widest font-bold text-gray-500">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"/> Selected</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-white/20"/> Available</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white/5 opacity-50"/> Occupied</div>
          </div>

          {tables.map((table) => {
            const isSelected = selectedTable?.id === table.id;
            const isAvailable = table.is_available !== 0; // assuming 1 is available

            return (
              <motion.div
                key={table.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={isAvailable ? { scale: 1.1, zIndex: 20 } : {}}
                onClick={() => isAvailable && onSelectTable(table)}
                style={{
                  left: `${table.position_x}px`,
                  top: `${table.position_y}px`,
                  position: 'absolute',
                }}
                className={`
                  w-20 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500
                  ${isSelected ? 'bg-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.6)] z-10' : 
                    isAvailable ? 'bg-black border border-white/10 text-white hover:border-[#D4AF37]/50 shadow-xl' : 
                    'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed opacity-50'}
                `}
              >
                <span className="text-[10px] font-bold tracking-tighter mb-1">{table.table_number}</span>
                <div className="flex items-center gap-1">
                  <Users size={10} />
                  <span className="text-[10px] font-black">{table.capacity}</span>
                </div>
                
                {/* Location Tooltip-like label */}
                <div className={`absolute -bottom-8 px-3 py-1 rounded-full text-[7px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                  {table.location_type}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Info size={16} className="text-[#D4AF37]" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
            Click on an available table to secure your specific spatial coordinate.
          </p>
        </div>
        {selectedTable && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-right">
            <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-[0.3em] block mb-1">Current Target</span>
            <span className="text-xl font-serif italic text-white">Table {selectedTable.table_number} — {selectedTable.location_type}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FloorPlan;
