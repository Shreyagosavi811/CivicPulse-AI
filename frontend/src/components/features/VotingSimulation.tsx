'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, Monitor, CheckCircle, AlertCircle, 
  ChevronRight, RefreshCcw, Download, ShieldCheck,
  Eye, Info, Play
} from 'lucide-react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { exportVoterChecklist } from '@/lib/export_utils';

const CANDIDATES = [
  { id: '1', name: 'National Progress Party', symbol: '🚜', color: 'bg-orange-500' },
  { id: '2', name: 'Democratic Unity Front', symbol: '⚖️', color: 'bg-blue-600' },
  { id: '3', name: 'Green Earth Alliance', symbol: '🌾', color: 'bg-green-600' },
  { id: '4', name: 'People\'s Freedom Party', symbol: '🕯️', color: 'bg-yellow-500' },
];

const VotingSimulation = () => {
  const [step, setStep] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showVVPAT, setShowVVPAT] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const { unlockAchievement, setSimulationComplete } = useSimulationStore();

  const handleVote = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    setShowVVPAT(true);
    
    // Simulate the 7-second VVPAT verification window
    setTimeout(() => {
      setShowVVPAT(false);
      setIsVoted(true);
      setStep(3);
      unlockAchievement('voted_correctly');
      setSimulationComplete(true);
    }, 7000);
  };

  const steps = [
    { title: 'Identity Verification', desc: 'Presenting your Voter ID to the polling officer.' },
    { title: 'Marking & Slip', desc: 'Indelible ink marking and receiving the voter slip.' },
    { title: 'The Digital Ballot', desc: 'Casting your vote on the EVM (Electronic Voting Machine).' },
    { title: 'Verification', desc: 'Verifying your choice via the VVPAT slip.' }
  ];

  const reset = () => {
    setStep(0);
    setSelectedCandidate(null);
    setShowVVPAT(false);
    setIsVoted(false);
  };

  return (
    <section id="simulation" className="px-6 max-w-5xl mx-auto scroll-mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-heading mb-3 tracking-tight">Interactive Digital Ballot</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Experience the Indian voting process step-by-step. Master the EVM-VVPAT flow in a safe environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step Progress */}
        <div className="lg:col-span-1 space-y-4">
          {steps.map((s, i) => (
            <div 
              key={i}
              className={`p-5 rounded-2xl border transition-all ${
                step === i ? 'bg-orange-600/5 border-orange-600 shadow-premium' : 
                step > i ? 'bg-green-500/5 border-green-500/30 opacity-60' : 'bg-black/5 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === i ? 'bg-orange-600 text-white' : 
                  step > i ? 'bg-green-500 text-white' : 'bg-black/10'
                }`}>
                  {step > i ? <CheckCircle size={16} /> : i + 1}
                </div>
                <div className="text-left">
                  <h4 className={`text-sm font-bold ${step === i ? 'text-orange-600' : ''}`}>{s.title}</h4>
                  <p className="text-[10px] text-foreground/40 leading-tight mt-1">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simulation Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] border border-black/5 shadow-premium overflow-hidden min-h-[500px] flex flex-col relative">
            
            {/* VVPAT OVERLAY */}
            <AnimatePresence>
              {showVVPAT && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8"
                >
                  <motion.div 
                    initial={{ y: 20, scale: 0.9 }}
                    animate={{ y: 0, scale: 1 }}
                    className="w-full max-w-sm bg-zinc-800 rounded-[32px] border-4 border-zinc-700 p-8 text-center relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-orange-600 animate-[pulse_2s_infinite]" />
                    <div className="text-white/40 text-[10px] font-black tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
                      <Eye size={12} /> VVPAT Verification Window
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg text-black inline-block mb-6 shadow-inner border-2 border-zinc-300">
                      <div className="text-4xl mb-2">{CANDIDATES.find(c => c.id === selectedCandidate)?.symbol}</div>
                      <div className="font-black text-xl uppercase">{CANDIDATES.find(c => c.id === selectedCandidate)?.name}</div>
                    </div>
                    
                    <p className="text-white/60 text-xs leading-relaxed italic">
                      This slip will be visible for 7 seconds. <br />
                      Verify your choice carefully.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8 border-b bg-orange-600/5 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Monitor size={18} className="text-orange-600" /> 
                {step === 3 ? 'Process Complete' : 'Digital Voting Compartment'}
              </h3>
              {step < 3 && <span className="text-[10px] font-black text-orange-600 animate-pulse">DO NOT TAKE PHOTOS</span>}
            </div>

            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto text-orange-600">
                    <Fingerprint size={40} />
                  </div>
                  <h4 className="text-2xl font-bold">Identity Verification</h4>
                  <p className="text-sm text-foreground/50 max-w-xs mx-auto">Please confirm you have your original Voter ID or valid identification ready.</p>
                  <button 
                    onClick={() => setStep(1)}
                    className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Confirm Identity
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-bold">Marking & Slip</h4>
                  <p className="text-sm text-foreground/50 max-w-xs mx-auto">Polling officer is marking your left forefinger with indelible ink.</p>
                  <button 
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Enter Voting Compartment
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md grid grid-cols-1 gap-3">
                  {CANDIDATES.map((candidate) => (
                    <button
                      key={candidate.id}
                      onClick={() => handleVote(candidate.id)}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:border-orange-600/30 hover:shadow-premium transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-600/5 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                          {candidate.symbol}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold uppercase">{candidate.name}</div>
                          <div className="text-[10px] text-foreground/40 font-medium">Click to Vote</div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                         <Play size={12} fill="white" />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <ShieldCheck size={40} />
                  </div>
                  <h4 className="text-2xl font-bold uppercase tracking-tight">Vote Successfully Cast</h4>
                  <p className="text-sm text-foreground/50 max-w-sm mx-auto">
                    You have successfully completed the voting process. Your VVPAT verification was successful.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button 
                      onClick={() => exportVoterChecklist()}
                      className="px-6 py-3 bg-black text-white font-bold rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all"
                    >
                      <Download size={18} /> Download Voter Slip
                    </button>
                    <button 
                      onClick={reset}
                      className="px-6 py-3 border border-foreground/10 text-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-black/5 transition-all"
                    >
                      <RefreshCcw size={18} /> Reset Demo
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VotingSimulation;
