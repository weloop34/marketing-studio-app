
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { Persona } from '../../types';
import { generatePersona } from '../../services/aiService';

declare global {
  interface Window {
    jspdf: any;
  }
}

interface PersonaGeneratorProps {
    onBack: () => void;
    unsplashAccessKey: string;
    bridgeApiUrl: string;
}

const InfoBlock: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
            {icon}
            <h4 className="text-[10px] uppercase tracking-widest">{label}</h4>
        </div>
        <div className="pl-7 space-y-2 text-sm text-slate-800 dark:text-slate-200">{children}</div>
    </div>
);

const PersonaGenerator: React.FC<PersonaGeneratorProps> = ({ onBack, unsplashAccessKey, bridgeApiUrl }) => {
    const [role, setRole] = useState("Responsable L&D");
    const [industry, setIndustry] = useState("Grande distribution");
    const [mainPainPoint, setMainPainPoint] = useState("Le taux de complétion des formations est trop bas.");
    
    const [persona, setPersona] = useState<Persona | null>(null);
    const [personaPhotoUrl, setPersonaPhotoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getSafeArray = (arr: any) => Array.isArray(arr) ? arr : [];

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPersona(null);
        setPersonaPhotoUrl('');

        try {
            const personaData = await generatePersona(role, industry, mainPainPoint);
            setPersona(personaData);

            if (personaData && personaData.photoSearchQuery && unsplashAccessKey) {
                try {
                    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(personaData.photoSearchQuery)}&per_page=1&orientation=portrait`;
                    const unsplashResponse = await fetch(unsplashUrl, {
                        headers: { 'Authorization': `Client-ID ${unsplashAccessKey}` }
                    });
                    if (unsplashResponse.ok) {
                        const unsplashData = await unsplashResponse.json();
                        if (unsplashData.results && unsplashData.results.length > 0) {
                           setPersonaPhotoUrl(unsplashData.results[0].urls.regular);
                        }
                    }
                } catch (imgError) {
                    console.error("Unsplash error:", imgError);
                }
            }

        } catch (err) {
            console.error("Generation error:", err);
            setError("Une erreur est survenue lors de la génération. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!persona) return;
    
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
    
        const page = { width: doc.internal.pageSize.getWidth(), height: doc.internal.pageSize.getHeight() };
        const margin = 40;
    
        const getImageDataFromProxy = (url: string) => new Promise<string>(async (resolve, reject) => {
            if (!bridgeApiUrl) {
                return reject(new Error("L'URL de l'API Bridge n'est pas configurée."));
            }
            try {
                // Using URLSearchParams for a more robust POST request to Apps Script
                const body = new URLSearchParams();
                body.append('action', 'fetchImageAsBase64');
                body.append('url', url);

                const response = await fetch(bridgeApiUrl, {
                    method: 'POST',
                    body: body,
                });

                if (!response.ok) throw new Error(`Erreur de l'API Bridge : ${response.statusText}`);
                const result = await response.json();
                if (result.status !== 'success' || !result.dataUrl) {
                    throw new Error(result.message || "Impossible de récupérer l'image via le pont.");
                }
                resolve(result.dataUrl);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'image via le pont :", error);
                reject(error);
            }
        });
        
        doc.setFont('helvetica');
    
        doc.setFillColor(241, 245, 249);
        doc.rect(0, 0, page.width, 80, 'F');
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text("Fiche Persona", margin, 50);
    
        let yPos = 120;
        if (personaPhotoUrl) {
            try {
                const imageDataUrl = await getImageDataFromProxy(personaPhotoUrl);

                const img = new Image();
                img.src = imageDataUrl;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
                
                const imgSize = 120;
                const imgX = margin;
                const imgY = yPos;
                
                doc.save();
                doc.beginPath();
                doc.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2, false);
                doc.clip();
                doc.addImage(img, imgX, imgY, imgSize, imgSize);
                doc.restore();
    
            } catch (e) {
                console.error("PDF Image Error:", e);
                doc.setFillColor(226, 232, 240);
                doc.circle(margin + 60, yPos + 60, 60, 'F');
            }
        } else {
             doc.setFillColor(226, 232, 240);
             doc.circle(margin + 60, yPos + 60, 60, 'F');
        }
    
        const textX = margin + 140;
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(persona.name, textX, yPos + 40);
    
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 64, 175);
        doc.text(persona.role, textX, yPos + 65);
    
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text(`${persona.age} ans`, textX, yPos + 85);
    
        yPos += 160;
    
        const drawSection = (title: string, content: string | string[]) => {
            if (!content || (Array.isArray(content) && content.length === 0)) return;
            if (yPos > page.height - 120) { doc.addPage(); yPos = margin; }
    
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(148, 163, 184);
            doc.text(title.toUpperCase(), margin, yPos);
            yPos += 20;
    
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            
            if (typeof content === 'string') {
                const lines = doc.splitTextToSize(content, page.width - margin * 2);
                doc.text(lines, margin, yPos);
                yPos += lines.length * 12 + 20;
            } else if (Array.isArray(content)) {
                content.forEach(item => {
                    const lines = doc.splitTextToSize(`•  ${item}`, page.width - margin * 2 - 15);
                    if (yPos > page.height - 40) { doc.addPage(); yPos = margin; }
                    doc.text(lines, margin + 15, yPos);
                    yPos += lines.length * 12 + 5;
                });
                yPos += 15;
            }
        };
        
        drawSection('Biographie', persona.bio);
        drawSection('Objectifs', getSafeArray(persona.goals));
        drawSection('Frustrations', getSafeArray(persona.painPoints));
    
        if(getSafeArray(persona.communicationChannels).length > 0) {
            if(yPos > page.height - 80) { doc.addPage(); yPos = margin; }
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(148, 163, 184);
            doc.text("CANAUX DE VEILLE", margin, yPos);
            yPos += 20;
        
            let xPos = margin;
            getSafeArray(persona.communicationChannels).forEach(channel => {
                doc.setFontSize(9);
                const tagWidth = doc.getTextWidth(channel) + 16;
                if (xPos + tagWidth > page.width - margin) { xPos = margin; yPos += 22; }
                doc.setFillColor(220, 237, 255);
                doc.setTextColor(2, 132, 199);
                doc.roundedRect(xPos, yPos - 10, tagWidth, 16, 8, 8, 'F');
                doc.text(channel, xPos + 8, yPos);
                xPos += tagWidth + 8;
            });
        }
    
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, page.height - 50, page.width - margin, page.height - 50);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("Généré par Marketing Studio", margin, page.height - 35);
        doc.text(`Fiche Persona : ${persona.name}`, page.width - margin, page.height - 35, { align: 'right' });
        
        doc.save(`Persona_${persona.name.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 group">
                        <Lucide.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Générateur de Persona</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Création de profil cible par IA</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-12 overflow-y-auto">
                {/* Formulaire de gauche */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm h-fit">
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                               <Lucide.PenSquare size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Décrivez votre cible</h3>
                                <p className="text-xs text-slate-500">Fournissez quelques informations, l'IA s'occupe du reste.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Poste / Rôle</label>
                                <input type="text" value={role} onChange={e => setRole(e.target.value)} required className="mt-2 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"/>
                            </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Secteur d'activité</label>
                                <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} required className="mt-2 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"/>
                            </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Problème / Pain Point Principal</label>
                                <textarea value={mainPainPoint} onChange={e => setMainPainPoint(e.target.value)} required rows={3} className="mt-2 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none"/>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all">
                            {loading ? <Lucide.Loader2 className="w-5 h-5 animate-spin"/> : <Lucide.Sparkles className="w-5 h-5" />}
                            {loading ? 'Génération en cours...' : 'Générer le Persona'}
                        </button>
                    </form>
                </div>
                
                {/* Résultat de droite */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-xl relative overflow-hidden flex flex-col min-h-[500px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <Lucide.Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                            <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-500">Création du profil stratégique...</p>
                        </div>
                    ) : persona ? (
                        <div className="animate-in fade-in duration-500 space-y-8 relative">
                             <button 
                                onClick={handleDownloadPDF} 
                                className="absolute top-0 right-0 p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                title="Télécharger en PDF"
                            >
                                <Lucide.Download size={20} />
                            </button>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 shadow-lg border-4 border-white dark:border-slate-950">
                                    {personaPhotoUrl ? (
                                        <img src={personaPhotoUrl} alt={persona.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600"><Lucide.User size={40}/></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">{persona.name || "Inconnu"}</h2>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{persona.role || role}</p>
                                    <p className="text-xs text-slate-500 mt-1">{persona.age || '??'} ans</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">{persona.bio}</p>
                            
                            <InfoBlock icon={<Lucide.Target size={16} />} label="Objectifs Clés">
                                <ul className="list-disc list-inside space-y-1">
                                    {getSafeArray(persona.goals).map((goal, i) => <li key={i}>{goal}</li>)}
                                </ul>
                            </InfoBlock>
                            
                            <InfoBlock icon={<Lucide.AlertTriangle size={16} />} label="Frustrations">
                                <ul className="list-disc list-inside space-y-1">
                                    {getSafeArray(persona.painPoints).map((pp, i) => <li key={i}>{pp}</li>)}
                                </ul>
                            </InfoBlock>
                            
                             <InfoBlock icon={<Lucide.MessageCircle size={16} />} label="Canaux de Veille">
                               <div className="flex flex-wrap gap-2">
                                   {getSafeArray(persona.communicationChannels).map((c, i) => (
                                       <span key={i} className="px-3 py-1 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-xs font-bold border border-sky-100 dark:border-sky-800">{c}</span>
                                   ))}
                               </div>
                            </InfoBlock>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <div className="w-24 h-24 bg-teal-600/10 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
                                <Lucide.Users className="w-12 h-12 text-teal-600" />
                            </div>
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Le persona généré s'affichera ici.</p>
                            {error && <p className="mt-4 text-sm text-red-500 font-bold">{error}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonaGenerator;
