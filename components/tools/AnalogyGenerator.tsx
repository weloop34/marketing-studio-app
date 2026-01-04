
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { AnalogyResult } from '../../types';
import { generateAnalogy } from '../../services/aiService';

interface AnalogyGeneratorProps {
    onBack: () => void;
}

const AnalogyGenerator: React.FC<AnalogyGeneratorProps> = ({ onBack }) => {
    const [concept, setConcept] = useState("");
    const [audience, setAudience] = useState("Grand Public");
    const [result, setResult] = useState<AnalogyResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const getSafeArray = (arr: any) => Array.isArray(arr) ? arr : [];

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!concept.trim()) return;
        
        setLoading(true);
        setResult(null);
        try {
            const data = await generateAnalogy(concept, audience);
            setResult(data);
        } catch (err) {
            showToast("Erreur lors de la recherche d'analogies.");
        } finally {
            setLoading(false);
        }
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
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Générateur d'Analogies</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vulgarisation & Storytelling</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto w-full p-6 md:p-12 space-y-10">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concept Complexe</label>
                                <input 
                                    type="text" value={concept} onChange={e => setConcept(e.target.value)} required
                                    placeholder="Ex: Le fonctionnement de la Blockchain"
                                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-lime-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cible</label>
                                <select 
                                    value={audience} onChange={e => setAudience(e.target.value)}
                                    className="w-full h-[58px] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-lime-500/50 transition-all appearance-none"
                                >
                                    <option value="Grand Public">Grand Public</option>
                                    <option value="Décideurs B2B">Décideurs B2B</option>
                                    <option value="Experts Techniques">Experts Techniques</option>
                                    <option value="Enfants (-12 ans)">Enfants</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full h-14 bg-lime-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-lime-700 shadow-lg shadow-lime-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                            {loading ? <Lucide.Loader2 className="w-5 h-5 animate-spin" /> : <Lucide.Lightbulb className="w-5 h-5" />}
                            {loading ? 'Eurêka en cours...' : 'Trouver des Métaphores'}
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                        <Lucide.Zap className="w-16 h-16 text-lime-500 mb-6" />
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-lime-500">Connexion des neurones...</p>
                    </div>
                ) : result ? (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                        <div className="bg-lime-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform"><Lucide.Star size={140} /></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                    <Lucide.Award size={14} /> La meilleure analogie
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black mb-8 leading-tight italic">
                                   "{result.mainAnalogy?.comparison || "Aucune analogie principale trouvée"}"
                                </h3>
                                <div className="space-y-6 max-w-2xl">
                                    <div className="bg-black/20 p-6 rounded-3xl border border-white/10">
                                        <p className="text-sm md:text-base font-medium opacity-90 leading-relaxed">{result.mainAnalogy?.explanation}</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/10 rounded-2xl"><Lucide.Camera size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Idée visuelle</p>
                                            <p className="text-xs font-bold">{result.mainAnalogy?.visualSuggestion}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 flex justify-end">
                                     <button 
                                        onClick={() => { navigator.clipboard.writeText(result.mainAnalogy?.comparison + "\n\n" + result.mainAnalogy?.explanation); showToast("Analogie copiée !"); }}
                                        className="flex items-center gap-2 px-6 py-3 bg-white text-lime-700 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:scale-105 transition-transform"
                                    >
                                        <Lucide.Copy size={16} /> Copier le contenu
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 px-2 flex items-center gap-3">
                                <Lucide.Shuffle size={18} /> Autres univers
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                                {getSafeArray(result.variations).map((v, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-widest">{v.universe}</span>
                                            <button onClick={() => { navigator.clipboard.writeText(v.text); showToast("Variante copiée !"); }} className="p-2 text-slate-300 hover:text-lime-500 transition-colors">
                                                <Lucide.Copy size={14} />
                                            </button>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed flex-1 italic">"{v.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-lime-600/10 rounded-[32px] flex items-center justify-center mb-8">
                            <Lucide.Lightbulb className="w-12 h-12 text-lime-600" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Collez un concept abstrait pour le rendre concret.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalogyGenerator;
