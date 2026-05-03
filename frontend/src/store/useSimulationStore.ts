import { create } from 'zustand';

export type SimulationStep = 'ID_CHECK' | 'INKING' | 'BALLOT' | 'VVPAT' | 'COMPLETE';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface SimulationState {
  step: SimulationStep;
  isVerified: boolean;
  selectedCandidate: string | null;
  hasInked: boolean;
  vvpatConfirmed: boolean;
  achievements: Achievement[];
  questionsAskedCount: number;
  
  setStep: (step: SimulationStep) => void;
  verify: () => void;
  ink: () => void;
  selectCandidate: (id: string) => void;
  confirmVvpat: () => void;
  unlockAchievement: (id: string) => void;
  incrementQuestions: () => void;
  getWCEI: () => number;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  step: 'ID_CHECK',
  isVerified: false,
  selectedCandidate: null,
  hasInked: false,
  vvpatConfirmed: false,
  questionsAskedCount: 0,
  achievements: [
    { id: 'first_question', title: 'The Questioner', description: 'Asked your first civic query.', icon: '🤔', unlocked: false },
    { id: 'id_verified', title: 'Verified Citizen', description: 'Successfully verified your ID.', icon: '🪪', unlocked: false },
    { id: 'vote_cast', title: 'Responsible Voter', description: 'Successfully cast a secret ballot.', icon: '🗳️', unlocked: false },
    { id: 'all_done', title: 'Civic Hero', description: 'Completed the entire simulation.', icon: '🏆', unlocked: false },
  ],

  setStep: (step) => set({ step }),
  verify: () => set((state) => {
    const newAchievements = state.achievements.map(a => a.id === 'id_verified' ? { ...a, unlocked: true } : a);
    return { isVerified: true, achievements: newAchievements };
  }),
  ink: () => set({ hasInked: true }),
  selectCandidate: (id) => set((state) => {
    const newAchievements = state.achievements.map(a => a.id === 'vote_cast' ? { ...a, unlocked: true } : a);
    return { selectedCandidate: id, achievements: newAchievements };
  }),
  confirmVvpat: () => set({ vvpatConfirmed: true }),
  unlockAchievement: (id) => set((state) => ({
    achievements: state.achievements.map(a => a.id === id ? { ...a, unlocked: true } : a)
  })),
  incrementQuestions: () => set((state) => ({ questionsAskedCount: state.questionsAskedCount + 1 })),
  getWCEI: () => {
    const state = get();
    // Experimental Weighted Model:
    // 60% Achievements (Knowledge Checkpoints)
    // 20% Engagement (Depth of inquiry)
    // 20% Simulation (Behavioral validation)
    const achievementPoints = (state.achievements.filter(a => a.unlocked).length / state.achievements.length) * 60;
    const engagementPoints = Math.min(state.questionsAskedCount, 5) * 4; 
    const simulationPoints = state.step === 'COMPLETE' ? 20 : 0; 
    
    return Math.min(Math.round(achievementPoints + engagementPoints + simulationPoints), 100);
  },
  reset: () => set({
    step: 'ID_CHECK',
    isVerified: false,
    selectedCandidate: null,
    hasInked: false,
    vvpatConfirmed: false
  })
}));
