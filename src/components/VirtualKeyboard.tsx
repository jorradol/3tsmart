import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X, Move, Maximize, Globe, Delete, Space, CornerDownLeft, ArrowBigUp as ShiftUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface VirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'th' | 'en';
}

const LAYOUTS = {
  en: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BKSP'],
    ['SPACE', 'ENTER']
  ],
  enShift: [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BKSP'],
    ['SPACE', 'ENTER']
  ],
  th: [
    ['ๅ', '/', '-', 'ถ', 'ุ', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช'],
    ['ๆ', 'ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ร', 'น', 'ย', 'บ', 'ล'],
    ['ฟ', 'ห', 'ก', 'ด', 'เ', '้', '่', 'า', 'ส', 'ว', 'ง'],
    ['SHIFT', 'ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ', 'BKSP'],
    ['SPACE', 'ENTER']
  ],
  thShift: [
    ['+', '๑', '๒', '๓', '๔', 'ู', '฿', '๕', '๖', '๗', '๘'],
    ['๐', 'ฎ', 'ฏ', 'ฐ', 'ภ', 'ํ', 'ธ', 'ณ', 'ญ', 'ฐ', 'ฅ', 'ฤ'],
    ['ฤ', 'ฆ', 'ฏ', 'โ', 'ฌ', '็', '๋', 'ษ', 'ศ', 'ซ', 'ฉ'],
    ['SHIFT', 'ฉ', 'ฮ', 'ฺ', '์', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ', 'BKSP'],
    ['SPACE', 'ENTER']
  ]
};

export default function VirtualKeyboard({ isOpen, onClose, language: initialLang }: VirtualKeyboardProps) {
  const [lang, setLang] = useState<'th' | 'en'>(initialLang);
  const [isShift, setIsShift] = useState(false);
  const [scale, setScale] = useState(1);
  const dragControls = useDragControls();

  const handleKeyClick = (key: string) => {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA')) return;

    const start = activeElement.selectionStart || 0;
    const end = activeElement.selectionEnd || 0;
    const value = activeElement.value;

    if (key === 'BKSP') {
      if (start === end && start > 0) {
        activeElement.value = value.substring(0, start - 1) + value.substring(end);
        activeElement.setSelectionRange(start - 1, start - 1);
      } else {
        activeElement.value = value.substring(0, start) + value.substring(end);
        activeElement.setSelectionRange(start, start);
      }
    } else if (key === 'SPACE') {
      activeElement.value = value.substring(0, start) + ' ' + value.substring(end);
      activeElement.setSelectionRange(start + 1, start + 1);
    } else if (key === 'ENTER') {
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      activeElement.blur();
    } else if (key === 'SHIFT') {
      setIsShift(!isShift);
      return;
    } else {
      activeElement.value = value.substring(0, start) + key + value.substring(end);
      activeElement.setSelectionRange(start + 1, start + 1);
      if (isShift) setIsShift(false);
    }

    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    activeElement.focus(); // Re-focus to keep the caret active
  };

  const layoutKey = `${lang}${isShift ? 'Shift' : ''}` as keyof typeof LAYOUTS;
  const layout = LAYOUTS[layoutKey] || LAYOUTS.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           drag
           dragControls={dragControls}
           dragListener={false}
           dragMomentum={false}
           initial={{ opacity: 0, y: 100, scale: 0.8 }}
           animate={{ opacity: 1, y: 0, scale: scale }}
           exit={{ opacity: 0, y: 100, scale: 0.8 }}
           className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[10000] w-[900px] bg-white rounded-[40px] shadow-2xl border-2 border-natural-line p-8 flex flex-col gap-6 touch-none"
        >
          {/* Header / Controls */}
          <div className="flex items-center justify-between px-4 pb-6 border-b border-natural-line/50">
             <div className="flex items-center gap-6">
                <div 
                  onPointerDown={(e) => dragControls.start(e)}
                  className="p-3 bg-natural-bg rounded-2xl cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-colors"
                >
                   <Move size={32} className="text-pastel-blue" />
                </div>
                <div>
                   <h4 className="text-2xl font-black text-natural-ink uppercase tracking-widest leading-none">Smart Keyboard</h4>
                   <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Drag to Move | Drag Handle Above</p>
                </div>
             </div>
             
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 bg-natural-bg px-6 py-2 rounded-2xl border border-natural-line">
                   <Maximize size={24} className="text-slate-400" />
                   <input 
                     type="range" 
                     min="0.5" 
                     max="1.5" 
                     step="0.05" 
                     value={scale} 
                     onChange={(e) => setScale(parseFloat(e.target.value))}
                     className="w-40 h-2 bg-pastel-pink/20 rounded-lg appearance-none cursor-pointer accent-pastel-pink"
                   />
                   <span className="text-xl font-black text-pastel-pink w-12">{Math.round(scale * 100)}%</span>
                </div>
                
                <button 
                  onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
                  className="flex items-center gap-3 px-6 py-3 bg-pastel-blue text-white rounded-2xl font-black text-xl shadow-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  <Globe size={24} />
                  {lang === 'en' ? 'ENGLISH' : 'ภาษาไทย'}
                </button>

                <button 
                  onClick={onClose} 
                  className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 transition-colors shadow-sm"
                >
                   <X size={32} />
                </button>
             </div>
          </div>

          {/* Keys Grid */}
          <div className="flex flex-col gap-3">
            {layout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-3">
                {row.map((key, keyIndex) => (
                  <button
                    key={`${rowIndex}-${keyIndex}`}
                    onPointerDown={(e) => {
                       e.preventDefault(); // Prevent focus loss
                       handleKeyClick(key);
                    }}
                    className={cn(
                      "h-16 min-w-[65px] flex items-center justify-center rounded-2xl bg-white border-2 border-natural-line border-b-6 active:border-b-2 active:translate-y-1 transition-all text-2xl font-bold hover:bg-natural-bg",
                      key === 'SHIFT' && (isShift ? "bg-pastel-pink text-white border-[#FF9AA2] ring-4 ring-pastel-pink/20" : "w-32"),
                      key === 'BKSP' && "w-32 bg-slate-50 text-slate-500",
                      key === 'SPACE' && "w-[450px] bg-natural-bg",
                      key === 'ENTER' && "w-40 bg-pastel-green text-green-700 border-[#88C6AF]",
                      key.length > 1 && "text-lg font-black"
                    )}
                  >
                    {key === 'SHIFT' ? <ShiftUp size={32} /> : 
                     key === 'BKSP' ? <Delete size={32} /> : 
                     key === 'SPACE' ? <Space size={32} /> :
                     key === 'ENTER' ? <CornerDownLeft size={32} /> : 
                     key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
