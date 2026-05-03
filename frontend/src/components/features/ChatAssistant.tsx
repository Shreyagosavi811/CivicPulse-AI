'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, ChevronRight, Info, Loader2, 
  Volume2, VolumeX, Sparkles, AlertCircle, CheckCircle, 
  HelpCircle, ChevronDown, ChevronUp, Play, Zap, ShieldAlert, Mic, MicOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulationStore } from '@/store/useSimulationStore';

interface Chunk {
  source: string;
  content: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  chunks?: Chunk[];
  confidence?: number;
  simulation_action?: 'SUGGEST' | 'AUTO_LAUNCH' | 'GUIDE' | null;
  isMisconception?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What documents do I need to vote?",
  "How is my vote verified?",
  "Who is eligible to vote?",
  "Can I use my phone in the polling booth?"
];

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am your AI Civic Tutor. I provide verified answers based on official election documents. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isELI10, setIsELI10] = useState(false);
  const [isFactCheck, setIsFactCheck] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { reset, incrementQuestions } = useSimulationStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).WebkitSpeechRecognition || (window as any).speechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === 'English' ? 'en-IN' : 'hi-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition not supported in this browser.");
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    let selectedVoice = null;
    if (language === 'English') {
      selectedVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
    } else {
      selectedVoice = voices.find(v => v.lang === 'hi-IN') || voices.find(v => v.lang.startsWith('hi'));
    }
    
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = language === 'English' ? 'en-IN' : 'hi-IN';
    utterance.rate = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  const launchSimulation = (action: string) => {
    reset();
    const element = document.getElementById('simulation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const { unlockAchievement } = useSimulationStore.getState();
    unlockAchievement('first_question');
    incrementQuestions();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          simplify: isELI10, 
          lang: language,
          fact_check: isFactCheck 
        })
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      
      let finalContent = data.answer;
      let isMisconception = false;
      
      if (finalContent.includes('[MISCONCEPTION DETECTED]')) {
        finalContent = finalContent.replace('[MISCONCEPTION DETECTED]', '').trim();
        isMisconception = true;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalContent,
        sources: data.sources,
        chunks: data.chunks,
        confidence: data.confidence,
        simulation_action: data.simulation_action,
        isMisconception
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (isVoiceEnabled) speak(finalContent);
      
      if (data.simulation_action === 'AUTO_LAUNCH') {
        setTimeout(() => launchSimulation('AUTO_LAUNCH'), 2000);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to my knowledge base."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-500 bg-green-500/10";
    if (score >= 0.5) return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  return (
    <div className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/10 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} /> AI-Powered Civic Intelligence
          </div>
          <h2 className="text-4xl font-bold font-heading mb-2 tracking-tight">Grounded Civic Learning</h2>
          <p className="text-sm text-foreground/40 max-w-2xl mx-auto">
            Combining RAG-based knowledge with behavioral simulation and myth detection.
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-black/5 shadow-premium overflow-hidden flex flex-col h-[400px] md:h-[550px]">
          {/* Chat Header */}
          <div className="p-6 border-b bg-orange-600/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center">
                <Bot className="text-orange-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">CivicPulse Assistant</h3>
                <p className="text-xs text-foreground/40 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Grounded RAG Engine
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFactCheck(!isFactCheck)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2",
                  isFactCheck ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20" : "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                )}
                title="Toggle Myth-Buster Mode"
              >
                <ShieldAlert size={14} /> {isFactCheck ? "Myth-Buster ON" : "Myth-Buster"}
              </button>
               <button 
                onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600/10 text-orange-600 border border-orange-600/20 hover:bg-orange-600/20 transition-all"
              >
                {language === 'English' ? 'EN' : 'HI'}
              </button>
              <button 
                onClick={() => setIsELI10(!isELI10)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2",
                  isELI10 ? "bg-orange-600 text-white border-orange-600" : "bg-orange-50 hover:bg-orange-100 border-foreground/10"
                )}
                title="Toggle Explain Like I'm 10 Mode"
              >
                <Zap size={14} /> {isELI10 ? "ELI10 Mode ON" : "ELI10"}
              </button>
              <button 
                onClick={() => {
                  const nextState = !isVoiceEnabled;
                  setIsVoiceEnabled(nextState);
                  if (nextState) speak(language === 'English' ? "Voice enabled" : "आवाज़ चालू है");
                }}
                className={cn(
                  "p-2 rounded-lg border transition-all",
                  isVoiceEnabled ? "bg-orange-600 text-white border-orange-600" : "bg-orange-50 hover:bg-orange-100 border-foreground/10"
                )}
              >
                {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                  msg.role === 'assistant' ? "bg-orange-600/10 text-orange-600" : "bg-black/5 text-foreground/40"
                )}>
                  {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                
                <div className={cn(
                  "space-y-3 max-w-[85%]",
                  msg.role === 'user' ? "items-end" : ""
                )}>
                  {msg.isMisconception && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 animate-pulse">
                      <ShieldAlert className="text-red-500 w-5 h-5 shrink-0" />
                      <div className="text-[10px] font-bold text-red-600">MISCONCEPTION DETECTED: Correcting with verified facts below.</div>
                    </div>
                  )}

                    <div className={cn(
                      "p-5 rounded-2xl text-base leading-relaxed shadow-sm relative group",
                      msg.role === 'assistant' 
                        ? "bg-white text-black border-black/5 border rounded-tl-none shadow-sm" 
                        : "bg-orange-600 text-white border-orange-600 border rounded-tr-none shadow-orange-600/10 shadow-lg",
                      msg.isMisconception ? "border-red-500/30" : ""
                    )}>
                    {msg.content}
                  
                  {msg.role === 'assistant' && msg.confidence !== undefined && (
                    <div className={cn(
                      "absolute -top-3 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 shadow-sm bg-white",
                      getConfidenceColor(msg.confidence)
                    )}>
                      {(msg.confidence * 100).toFixed(0)}% Confidence
                    </div>
                  )}
                </div>
                
                {msg.role === 'assistant' && msg.sources && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-orange-50 rounded-full text-foreground/40 font-medium border flex items-center gap-1">
                          <CheckCircle size={10} /> {source}
                        </span>
                      ))}
                      <button 
                        onClick={() => setExpandedMessage(expandedMessage === msg.id ? null : msg.id)}
                        className="text-[10px] px-2 py-0.5 bg-orange-600/5 text-orange-600 rounded-full font-bold border border-orange-600/20 flex items-center gap-1 hover:bg-orange-600/10 transition-colors"
                      >
                        {expandedMessage === msg.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        {expandedMessage === msg.id ? "Hide Details" : "Show Source Chunks"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-orange-600/10 text-orange-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white text-black border border-zinc-200 rounded-tl-none italic text-foreground/40 text-sm">
                Verifying civic intelligence...
              </div>
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <div className="p-6 border-t bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about election laws..."
              className="w-full bg-white border border-foreground/10 rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all text-sm"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "absolute right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all",
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-black/5 hover:bg-black/10 text-foreground/40"
              )}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-orange-600 text-white rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-orange-600/20"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
