import React from 'react';
import { Mail, Globe, Twitter, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/20">
                CP
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">CivicPulse AI</span>
            </div>
            <p className="text-sm text-foreground/50 max-w-sm leading-relaxed">
              Empowering Indian citizens with verified election intelligence, real-time news, and immersive digital simulations. Built for a more informed and engaged democracy.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-foreground/40">
              <li><a href="#ai-tutor" className="hover:text-orange-600 transition-colors">AI Learning Hub</a></li>
              <li><a href="#simulation" className="hover:text-orange-600 transition-colors">EVM Simulation</a></li>
              <li><a href="#directory" className="hover:text-orange-600 transition-colors">Election Directory</a></li>
              <li><a href="#glossary" className="hover:text-orange-600 transition-colors">Civic Glossary</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">Contact</h4>
            <div className="flex flex-col gap-4 text-sm text-foreground/40">
              <div className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                <Mail size={16} /> support@civicpulse.ai
              </div>
              <div className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                <Globe size={16} /> www.eci.gov.in
              </div>
              <div className="flex gap-4 mt-2">
                <Twitter size={18} className="hover:text-orange-600 transition-colors cursor-pointer" />
                <Github size={18} className="hover:text-orange-600 transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-foreground/20 font-bold uppercase tracking-widest">
            © 2026 CivicPulse AI Platform • Non-Partisan Initiative
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-medium text-foreground/30 uppercase tracking-widest">Built with</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              <span className="text-[10px] font-bold">Google Cloud & Vertex AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
