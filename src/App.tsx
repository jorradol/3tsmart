/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import LessonEngine from './components/LessonEngine';
import TutorMode from './components/TutorMode';
import QuizSystem from './components/QuizSystem';
import Whiteboard from './components/Whiteboard';
import LifeSkills from './components/LifeSkills';
import Dashboard from './components/Dashboard';

import VirtualKeyboard from './components/VirtualKeyboard';
import { Keyboard, ArrowBigUp as ShiftUp } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('lesson');
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const handleSpeak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Set language based on app state or content detection
    // For simplicity, we use the app language
    utterance.lang = language === 'th' ? 'th-TH' : 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher for a friendly "AI teacher" vibe
    
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled, language]);

  const renderContent = () => {
    switch (activeTab) {
      case 'lesson':
        return <LessonEngine language={language} onSpeak={handleSpeak} />;
      case 'tutor':
        return <TutorMode language={language} onSpeak={handleSpeak} />;
      case 'quiz':
        return <QuizSystem language={language} onSpeak={handleSpeak} />;
      case 'whiteboard':
        return <Whiteboard />;
      case 'lifeskills':
        return <LifeSkills language={language} onSpeak={handleSpeak} />;
      case 'dashboard':
        return <Dashboard language={language} />;
      default:
        return <LessonEngine language={language} onSpeak={handleSpeak} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        language={language}
        setLanguage={setLanguage}
        voiceEnabled={voiceEnabled}
        onVoiceToggle={() => setVoiceEnabled(!voiceEnabled)}
      >
        {renderContent()}
      </Layout>

      {/* Floating Keyboard Toggle */}
      <button
        onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
        className={cn(
          "fixed bottom-28 right-8 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-[10000] border-4 transition-all active:scale-90",
          isKeyboardOpen ? "bg-pastel-pink border-[#FF9AA2] text-white" : "bg-white border-natural-line text-slate-400"
        )}
      >
        <Keyboard size={40} />
      </button>

      <VirtualKeyboard 
        isOpen={isKeyboardOpen} 
        onClose={() => setIsKeyboardOpen(false)} 
        language={language}
      />
    </>
  );
}

