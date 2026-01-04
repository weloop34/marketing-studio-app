
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { FeedbackAnalysis } from '../../types';
import { analyzeFeedback } from '../../services/aiService';

interface FeedbackSynthesizerProps {
    onBack: () => void;
}

const FeedbackSynthesizer: React.FC<FeedbackSynthesizerProps> = ({ onBack }) => {
    const [rawText, setRawText] = useState("");
    const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const getSafeArray = (arr: any) => Array.isArray(arr) ? arr : [];

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rawText.trim() || rawText.length < 50) {
            showToast("Veuillez entrer au moins 50 caractères pour une analyse pertinente.");
            return;
        }
        
        setLoading(true);
        setAnalysis(null);
        try {
            const data = await analyzeFeedback(rawText);
            setAnalysis(data);
        } catch (err) {
            showToast("Erreur d'analyse. Réessayez.");
        } finally {
            setLoading(false);
        }
    };

    const getSentimentColor = (score: number) => {
        if (score >= 70) return 'text-emerald-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-rose-500';
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
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Synthétiseur de Feedback</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyse Qualitative & Insights IA</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full p-6 md:p-12 space-y-10">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                    <form onSubmit={handleAnalyze} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feedbacks Bruts (Avis, Sondages, Transcriptions...)</label>
                            <textarea 
                                value={rawText} onChange={e => setRawText(e.target.value)} required
                                placeholder="Collez ici les avis clients ou les retours que vous souhaitez synthétiser..."
                                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all text-sm min-h-[200px] resize-none scrollbar-thin"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full h-14 bg-fuchsia-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                            {loading ? <Lucide.Loader2 className="w-5 h-5 animate-spin" /> : <Lucide.Zap className="w-5 h-5" />}
                            {loading ? 'Extraction des insights...' : 'Analyser les retours'}
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                        <Lucide.ScanSearch className="w-16 h-16 text-fuchsia-500 mb-6" />
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-fuchsia-500">Filtrage du bruit sémantique...</p>
                    </div>
                ) : analysis ? (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10 pb-24">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Sentiment Global</div>
                                <div className={`relative w-40 h-40 flex items-center justify-center`}>
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                            strokeDasharray={440} 
                                            strokeDashoffset={440 - (analysis.globalSentiment / 100) * 440} 
                                            className={`${getSentimentColor(analysis.globalSentiment)} transition-all duration-1000 ease-out`} 
                                            strokeLinecap="round" 
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-4xl font-black tabular-nums ${getSentimentColor(analysis.globalSentiment)}`}>{analysis.globalSentiment}</span>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Sur 100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-800/40 rounded-[32px] p-8">
                                    <div className="flex items-center gap-3 text-emerald-600 mb-6">
                                        <Lucide.Heart size={20} />
                                        <h3 className="text-xs font-black uppercase tracking-widest">Points Forts</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {getSafeArray(analysis.positives).map((p, i) => (
                                            <li key={i} className="flex gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-[10px]"><Lucide.Check size={12} strokeWidth={3} /></div>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-800/40 rounded-[32px] p-8">
                                    <div className="flex items-center gap-3 text-rose-600 mb-6">
                                        <Lucide.AlertCircle size={20} />
                                        <h3 className="text-xs font-black uppercase tracking-widest">Pain Points</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {getSafeArray(analysis.negatives).map((n, i) => (
                                            <li key={i} className="flex gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 text-[10px]"><Lucide.X size={12} strokeWidth={3} /></div>
                                                {n}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Verbatims Clés</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {getSafeArray(analysis.keyQuotes).map((q, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 italic text-slate-600 dark:text-slate-400 text-sm leading-relaxed shadow-sm relative group hover:border-fuchsia-500/30 transition-all">
                                        <Lucide.Quote size={20} className="text-slate-100 dark:text-slate-800 absolute top-4 right-4" />
                                        "{q}"
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="bg-slate-900 dark:bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
                             <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-fuchsia-600 rounded-2xl flex items-center justify-center"><Lucide.TrendingUp size={24} /></div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Plan d'Action Stratégique</h3>
                                    <p className="text-xs text-slate-400">Recommandations prioritaires pour booster la satisfaction.</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {getSafeArray(analysis.recommendations).map((r, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[8px] font-black uppercase px-2 py-1 bg-white/10 rounded-md border border-white/10 tracking-widest">Impact {r.impact}</span>
                                            <span className="text-fuchsia-400 font-black text-xl">0{i+1}</span>
                                        </div>
                                        <p className="text-sm font-bold leading-relaxed">{r.action}</p>
                                    </div>
                                ))}
                             </div>
                             <div className="mt-10 pt-8 border-t border-white/10 flex justify-end">
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(JSON.stringify(analysis, null, 2)); showToast("Synthèse copiée !"); }}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                                >
                                    <Lucide.Copy size={16} /> Copier l'analyse complète (JSON)
                                </button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-fuchsia-600/10 rounded-[32px] flex items-center justify-center mb-8">
                            <Lucide.MessageSquareQuote className="w-12 h-12 text-fuchsia-600" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Collez des retours clients pour en extraire l'essence stratégique.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackSynthesizer;
