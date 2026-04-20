import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Heart, Wallet, MessageCircle, CheckCircle, Loader2, Sparkles, Brain } from 'lucide-react';
import { generateScenario, Scenario } from '../lib/gemini';
import { cn } from '../lib/utils';

const TOPICS = [
  { id: 'money', label: 'การเงิน (Money)', icon: Wallet, color: 'bg-pastel-green text-[#5A7A2A]' },
  { id: 'safety', label: 'ความปลอดภัย (Safety)', icon: Shield, color: 'bg-pastel-pink text-pink-700' },
  { id: 'comm', label: 'การสื่อสาร (Empathy)', icon: MessageCircle, color: 'bg-pastel-blue text-[#4A4A4A]' },
];

export default function LifeSkills({ language, onSpeak }: { language: 'th' | 'en', onSpeak: (text: string) => void }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleStart = async (topicId: string) => {
    setLoading(true);
    setScenario(null);
    setFeedback(null);
    try {
      const s = await generateScenario(topicId, language);
      setScenario(s);
      setSelectedTopic(topicId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (!scenario) return;
    const correct = idx === scenario.correctIdx;
    setIsCorrect(correct);
    setFeedback(scenario.feedback);
    onSpeak(scenario.feedback);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8 overflow-hidden bg-natural-bg">
      <div className="flex gap-4">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleStart(t.id)}
            disabled={loading}
            className={cn(
              "flex-1 flex items-center justify-center gap-4 px-8 py-6 rounded-[30px] border-2 transition-all transition-transform active:scale-95",
              selectedTopic === t.id 
                ? `${t.color} border-current ring-4 ring-current/10 scale-105` 
                : "bg-white border-natural-line text-slate-400 hover:border-slate-300"
            )}
          >
            <t.icon size={40} />
            <span className="text-2xl font-bold uppercase tracking-tight">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-[40px] shadow-sm border-2 border-natural-line overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Loader2 size={100} className="text-pastel-peach" />
            </motion.div>
            <h2 className="text-4xl font-black text-natural-ink italic tracking-tighter">จำลองเหตุการณ์จริง...</h2>
          </div>
        ) : scenario ? (
          <div className="p-12 flex flex-col h-full overflow-hidden">
            <h2 className="text-[48px] font-black text-natural-ink mb-10 leading-tight flex items-center gap-6">
              <span className="p-4 bg-pastel-lemon rounded-2xl"><Sparkles size={40} className="text-pastel-peach" /></span>
              {scenario.title}
            </h2>
            
            <div className="flex-1 overflow-y-auto custom-scroll pr-4">
              <div className="bg-natural-bg p-10 rounded-[30px] border-2 border-natural-line mb-10">
                <p className="text-[34px] leading-relaxed text-natural-ink font-sans italic opacity-90">
                  {scenario.situation}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {scenario.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={!!feedback}
                    className={cn(
                      "w-full p-8 rounded-[30px] border-2 text-[28px] font-bold transition-all text-left flex items-center justify-between",
                      !feedback 
                        ? "bg-white border-natural-line hover:border-pastel-peach hover:bg-pastel-peach/10 shadow-sm" 
                        : i === scenario.correctIdx 
                          ? "bg-pastel-green border-[#88C6AF] text-[#5A7A2A]" 
                          : "bg-white opacity-40 border-transparent shadow-none"
                    )}
                  >
                    <span>{opt}</span>
                    {feedback && i === scenario.correctIdx && <CheckCircle size={40} />}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={cn(
                    "mt-10 p-8 rounded-[30px] border-2 flex items-center gap-8 shadow-md",
                    isCorrect ? "bg-pastel-green border-[#88C6AF]" : "bg-pastel-pink border-[#FF9AA2]"
                  )}
                >
                  <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                     {isCorrect ? <Brain size={48} className="text-[#5A7A2A]" /> : <Shield size={48} className="text-pink-700" />}
                  </div>
                  <div>
                    <h4 className="text-[20px] font-black uppercase tracking-[0.3em] mb-1 opacity-60">
                      {isCorrect ? 'ยอดเยี่ยม!' : 'ระมัดระวัง!'} (Outcome)
                    </h4>
                    <p className="text-[28px] font-bold leading-snug">{feedback}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-10 opacity-30">
             <Heart size={150} className="text-pastel-peach" />
             <h2 className="text-5xl font-black italic tracking-tighter">เตรียมตัวให้พร้อมสำหรับชีวิตจริง!</h2>
          </div>
        )}
      </div>
    </div>
  );
}
