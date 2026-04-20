import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, Sparkles, Brain, BookOpenText, ListChecks, PlayCircle } from 'lucide-react';
import { generateLesson, LessonContent } from '../lib/gemini';
import { cn } from '../lib/utils';

const SUBJECTS = [
  { id: 'math', label: 'คณิตศาสตร์ (Math)', icon: Brain, color: 'bg-blue-100 text-blue-700' },
  { id: 'science', label: 'วิทยาศาสตร์ (Science)', icon: Sparkles, color: 'bg-green-100 text-green-700' },
  { id: 'english', label: 'ภาษาอังกฤษ (English)', icon: BookOpenText, color: 'bg-orange-100 text-orange-700' },
  { id: 'survival', label: 'ความปลอดภัย (Safety)', icon: ListChecks, color: 'bg-red-100 text-red-700' },
];

export default function LessonEngine({ language, onSpeak }: { language: 'th' | 'en', onSpeak: (text: string) => void }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<'simple' | 'advanced'>('simple');

  const handleGenerate = async (subject: string) => {
    setLoading(true);
    try {
      const content = await generateLesson(subject, language);
      setLesson(content);
      setSelectedSubject(subject);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakLesson = () => {
    if (!lesson) return;
    const textToSpeak = `${lesson.title}. ${level === 'simple' ? lesson.explanation.simple : lesson.explanation.advanced}`;
    onSpeak(textToSpeak);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8 overflow-hidden">
      {/* Subject Selection Area */}
      <div className="flex gap-4 scroll-x overflow-x-auto pb-2 custom-scroll flex-shrink-0">
        {SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleGenerate(sub.id)}
            disabled={loading}
            className={cn(
              "flex-shrink-0 flex items-center gap-4 px-8 py-5 rounded-3xl transition-all border-2",
              selectedSubject === sub.id 
                ? `${sub.color} border-current ring-4 ring-current/10 scale-105` 
                : "bg-white border-natural-line text-slate-400 hover:border-slate-300"
            )}
          >
            <sub.icon size={40} />
            <span className="text-2xl font-bold">{sub.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        {loading ? (
          <div className="col-span-12 flex flex-col items-center justify-center gap-6 bg-white rounded-[40px] border-2 border-natural-line shadow-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Loader2 size={100} className="text-pastel-pink" />
            </motion.div>
            <h2 className="text-4xl font-bold text-natural-ink">กำลังวิเคราะห์ข้อมูล...</h2>
          </div>
        ) : lesson ? (
          <>
            <section className="col-span-8 flex flex-col gap-6 overflow-hidden h-full">
              <div className="bg-white rounded-[40px] p-12 border-2 border-natural-line shadow-sm flex-1 overflow-y-auto custom-scroll flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <span className="bg-pastel-green px-8 py-3 rounded-full text-[28px] font-bold text-[#5A7A2A] uppercase tracking-wider">
                      {selectedSubject}
                    </span>
                    <h2 className="text-[64px] font-black text-natural-ink leading-tight">{lesson.title}</h2>
                  </div>
                </div>

                <p className="text-[42px] leading-relaxed text-natural-ink mb-12 font-sans opacity-95">
                  {level === 'simple' ? lesson.explanation.simple : lesson.explanation.advanced}
                </p>

                <div className="grid grid-cols-2 gap-8 mt-auto">
                  <div className="bg-pastel-peach p-10 rounded-[30px] border-2 border-[#FFC8A2]">
                    <h3 className="text-[32px] font-bold mb-4">ตัวอย่าง (Examples):</h3>
                    <ul className="space-y-6">
                       {lesson.examples.slice(0, 2).map((ex, i) => (
                         <li key={i} className="text-[30px] leading-snug opacity-90 font-medium">• {ex}</li>
                       ))}
                    </ul>
                  </div>
                  <div className="bg-pastel-blue p-10 rounded-[30px] border-2 border-[#A8B2D1] flex flex-col justify-center">
                    <h3 className="text-[32px] font-bold mb-6">การเรียนรู้ (Level):</h3>
                    <div className="flex gap-4">
                         <button onClick={() => setLevel('simple')} className={cn("flex-1 py-4 rounded-xl text-2xl font-black border-2", level === 'simple' ? "bg-white border-natural-ink" : "bg-white/50 border-transparent")}>SIMPLE</button>
                         <button onClick={() => setLevel('advanced')} className={cn("flex-1 py-4 rounded-xl text-2xl font-black border-2", level === 'advanced' ? "bg-white border-natural-ink" : "bg-white/50 border-transparent")}>EXPERT</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[160px] flex gap-8 flex-shrink-0">
                <button 
                  onClick={handleSpeakLesson}
                  className="flex-1 bg-[#FFB7B2] rounded-[30px] border-b-12 border-[#FF9AA2] text-[40px] font-black flex items-center justify-center gap-6 shadow-md transition-all active:translate-y-2 active:border-b-4 uppercase"
                >
                  <PlayCircle size={60} /> AI TEACHER
                </button>
                <button className="flex-1 bg-pastel-green rounded-[30px] border-b-12 border-[#B5EAD7] text-[40px] font-black flex items-center justify-center gap-6 shadow-md transition-all active:translate-y-2 active:border-b-4 uppercase">
                  SUMMARIZE IT!
                </button>
              </div>
            </section>

            <aside className="col-span-4 flex flex-col gap-6 overflow-hidden h-full">
               <div className="bg-white rounded-[40px] p-8 border-2 border-natural-line shadow-sm flex-1 flex flex-col overflow-hidden">
                  <h3 className="text-[30px] font-bold mb-8 text-center text-slate-500 uppercase tracking-widest flex-shrink-0">สถานะห้องเรียน</h3>
                  <div className="space-y-6 flex-1 overflow-y-auto custom-scroll pr-2">
                     <div className="flex items-center justify-between p-6 bg-natural-bg rounded-2xl border border-natural-line">
                        <span className="text-[24px]">การมีส่วนร่วม</span>
                        <span className="text-[32px] font-black text-green-600">88%</span>
                     </div>
                     <div className="flex items-center justify-between p-6 bg-natural-bg rounded-2xl border border-natural-line">
                        <span className="text-[24px]">ความเข้าใจเฉลี่ย</span>
                        <span className="text-[32px] font-black text-blue-600">ดีเยี่ยม</span>
                     </div>
                     
                     <div className="mt-10 border-t-2 border-dashed border-natural-line pt-10">
                        <p className="text-[22px] text-slate-400 uppercase tracking-[0.2em] text-center mb-6">นักเรียนที่เข้าเรียน</p>
                        <div className="flex justify-center -space-x-5">
                           {[1,2,3,4].map(i => (
                             <div key={i} className={cn("w-20 h-20 rounded-full border-4 border-white shadow-sm ring-2 ring-natural-line/10", i % 2 === 0 ? "bg-pastel-pink" : "bg-pastel-blue")} />
                           ))}
                           <div className="w-20 h-20 rounded-full bg-slate-50 border-4 border-white flex items-center justify-center text-[22px] font-bold text-slate-400 shadow-sm">+32</div>
                        </div>
                     </div>
                  </div>
                  <button className="w-full h-[100px] bg-pastel-blue rounded-[30px] border-b-8 border-[#949FCB] text-[32px] font-black shadow-md mt-auto transition-transform active:translate-y-2 active:border-b-0 uppercase italic flex-shrink-0">
                    เริ่มควิซด่วน!
                  </button>
               </div>
            </aside>
          </>
        ) : (
          <div className="col-span-12 flex flex-col items-center justify-center gap-10 bg-white/40 border-4 border-dashed border-natural-line rounded-[60px]">
             <BookOpenText size={150} className="text-natural-line" />
             <h2 className="text-5xl font-black text-slate-300">เลือกวิชาที่คุณต้องการเรียนทางด้านบนได้เลย!</h2>
          </div>
        )}
      </div>
    </div>
  );
}
