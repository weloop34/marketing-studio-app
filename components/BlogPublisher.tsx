
import React from 'react';
import * as Lucide from 'lucide-react';
import { Task } from '../types';

interface BlogPublisherProps {
  task: Task;
  onPublish: () => void;
  isPublishing: boolean;
  isWebhookConfigured: boolean;
}

const DetailCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
    <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
      {icon}
      <h4 className="text-[9px] font-bold uppercase tracking-wider">{label}</h4>
    </div>
    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{value}</p>
  </div>
);

const BlogPublisher: React.FC<BlogPublisherProps> = ({ task, onPublish, isPublishing, isWebhookConfigured }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 text-center bg-slate-50 dark:bg-slate-950/50">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-12">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500/10 text-orange-500 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Lucide.Rss className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">{task.sujet}</h2>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed">
          Cette action lancera votre scénario Make.com pour générer et publier l'article de blog. Toutes les informations stratégiques ci-dessous seront transmises.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10 text-left">
          <DetailCard label="Objectif" value={task.objectif} icon={<Lucide.Target size={14} />} />
          <DetailCard label="Produit" value={task.produit} icon={<Lucide.Sparkles size={14} />} />
          <DetailCard label="Cible" value={task.cible} icon={<Lucide.User size={14} />} />
          <DetailCard label="Angle" value={task.angle} icon={<Lucide.ChevronRight size={14} />} />
          <DetailCard label="Message Clé" value={task.message} icon={<Lucide.MessageSquare size={14} />} />
          <DetailCard label="CTA" value={task.cta} icon={<Lucide.MousePointer2 size={14} />} />
        </div>

        {!isWebhookConfigured && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 p-4 rounded-lg mb-8 text-left text-xs md:text-sm font-medium flex items-center gap-4">
            <Lucide.AlertTriangle className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
            <div>
              <strong>Attention :</strong> L'URL du webhook Make.com n'est pas configurée dans les paramètres.
            </div>
          </div>
        )}

        <button
          onClick={onPublish}
          disabled={isPublishing || !isWebhookConfigured}
          className="w-full py-4 md:py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[11px] md:text-sm font-black uppercase tracking-wider md:tracking-widest shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isPublishing ? (
            <>
              <Lucide.Loader2 className="w-5 h-5 animate-spin" />
              <span className="leading-tight">Lancement en cours...</span>
            </>
          ) : (
            <>
              <Lucide.Send className="w-5 h-5 shrink-0" />
              <span className="leading-tight">Lancer la génération via Make.com</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BlogPublisher;
