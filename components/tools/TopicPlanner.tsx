
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { TopicPlan, SatelliteContent } from '../../types';
import { generateTopicPlan } from '../../services/aiService';

interface TopicPlannerProps {
    onBack: () => void;
    bridgeApiUrl: string;
}

const FormatBadge: React.FC<{ format: string }> = ({ format }) => {
    const colors: Record<string, string> = {
        'Article': 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
        'LinkedIn': 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800',
        'Vidéo': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
        'Livre Blanc': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${colors[format] || 'bg-slate-100 text-slate-600'}`}>
            {format || 'Contenu'}
        </span>
    );
};

const TopicPlanner: React.FC<TopicPlannerProps> = ({ onBack, bridgeApiUrl }) => {
    const [topic, setTopic] = useState("L'Intelligence Artificielle au service de la formation B2B");
    const [plan, setPlan] = useState<TopicPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [addingTaskId, setAddingTaskId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    const getSafeArray = (arr: any) => Array.isArray(arr) ? arr : [];

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPlan(null);
        try {
            const data = await generateTopicPlan(topic);
            setPlan(data);
        } catch (err) {
            setError("Échec de la génération du plan. Réessayez.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToRoadmap = async (satellite: SatelliteContent, index: number) => {
        const taskId = `task-${index}`;
        setAddingTaskId(taskId);
        
        try {
            const payload = {
                action: 'addRow',
                data: [
                    "", // ID
                    "Projet Cluster", // Produit
                    "Notoriété / SEO", // Objectif
                    satellite.title || "Titre absent", 
                    satellite.format || "LinkedIn", 
                    "Cible Cluster", 
                    "", // Auteur
                    "", // Date
                    "", // Date lancement
                    "Programmé", 
                    satellite.angle || "", 
                    "En savoir plus", 
                    `Mots-clés suggérés : ${getSafeArray(satellite.keywords).join(', ')}`
                ]
            };

            const response = await fetch(bridgeApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'addRow',
                    rowData: payload.data
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                showToast("Mission ajoutée à votre Roadmap !");
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error("Error adding task:", err);
            showToast("Erreur lors de l'ajout au planning.");
        } finally {
            setAddingTaskId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500 overflow-y-auto relative h-full scrollbar-thin">
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
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Planificateur de Contenus</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stratégie de Cluster Thématique</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full p-6 md:p-12 space-y-10">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                    <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sujet Pilier (Pillar Topic)</label>
                            <input 
                                type="text" value={topic} onChange={e => setTopic(e.target.value)} required
                                placeholder="Entrez un sujet large (ex: Management Hybride)"
                                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="px-8 h-14 bg-violet-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-violet-700 shadow-lg shadow-violet-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                            {loading ? <Lucide.Loader2 className="w-5 h-5 animate-spin" /> : <Lucide.Network className="w-5 h-5" />}
                            {loading ? 'Analyse...' : 'Générer le Cluster'}
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                        <Lucide.Network className="w-16 h-16 text-violet-500 mb-6" />
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-violet-500">Conception du réseau sémantique...</p>
                    </div>
                ) : plan ? (
                    <div className="animate-in fade-in duration-700 space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            <div className="lg:col-span-4 bg-violet-600 rounded-[32px] p-10 text-white shadow-xl flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform"><Lucide.Star size={120} /></div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Contenu Pilier</div>
                                <h3 className="text-2xl font-black mb-6 leading-tight">{plan.pillarTitle || "Sujet Pilier"}</h3>
                                <p className="text-sm font-medium opacity-80 leading-relaxed italic border-l-2 border-white/30 pl-4">{plan.pillarDescription}</p>
                            </div>

                            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm flex flex-col justify-center">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Réseau Satellites suggéré</div>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {getSafeArray(plan.satellites).map((s, i) => (
                                        <div key={i} className="px-6 py-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-2xl flex flex-col gap-2 items-center text-center max-w-[200px] hover:scale-105 transition-transform cursor-default shadow-sm">
                                            <FormatBadge format={s.format} />
                                            <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">{s.title || "Titre satellite"}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500"><Lucide.Target size={18} /></div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Objectif Stratégique : <span className="text-slate-800 dark:text-slate-300">{plan.strategyGoal || "Non défini"}</span></h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                {getSafeArray(plan.satellites).map((s, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <FormatBadge format={s.format} />
                                            <div className="flex gap-1">
                                                <button onClick={() => { navigator.clipboard.writeText(`${s.title}\n\nAngle: ${s.angle}`); showToast("Copié !"); }} className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-xl transition-all">
                                                    <Lucide.Copy size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 dark:text-white mb-3 group-hover:text-violet-500 transition-colors leading-tight">{s.title || "Sans titre"}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">{s.angle}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {getSafeArray(s.keywords).map((kw, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">#{String(kw).replace(/\s+/g, '')}</span>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => handleAddToRoadmap(s, i)}
                                            disabled={addingTaskId === `task-${i}`}
                                            className="mt-auto w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-violet-600 hover:text-white text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            {addingTaskId === `task-${i}` ? (
                                                <Lucide.Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Lucide.CalendarPlus size={14} className="group-hover/btn:scale-110 transition-transform" />
                                            )}
                                            {addingTaskId === `task-${i}` ? 'Ajout...' : 'Créer la mission'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-violet-600/10 rounded-[32px] flex items-center justify-center mb-8">
                            <Lucide.Network className="w-12 h-12 text-violet-600" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Entrez un sujet pour générer votre stratégie en grappe.</p>
                        {error && <p className="mt-4 text-sm text-red-500 font-bold">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicPlanner;
