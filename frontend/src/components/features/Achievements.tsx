'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Shield, Book, 
  MapPin, CheckCircle2, Award, Zap
} from 'lucide-react';
import { useSimulationStore } from '@/store/useSimulationStore';

const Achievements = () => {
  const { achievements, questionsAsked, simulationComplete } = useSimulationStore();
  
  const stats = [
    { 
      label: 'Civic Score', 
      value: ((Array.isArray(achievements) ? achievements.length : 0) * 25) + ((questionsAsked || 0) * 5), 
      icon: <Zap size={14} />, 
      color: 'text-orange-600' 
    },
    { 
      label: 'Verified', 
      value: Array.isArray(achievements) ? achievements.length : 0, 
      icon: <Shield size={14} />, 
      color: 'text-green-600' 
    }
  ];

  return (
    <div id="achievements" className="p-6 bg-white border border-black/5 rounded-[32px] mb-6 shadow-premium">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold flex items-center gap-2">
          <Award className="text-orange-600" size={18} /> Voter Hub
        </h3>
        <span className="text-[10px] font-bold text-foreground/40 bg-black/5 px-2 py-1 rounded-full uppercase">
          WCEI Level 2
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-3 bg-white border border-black/5 rounded-2xl shadow-sm">
            <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>
              {stat.icon}
              <span className="text-[10px] font-bold uppercase">{stat.label}</span>
            </div>
            <div className="text-xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2">Recent Badges</p>
        <div className="flex flex-wrap gap-2">
          {(achievements || []).map((ach, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-xl bg-orange-600/5 flex items-center justify-center text-orange-600 border border-orange-600/10 shadow-sm"
              title={ach}
            >
              <Trophy size={18} />
            </motion.div>
          ))}
          {achievements.length === 0 && (
            <div className="flex items-center gap-2 text-xs text-foreground/30 italic py-2">
              <Star size={12} /> Complete your first simulation...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
