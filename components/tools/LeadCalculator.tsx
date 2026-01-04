
import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

interface LeadCalculatorProps {
    onBack: () => void;
}

const StepNumber = ({ num }: { num: number }) => (
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
        <span className="text-sm font-black text-blue-600 dark:text-blue-400">{num}</span>
    </div>
);

const MetricInput = ({ label, value, onChange, suffix, description }: any) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
            {description && <span className="text-[9px] font-bold text-slate-400 italic">{description}</span>}
        </div>
        <div className="relative group">
            <input 
                type="number" 
                value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-extrabold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm pr-10"
            />
            {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">{suffix}</span>}
        </div>
    </div>
);

const MetricResult = ({ value, label, color = "blue" }: { value: string | number, label: string, color?: "blue" | "emerald" | "amber" | "purple" }) => {
    const colorClasses = {
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-500/20",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/20",
        amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-500/20",
        purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-500/20"
    };

    return (
        <div className={`p-4 rounded-2xl border ${colorClasses[color]} flex flex-col gap-1 transition-all hover:scale-[1.02] shadow-sm`}>
            <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">{label}</span>
            <span className="text-xl font-black tabular-nums">{value}</span>
        </div>
    );
};

const FunnelStep = ({ label, value, subValue, percentage, colorClass, width }: { label: string, value: string, subValue: string, percentage: string, colorClass: string, width: string }) => (
    <div className="flex flex-col items-center w-full group">
        <div 
            style={{ width }} 
            className={`h-20 ${colorClass} rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-lg transition-all duration-500 relative overflow-hidden group-hover:brightness-110`}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">{label}</span>
            <span className="text-xl font-black text-white tabular-nums">{value}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
            <Lucide.ArrowDown size={14} className="text-slate-300" />
            <span className="text-[10px] font-black text-slate-400 uppercase">{percentage} CONV.</span>
        </div>
    </div>
);

