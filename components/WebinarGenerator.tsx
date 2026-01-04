
import React, { useState, useRef, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { WebinarData, WebinarAsset, Task, Speaker } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs';

interface WebinarGeneratorProps {
  task: Task;
  data: WebinarData;
  onChange: (newData: WebinarData) => void;
  onShowToast: (msg: string) => void;
  assets: WebinarAsset[];
  onAssetsChange: (assets: WebinarAsset[]) => void;
  onRunAnalysis: () => void;
}

const WebinarGenerator: React.FC<WebinarGeneratorProps> = ({ task, data, onChange, onShowToast, assets, onAssetsChange, onRunAnalysis }) => {
  const [activeSection, setActiveSection] = useState<'setup' | 'resources' | 'landing' | 'agenda' | 'plan' | 'preview'>('setup');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speakerPhotoInputRef = useRef<HTMLInputElement>(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);

  const speakers = data.speakers || [];

  const handleAddSpeaker = () => {
    const newSpeaker: Speaker = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: '',
      lastName: '',
      role: '',
    };
    onChange({ ...data, speakers: [...speakers, newSpeaker] });
  };

  const handleUpdateSpeaker = (id: string, field: keyof Speaker, value: string) => {
    onChange({
      ...data,
      speakers: speakers.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const handleRemoveSpeaker = (id: string) => {
    onChange({ ...data, speakers: speakers.filter(s => s.id !== id) });
  };

  const handleSpeakerPhotoClick = (id: string) => {
    setActiveSpeakerId(id);
    speakerPhotoInputRef.current?.click();
  };

  const handleSpeakerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSpeakerId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateSpeaker(activeSpeakerId, 'photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePdfThumbnail = async (pdfDataUrl: string): Promise<string | undefined> => {
    try {
      const base64 = pdfDataUrl.split(',')[1];
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (!context) return undefined;
      await page.render({ canvasContext: context, viewport }).promise;
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (err) { return undefined; }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const fileList = Array.from(files);
    let completed = 0;
    const newAssetsPromises = fileList.map((file: File) => {
      return new Promise<WebinarAsset>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result as string;
          let thumbnail: string | undefined = undefined;
          if (file.type === 'application/pdf') { thumbnail = await generatePdfThumbnail(dataUrl); }
          completed++;
          setUploadProgress(Math.round((completed / fileList.length) * 100));
          resolve({ id: Math.random().toString(36).substring(2, 11), name: file.name, data: dataUrl, mimeType: file.type, thumbnail: thumbnail });
        };
        reader.readAsDataURL(file);
      });
    });
    const newAssets = await Promise.all(newAssetsPromises);
    onAssetsChange([...assets, ...newAssets]);
    setTimeout(() => { setIsUploading(false); setUploadProgress(0); onShowToast(`${newAssets.length} fichier(s) prêt(s)`); }, 600);
  };

  const renderSlideContent = (slide: any, index: number) => {
    const layout = slide.layout || 'corporate-intro';
    const SlideHeader = () => (
      <div className="mb-6">
        <span className="text-[10px] md:text-[12px] font-black text-[#10b981] uppercase tracking-[0.6em] drop-shadow-sm">
          {slide.visualHints?.label || `SLIDE ${index + 1}`}
        </span>
      </div>
    );

    switch (layout) {
      case 'corporate-intro':
        return (
          <div className="relative h-full bg-[#0b1120] flex flex-col items-center justify-center p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 to-transparent"></div>
            <SlideHeader />
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight z-10 max-w-4xl drop-shadow-2xl">{slide.slideTitle}</h2>
            <p className="mt-8 text-lg md:text-2xl font-bold text-[#fbbf24] z-10 italic uppercase tracking-widest">"{slide.mainMessage}"</p>
          </div>
        );

      case 'expert-duo':
        return (
          <div className="relative h-full bg-[#0b1120] flex flex-col items-center justify-center p-12 overflow-hidden">
            <SlideHeader />
            <h2 className="text-3xl font-black text-white mb-16 uppercase tracking-tight">Vos Intervenants</h2>
            <div className="flex gap-12 flex-wrap justify-center">
              {speakers.length > 0 ? speakers.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="w-44 h-44 rounded-[40px] bg-slate-800 border-[6px] border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">
                    {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> : <Lucide.User size={60} className="text-slate-600" />}
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white uppercase">{s.firstName} {s.lastName}</p>
                    <p className="text-sm font-bold text-[#10b981] uppercase tracking-widest mt-1">{s.role}</p>
                  </div>
                </div>
              )) : (
                <div className="text-slate-500 italic">Aucun intervenant configuré.</div>
              )}
            </div>
          </div>
        );

      case 'vts-screenshot':
        return (
          <div className="relative h-full bg-slate-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center opacity-40">
              <Lucide.Monitor size={300} className="text-white/5" />
            </div>
            <div className="relative z-10 w-full h-full p-20 flex flex-col justify-center bg-gradient-to-r from-black via-black/40 to-transparent">
              <SlideHeader />
              <h2 className="text-5xl font-black text-white uppercase max-w-2xl leading-none mb-6">{slide.slideTitle}</h2>
              <div className="h-1.5 w-40 bg-[#10b981] rounded-full mb-8"></div>
              <p className="text-2xl font-medium text-slate-400 italic max-w-xl">"{slide.mainMessage}"</p>
            </div>
            <div className="absolute top-8 right-8 px-6 py-2.5 bg-white/10 backdrop-blur-xl rounded-2xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20">PRODUIT / DÉMO</div>
          </div>
        );

      case 'neon-concept':
        return (
          <div className="relative h-full bg-[#050810] flex flex-col items-center justify-center p-20 text-left overflow-hidden">
            <div className="absolute -right-20 -top-20 w-[600px] h-[600px] border-[2px] border-[#fbbf24]/10 rotate-45"></div>
            <div className="absolute -right-10 -top-10 w-[600px] h-[600px] border-[1px] border-pink-500/10 rotate-45"></div>
            <div className="relative z-10 w-full max-w-4xl mx-auto">
              <SlideHeader />
              <h2 className="text-7xl font-black text-white leading-[0.9] tracking-tighter mb-10 uppercase">{slide.slideTitle}</h2>
              <p className="text-3xl font-bold text-slate-500 leading-tight border-l-4 border-[#fbbf24] pl-8 italic">"{slide.mainMessage}"</p>
            </div>
          </div>
        );

      case 'dotted-practice':
        return (
          <div className="relative h-full bg-[#fbbf24] flex items-center justify-center p-20 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#000 3px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <div className="relative z-10 text-center">
              <h2 className="text-7xl font-black text-[#0b1120] leading-tight uppercase tracking-tighter mb-4">{slide.slideTitle}</h2>
              <div className="h-2 w-48 bg-black/20 mx-auto mb-8 rounded-full"></div>
              <p className="text-2xl font-bold text-black/60 italic max-w-2xl mx-auto">"{slide.mainMessage}"</p>
            </div>
          </div>
        );

      case 'statistics':
        return (
          <div className="relative h-full bg-white flex flex-col items-center justify-center p-20">
            <div className="text-[200px] font-black text-[#0b1120] leading-none tracking-tighter mb-4 tabular-nums">{slide.slideTitle}</div>
            <div className="text-3xl font-black text-slate-400 uppercase tracking-[0.3em]">{slide.mainMessage}</div>
            <div className="mt-12 h-1.5 w-60 bg-[#fbbf24] rounded-full"></div>
          </div>
        );

      case 'closing':
        return (
          <div className="relative h-full bg-[#10b981] flex flex-col items-center justify-center p-12 text-center">
            <Lucide.Star size={100} className="text-white mb-8 animate-pulse" />
            <h2 className="text-5xl md:text-7xl font-black text-[#0b1120] uppercase tracking-tighter">{slide.slideTitle}</h2>
            <p className="mt-6 text-2xl font-bold text-white uppercase tracking-widest">{slide.mainMessage}</p>
          </div>
        );

      default:
        return (
          <div className="relative h-full bg-[#0b1120] flex flex-col items-center justify-center p-20 text-center">
            <SlideHeader />
            <h2 className="text-5xl font-black text-white uppercase tracking-tight mb-8">{slide.slideTitle}</h2>
            <p className="text-2xl text-slate-400 italic">"{slide.mainMessage}"</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-300 overflow-hidden font-sans">
      <input type="file" ref={speakerPhotoInputRef} className="hidden" accept="image/*" onChange={handleSpeakerPhotoChange} />
      
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/5 px-4 md:px-6 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'setup', label: 'SETUP', icon: <Lucide.Users size={12} />, disabled: false },
          { id: 'resources', label: 'VISUELS', icon: <Lucide.Library size={12} />, disabled: false },
          { id: 'landing', label: 'LANDING', icon: null, disabled: !data?.landingPage?.headline },
          { id: 'agenda', label: 'AGENDA', icon: null, disabled: !data?.agenda?.length },
          { id: 'plan', label: 'MASTERPLAN', icon: null, disabled: !data?.slides?.length },
          { id: 'preview', label: 'APERÇU HD', icon: <Lucide.Monitor size={12} />, disabled: !data?.slides?.length }
        ].map((tab) => (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3 md:px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSection === tab.id 
                ? 'bg-[#10b981] text-white dark:text-[#0b1120] shadow-lg shadow-[#10b981]/10' 
                : tab.disabled ? 'text-slate-400 dark:text-slate-700 cursor-not-allowed opacity-40' : 'text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-thin">
        <div className="max-w-5xl mx-auto pb-32">
          
          {activeSection === 'setup' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lucide.Users size={16} className="text-[#10b981]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Configuration des Intervenants</h3>
                </div>
                <button onClick={handleAddSpeaker} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent rounded-xl text-[9px] font-black uppercase transition-all shadow-sm">
                  <Lucide.Plus size={14} /> Ajouter un Speaker
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {speakers.map((s) => (
                  <div key={s.id} className="bg-white dark:bg-[#1e293b]/20 border border-slate-200 dark:border-white/5 rounded-[32px] p-6 flex flex-col gap-6 relative group shadow-sm">
                    <button onClick={() => handleRemoveSpeaker(s.id)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Lucide.Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-6">
                      <div 
                        onClick={() => handleSpeakerPhotoClick(s.id)}
                        className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#10b981]/40 transition-all shrink-0 shadow-md"
                      >
                        {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> : <Lucide.Camera size={24} className="text-slate-400 dark:text-slate-600" />}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Prénom & Nom</label>
                          <div className="flex gap-2">
                             <input type="text" value={s.firstName} onChange={e => handleUpdateSpeaker(s.id, 'firstName', e.target.value)} placeholder="Prénom" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-[#10b981]/30 outline-none text-slate-800 dark:text-slate-200" />
                             <input type="text" value={s.lastName} onChange={e => handleUpdateSpeaker(s.id, 'lastName', e.target.value)} placeholder="Nom" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-[#10b981]/30 outline-none text-slate-800 dark:text-slate-200" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Fonction / Rôle</label>
                          <input type="text" value={s.role} onChange={e => handleUpdateSpeaker(s.id, 'role', e.target.value)} placeholder="Ex: Directeur Marketing" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-none rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-[#10b981]/30 outline-none text-slate-800 dark:text-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {speakers.length === 0 && (
                   <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] text-slate-400 dark:text-slate-600">
                      <Lucide.UserCircle2 size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-bold">Aucun intervenant défini.</p>
                      <p className="text-xs">Ajoutez les personnes qui animeront ce webinaire.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'resources' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-10">
                <div className="flex items-center gap-3">
                  <Lucide.Sparkles size={16} className="text-[#10b981]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Inspiration Visuelle</h3>
                </div>
                <div className="space-y-6">
                  <div className={`bg-white dark:bg-[#1e293b]/20 border-2 border-dashed rounded-[40px] p-12 md:p-20 text-center group transition-all relative overflow-hidden shadow-sm ${isUploading ? 'border-[#10b981]/40' : 'border-slate-200 dark:border-white/10 hover:border-[#10b981]/40 cursor-pointer'}`} onClick={() => !isUploading && fileInputRef.current?.click()}>
                      {isUploading && <div className="absolute inset-0 z-0 pointer-events-none opacity-20"><div className="h-full bg-[#10b981] transition-all duration-300" style={{ width: `${uploadProgress}%` }} /></div>}
                      <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,application/pdf" onChange={handleFileUpload} disabled={isUploading} />
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-all ${isUploading ? 'bg-[#10b981] text-white dark:text-[#0b1120] scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-[#10b981]/10 text-[#10b981]'}`}>
                          {isUploading ? <Lucide.Loader2 size={40} className="animate-spin" /> : <Lucide.Image size={40} />}
                      </div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Upload de Ressources</h3>
                      <p className="text-slate-500 dark:text-slate-500 text-[11px] max-w-sm mx-auto leading-relaxed font-medium">Déposez vos slides de référence, captures d'écran ou chartes. L'IA analysera les layouts pour s'en inspirer.</p>
                  </div>
                  {assets.length > 0 && (
                      <div className="flex flex-col gap-6">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {assets.map(asset => (
                                <div key={asset.id} className="bg-white dark:bg-[#1e293b]/40 rounded-xl p-3 border border-slate-200 dark:border-white/5 relative overflow-hidden h-28 flex flex-col justify-between group shadow-sm">
                                    <div className="absolute inset-0 z-0">
                                        <img src={asset.thumbnail || asset.data} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity" alt="" />
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); onAssetsChange(assets.filter(a => a.id !== asset.id)); }} className="relative z-10 self-end p-1 hover:text-red-500 transition-colors bg-slate-100 dark:bg-[#0b1120]/50 rounded-md"><Lucide.X size={12}/></button>
                                    <p className="relative z-10 mt-auto text-[8px] font-bold truncate text-slate-600 dark:text-white/80">{asset.name}</p>
                                </div>
                            ))}
                         </div>
                      </div>
                  )}
                  <div className="pt-10 flex justify-center">
                    <button onClick={onRunAnalysis} className="px-10 py-5 bg-[#10b981] text-white dark:text-[#0b1120] rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Générer le Masterplan complet</button>
                  </div>
                </div>
            </div>
          )}

          {activeSection === 'preview' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 flex flex-col items-center">
              <div className="relative w-full aspect-video bg-black rounded-[48px] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.5)] dark:shadow-[0_80px_150px_-30px_rgba(0,0,0,0.9)] overflow-hidden border border-white/5 flex flex-col group/slide">
                  {data?.slides?.[currentSlide] ? renderSlideContent(data.slides[currentSlide], currentSlide) : <div className="flex items-center justify-center h-full text-slate-500 font-black uppercase tracking-widest">Générer pour prévisualiser</div>}
                  
                  {data?.slides?.length > 0 && (
                    <>
                      <div className="absolute inset-x-12 bottom-12 h-1.5 bg-white/5 rounded-full z-20">
                        <div className="h-full bg-[#10b981] transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] rounded-full" style={{ width: `${((currentSlide + 1) / (data.slides.length)) * 100}%` }} />
                      </div>
                      
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                          {data.slides.map((_, i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-[#10b981] scale-125' : 'bg-white/10'}`} />
                          ))}
                      </div>

                      <button onClick={() => setCurrentSlide(prev => (prev - 1 + data.slides.length) % data.slides.length)} className="absolute left-6 top-1/2 -translate-y-1/2 p-5 bg-black/20 hover:bg-white/10 backdrop-blur-xl rounded-full text-white/50 hover:text-white transition-all z-30 border border-white/5 opacity-0 group-hover/slide:opacity-100"><Lucide.ChevronLeft size={28} /></button>
                      <button onClick={() => setCurrentSlide(prev => (prev + 1) % data.slides.length)} className="absolute right-6 top-1/2 -translate-y-1/2 p-5 bg-black/20 hover:bg-white/10 backdrop-blur-xl rounded-full text-white/50 hover:text-white transition-all z-30 border border-white/5 opacity-0 group-hover/slide:opacity-100"><Lucide.ChevronRight size={28} /></button>
                    </>
                  )}
              </div>
              
              {data?.slides?.[currentSlide] && (
                <div className="mt-12 p-8 bg-white dark:bg-[#1e293b]/40 rounded-[40px] border border-slate-200 dark:border-white/5 w-full shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#10b981]/10 rounded-2xl flex items-center justify-center text-[#10b981]"><Lucide.Mic2 size={20}/></div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Script Orateur Suggéré</h4>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">Intentions Pédagogiques</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-2xl border border-slate-100 dark:border-white/5 italic text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                        "{data.slides[currentSlide].speakerNotes || "Pas de notes disponibles pour cette slide."}"
                    </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'landing' && data?.landingPage && (
             <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[40px] p-8 md:p-12 space-y-8 animate-in fade-in duration-500 shadow-sm">
                <div className="space-y-4">
                    <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.3em]">Accroche Captivante</span>
                    <h3 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-tight uppercase">{data.landingPage.headline || "Chargement..."}</h3>
                </div>
                <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Promesse du Webinaire</span>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 italic leading-relaxed">"{data.landingPage.subheadline || "Veuillez générer le masterplan."}"</p>
                </div>
                {data.landingPage.learningPoints?.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Ce qu'ils vont apprendre</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.landingPage.learningPoints.map((pt, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                          <Lucide.CheckCircle2 className="text-[#10b981]" size={16} />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          )}
          
          {activeSection === 'agenda' && data?.agenda && (
             <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] border border-[#10b981]/20">
                    <Lucide.Clock size={20} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 dark:text-slate-500">Timeline</h3>
                </div>

                <div className="relative pl-24 md:pl-32 space-y-10">
                    <div className="absolute left-[110px] md:left-[118px] top-6 bottom-6 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

                    {data.agenda.length > 0 ? data.agenda.map((item, i) => {
                        const times = (item.time || "00:00 - 05:00").split(' - ');
                        return (
                          <div key={i} className="relative flex items-start group">
                              <div className="absolute -left-24 md:-left-32 top-6 w-20 md:w-24 text-right pr-6 md:pr-12 flex flex-col justify-center h-12">
                                  <span className="text-[10px] md:text-[12px] font-black text-[#10b981] tabular-nums tracking-widest leading-none">
                                      {times[0]} -
                                  </span>
                                  <span className="text-[10px] md:text-[12px] font-black text-[#10b981] tabular-nums tracking-widest leading-tight">
                                      {times[1]}
                                  </span>
                              </div>

                              <div className="absolute left-[-5px] top-9 w-2.5 h-2.5 rounded-full bg-slate-50 dark:bg-[#0b1120] border-2 border-[#10b981] z-10"></div>

                              <div className="bg-white dark:bg-[#151b2d] p-6 md:p-8 rounded-[32px] md:rounded-[40px] w-full ml-6 border border-slate-200 dark:border-white/[0.02] shadow-sm dark:shadow-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-[#1a2135]">
                                  <h4 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
                                      {item.title}
                                  </h4>
                                  <p className="text-sm md:text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                      {item.description}
                                  </p>
                              </div>
                          </div>
                        );
                    }) : (
                        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] text-slate-400 dark:text-slate-600">
                            <Lucide.LayoutList size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm font-bold">Agenda non généré.</p>
                        </div>
                    )}
                </div>
             </div>
          )}

          {activeSection === 'plan' && data?.slides && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                {data.slides.length > 0 ? data.slides.map((s, i) => (
                    <div key={i} className="flex flex-col gap-3 bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm" onClick={() => { setCurrentSlide(i); setActiveSection('preview'); }}>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-[#10b981] uppercase tracking-[0.2em]">{s.layout}</span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600">#{i+1}</span>
                        </div>
                        <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase truncate">{s.slideTitle}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-500 line-clamp-2 italic">"{s.mainMessage}"</p>
                    </div>
                )) : (
                   <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] text-slate-400 dark:text-slate-600">
                      <Lucide.Layers size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-bold">Plan des slides non généré.</p>
                   </div>
                )}
             </div>
          )}

        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default WebinarGenerator;
