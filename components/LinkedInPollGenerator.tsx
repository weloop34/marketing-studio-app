
import React, { useState, useRef, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { PollData } from '../types';

interface LinkedInPollGeneratorProps {
  data: PollData;
  onChange: (newData: PollData) => void;
  onShowToast: (msg: string) => void;
}

const LinkedInPollGenerator: React.FC<LinkedInPollGeneratorProps> = ({ data, onChange, onShowToast }) => {
  const postRef = useRef<HTMLDivElement>(null);

  const handlePostChange = () => {
    if (postRef.current) {
      onChange({ ...data, introPost: postRef.current.innerText });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...data.options];
    newOptions[index] = value;
    onChange({ ...data, options: newOptions });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copié !`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto scrollbar-thin p-6 md:p-12">
      <div className="max-w-3xl mx-auto w-full space-y-10">
        
        {/* Section 1: Intro Post */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
          <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Post d'accompagnement</h3>
            <button 
              onClick={() => copyToClipboard(data.introPost, "Post")}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[9px] font-black uppercase hover:bg-blue-100"
            >
              <Lucide.Copy size={12} /> COPIER POST
            </button>
          </div>
          <div className="p-8">
            <div 
              ref={postRef}
              contentEditable
              onBlur={handlePostChange}
              className="w-full min-h-[150px] outline-none leading-relaxed text-slate-800 dark:text-slate-100 text-sm md:text-base whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: data.introPost.replace(/\n/g, '<br>') }}
            />
          </div>
        </div>

        {/* Section 2: Poll Preview (LinkedIn Style) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Lucide.Layout size={18} className="text-slate-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Aperçu du sondage</h3>
          </div>

          <div className="bg-white dark:bg-[#1d2226] border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-xl max-w-[550px] mx-auto transition-colors">
            {/* Header info placeholder */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                <div className="space-y-1">
                    <div className="w-24 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800/50 rounded-full"></div>
                </div>
            </div>

            <div className="border dark:border-[#38434f] rounded-lg p-4 md:p-5 bg-white dark:bg-transparent">
              <input 
                type="text"
                value={data.question}
                onChange={(e) => onChange({ ...data, question: e.target.value })}
                className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white/90 text-sm md:text-base mb-6 placeholder:text-slate-400"
                placeholder="Votre question ici (140 car. max)"
                maxLength={140}
              />

              <div className="space-y-3">
                {data.options.map((opt, i) => (
                  <div key={i} className="relative group">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input 
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(i, e.target.value)}
                                className="w-full py-2 px-4 rounded-full border-2 border-blue-600/30 dark:border-blue-500/20 bg-transparent text-slate-800 dark:text-white/80 text-xs md:text-sm font-bold outline-none focus:border-blue-600 transition-colors pr-10"
                                placeholder={`Option ${i + 1}`}
                                maxLength={30}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase">
                                {opt.length}/30
                            </span>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(opt, `Option ${i+1}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                            title="Copier l'option"
                        >
                            <Lucide.Copy size={14} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t dark:border-[#38434f] flex justify-between items-center text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>0 votes • 1 semaine restante</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/40 rounded-2xl flex gap-4">
            <Lucide.Info className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                <strong>Astuce Stratégique :</strong> Les sondages les plus performants sont ceux qui posent une question à laquelle on ne peut pas s'empêcher de répondre. Assurez-vous que les options couvrent bien les différents avis pour éviter la frustration.
            </p>
        </div>

        <div className="pb-20"></div>
      </div>
    </div>
  );
};

export default LinkedInPollGenerator;
