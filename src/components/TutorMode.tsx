import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import { generateTutorResponse } from '../lib/gemini';
import { cn } from '../lib/utils';

interface Message {
  role: 'student' | 'tutor';
  text: string;
  id: string;
}

export default function TutorMode({ language, onSpeak }: { language: 'th' | 'en', onSpeak: (text: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'tutor', 
      text: language === 'th' ? 'สวัสดีค่ะ! มีคำถามอะไรเกี่ยวกับบทเรียนวันนี้ไหมคะ?' : 'Hello! Do you have any questions about today\'s lesson?', 
      id: '1' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [simpleMode, setSimpleMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'student', text: input, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateTutorResponse(input, "Classroom Assistant", simpleMode, language);
      const botMsg: Message = { role: 'tutor', text: response, id: (Date.now() + 1).toString() };
      setMessages(prev => [...prev, botMsg]);
      onSpeak(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-8 flex flex-col gap-8 overflow-hidden">
      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-[2] bg-white rounded-[40px] shadow-sm flex flex-col overflow-hidden border-2 border-natural-line">
           <div className="h-32 bg-pastel-pink flex items-center justify-between px-12 border-b border-natural-line">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Bot size={36} className="text-pastel-pink" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-natural-ink italic">AI Tutor 3TSmart</h2>
                 </div>
              </div>
              
              <button 
                onClick={() => setSimpleMode(!simpleMode)}
                className={cn(
                  "px-6 py-3 rounded-full text-xl font-black transition-all border-2",
                  simpleMode ? "bg-pastel-green border-[#88C6AF] text-[#5A7A2A]" : "bg-white border-natural-line text-slate-400"
                )}
              >
                {simpleMode ? '🌟 EASY MODE' : '📚 ACADEMIC'}
              </button>
           </div>

           <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scroll bg-natural-bg/30">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col gap-3 max-w-[85%]",
                    m.role === 'student' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-8 rounded-[40px] text-[36px] font-bold leading-relaxed border-2 shadow-sm",
                    m.role === 'student' 
                      ? "bg-pastel-blue border-[#949FCB] text-natural-ink rounded-br-none font-black" 
                      : "bg-white border-natural-line text-natural-ink rounded-bl-none"
                  )}>
                    {m.text}
                  </div>
                  <div className="flex items-center gap-3 px-2">
                     <span className="text-[14px] font-black uppercase text-slate-400 tracking-[0.2em]">
                       {m.role === 'student' ? 'STUDENT' : '3TSMART BOT'}
                     </span>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-4 items-center pl-4 text-pastel-pink">
                  <Loader2 size={36} className="animate-spin" />
                  <span className="text-2xl font-black italic">THINKING...</span>
                </div>
              )}
           </div>

           <div className="p-10 glass flex gap-6 h-[160px] flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'th' ? "ถามมาได้เลย..." : "Type your question..."}
                className="flex-1 h-full px-12 rounded-[40px] bg-white border-2 border-natural-line focus:border-pastel-pink outline-none text-[32px] font-bold transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="w-32 bg-pastel-pink text-white rounded-[40px] border-b-12 border-[#FF9AA2] flex items-center justify-center transition-all active:translate-y-2 active:border-b-4 hover:brightness-105"
              >
                <Send size={48} />
              </button>
           </div>
        </div>

        {/* Suggestion Sidebar */}
        <div className="flex-1 flex flex-col gap-8 overflow-hidden">
           <div className="bg-white rounded-[40px] p-8 shadow-sm border-2 border-natural-line overflow-y-auto custom-scroll">
              <h3 className="text-[24px] font-black mb-6 flex items-center gap-3 text-natural-ink uppercase tracking-wider">
                <Sparkles size={28} className="text-pastel-peach" /> 
                {language === 'th' ? 'ถามแบบนี้ก็ได้นะ' : 'Try asking...'}
              </h3>
              <div className="space-y-3">
                 {[
                   language === 'th' ? 'อธิบายเรื่องนี้ใหม่หน่อย' : 'Explain this again',
                   language === 'th' ? 'ขอยกตัวอย่างง่ายๆ' : 'Simple examples',
                   language === 'th' ? 'เรื่องนี้สำคัญยังไง' : 'Why it matters?',
                   language === 'th' ? 'ความลับของเรื่องนี้' : 'Secret facts'
                 ].map((s, i) => (
                   <button 
                     key={i}
                     onClick={() => setInput(s)}
                     className="w-full p-5 text-left text-xl font-bold text-slate-500 bg-natural-bg rounded-2xl hover:bg-pastel-blue/20 hover:text-natural-ink transition-all border-2 border-transparent hover:border-pastel-blue/30"
                   >
                     🌈 {s}
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="flex-1 bg-pastel-peach rounded-[40px] p-10 text-natural-ink flex flex-col justify-center gap-6 relative overflow-hidden border-2 border-[#FFC8A2]">
              <h3 className="text-[32px] font-black italic">รู้หรือไม่?<br/>(Did you know?)</h3>
              <p className="text-[22px] font-bold opacity-80 leading-snug">
                 "แอลเบิร์ต ไอน์สไตน์ เชื่อว่าหัวใจสำคัญของการเรียนรู้คือความอยากรู้อยากเห็น"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
