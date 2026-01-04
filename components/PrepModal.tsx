
import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { Task } from '../types';

interface PrepModalProps {
  task: Task;
  onClose: () => void;
  fetchPrepContent: (t: Task) => Promise<string>;
  onShowToast: (m: string) => void;
}

const PrepModal: React.FC<PrepModalProps> = ({ task, onClose, fetchPrepContent, onShowToast }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetchPrepContent(task);
      setContent(res);
      setLoading(false);
    };
    load();
  }, [task, fetchPrepContent]);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[2200] flex items-center justify-center p-4 md:p-6" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.2em] mb-1">Checklist Préparation</div>
            <h3 className="text-xl font-black text-[#0f172a] dark:text-white tracking-tight">{task.sujet}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400">
            <Lucide.X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-thin bg-white dark:bg-slate-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Lucide.Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.4em]">IA en réflexion...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[24px] border border-slate-100 dark:border-slate-800 whitespace-pre-wrap text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-300 shadow-inner">
                {content}
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/30 dark:bg-slate-950/30">
            <button onClick={onClose} className="px-6 py-2 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Fermer</button>
            <button 
              onClick={() => { navigator.clipboard.writeText(content); onShowToast("Copié !"); }} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Lucide.Copy className="w-4 h-4" /> <span className="hidden md:inline">COPIER CHECKLIST</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrepModal;
