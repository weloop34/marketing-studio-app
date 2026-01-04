
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { HeadlineAnalysis } from '../../types';
import { analyzeHeadline } from '../../services/aiService';

interface HeadlineAnalyzerProps {
    onBack: () => void;
}

const ScoreBadge: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
            <span>{label}</span>
            <span>{score}/100</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

const HeadlineAnalyzer: React.FC<HeadlineAnalyzerProps> = ({ onBack }) => {
    const [headline, setHeadline] = useState("");
    const [channel, setChannel] = useState("LinkedIn");
    const [analysis, setAnalysis] = useState<HeadlineAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const getSafeArray = (arr: any) => Array.isArray(arr) ? arr : [];

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!headline.trim()) return;
        
        setLoading(true);
        setAnalysis(null);
        try {
            const data = await analyzeHeadline(headline, channel);
            setAnalysis(data);
        } catch (err) {
            showToast("Erreur d'analyse. Réessayez.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
        if (score >= 60) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
        return 'text-red-500 border-red-500/20 bg-red-500/5';
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500 overflow-y-auto relative">
             {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                        <Lucide.CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-widest">{toast}</span>
                    </div>
                </div>
            )}

            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 group">
                        <Lucide.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Analyseur de Titres</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimisation CTR & Neuro-copywriting</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto w-full p-6 md:p-12 space-y-10">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                    <form onSubmit={handleAnalyze} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votre Titre ou Accroche</label>
                                <input 
                                    type="text" value={headline} onChange={e => setHeadline(e.target.value)} required
                                    placeholder="Ex: 5 raisons de passer à l'IA en 2026"
                                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Canal</label>
                                <select 
                                    value={channel} onChange={e => setChannel(e.target.value)}
                                    className="w-full h-[58px] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none"
                                >
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Blog / SEO">Blog / SEO</option>
                                    <option value="Email Subject">Objet Email</option>
                                    <option value="YouTube Title">Titre YouTube</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full h-14 bg-rose-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                            {loading ? <Lucide.Loader2 className="w-5 h-5 animate-spin" /> : <Lucide.Zap className="w-5 h-5" />}
                            {loading ? 'Analyse psychologique en cours...' : 'Analyser l\'Impact'}
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                        <Lucide.BrainCircuit className="w-16 h-16 text-rose-500 mb-6" />
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-rose-500">Scan des déclencheurs cognitifs...</p>
                    </div>
                ) : analysis ? (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className={`md:col-span-4 rounded-[32px] border p-8 flex flex-col items-center justify-center text-center gap-4 shadow-xl ${getScoreColor(analysis.globalScore)}`}>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Impact Global</div>
                                <div className="text-7xl font-black tabular-nums leading-none">{analysis.globalScore}</div>
                                <div className="text-[10px] font-black uppercase px-4 py-1.5 rounded-full bg-white/20 border border-white/10">
                                    {analysis.globalScore >= 80 ? 'EXCELLENT' : analysis.globalScore >= 60 ? 'MOYEN' : 'À REVOIR'}
                                </div>
                            </div>
                            <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
                                <ScoreBadge label="Neuro-Émotion" score={analysis.emotionalScore} />
                                <ScoreBadge label="Power Words" score={analysis.powerScore} />
                                <ScoreBadge label="Structure" score={analysis.structureScore} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/50 rounded-[32px] p-8">
                                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-6">
                                    <Lucide.CheckCircle size={20} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Points Forts</h3>
                                </div>
                                <ul className="space-y-4">
                                    {getSafeArray(analysis.strengths).map((s, i) => (
                                        <li key={i} className="flex gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <span className="text-emerald-500">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/50 rounded-[32px] p-8">
                                <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-6">
                                    <Lucide.AlertCircle size={20} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Pistes d'amélioration</h3>
                                </div>
                                <ul className="space-y-4">
                                    {getSafeArray(analysis.weaknesses).map((w, i) => (
                                        <li key={i} className="flex gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <span className="text-rose-500">•</span> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6 pb-20">
                            <div className="flex items-center gap-3 px-2">
                                <Lucide.Sparkles className="w-5 h-5 text-amber-500" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Variantes Haute-Performance</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {getSafeArray(analysis.suggestions).map((s, i) => (
                                    <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-6 hover:border-rose-500/50 transition-all shadow-sm">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{s.type}</div>
                                            <p className="text-sm md:text-base font-extrabold text-slate-800 dark:text-white truncate">{s.title}</p>
                                        </div>
                                        <button 
                                            onClick={() => { navigator.clipboard.writeText(s.title); showToast("Copié !"); }}
                                            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors rounded-xl"
                                        >
                                            <Lucide.Copy size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-rose-600/10 rounded-[32px] flex items-center justify-center mb-8">
                            <Lucide.ScanText size={24} className="text-rose-600" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Collez votre titre pour obtenir un score d'impact par IA.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeadlineAnalyzer;
