
import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { MarketingData, Task, ViewMode } from '../types';
import { TOOLS } from './tools/toolData';

interface SidebarProps {
  data: MarketingData;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  selectedTask: Task | null;
  setSelectedTask: (t: Task | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeToolId: string | null;
  onSelectTool: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  data, view, setView, selectedTask, setSelectedTask, darkMode, toggleDarkMode, onRefresh, isRefreshing,
  isMobileOpen, onCloseMobile, activeToolId, onSelectTool
}) => {
  const [filterAction, setFilterAction] = useState<string>('Toutes');
  const [filterStatus, setFilterStatus] = useState<string>('Tous');

  const getTagColor = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('linkedin ads')) return 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800';
    if (a.includes('sondage')) return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800';
    if (a.includes('linkedin')) return 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-100 dark:border-sky-800';
    if (a.includes('vidéo')) return 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800';
    if (a.includes('webinaire')) return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800';
    if (a.includes('blog')) return 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800';
    if (a.includes('email')) return 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800';
    return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700';
  };

  const actions = useMemo(() => {
    const uniqueActions = Array.from(new Set(data.allTasks.map(t => t.action)));
    return ['Toutes', ...uniqueActions];
  }, [data.allTasks]);

  const statuses = ['Tous', 'Programmé', 'Génération', 'Généré', 'En cours', 'Attribué', 'Rédaction', 'Revoir', 'Prêt', 'Terminé'];

  const tasksToDisplay = useMemo(() => {
    let baseTasks;
    switch(view) {
        case 'late': baseTasks = data.lateTasks; break;
        case 'today': baseTasks = data.todayTasks; break;
        case 'all': baseTasks = data.allTasks; break;
        default: baseTasks = [];
    }
    
    if (filterStatus === 'Terminé') {
        baseTasks = data.allTasks.filter(t => t.status === 'Terminé');
    }

    return baseTasks.filter(t => {
      if (filterStatus === 'Terminé' && t.status !== 'Terminé') return false;
      const matchAction = filterAction === 'Toutes' || t.action === filterAction;
      const matchStatus = filterStatus === 'Tous' || t.status === filterStatus;
      return matchAction && matchStatus;
    });
  }, [view, data, filterAction, filterStatus]);
  
  const todayDateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  const handleSetView = (v: ViewMode) => {
      setView(v);
      onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[490] md:hidden" 
          onClick={onCloseMobile}
        />
      )}
      <aside className={`${isMobileOpen ? 'flex fixed inset-y-0 left-0 z-[500] w-[280px] shadow-2xl' : 'hidden'} md:flex md:static w-[300px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shadow-sm transition-all duration-300`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/20"><Lucide.Rocket className="w-5 h-5" /></div>
              <h1 className="font-extrabold text-xl tracking-tight text-[#0f172a] dark:text-white">Marketing <span className="text-blue-600">Studio</span></h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Rafraîchir les données"
                className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Lucide.RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={toggleDarkMode}
                title={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {darkMode ? <Lucide.Sun className="w-4 h-4" /> : <Lucide.Moon className="w-4 h-4" />}
              </button>
              <button onClick={onCloseMobile} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Fermer le menu">
                <Lucide.X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-[9px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Lucide.Calendar className="w-3 h-3 text-slate-700 dark:text-slate-500" /> {todayDateStr}</p>
          
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 mb-4">
            <button onClick={() => { handleSetView('today'); setFilterStatus('Tous'); }} className={`py-2 text-[10px] font-black rounded-lg transition-all ${view === 'today' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}>AUJOURD'HUI</button>
            <button onClick={() => { handleSetView('late'); setFilterStatus('Tous'); }} className={`py-2 text-[10px] font-black rounded-lg transition-all ${view === 'late' ? 'bg-white dark:bg-slate-800 shadow-sm text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}>RETARDS</button>
          </div>

          {(view !== 'calendar' && view !== 'toolbox') && (
            <div className="space-y-3">
                <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><Lucide.Filter className="w-3 h-3" /><span className="text-[8px] font-black uppercase tracking-widest">Type d'action</span></div>
                <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-500/50">{actions.map(a => <option key={a} value={a}>{a}</option>)}</select>
                </div>
                <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><Lucide.Activity className="w-3 h-3" /><span className="text-[8px] font-black uppercase tracking-widest">Statut</span></div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-500/50">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {view === 'calendar' ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <div className="p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500"><Lucide.LayoutGrid size={32} /></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mode Calendrier</p>
            </div>
          ) : view === 'toolbox' ? (
            TOOLS.map(tool => (
                 <button key={tool.id} onClick={() => onSelectTool(tool.id)} className={`w-full p-3 pr-4 rounded-xl flex items-center gap-4 transition-all duration-200 group ${activeToolId === tool.id ? 'bg-amber-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${activeToolId === tool.id ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-white'}`}>
                        {/* FIX: Use React.isValidElement as a type guard to help TypeScript infer props for cloneElement. */}
                        {tool.icon && React.isValidElement(tool.icon) && React.cloneElement(tool.icon, { size: 16 })}
                    </div>
                    <span className={`text-sm font-bold text-left ${activeToolId === tool.id ? 'text-amber-700 dark:text-amber-300' : ''}`}>{tool.name}</span>
                 </button>
            ))
          ) : tasksToDisplay.length === 0 ? (
            <div className="text-center py-10"><p className="text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">Aucune tâche trouvée</p></div>
          ) : (
            tasksToDisplay.map(t => (
              <div key={t.id} onClick={() => setSelectedTask(t)} className={`p-4 rounded-xl border-2 transition-all cursor-pointer group ${selectedTask?.id === t.id ? 'bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-500 shadow-md transform scale-[1.02]' : 'bg-white dark:bg-slate-900 border-transparent dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border inline-block ${getTagColor(t.action)}`}>{t.action}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase text-slate-400">LIGNE {t.rowIndex}</span>
                    {view === 'late' && <Lucide.Clock className="w-3 h-3 text-red-500" />}
                  </div>
                </div>
                <div className="text-[13px] font-extrabold text-[#0f172a] dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">{t.sujet}</div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button 
            onClick={() => setView('toolbox')}
            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${view === 'toolbox' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Lucide.Wrench className="w-4 h-4" /> BOÎTE À OUTILS
          </button>

          <button 
            onClick={() => setView('calendar')}
            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${view === 'calendar' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-[#0f172a] dark:bg-slate-950 text-white hover:bg-black'}`}
          >
            <Lucide.LayoutGrid className="w-4 h-4" /> CALENDRIER
          </button>
          
          <a 
            href={data.sheetId ? `https://docs.google.com/spreadsheets/d/${data.sheetId}` : '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-all border border-slate-200 dark:border-slate-700 shadow-sm ${!data.sheetId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Lucide.Table className="w-4 h-4" /> SOURCE SHEET
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
