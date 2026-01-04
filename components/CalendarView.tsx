
import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { Task, CalendarMode } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onSelect: (t: Task) => void;
}

const getActionStyling = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('linkedin')) return { 
        badge: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-100 dark:border-sky-800',
        hoverBorder: 'hover:border-sky-500/20', 
        accent: 'border-l-sky-500' 
    };
    if (a.includes('vidéo')) return { 
        badge: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800',
        hoverBorder: 'hover:border-purple-500/20', 
        accent: 'border-l-purple-500'
    };
    if (a.includes('webinaire')) return { 
        badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800',
        hoverBorder: 'hover:border-emerald-500/20', 
        accent: 'border-l-emerald-500'
    };
    if (a.includes('blog')) return { 
        badge: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800',
        hoverBorder: 'hover:border-orange-500/20', 
        accent: 'border-l-orange-500'
    };
    return { 
        badge: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700',
        hoverBorder: 'hover:border-slate-500/20', 
        accent: 'border-l-slate-500'
    };
};

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelect }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [mode, setMode] = useState<CalendarMode>('week');

  const fullDateStr = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const days = useMemo(() => {
    const d: Date[] = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    if (mode === 'month') {
      const lastDay = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= lastDay; i++) d.push(new Date(year, month, i));
    } else {
      const start = new Date(viewDate);
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - (day - 1));
      const limit = mode === 'workweek' ? 5 : 7;
      for (let i = 0; i < limit; i++) {
        const next = new Date(start);
        next.setDate(start.getDate() + i);
        d.push(next);
      }
    }
    return d;
  }, [viewDate, mode]);

  const handlePrev = () => {
    const next = new Date(viewDate);
    if (mode === 'month') next.setMonth(next.getMonth() - 1);
    else next.setDate(next.getDate() - 7);
    setViewDate(next);
  };

  const handleNext = () => {
    const next = new Date(viewDate);
    if (mode === 'month') next.setMonth(next.getMonth() + 1);
    else next.setDate(next.getDate() + 7);
    setViewDate(next);
  };

  const title = mode === 'month' 
    ? viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : `${days[0]?.getDate()} AU ${days[days.length-1]?.getDate()} ${days[0]?.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`;

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 md:rounded-[40px] overflow-hidden transition-all border-slate-200 dark:border-slate-800 md:border shadow-2xl">
      {/* MOBILE HEADER - DESIGN REFAIT */}
      <div className="md:hidden p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-500/30">
              <Lucide.Rocket className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-[#0f172a] dark:text-white uppercase tracking-tighter">
              MARKETING <span className="text-blue-600">STUDIO</span>
            </h1>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">CALENDRIER</h2>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{fullDateStr}</p>
          </div>
        </div>
      </div>

      {/* Main Toolbar - Plus aérée et contrastée */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-black text-[#0f172a] dark:text-white uppercase tracking-tighter leading-none">{title}</h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <button onClick={handlePrev} className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-all active:scale-90" title="Période précédente"><Lucide.ChevronLeft className="w-5 h-5" /></button>
              <button onClick={handleNext} className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-all active:scale-90" title="Période suivante"><Lucide.ChevronRight className="w-5 h-5" /></button>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex-1 md:flex-none">
              {['MOIS', 'SEMAINE', 'TRAVAIL'].map((m) => {
                const isActive = (mode === 'month' && m === 'MOIS') || (mode === 'week' && m === 'SEMAINE') || (mode === 'workweek' && m === 'TRAVAIL');
                return (
                  <button 
                    key={m}
                    onClick={() => setMode(m === 'MOIS' ? 'month' : m === 'SEMAINE' ? 'week' : 'workweek')}
                    title={m === 'MOIS' ? 'Affichage par mois' : m === 'SEMAINE' ? 'Affichage par semaine' : 'Affichage par semaine de travail'}
                    className={`flex-1 md:px-6 py-2 text-[10px] font-black rounded-xl transition-all duration-300 ${
                        isActive ? 'bg-white dark:bg-slate-600 shadow-lg shadow-black/5 text-blue-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin">
        <div className={`grid gap-4 md:gap-8 ${mode === 'month' ? 'grid-cols-7' : 'grid-cols-1 md:grid-cols-7'}`}>
          <div className="hidden md:contents">
              {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">{d}</div>
              ))}
          </div>
          {days.map((date, i) => {
            const dateStr = date.toDateString();
            const dayTasks = tasks.filter(t => new Date(t.tLan).toDateString() === dateStr);
            const isToday = new Date().toDateString() === dateStr;
            return (
              <div key={i} className={`group relative min-h-[160px] md:min-h-[260px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px] flex flex-col overflow-hidden ${isToday ? 'ring-2 ring-blue-500/40 bg-blue-50/5 dark:bg-blue-900/5' : ''}`}>
                <div className={`px-5 py-4 flex justify-between items-center border-b border-slate-50 dark:border-slate-800/40 ${isToday ? 'bg-blue-600/5' : 'bg-slate-50/30'}`}>
                  <span className={`text-lg font-black ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-700 group-hover:text-slate-600 transition-colors'}`}>{date.getDate()}</span>
                  {isToday && (
                    <div className="px-2 py-0.5 bg-blue-600 rounded-md text-[8px] font-black uppercase text-white tracking-widest shadow-lg shadow-blue-500/30">AUJOURD'HUI</div>
                  )}
                </div>
                <div className="p-4 space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                  {dayTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                      <Lucide.PlusCircle className="w-8 h-8 text-slate-300" />
                    </div>
                  ) : dayTasks.map((t, idx) => {
                    const theme = getActionStyling(t.action);
                    const isDone = t.status === 'terminé';
                    return (
                      <div 
                        key={idx} 
                        onClick={() => onSelect(t)} 
                        title={`Ouvrir la tâche : ${t.sujet}`}
                        className={`group/task relative p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] border-2 shadow-sm flex flex-col gap-2 border-l-[6px] 
                        ${isDone ? 'bg-emerald-50/20 border-emerald-500/10 dark:bg-emerald-900/10 opacity-70 border-l-emerald-500' : `bg-white dark:bg-slate-950 border-transparent ${theme.hoverBorder} dark:hover:border-slate-700 ${theme.accent}`}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                           <div className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border inline-block ${theme.badge}`}>{t.action}</div>
                           {isDone && <Lucide.CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        </div>
                        <h4 className={`text-[11px] font-extrabold leading-snug line-clamp-3 ${isDone ? 'text-emerald-900/80 dark:text-emerald-500/80 line-through' : 'text-[#0f172a] dark:text-slate-100 group-hover/task:text-blue-600 transition-colors'}`}>
                          {t.sujet}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
