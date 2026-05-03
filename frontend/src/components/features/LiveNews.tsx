'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Newspaper, ExternalLink, Clock, TrendingUp, Sparkles, Loader2 } from 'lucide-react';

const NEWS_FEED = [
  { id: 1, title: "ECI issues new guidelines for Model Code of Conduct compliance.", time: "2m ago", category: "OFFICIAL" },
  { id: 2, title: "Voter turnout crosses 65% in phase 3 of state assembly elections.", time: "15m ago", category: "LIVE" },
  { id: 3, title: "New AI-based voter verification system piloted in Bangalore polling booths.", time: "1h ago", category: "TECH" },
  { id: 4, title: "Supreme Court reaffirms the integrity of EVM-VVPAT synchronization.", time: "3h ago", category: "LEGAL" },
  { id: 5, title: "Digital Voter ID (e-EPIC) downloads hit record 5 million in 24 hours.", time: "5h ago", category: "STATS" }
];

const STATES = [
  "India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir"
];

const LiveNews = () => {
  const [currentNews, setCurrentNews] = useState(0);
  const [selectedState, setSelectedState] = useState("India");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % NEWS_FEED.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const generateAIPulse = async () => {
    setIsGenerating(true);
    try {
      const headlines = NEWS_FEED.map(n => n.title);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ai/summarize-news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headlines, state: selectedState })
      });
      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      setAiSummary("• Stay updated on regional voting shifts.\n• Verify your constituency booth local list.\n• High engagement expected in " + selectedState + ".");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-5 bg-white border border-black/5 rounded-[32px] relative overflow-hidden group shadow-premium">
      {/* Background Pulse Decorative */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-all" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center relative">
            <Radio className="text-red-500 w-5 h-5" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm">CivicPulse Live</h3>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-[9px] text-red-500 font-bold uppercase tracking-widest focus:outline-none cursor-pointer hover:text-red-600 transition-colors"
            >
              {STATES.map(s => <option key={s} value={s}>{s} Feed</option>)}
            </select>
          </div>
        </div>
        <button 
          onClick={generateAIPulse}
          disabled={isGenerating}
          className="p-2 bg-orange-600/10 text-orange-600 rounded-lg hover:bg-orange-600/20 transition-all flex items-center gap-2 group/btn"
        >
          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="group-hover/btn:scale-125 transition-transform" />}
          <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">AI Pulse</span>
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNews}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4 bg-white border border-black/5 rounded-2xl shadow-sm hover:border-orange-600/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold px-2 py-0.5 bg-red-500 text-white rounded-md uppercase tracking-tighter">
                {NEWS_FEED[currentNews].category}
              </span>
              <span className="text-[10px] text-foreground/40 flex items-center gap-1">
                <Clock size={10} /> {NEWS_FEED[currentNews].time}
              </span>
            </div>
            <p className="text-xs font-bold leading-relaxed mb-3">
              {NEWS_FEED[currentNews].title}
            </p>
            <button className="text-[10px] font-bold text-orange-600 flex items-center gap-1 hover:underline">
              Read Official Bulletin <ExternalLink size={10} />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* AI INSIGHTS BOX */}
        <AnimatePresence>
          {aiSummary && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-orange-600/5 border border-orange-600/10 rounded-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={12} className="text-orange-600" />
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Gemini Civic Insights</span>
              </div>
              <div className="text-[11px] text-orange-800/80 leading-relaxed space-y-2 whitespace-pre-line">
                {aiSummary}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini List */}
        <div className="space-y-2 pt-2 border-t border-black/5">
          {NEWS_FEED.slice(0, 3).map((item, i) => (
            <div key={item.id} className="flex items-center gap-3 group/item cursor-pointer">
               <div className={`w-1 h-1 rounded-full ${i === currentNews ? 'bg-red-500 animate-pulse' : 'bg-black/10'}`} />
               <p className={`text-[10px] truncate transition-all ${i === currentNews ? 'text-foreground font-bold' : 'text-foreground/40'}`}>
                 {item.title}
               </p>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-6 py-3 rounded-xl border border-black/5 bg-black/[0.02] text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all flex items-center justify-center gap-2">
        <Newspaper size={12} /> View Full Newsroom
      </button>
    </div>
  );
};

export default LiveNews;
