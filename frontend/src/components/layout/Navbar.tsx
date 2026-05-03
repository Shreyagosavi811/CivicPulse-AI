'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Lock, X, Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  const navLinks = [
    { name: 'Education', href: '#ai-tutor' },
    { name: 'Directory', href: '#directory' },
    { name: 'Simulation', href: '#simulation' },
    { name: 'Glossary', href: '#glossary' },
    { name: 'Booth', href: '#polling-info' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-4 md:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/20">
              CP
            </div>
            <span className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground">CivicPulse AI</span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-orange-600 transition-colors cursor-pointer">{link.name}</a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setShowLogin(true)}
              className="hidden sm:block px-4 py-2 text-sm font-semibold rounded-lg hover:bg-black/5 transition-colors"
            >
              Log In
            </button>
            <a 
              href="#ai-tutor"
              className="px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-orange-600 text-white rounded-lg shadow-lg shadow-orange-600/20 hover:scale-105 transition-transform"
            >
              Get Started
            </a>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[73px] z-40 bg-white border-b border-black/5 p-6 flex flex-col gap-4 shadow-xl lg:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-foreground/60 hover:text-orange-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <hr className="border-black/5 my-2" />
            <button 
              onClick={() => { setIsOpen(false); setShowLogin(true); }}
              className="w-full py-4 bg-black/5 rounded-xl font-bold text-center"
            >
              Member Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-premium overflow-hidden border border-black/5"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">CP</div>
                  <button onClick={() => setShowLogin(false)} className="p-2 hover:bg-black/5 rounded-full text-foreground/40"><X size={20}/></button>
                </div>
                
                <h3 className="text-3xl font-bold mb-2">Welcome Back</h3>
                <p className="text-foreground/40 mb-8">Access your personalized CivicPulse learning path.</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                    <input type="text" placeholder="Voter ID or Mobile" className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-orange-600/5 transition-all" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                    <input type="password" placeholder="Password" className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-orange-600/5 transition-all" />
                  </div>
                </div>
                
                <button 
                  onClick={() => { alert("Demo account authorized!"); setShowLogin(false); }}
                  className="w-full mt-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Sign In
                </button>
                
                <p className="text-center mt-6 text-sm text-foreground/50">
                  Don't have an account? <span className="text-orange-600 font-bold hover:underline cursor-pointer">Register Now</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
