import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageSquare, 
  CheckSquare, 
  Edit3, 
  Heart, 
  BarChart2, 
  Volume2, 
  Settings,
  Languages
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
  key?: any;
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}

const NavItem = ({ icon: Icon, label, active, onClick, color }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-2xl transition-all",
      active 
        ? `${color} text-slate-900 shadow-lg scale-105 border-b-4 border-slate-900/10` 
        : "bg-transparent text-slate-500 hover:bg-slate-100"
    )}
    style={{ minWidth: '180px', height: '110px' }}
  >
    <Icon size={40} strokeWidth={active ? 2.5 : 2} />
    <span className="text-xl font-bold tracking-tight">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
  onVoiceToggle: () => void;
  voiceEnabled: boolean;
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  language, 
  setLanguage,
  onVoiceToggle,
  voiceEnabled
}: LayoutProps) {
  const tabs = [
    { id: 'lesson', label: language === 'th' ? 'บทเรียน' : 'Lesson', icon: BookOpen, color: 'bg-pastel-blue' },
    { id: 'tutor', label: language === 'th' ? 'ติวเตอร์ AI' : 'AI Tutor', icon: MessageSquare, color: 'bg-pastel-pink' },
    { id: 'quiz', label: language === 'th' ? 'ควิซ' : 'Quiz', icon: CheckSquare, color: 'bg-pastel-lemon' },
    { id: 'whiteboard', label: language === 'th' ? 'ไวท์บอร์ด' : 'Whiteboard', icon: Edit3, color: 'bg-pastel-green' },
    { id: 'lifeskills', label: language === 'th' ? 'ทักษะชีวิต' : 'Life Skills', icon: Heart, color: 'bg-pastel-peach' },
    { id: 'dashboard', label: language === 'th' ? 'ข้อมูล' : 'Dashboard', icon: BarChart2, color: 'bg-pastel-blue' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-natural-bg overflow-hidden font-sans select-none">
      {/* Top Navigation */}
      <nav className="h-[110px] w-full flex items-center justify-between px-8 border-b-2 border-natural-line bg-white z-50">
        <div className="flex items-center gap-6">
          <div className="bg-pastel-pink w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
             <span className="text-white font-black text-2xl uppercase tracking-tighter">3T</span>
          </div>
          <h1 className="text-[42px] font-bold text-natural-ink">3TSmart</h1>
        </div>

        <div className="flex gap-2 h-full items-end pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-[85px] px-8 rounded-t-3xl text-[30px] font-semibold transition-all",
                activeTab === tab.id ? "active-tab" : "text-slate-400 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            className="bg-pastel-mint hover:opacity-90 h-[70px] px-6 rounded-2xl text-[24px] font-bold border-b-4 border-[#88C6AF] transition-all"
          >
            {language === 'th' ? 'ไทย / EN' : 'EN / TH'}
          </button>
          
          <button 
             onClick={onVoiceToggle}
             className={cn(
               "flex items-center justify-center w-[70px] h-[70px] border-2 rounded-2xl transition-all shadow-sm",
               voiceEnabled ? "bg-[#FFB7B2] border-[#FF9AA2] text-white" : "bg-white border-natural-line text-slate-300"
             )}
          >
            <Volume2 size={36} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Aesthetic Footer */}
      <footer className="h-[100px] bg-natural-ink text-white flex items-center justify-between px-10">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[20px] font-medium opacity-80 uppercase tracking-widest text-white/70">AI READY</span>
          </div>
          <span className="h-6 w-[2px] bg-gray-500"></span>
          <span className="text-[22px] font-medium">3TSmart Classroom Pro System v1.0</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[22px] opacity-70">School OS Radar | Active Now</span>
          <button className="text-[18px] border border-white/30 px-5 py-1 rounded-lg hover:bg-white/10 transition-all font-bold">SETTING</button>
        </div>
      </footer>
    </div>
  );
}
