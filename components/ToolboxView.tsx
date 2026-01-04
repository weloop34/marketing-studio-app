import React from 'react';
import * as Lucide from 'lucide-react';
import LeadCalculator from './tools/LeadCalculator';
import CompetitiveWatchTool from './tools/CompetitiveWatchTool';
import PersonaGenerator from './tools/PersonaGenerator';
import TopicPlanner from './tools/TopicPlanner';
import HeadlineAnalyzer from './tools/HeadlineAnalyzer';
import AnalogyGenerator from './tools/AnalogyGenerator';
import FeedbackSynthesizer from './tools/FeedbackSynthesizer';
import { TOOLS } from './tools/toolData';

interface ToolboxViewProps {
    bridgeApiUrl: string;
    unsplashAccessKey: string;
    activeToolId: string | null;
    onSelectTool: (id: string | null) => void;
}

const ToolboxView: React.FC<ToolboxViewProps> = ({ bridgeApiUrl, unsplashAccessKey, activeToolId, onSelectTool }) => {

    if (activeToolId) {
        const toolComponentMap: { [key: string]: React.ReactNode } = {
            'lead-calc': <LeadCalculator onBack={() => onSelectTool(null)} />,
            'competitor-monitor': <CompetitiveWatchTool onBack={() => onSelectTool(null)} bridgeApiUrl={bridgeApiUrl} />,
            // FIX: Pass the required bridgeApiUrl prop to PersonaGenerator.
            'persona-generator': <PersonaGenerator onBack={() => onSelectTool(null)} unsplashAccessKey={unsplashAccessKey} bridgeApiUrl={bridgeApiUrl} />,
            'topic-planner': <TopicPlanner onBack={() => onSelectTool(null)} bridgeApiUrl={bridgeApiUrl} />,
            'headline-analyzer': <HeadlineAnalyzer onBack={() => onSelectTool(null)} />,
            'analogy-generator': <AnalogyGenerator onBack={() => onSelectTool(null)} />,
            'feedback-synthesizer': <FeedbackSynthesizer onBack={() => onSelectTool(null)} />,
        };
        return <>{toolComponentMap[activeToolId] || null}</>;
    }
    
    return (
        <div className="flex-1 flex flex-col p-6 md:p-12 animate-in fade-in duration-500">
            <div className="mb-12">
                <div className="inline-flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-full mb-4">
                    <Lucide.Wrench className="w-5 h-5" />
                    <span className="font-bold text-sm">Marketing Toolbox</span>
                </div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Outils Marketing Stratégiques</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                    Des utilitaires précis pour piloter votre performance marketing, au-delà de la production de contenu quotidienne.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool) => (
                    <button
                        key={tool.id}
                        disabled={tool.isComingSoon}
                        onClick={() => onSelectTool(tool.id)}
                        className={`group flex flex-col text-left p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-1 ${tool.isComingSoon ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${tool.isComingSoon ? 'text-slate-400 bg-slate-400/10' : tool.color}`}>
                            {tool.icon}
                        </div>
                        <div className={`text-[10px] font-black uppercase tracking-widest ${tool.isComingSoon ? 'text-slate-400' : 'text-amber-600 dark:text-amber-400'} mb-2`}>{tool.category}</div>
                        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-3">{tool.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                            {tool.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 group-hover:text-amber-500 transition-colors">
                            {tool.isComingSoon ? 'Bientôt disponible' : "Ouvrir l'outil"}
                             {!tool.isComingSoon && <Lucide.ArrowRight size={14} />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ToolboxView;