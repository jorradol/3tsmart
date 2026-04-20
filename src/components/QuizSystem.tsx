import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, RefreshCcw, Loader2, PlayCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuiz, QuizQuestion } from '../lib/gemini';
import { cn } from '../lib/utils';

export default function QuizSystem({ language, onSpeak }: { language: 'th' | 'en', onSpeak: (text: string) => void }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const startQuiz = async (category: string) => {
    setLoading(true);
    setFinished(false);
    setScore(0);
    setCurrentIdx(0);
    try {
      const data = await generateQuiz(category, language);
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedAns(idx);
    setShowFeedback(true);

    const correct = idx === questions[currentIdx].correctAnswer;
    if (correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#22c55e', '#ffffff']
      });
      onSpeak(language === 'th' ? "ถูกต้องเก่งมากค่ะ" : "Excellent, correct answer!");
    } else {
      onSpeak(language === 'th' ? "ไม่ใช่คำตอบนี้ ลองพยายามดูอีกทีนะคะ" : "That's not quite right, try again next time!");
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedAns(null);
        setShowFeedback(false);
      } else {
        setFinished(true);
        confetti({
          particleCount: 300,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#facc15', '#fbbf24', '#ffffff']
        });
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 bg-natural-bg/40">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <Loader2 size={120} className="text-pastel-blue" />
        </motion.div>
        <h2 className="text-5xl font-black text-natural-ink tracking-tight">กำลังเตรียมคำถามสุดสนุก...</h2>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <Trophy size={200} className="text-pastel-peach mb-10 drop-shadow-lg" />
        </motion.div>
        <h1 className="text-7xl font-black mb-4 text-natural-ink">เก่งมาก! (Great Job!)</h1>
        <p className="text-5xl font-bold text-slate-500 mb-12">
          คะแนนที่ได้: {score} / {questions.length}
        </p>
        <button 
          onClick={() => startQuiz('General Knowledge')}
          className="flex items-center gap-4 px-16 py-8 bg-pastel-blue border-b-8 border-[#949FCB] rounded-[40px] text-4xl font-black text-natural-ink shadow-md active:translate-y-2 active:border-b-0 transition-all font-sans"
        >
          <RefreshCcw size={40} /> เล่นอีกครั้ง
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 gap-10">
        <h1 className="text-8xl font-black text-natural-ink tracking-tighter">แบบทดสอบอัจฉริยะ</h1>
        <div className="grid grid-cols-2 gap-8 max-w-[1200px]">
          {['ดาราศาสตร์', 'โลกใต้พิภพ', 'บวกเลขหรรษา', 'คำศัพท์น่ารู้'].map((cat) => (
            <button
               key={cat}
               onClick={() => startQuiz(cat)}
               className="h-32 bg-white border-2 border-natural-line rounded-[30px] text-3xl font-bold text-natural-ink hover:border-pastel-blue hover:bg-natural-bg shadow-sm transition-all flex items-center justify-center gap-4"
            >
              🚀 {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="h-full p-12 flex flex-col gap-10">
      <div className="flex justify-between items-center bg-white rounded-full px-12 py-5 shadow-sm border-2 border-natural-line">
        <span className="text-2xl font-black text-pastel-blue uppercase tracking-widest">Question {currentIdx + 1} / {questions.length}</span>
        <div className="flex gap-3">
           {questions.map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "w-5 h-5 rounded-full transition-all duration-500",
                 i < currentIdx ? "bg-pastel-green" : i === currentIdx ? "bg-pastel-blue ring-4 ring-pastel-blue/20" : "bg-natural-line"
               )}
             />
           ))}
        </div>
        <span className="text-2xl font-black text-pastel-peach uppercase">Score: {score}</span>
      </div>

      <div className="flex-1 bg-white rounded-[50px] shadow-sm flex flex-col overflow-hidden border-2 border-natural-line">
          <div className="p-16 flex-1 flex flex-col h-full overflow-hidden">
            <h2 className="text-[64px] font-black text-natural-ink mb-12 leading-tight flex-shrink-0">
              {q.question}
            </h2>

            <div className="grid grid-cols-2 gap-10 flex-1 overflow-y-auto custom-scroll pr-4">
               {q.options.map((opt, i) => {
                 const isCorrect = i === q.correctAnswer;
                 const isSelected = selectedAns === i;
                 return (
                   <button
                     key={i}
                     onClick={() => handleSelect(i)}
                     disabled={showFeedback}
                     className={cn(
                       "relative min-h-[180px] flex flex-col items-center justify-center p-10 rounded-[40px] border-2 transition-all text-[42px] font-black leading-tight",
                       !showFeedback 
                         ? "bg-natural-bg border-natural-line text-natural-ink hover:border-pastel-blue hover:bg-white" 
                         : isCorrect 
                           ? "bg-pastel-green border-[#88C6AF] text-[#5A7A2A] scale-105 z-10 shadow-xl" 
                           : isSelected 
                             ? "bg-pastel-pink border-[#FF9AA2] text-white" 
                             : "bg-white opacity-40 shadow-none border-transparent"
                     )}
                   >
                     {isSelected && (
                        <div className="absolute top-6 left-6">
                           {isCorrect ? <CheckCircle2 size={60} /> : <XCircle size={60} />}
                        </div>
                     )}
                     <span className="text-center">{opt}</span>
                   </button>
                 );
               })}
            </div>
          </div>
         
         <AnimatePresence>
           {showFeedback && (
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-natural-ink text-white p-10 overflow-hidden flex items-center justify-between"
             >
                <div className="flex-1">
                  <h4 className="text-pastel-blue text-[24px] font-black uppercase tracking-[0.3em] mb-3">บทอธิบาย (Context)</h4>
                  <p className="text-[34px] font-bold opacity-90 leading-relaxed">{q.explanation}</p>
                </div>
                <div className="flex items-center justify-center w-20 h-20 bg-white/10 rounded-full flex-shrink-0">
                   <Loader2 size={40} className="animate-spin text-pastel-blue" />
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
