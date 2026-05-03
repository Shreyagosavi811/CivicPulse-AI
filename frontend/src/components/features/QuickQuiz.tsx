'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw, Loader2 } from 'lucide-react';
import { useSimulationStore } from '@/store/useSimulationStore';

const QUESTIONS = [
  {
    id: 1,
    text: "How long is the VVPAT slip visible before it drops into the box?",
    options: ["3 seconds", "7 seconds", "10 seconds", "15 seconds"],
    answer: 1,
    explanation: "The slip is visible for 7 seconds for you to verify your choice."
  },
  {
    id: 2,
    text: "Which of these is NOT a valid document for identification if you don't have a Voter ID?",
    options: ["Aadhaar Card", "PAN Card", "A printed photocopy of an ID", "Passport"],
    answer: 2,
    explanation: "Original documents are required; photocopies are not valid for identification."
  },
  {
    id: 3,
    text: "What does the MCC (Model Code of Conduct) primarily regulate?",
    options: ["The cost of EVMs", "The conduct of parties and candidates", "The speed of the internet", "The number of polling booths"],
    answer: 1,
    explanation: "MCC ensures free and fair elections by regulating the conduct of political entities."
  }
];

const QuickQuiz = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { unlockAchievement } = useSimulationStore();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ai/generate-quiz`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch quiz", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null || !questions[currentStep]) return;
    setSelectedOption(index);
    const correct = index === questions[currentStep].answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
      if (score >= 2) unlockAchievement('first_question'); 
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setIsFinished(false);
    fetchQuestions();
  };

  return (
    <div className="p-6 bg-white border border-black/5 rounded-[32px] relative overflow-hidden flex flex-col shadow-premium">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-600/5 flex items-center justify-center">
          <Brain className="text-orange-600 w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">Civic Quick Quiz</h3>
          <p className="text-[10px] text-foreground/40 uppercase font-black tracking-widest">Test your knowledge</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
            <h4 className="font-bold">Gemini is Thinking...</h4>
            <p className="text-[10px] text-foreground/40 uppercase font-black tracking-widest mt-2">Generating Dynamic Quiz from Guide</p>
          </motion.div>
        ) : !isFinished ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-6">
              <span className="text-xs font-bold text-orange-600 tracking-widest uppercase">QUESTION {currentStep + 1} OF {questions.length}</span>
              <h4 className="text-xl font-bold mt-2 leading-snug tracking-tight">{questions[currentStep]?.text}</h4>
            </div>

            <div className="space-y-3 flex-1">
              {questions[currentStep]?.options.map((option: string, i: number) => (
                <button
                  key={i}
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionClick(i)}
                  className={`w-full p-5 rounded-2xl text-left text-base font-semibold transition-all border ${
                    selectedOption === i
                      ? isCorrect ? 'bg-green-500/10 border-green-500 text-green-600' : 'bg-red-500/10 border-red-500 text-red-600'
                      : selectedOption !== null && i === questions[currentStep].answer
                        ? 'bg-green-500/10 border-green-500 text-green-600'
                        : 'bg-black/5 border-transparent hover:bg-black/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {option}
                    {selectedOption === i && (isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />)}
                  </div>
                </button>
              ))}
            </div>

            {selectedOption !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-orange-600/5 rounded-2xl border border-orange-600/10 mb-6"
              >
                <p className="text-[11px] text-orange-700/80 leading-relaxed italic">
                  <strong>Insight:</strong> {questions[currentStep]?.explanation}
                </p>
              </motion.div>
            )}

            <button
              disabled={selectedOption === null}
              onClick={handleNext}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-auto"
            >
              {currentStep < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-yellow-500/5 rounded-full flex items-center justify-center mb-6">
              <Trophy className="text-yellow-600 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
            <p className="text-foreground/40 mb-8">You scored {score} out of {questions.length}</p>
            
            <div className="w-full space-y-3">
              <button
                onClick={reset}
                className="w-full py-4 bg-black/5 font-bold rounded-2xl hover:bg-black/10 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} /> Try Again
              </button>
              <a href="#achievements" className="w-full py-4 text-orange-600 font-bold flex items-center justify-center gap-2">
                Check Achievements
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickQuiz;
