'use client';

import React from 'react';
import { MapPin, ExternalLink, Info, Phone, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const PollingInfo = () => {
  const boothAddress = "Booth 14 - Primary School Building, Block A, Sector 15, New Delhi - 110001";
  
  const handleDirections = () => {
    const query = encodeURIComponent(boothAddress);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div id="polling-info" className="p-8 md:p-12 bg-white border border-black/5 rounded-[40px] shadow-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-3xl -z-10 rounded-full" />
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
            <MapPin className="text-orange-600" size={24} /> Live Booth Intelligence
          </h2>
          <p className="text-xs text-foreground/40 font-medium mt-1 uppercase tracking-widest">Real-time Assigned Polling Station Data</p>
        </div>
        <span className="flex items-center gap-2 text-[10px] font-black text-green-600 px-4 py-1.5 bg-green-500/10 rounded-full uppercase tracking-tighter border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Now
        </span>
      </div>

      <div className="p-4 bg-black/[0.02] border border-black/5 rounded-2xl shadow-sm mb-6">
        <div className="text-[10px] font-bold text-foreground/40 uppercase mb-2 flex items-center gap-2">
          <Navigation size={10} /> Your Assigned Location
        </div>
        <p className="text-xs font-bold leading-relaxed mb-4">
          {boothAddress}
        </p>
        <button 
          onClick={handleDirections}
          className="w-full py-3 bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-black/5"
        >
          View on Google Maps <ExternalLink size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-foreground/20 uppercase">Queue Status</div>
          <div className="text-xs font-bold flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-600" /> ~15-20 mins
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-foreground/20 uppercase">Closing In</div>
          <div className="text-xs font-bold text-red-500 flex items-center gap-2">
             <Clock size={12} /> 4h 32m
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollingInfo;
