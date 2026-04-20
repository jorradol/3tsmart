import React from 'react';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, Users, Award, Clock, Star, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

const SUBJECT_DATA = [
  { subject: 'Math', hours: 45, score: 85 },
  { subject: 'Science', hours: 62, score: 92 },
  { subject: 'English', hours: 38, score: 78 },
  { subject: 'Skills', hours: 25, score: 95 },
];

export default function Dashboard({ language }: { language: 'th' | 'en' }) {
  return (
    <div className="p-8 h-full flex flex-col gap-8 overflow-hidden bg-natural-bg">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-[54px] font-black italic text-natural-ink">School OS Dashboard</h2>
         <div className="bg-white px-6 py-3 rounded-full border-2 border-natural-line flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xl font-black uppercase tracking-widest text-slate-400">Live Data Sync</span>
         </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-8">
        {[
          { label: language === 'th' ? 'ชั่วโมงการเรียน' : 'Learn Hours', value: '1,240', sub: '+12% vs last week', color: 'bg-pastel-blue', text: 'text-natural-ink' },
          { label: language === 'th' ? 'คะแนนเฉลี่ย' : 'Avg. Quiz Score', value: '88%', sub: 'Exceeding target', color: 'bg-pastel-green', text: 'text-[#5A7A2A]' },
          { label: language === 'th' ? 'นักเรียนออนไลน์' : 'Students Live', value: '342', sub: 'Across 12 classes', color: 'bg-pastel-pink', text: 'text-white' },
          { label: language === 'th' ? 'รางวัลสะสม' : 'Rewards Issued', value: '52', sub: 'Level Up badges', color: 'bg-pastel-peach', text: 'text-natural-ink' },
        ].map((stat, i) => (
          <div key={i} className={cn("p-8 rounded-[40px] shadow-sm border-2 border-natural-line flex flex-col gap-2 transition-transform hover:scale-105", stat.color)}>
            <span className={cn("text-xl font-black uppercase tracking-widest opacity-60", stat.text)}>{stat.label}</span>
            <span className={cn("text-6xl font-black", stat.text)}>{stat.value}</span>
            <span className={cn("text-lg font-bold opacity-50", stat.text)}>{stat.sub}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        {/* Engagement Chart */}
        <div className="col-span-8 bg-white rounded-[40px] p-10 border-2 border-natural-line shadow-sm flex flex-col">
          <h3 className="text-3xl font-black mb-10 text-natural-ink uppercase tracking-widest flex items-center gap-4">
            <TrendingUp size={36} className="text-pastel-peach" />
            {language === 'th' ? 'ความสนใจตามวิชา' : 'Subject Engagement'}
          </h3>
          <div className="flex-1 flex items-end justify-between gap-6 px-4">
             {SUBJECT_DATA.map((d, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                  <div className="relative w-full flex items-end justify-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${d.hours * 4}px` }}
                      className={cn(
                        "w-full max-w-[120px] rounded-t-3xl transition-all group-hover:scale-105 shadow-sm border-b-0",
                        d.subject === 'Math' ? 'bg-pastel-blue border-b-8 border-[#949FCB]' :
                        d.subject === 'Science' ? 'bg-pastel-green border-b-8 border-[#88C6AF]' :
                        d.subject === 'English' ? 'bg-pastel-pink border-b-8 border-[#FF9AA2]' :
                        'bg-pastel-lemon border-b-8 border-[#E5E0D8]'
                      )}
                    />
                    <span className="absolute -top-10 text-xl font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.score}%
                    </span>
                  </div>
                  <span className="text-[22px] font-black text-slate-500 uppercase tracking-tighter">{d.subject}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-4 bg-white rounded-[40px] p-10 border-2 border-natural-line shadow-sm flex flex-col overflow-hidden">
           <h3 className="text-3xl font-black mb-8 text-natural-ink uppercase tracking-widest flex items-center gap-3">
             <Clock size={32} className="text-pastel-blue" />
             {language === 'th' ? 'กิจกรรมล่าสุด' : 'Recent Activity'}
           </h3>
           <div className="space-y-6 overflow-y-auto custom-scroll pr-2 flex-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="p-5 bg-natural-bg rounded-3xl border border-natural-line flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <BarChart2 size={32} className={cn(item % 2 === 0 ? "text-pastel-peach" : "text-pastel-blue")} />
                   </div>
                   <div>
                      <p className="text-2xl font-black text-natural-ink italic leading-tight">Class {4 + item}B Active</p>
                      <p className="text-lg font-bold text-slate-400">Activity logged {item * 5}m ago</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 py-5 rounded-2xl bg-white border-2 border-natural-line text-xl font-black text-natural-ink uppercase shadow-sm active:translate-y-1 hover:bg-natural-bg transition-all">
             Full School Report
           </button>
        </div>
      </div>
    </div>
  );
}
