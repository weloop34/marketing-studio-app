
import React from 'react';
import * as Lucide from 'lucide-react';

interface AdHubProps {
  onSelectFormat: (format: 'post' | 'carousel' | 'video') => void;
}

const AdFormatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800/50 border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2"
  >
    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white text-slate-500 dark:text-slate-400">
      {icon}
    </div>
    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    <div className="mt-6 text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
      Sélectionner <Lucide.ArrowRight className="w-4 h-4" />
    </div>
  </button>
);

const LinkedInAdHub: React.FC<AdHubProps> = ({ onSelectFormat }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-slate-50 dark:bg-slate-950/50 animate-in fade-in duration-500">
      <div className="w-full max-w-4xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-full mb-4">
            <Lucide.Linkedin className="w-5 h-5" />
            <span className="font-bold text-sm">Campagne LinkedIn Ads</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Choisissez un format de publicité</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Sélectionnez le type de publicité que vous souhaitez créer. L'application vous guidera ensuite vers le module de création approprié.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AdFormatCard
            icon={<Lucide.Image className="w-10 h-10" />}
            title="Image Unique"
            description="Créez un post sponsorisé avec une image percutante et un texte publicitaire optimisé."
            onClick={() => onSelectFormat('post')}
          />
          <AdFormatCard
            icon={<Lucide.GalleryHorizontal className="w-10 h-10" />}
            title="Carrousel"
            description="Concevez une publicité interactive avec plusieurs slides pour raconter une histoire ou présenter un produit."
            onClick={() => onSelectFormat('carousel')}
          />
          <AdFormatCard
            icon={<Lucide.Video className="w-10 h-10" />}
            title="Vidéo"
            description="Préparez une publicité vidéo engageante avec un script et des sous-titres optimisés pour la conversion."
            onClick={() => onSelectFormat('video')}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkedInAdHub;
