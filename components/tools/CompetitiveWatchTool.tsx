
import React, { useState, useEffect, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { CompanyProfile, Competitor } from '../../types';
import { extractCompanyInfoFromText } from '../../services/aiService';

interface CompetitiveWatchToolProps {
    onBack: () => void;
    bridgeApiUrl: string;
}

const STORAGE_KEYS = {
    PROFILE: 'competitive_watch_profile',
    COMPETITORS: 'competitive_watch_competitors'
};

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-5">
        <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
    </div>
);

const FormInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; name: string; placeholder: string; required?: boolean; isTextarea?: boolean }> = 
({ label, value, onChange, name, placeholder, required, isTextarea }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
        {isTextarea ? (
            <textarea
                id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={3}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none"
            />
        ) : (
            <input
                type="text" id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
        )}
    </div>
);


const CompetitiveWatchTool: React.FC<CompetitiveWatchToolProps> = ({ onBack, bridgeApiUrl }) => {
    const [profile, setProfile] = useState<CompanyProfile>({ name: '', pitch: '', targets: '', products: '', linkedinUrl: '', websiteUrl: '' });
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
            if (savedProfile) setProfile(JSON.parse(savedProfile));

            const savedCompetitors = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
            if (savedCompetitors) setCompetitors(JSON.parse(savedCompetitors));
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCompetitorChange = (id: string, field: 'name' | 'linkedinUrl', value: string) => {
        setCompetitors(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const addCompetitor = () => {
        if (competitors.length < 3) {
            setCompetitors(prev => [...prev, { id: Date.now().toString(), name: '', linkedinUrl: '' }]);
        } else {
            showToast("Maximum de 3 concurrents atteint.");
        }
    };

    const removeCompetitor = (id: string) => {
        setCompetitors(prev => prev.filter(c => c.id !== id));
    };

    const handleSave = () => {
        try {
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
            localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(competitors));
            showToast("Configuration sauvegardée !");
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
            showToast("Erreur lors de la sauvegarde.");
        }
    };

    const handleExtractInfo = async () => {
        if (!profile.websiteUrl || !profile.websiteUrl.startsWith('http')) {
            showToast("Veuillez entrer une URL de site web valide.");
            return;
        }
        setIsExtracting(true);
        try {
            const scrapeResponse = await fetch(bridgeApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'scrapeWebsite', url: profile.websiteUrl })
            });

            if (!scrapeResponse.ok) throw new Error("Erreur du service de scraping.");
            
            const scrapeResult = await scrapeResponse.json();
            if (scrapeResult.status !== 'success' || !scrapeResult.text) {
                throw new Error(scrapeResult.message || "Impossible d'extraire le contenu du site.");
            }
            
            const extractedData = await extractCompanyInfoFromText(scrapeResult.text);

            setProfile(prev => ({
                ...prev,
                pitch: extractedData.pitch || prev.pitch,
                targets: extractedData.targets || prev.targets,
                products: extractedData.products || prev.products,
            }));

            showToast("Informations pré-remplies !");

        } catch (error: any) {
            console.error("Extraction error:", error);
            showToast(error.message || "Échec de l'extraction IA.");
        } finally {
            setIsExtracting(false);
        }
    };
    
    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
             {toast && <div className="fixed bottom-10 right-10 z-[1000] animate-in slide-in-from-bottom-4"><div className="bg-slate-900 text-white px-6 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 border border-white/10"><Lucide.CheckCircle className="w-6 h-6 text-emerald-400" /><span className="text-xs font-black uppercase tracking-widest">{toast}</span></div></div>}
            
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 group">
                        <Lucide.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Veille Stratégique</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuration & Analyse Concurrentielle</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all">
                        <Lucide.Save size={14} /> Sauvegarder
                    </button>
                    <button disabled className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        <Lucide.Zap size={14} /> Lancer l'analyse
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full p-6 md:p-12 space-y-12 pb-32">
                {/* Section "Mon Entreprise" */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                    <SectionTitle icon={<Lucide.Building2 size={22} className="text-blue-600 dark:text-blue-400" />} title="Mon Entreprise" subtitle="Définissez votre profil pour contextualiser l'analyse de l'IA." />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <FormInput label="Nom de l'entreprise" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Ex: Serious Factory" required />
                        <FormInput label="URL Page LinkedIn" name="linkedinUrl" value={profile.linkedinUrl} onChange={handleProfileChange} placeholder="https://www.linkedin.com/company/..." required />
                        <div className="md:col-span-2 space-y-2">
                           <label htmlFor="websiteUrl" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">URL du Site Web</label>
                           <div className="flex items-center gap-3">
                               <input type="url" id="websiteUrl" name="websiteUrl" value={profile.websiteUrl} onChange={handleProfileChange} placeholder="https://www.votre-entreprise.com" required className="flex-1 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"/>
                               <button onClick={handleExtractInfo} disabled={isExtracting} className="flex items-center gap-2 px-4 h-[46px] bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                   {isExtracting ? <Lucide.Loader2 className="w-4 h-4 animate-spin"/> : <Lucide.Sparkles size={14} />}
                                   <span className="hidden sm:inline">Pré-remplir avec l'IA</span>
                               </button>
                           </div>
                        </div>
                        <FormInput label="Pitch / Description courte" name="pitch" value={profile.pitch} onChange={handleProfileChange} placeholder="Extrait automatiquement par l'IA..." isTextarea />
                        <FormInput label="Produits / Services clés" name="products" value={profile.products} onChange={handleProfileChange} placeholder="Extraits automatiquement par l'IA..." isTextarea />
                        <div className="md:col-span-2">
                           <FormInput label="Cibles principales" name="targets" value={profile.targets} onChange={handleProfileChange} placeholder="Extraites automatiquement par l'IA..." isTextarea />
                        </div>
                    </div>
                </div>

                 {/* Section "Mes Concurrents" */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
                    <div className="flex justify-between items-start">
                         <SectionTitle icon={<Lucide.Globe size={22} className="text-blue-600 dark:text-blue-400" />} title="Mes Concurrents" subtitle="Ajoutez jusqu'à 3 concurrents à analyser." />
                         <button onClick={addCompetitor} disabled={competitors.length >= 3} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-50 transition-all">
                             <Lucide.Plus size={14} /> Ajouter
                         </button>
                    </div>
                    <div className="space-y-6 mt-8">
                        {competitors.length === 0 && (
                            <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                <Lucide.Users size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                                <p className="text-sm font-bold text-slate-400">Aucun concurrent ajouté.</p>
                                <p className="text-xs text-slate-400">Cliquez sur "Ajouter" pour commencer.</p>
                            </div>
                        )}
                        {competitors.map((c, index) => (
                            <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <div className="md:col-span-5">
                                    <FormInput label={`Nom du Concurrent ${index + 1}`} name="name" value={c.name} onChange={(e) => handleCompetitorChange(c.id, 'name', e.target.value)} placeholder="Ex: 360Learning" />
                                </div>
                                <div className="md:col-span-6">
                                    <FormInput label="URL Page LinkedIn" name="linkedinUrl" value={c.linkedinUrl} onChange={(e) => handleCompetitorChange(c.id, 'linkedinUrl', e.target.value)} placeholder="https://www.linkedin.com/company/..." />
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                    <button onClick={() => removeCompetitor(c.id)} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all">
                                        <Lucide.Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitiveWatchTool;