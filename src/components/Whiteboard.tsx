import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pen, Trash2, Download, Save, Undo, Redo, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = [
  '#0f172a', // Navy
  '#dc2626', // Red
  '#2563eb', // Blue
  '#16a34a', // Green
  '#d97706', // Yellow
  '#9333ea', // Purple
  '#db2777', // Pink
];

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to parent
    const resizeCanvas = () => {
      const { width, height } = canvas.parentElement!.getBoundingClientRect();
      canvas.width = width * 2; // High DPI support
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        contextRef.current = ctx;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      contextRef.current.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    }
  }, [tool, color, brushSize]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const { x, y } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { x, y } = getCoordinates(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const endDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="h-full w-full relative flex">
      {/* Side Toolbar */}
      <div className="w-[160px] glass h-full flex flex-col items-center py-10 gap-8 z-10 border-r border-slate-200">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setTool('pen')}
            className={cn(
              "w-24 h-24 rounded-3xl flex items-center justify-center transition-all",
              tool === 'pen' ? "bg-indigo-600 text-white shadow-xl" : "bg-white text-slate-400 hover:bg-slate-50"
            )}
          >
            <Pen size={44} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={cn(
              "w-24 h-24 rounded-3xl flex items-center justify-center transition-all",
              tool === 'eraser' ? "bg-indigo-600 text-white shadow-xl" : "bg-white text-slate-400 hover:bg-slate-50"
            )}
          >
            <Eraser size={44} />
          </button>
        </div>

        <div className="h-px w-10 bg-slate-200" />

        <div className="grid grid-cols-2 gap-3">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setTool('pen');
              }}
              className={cn(
                "w-12 h-12 rounded-full border-4 transition-all scale-110",
                color === c && tool === 'pen' ? "border-slate-800 ring-4 ring-slate-200" : "border-white"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="h-px w-10 bg-slate-200" />

        <input 
          type="range" 
          min="2" 
          max="50" 
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-32 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600 [writing-mode:vertical-rl]"
        />

        <button
          onClick={clearCanvas}
          className="mt-auto w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center hover:bg-red-100 transition-all"
        >
          <Trash2 size={40} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-white cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="touch-none"
        />
      </div>

      {/* Floating Info */}
      <div className="absolute top-10 right-10 flex gap-4 pointer-events-none">
        <div className="glass px-10 py-5 rounded-full flex items-center gap-4">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: tool === 'eraser' ? '#fff' : color, border: '2px solid #ccc' }} />
          <span className="text-2xl font-black text-slate-700 italic uppercase">
             {tool === 'pen' ? 'Drawing Mode' : 'Eraser Mode'}
          </span>
        </div>
      </div>
    </div>
  );
}