const LeadCalculator: React.FC<LeadCalculatorProps> = ({ onBack }) => {
    // Inputs State
    const [revenueGoal, setRevenueGoal] = useState(50000);
    const [marketingPercent, setMarketingPercent] = useState(80);
    const [avgDealSize, setAvgDealSize] = useState(2600);
    const [ltcActual, setLtcActual] = useState(2.42);
    const [ltcGoal, setLtcGoal] = useState(5.00);
    const [vtlActual, setVtlActual] = useState(8.70);
    const [vtlGoal, setVtlGoal] = useState(12.00);

    const [results, setResults] = useState({
        newClients: 0,
        leadsActual: 0,
        leadsGoal: 0,
        visitorsActual: 0,
        visitorsGoal: 0
    });

    useEffect(() => {
        const mktRevenueTarget = revenueGoal * (marketingPercent / 100);
        const clients = mktRevenueTarget / (avgDealSize || 1);
        const leadsA = clients / (ltcActual / 100 || 0.001);
        const leadsG = clients / (ltcGoal / 100 || 0.001);
        const visitorsA = leadsA / (vtlActual / 100 || 0.001);
        const visitorsG = leadsG / (vtlGoal / 100 || 0.001);

        setResults({
            newClients: parseFloat(clients.toFixed(1)),
            leadsActual: Math.ceil(leadsA),
            leadsGoal: Math.ceil(leadsG),
            visitorsActual: Math.ceil(visitorsA),
            visitorsGoal: Math.ceil(visitorsG)
        });
    }, [revenueGoal, marketingPercent, avgDealSize, ltcActual, ltcGoal, vtlActual, vtlGoal]);

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500 overflow-y-auto scrollbar-thin h-full">
            {/* Nav */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 group">
                        <Lucide.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Lead Volume Strategy</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inbound Marketing Calculator</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600/10 rounded-full border border-blue-500/20">
                    <Lucide.Target className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">Objectif : {revenueGoal.toLocaleString()} €</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full p-6 md:p-12 grid grid-cols-1 xl:grid-cols-12 gap-8 pb-32">
                
                {/* LEFT COLUMN : INPUTS (Step 1-5) */}
                <div className="xl:col-span-7 space-y-6">
                    {/* ETAPE 1 & 2 : OBJECTIFS FINANCIERS */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                        <div className="flex items-start gap-6 mb-8">
                            <StepNumber num={1} />
                            <div className="flex-1">
                                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">Cibles de Chiffre d'Affaires</h3>
                                <p className="text-xs text-slate-500">Définissez vos ambitions financières mensuelles pour la partie Inbound.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:pl-16">
                            <MetricInput label="Objectif de CA" value={revenueGoal} onChange={setRevenueGoal} suffix="€" description="Nouveau CA mensuel" />
                            <MetricInput label="Part Marketing" value={marketingPercent} onChange={setMarketingPercent} suffix="%" description="Attribution Inbound" />
                        </div>
                    </div>

                    {/* ETAPE 3 : UNIT ECONOMICS */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Lucide.Users size={120} />
                        </div>
                        <div className="flex items-start gap-6 mb-8">
                            <StepNumber num={3} />
                            <div className="flex-1">
                                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">Panier Moyen & Client Requis</h3>
                                <p className="text-xs text-slate-500">Combien de clients faut-il signer pour atteindre vos objectifs ?</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:pl-16">
                            <MetricInput label="Revenu Moyen par Client" value={avgDealSize} onChange={setAvgDealSize} suffix="€" />
                            <MetricResult label="Clients Requis / Mois" value={results.newClients} color="emerald" />
                        </div>
                    </div>

                    {/* ETAPE 4 : CONVERSION LEADS */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                        <div className="flex items-start gap-6 mb-8">
                            <StepNumber num={4} />
                            <div className="flex-1">
                                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">Besoin en Leads</h3>
                                <p className="text-xs text-slate-500">Analyse de la performance commerciale (Lead to Customer).</p>
                            </div>
                        </div>
                        <div className="space-y-8 md:pl-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <MetricInput label="Taux Conv. Actuel" value={ltcActual} onChange={setLtcActual} suffix="%" />
                                <MetricInput label="Taux Conv. Objectif" value={ltcGoal} onChange={setLtcGoal} suffix="%" />
                            </div>
                        </div>
                    </div>

                    {/* ETAPE 5 : TRAFIC & VISITEURS */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm border-b-4 border-b-blue-600">
                        <div className="flex items-start gap-6 mb-8">
                            <StepNumber num={5} />
                            <div className="flex-1">
                                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">Volume de Trafic Nécessaire</h3>
                                <p className="text-xs text-slate-500">Quel volume de visiteurs devez-vous attirer sur vos plateformes ?</p>
                            </div>
                        </div>
                        <div className="space-y-8 md:pl-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <MetricInput label="Visitor to Lead Actual" value={vtlActual} onChange={setVtlActual} suffix="%" />
                                <MetricInput label="Visitor to Lead Target" value={vtlGoal} onChange={setVtlGoal} suffix="%" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN : FUNNEL VISUALIZATION */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 md:p-10 shadow-xl sticky top-24">
                        <div className="text-center mb-10">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.3em] mb-2">Entonnoir de Conversion</h3>
                            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> Situation Actuelle</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> Objectif Optimisé</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-stretch gap-8 min-h-[500px]">
                            {/* ACTUAL FUNNEL */}
                            <div className="flex-1 flex flex-col justify-between items-center opacity-40">
                                <FunnelStep 
                                    label="Visiteurs" 
                                    value={results.visitorsActual.toLocaleString()} 
                                    subValue="" 
                                    percentage={`${vtlActual}%`} 
                                    colorClass="bg-slate-500" 
                                    width="100%" 
                                />
                                <FunnelStep 
                                    label="Leads" 
                                    value={results.leadsActual.toLocaleString()} 
                                    subValue="" 
                                    percentage={`${ltcActual}%`} 
                                    colorClass="bg-slate-600" 
                                    width="80%" 
                                />
                                <div className="flex flex-col items-center w-full">
                                    <div className="w-[60%] h-20 bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-lg">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Clients</span>
                                        <span className="text-xl font-black text-white">{results.newClients}</span>
                                    </div>
                                </div>
                            </div>

                            {/* GOAL FUNNEL */}
                            <div className="flex-1 flex flex-col justify-between items-center">
                                <FunnelStep 
                                    label="Visiteurs" 
                                    value={results.visitorsGoal.toLocaleString()} 
                                    subValue="" 
                                    percentage={`${vtlGoal}%`} 
                                    colorClass="bg-blue-500" 
                                    width="100%" 
                                />
                                <FunnelStep 
                                    label="Leads" 
                                    value={results.leadsGoal.toLocaleString()} 
                                    subValue="" 
                                    percentage={`${ltcGoal}%`} 
                                    colorClass="bg-blue-600" 
                                    width="80%" 
                                />
                                <div className="flex flex-col items-center w-full">
                                    <div className="w-[60%] h-20 bg-emerald-600 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-xl shadow-emerald-500/20">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Clients</span>
                                        <span className="text-xl font-black text-white">{results.newClients}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-500/20">
                            <div className="flex items-center gap-3 mb-2">
                                <Lucide.Zap size={18} className="text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-300">Levier d'Optimisation</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                En passant de {ltcActual}% à {ltcGoal}% de conversion, vous diminuez votre besoin en trafic de <span className="text-blue-600 dark:text-blue-400 font-black">{Math.round(((results.visitorsActual - results.visitorsGoal) / results.visitorsActual) * 100)}%</span> pour le même résultat financier.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadCalculator;
