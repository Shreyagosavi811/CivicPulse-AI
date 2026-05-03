'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Target, BookOpen, ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-10 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold bg-orange-600/10 text-orange-600 rounded-full border border-orange-600/20 uppercase tracking-widest">
            The Ultimate Civic Intelligence Platform
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold font-heading tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Empowering the <br /> 
            <span className="text-orange-600">Modern Citizen.</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            Unlocking democracy through high-fidelity AI. Master complex election laws, 
            simulate the voting booth, and verify civic facts with CivicPulse AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#ai-tutor"
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              Start Learning Path
            </a>
            <a 
              href="#simulation"
              className="px-8 py-4 bg-white text-foreground font-bold rounded-2xl border border-black/5 shadow-premium hover:bg-black/5 transition-all w-full sm:w-auto"
            >
              Watch Simulation
            </a>
          </div>
        </motion.div>

        {/* Interactive Simulation Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="aspect-[16/9] bg-white rounded-[40px] border border-black/5 shadow-premium overflow-hidden relative group">
            <Image 
              src="/images/sim-preview.png" 
              alt="Interactive Simulation Preview" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/10 to-transparent pointer-events-none" />
            
            {/* Live Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-black/5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-black tracking-widest uppercase">Live Simulation Feed</span>
            </div>
          </div>
          
          {/* Floating Stats Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl border border-black/5 shadow-premium hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <Shield className="text-green-600 w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-foreground/20 uppercase">Voter Status</div>
                <div className="text-sm font-bold">Verified & Active</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl border border-black/5 shadow-premium hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600/10 rounded-full flex items-center justify-center">
                <Target className="text-orange-600 w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-foreground/20 uppercase">Success Rate</div>
                <div className="text-sm font-bold">98.4% Accuracy</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-foreground/20">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;
