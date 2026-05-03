'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Users, Building2, Map, Search, Filter } from 'lucide-react';

const ELECTION_TYPES = [
  {
    id: 'lok-sabha',
    title: "Lok Sabha (General Elections)",
    category: "NATIONAL",
    desc: "The lower house of India&apos;s bicameral Parliament. Members are directly elected by the people.",
    frequency: "Every 5 years",
    icon: <Users className="text-orange-600" />
  },
  {
    id: 'vidhan-sabha',
    title: "Vidhan Sabha (State Assembly)",
    category: "STATE",
    desc: "The legislative body for each State and Union Territory in India.",
    frequency: "Every 5 years",
    icon: <Building2 className="text-blue-600" />
  },
  {
    id: 'rajya-sabha',
    title: "Rajya Sabha (Upper House)",
    category: "NATIONAL",
    desc: "Council of States. Members are elected by the elected members of State Legislative Assemblies.",
    frequency: "Indirect (Permanent Body)",
    icon: <Landmark className="text-purple-600" />
  },
  {
    id: 'panchayat',
    title: "Local Bodies (Panchayat/Municipal)",
    category: "LOCAL",
    desc: "Local self-government institutions in rural and urban areas.",
    frequency: "Every 5 years",
    icon: <Map className="text-green-600" />
  }
];

const ElectionDirectory = () => {
  const [filter, setFilter] = useState('ALL');

  const filteredElections = filter === 'ALL' 
    ? ELECTION_TYPES 
    : ELECTION_TYPES.filter(e => e.category === filter);

  return (
    <section id="directory" className="px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold font-heading mb-3 text-foreground tracking-tight">Election Directory</h2>
          <p className="text-foreground/60 max-w-xl">
            A comprehensive guide to the different layers of the world&apos;s largest democratic process.
          </p>
        </div>
        
        <div className="flex bg-black/5 p-1 rounded-2xl border border-black/5">
          {['ALL', 'NATIONAL', 'STATE', 'LOCAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                filter === cat ? 'bg-white shadow-sm text-orange-600' : 'text-foreground/40 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredElections.map((election) => (
            <motion.div
              key={election.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 bg-white border border-black/5 rounded-[32px] shadow-premium hover:border-orange-600/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-600/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {election.icon}
              </div>
              <span className="text-[9px] font-black text-orange-600 tracking-widest uppercase mb-2 block">
                {election.category}
              </span>
              <h3 className="text-xl font-bold mb-3 leading-tight">{election.title}</h3>
              <p className="text-xs text-foreground/50 leading-relaxed mb-6">{election.desc}</p>
              <div className="text-[10px] font-bold text-foreground/40 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-600" />
                {election.frequency}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ElectionDirectory;
