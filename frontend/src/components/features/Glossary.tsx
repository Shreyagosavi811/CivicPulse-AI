'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Info, ChevronRight } from 'lucide-react';

const TERMS = [
  { 
    term: "EVM", 
    full: "Electronic Voting Machine", 
    desc: "The cornerstone of Indian elections, ensuring secure and tamper-proof voting since 1982.", 
    cat: "EVM/TECH",
    link: "https://en.wikipedia.org/wiki/Electronic_voting_in_India"
  },
  { 
    term: "VVPAT", 
    full: "Voter Verifiable Paper Audit Trail", 
    desc: "An independent system that allows voters to verify that their votes are cast as intended.", 
    cat: "EVM/TECH",
    link: "https://en.wikipedia.org/wiki/Voter-verifiable_paper_audit_trail"
  },
  { 
    term: "MCC", 
    full: "Model Code of Conduct", 
    desc: "A set of guidelines for political parties and candidates to ensure free and fair elections.", 
    cat: "LEGAL",
    link: "https://en.wikipedia.org/wiki/Model_Code_of_Conduct"
  },
  { 
    term: "EPIC", 
    full: "Elector's Photo Identity Card", 
    desc: "The primary identification document for Indian citizens to exercise their right to vote.", 
    cat: "BASICS",
    link: "https://en.wikipedia.org/wiki/Voter_ID_card_(India)"
  },
  { 
    term: "NOTA", 
    full: "None of the Above", 
    desc: "Allows voters to officially register a vote of rejection against all contesting candidates.", 
    cat: "PROCEDURE",
    link: "https://en.wikipedia.org/wiki/None_of_the_above"
  },
  { 
    term: "ECI", 
    full: "Election Commission of India", 
    desc: "The autonomous constitutional authority responsible for administering election processes.", 
    cat: "LEGAL",
    link: "https://eci.gov.in/"
  }
];

const Glossary = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredTerms = TERMS.filter(t => 
    (activeTab === 'ALL' || t.cat === activeTab) &&
    (t.term.toLowerCase().includes(search.toLowerCase()) || 
     t.full.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section id="glossary" className="py-12 px-6 bg-black/[0.01] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold font-heading text-foreground tracking-tight">Civic Intelligence Hub</h2>
            <p className="text-sm text-foreground/40 font-medium mt-1">Verified terminology and deep-dive resources</p>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
            <input 
              type="text" 
              placeholder="Search concepts (e.g. VVPAT)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-orange-600/5 transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Sliding Categories / Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar mb-6">
          {['ALL', 'BASICS', 'EVM/TECH', 'LEGAL', 'PROCEDURE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeTab === tab 
                  ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/20' 
                  : 'border-black/5 bg-white shadow-sm text-foreground/40 hover:text-foreground hover:bg-black/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Horizontal Sliding Cards */}
        <div className="relative group">
          <div className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar px-1 snap-x">
            <AnimatePresence mode="popLayout">
              {filteredTerms.map((item) => (
                <motion.div
                  key={item.term}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="min-w-[300px] md:min-w-[360px] p-6 bg-white rounded-[32px] border border-black/5 shadow-premium hover:border-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/5 transition-all snap-center flex flex-col justify-between group/card"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-orange-600/10 text-orange-600 rounded-lg text-xs font-black tracking-widest uppercase">
                        {item.term}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover/card:bg-orange-600/10 transition-colors">
                        <Info size={14} className="text-foreground/20 group-hover/card:text-orange-600 transition-colors" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-foreground tracking-tight">{item.full}</h4>
                    <p className="text-[15px] text-foreground/50 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground/20 uppercase tracking-widest">Source</span>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-orange-600 flex items-center gap-1.5 hover:gap-2.5 transition-all bg-orange-600/5 px-4 py-2 rounded-xl"
                    >
                      Details <ChevronRight size={12} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredTerms.length === 0 && (
              <div className="w-full text-center py-10 bg-white border border-dashed rounded-[24px]">
                <p className="text-[10px] text-foreground/40 font-bold uppercase">No matching terms</p>
              </div>
            )}
          </div>
          
          {/* Subtle Indicators */}
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </section>
  );
};

export default Glossary;
