import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import ChatAssistant from '@/components/features/ChatAssistant';
import VotingSimulation from '@/components/features/VotingSimulation';
import Achievements from '@/components/features/Achievements';
import PollingInfo from '@/components/features/PollingInfo';
import LiveNews from '@/components/features/LiveNews';
import ElectionDirectory from '@/components/features/ElectionDirectory';
import Glossary from '@/components/features/Glossary';
import QuickQuiz from '@/components/features/QuickQuiz';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-orange-600/30">
      <Navbar />
      <Hero />
      
      {/* Main Learning Hub */}
      <div id="ai-tutor" className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-12 scroll-mt-24">
        <div className="lg:col-span-3 order-1">
          <ChatAssistant />
        </div>
        <div className="lg:col-span-2 order-2 flex flex-col space-y-6">
          <LiveNews />
          <QuickQuiz />
          <Achievements />
        </div>
      </div>

      <div className="space-y-16 mb-20">
        <ElectionDirectory />
        <Glossary />
        
        <div id="simulation" className="max-w-7xl mx-auto px-6 scroll-mt-24">
          <VotingSimulation />
        </div>

        <div id="polling-info" className="max-w-7xl mx-auto px-6 scroll-mt-24">
          <PollingInfo />
        </div>
      </div>

      <Footer />
    </main>
  );
}
