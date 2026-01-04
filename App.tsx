
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Lucide from 'lucide-react';
import { Task, MarketingData, ViewMode, CarouselSlide, PollData, WebinarData, WebinarAsset, AIProvider, AIConfig } from './types';
import { getMockMarketingData } from './mockData';
import { generateContent, generatePrepContent, generateImagePrompts, generateCarouselData, formatArticleForWord, generateEmailCampaign, translateHtmlContent, generateImageFromPrompt, generatePollContent, generateWebinarContent, setAIConfig } from './services/aiService';
import { parseDate, formatToLinkedInWYSIWYG, markdownToHtml } from './utils';
import { createDefaultSlides } from './constants';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import ToolboxView from './components/ToolboxView';
import PrepModal from './components/PrepModal';
import ConfirmationModal from './components/ConfirmationModal';
import VideoPrompter from './components/VideoPrompter';
import ConfigurationModal from './components/ConfigurationModal';
import ContentWorkspace from './components/ContentWorkspace';
import DetailItem from './components/DetailItem';
import { SlideComponent, THEMES } from './components/CarouselSlides';

declare var html2canvas: any;
declare global {
  interface Window {
    jspdf: any;
  }
}

const LoadingOverlay = ({ progress }: { progress: number }) => {
  const radius = 45; const circumference = 2 * Math.PI * radius; const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center text-white backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative mb-12"><svg className="w-32 h-32 transform -rotate-90"><circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" /><circle cx="64" cy="64" r={radius} stroke="#2563eb" strokeWidth="4" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease' }} strokeLinecap="round" /></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-black text-white/90">{progress}%</span></div></div>
      <h2 className="text-3xl font-black mb-4 uppercase tracking-[0.15em] text-center">Export PDF en cours...</h2><p className="text-xl font-medium opacity-50 mb-10 tracking-normal">Compilation haute définition.</p><div className="w-[450px] h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner relative"><div className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_25px_rgba(37,99,235,0.6)]" style={{ width: `${progress}%` }} /></div>
      <p className="mt-10 text-[11px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse">Ne fermez pas la fenêtre</p>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<MarketingData>({ todayTasks: [], lateTasks: [], allTasks: [], sheetId: "" });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<ViewMode>('today');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [aiImagePrompt, setAiImagePrompt] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [prepModalTask, setPrepModalTask] = useState<Task | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPrompter, setShowPrompter] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const HARDCODED_BRIDGE_URL = 'https://script.google.com/macros/s/AKfycbx8BHhe1wz8XrAbDTTFhpL7rXGfo37he-yaOuVnRLpZHPsCF3-PHrSBSYpMhVl4DHBhjA/exec';
  const DEFAULT_WEBHOOK_URL = 'https://hook.eu2.make.com/oaweyps6rqs0n138rx2m9th4rlf0cyc8';
  const DEFAULT_UNSPLASH_KEY = 'o7pYMLrjwQDj9F3Oinh5Z_1KDABSPnqKHkdp-CTu8gA';

  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('sf_webhook_url') || DEFAULT_WEBHOOK_URL);
  const [bridgeApiUrl, setBridgeApiUrl] = useState(() => localStorage.getItem('sf_bridge_url') || HARDCODED_BRIDGE_URL);
  const [unsplashAccessKey, setUnsplashAccessKey] = useState(() => localStorage.getItem('sf_unsplash_key') || DEFAULT_UNSPLASH_KEY);
  const [aiProvider, setAiProvider] = useState<AIProvider>(() => (localStorage.getItem('sf_ai_provider') as AIProvider) || 'gemini');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('sf_gemini_key') || '');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('sf_openai_key') || '');
  const [mistralKey, setMistralKey] = useState(() => localStorage.getItem('sf_mistral_key') || '');

  const [darkMode, setDarkMode] = useState(() => { const h = new Date().getHours(); return h >= 19 || h <= 7; });
  
  useEffect(() => {
    setAIConfig({ provider: aiProvider, geminiKey, openaiKey, mistralKey });
    localStorage.setItem('sf_ai_provider', aiProvider);
    localStorage.setItem('sf_gemini_key', geminiKey);
    localStorage.setItem('sf_openai_key', openaiKey);
    localStorage.setItem('sf_mistral_key', mistralKey);
    localStorage.setItem('sf_webhook_url', webhookUrl);
    localStorage.setItem('sf_bridge_url', bridgeApiUrl);
    localStorage.setItem('sf_unsplash_key', unsplashAccessKey);
  }, [aiProvider, geminiKey, openaiKey, mistralKey, webhookUrl, bridgeApiUrl, unsplashAccessKey]);

  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([]);
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [webinarData, setWebinarData] = useState<WebinarData | null>(null);
  const [webinarAssets, setWebinarAssets] = useState<WebinarAsset[]>([]);
  
  const [activeEmailTab, setActiveEmailTab] = useState(0);
  const [previewTemplateKey, setPreviewTemplateKey] = useState<string | null>(null);
  const [campaignLanguage, setCampaignLanguage] = useState<'fr' | 'en'>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [authorName, setAuthorName] = useState("William PERES");
  const [authorRole, setAuthorRole] = useState("CEO Serious Factory");
  const [slidesCount, setSlidesCount] = useState(12);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null);
  const [themeKey, themeSetKey] = useState<'seriousDark' | 'techBlue' | 'lightPro'>('seriousDark');
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [selectionFormat, setSelectionFormat] = useState({ bold: false, italic: false, ul: false, ol: false });
  const [adFormatSelected, setAdFormatSelected] = useState(false);
  const [selectedAdFormat, setSelectedAdFormat] = useState<'post' | 'carousel' | 'video' | null>(null);
  const [isStrategicInfoExpanded, setIsStrategicInfoExpanded] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const promoEditorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authorPhotoInputRef = useRef<HTMLInputElement>(null);
  const exportContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (darkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [darkMode]);
  
  useEffect(() => {
    const checkFormat = () => {
      const selection = window.getSelection(); if (!selection || selection.rangeCount === 0) return;
      const container = selection.getRangeAt(0).commonAncestorContainer; const element = container.nodeType === 1 ? container as HTMLElement : container.parentElement;
      if (editorRef.current?.contains(element) || promoEditorRef.current?.contains(element)) {
        setSelectionFormat({ bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), ul: document.queryCommandState('insertUnorderedList'), ol: document.queryCommandState('insertOrderedList') });
      } else { setSelectionFormat({ bold: false, italic: false, ul: false, ol: false }); }
    };
    document.addEventListener('selectionchange', checkFormat); document.addEventListener('mouseup', checkFormat); document.addEventListener('keyup', checkFormat);
    return () => { document.removeEventListener('selectionchange', checkFormat); document.removeEventListener('mouseup', checkFormat); document.removeEventListener('keyup', checkFormat); };
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  
  const applyLinkedInFormat = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const htmlContent = ref.current.innerHTML;
      const linkedInText = formatToLinkedInWYSIWYG(htmlContent);
      ref.current.innerText = linkedInText;
      showToast("Formatage pour LinkedIn appliqué !");
    }
  };

  const handleExportWord = async () => { if (!editorRef.current || !selectedTask) return; setGenerating(true); try { const rawText = editorRef.current.innerText; const formatted = await formatArticleForWord(rawText); const blob = new Blob([formatted], { type: 'application/msword' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Article_LinkedIn_${selectedTask.sujet.replace(/\s+/g, '_')}.doc`; a.click(); showToast("Article formaté pour Google Docs !"); } catch (err) { showToast("Erreur lors du formatage Word"); } finally { setGenerating(false); } };
  const handleExportPDF = async () => { if (isExporting || !exportContainerRef.current) return; setIsExporting(true); setExportProgress(0); try { const { jsPDF } = window.jspdf; const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [1080, 1350], hotfixes: ['px_scaling'] }); const domSlides = exportContainerRef.current.children; const total = domSlides.length; for (let i = 0; i < total; i++) { setExportProgress(Math.round(((i + 1) / total) * 100)); await new Promise(r => setTimeout(r, 100)); const slide = domSlides[i] as HTMLElement; const canvas = await html2canvas(slide, { scale: 2, useCORS: true, logging: false, backgroundColor: null }); const imgData = canvas.toDataURL('image/jpeg', 0.95); if (i > 0) pdf.addPage([1080, 1350]); pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1350); } pdf.save(`Carrousel_${selectedTask?.sujet.replace(/\s+/g, '_') || 'SF'}.pdf`); showToast("PDF Exporté avec succès !"); } catch (err) { showToast("Erreur lors de l'export PDF"); } finally { setIsExporting(false); setExportProgress(0); } };
  const handleExportArticlePDF = async () => { if (!editorRef.current || !selectedTask || !editorRef.current.innerText.trim()) { showToast("L'article est vide."); return; } setIsExporting(true); setExportProgress(10); try { const { jsPDF } = window.jspdf; const pdf = new jsPDF('p', 'pt', 'a4'); const page = { width: pdf.internal.pageSize.getWidth(), height: pdf.internal.pageSize.getHeight(), }; const margins = { top: 80, bottom: 60, left: 60, right: 60 }; const contentWidth = page.width - margins.left - margins.right; let y = margins.top; const addLines = (text: string, options: { fontSize: number; fontStyle: 'normal' | 'bold' | 'italic'; spaceAfter: number; }) => { if (text.trim().length === 0 && options.spaceAfter === 0) return; pdf.setFont('helvetica', options.fontStyle); pdf.setFontSize(options.fontSize); const lines = pdf.splitTextToSize(text, contentWidth); const lineHeight = options.fontSize * 1.2; if (y + (lines.length * lineHeight) > page.height - margins.bottom) { pdf.addPage(); y = margins.top; } for (const line of lines) { if (y + lineHeight > page.height - margins.bottom) { pdf.addPage(); y = margins.top; } pdf.text(line, margins.left, y); y += lineHeight; } y += options.spaceAfter; }; setExportProgress(30); const processNode = (node: ChildNode) => { const text = node.textContent || ""; switch (node.nodeName) { case 'H1': addLines(text, { fontSize: 22, fontStyle: 'bold', spaceAfter: 15 }); break; case 'H2': addLines(text, { fontSize: 16, fontStyle: 'bold', spaceAfter: 12 }); break; case 'H3': addLines(text, { fontSize: 14, fontStyle: 'bold', spaceAfter: 10 }); break; default: addLines(text, { fontSize: 11, fontStyle: 'normal', spaceAfter: 8 }); break; } }; const nodes = Array.from(editorRef.current.childNodes); for (const node of nodes) { processNode(node as ChildNode); } setExportProgress(80); const pageCount = pdf.internal.getNumberOfPages(); for (let i = 1; i <= pageCount; i++) { pdf.setPage(i); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor('#666666'); pdf.text(`${selectedTask.sujet} - ${selectedTask.auteur}`, margins.left, 40); pdf.text(`Généré par Marketing Studio`, margins.left, page.height - 30); pdf.text(`Page ${i} sur ${pageCount}`, page.width - margins.right, page.height - 30, { align: 'right' }); } setExportProgress(100); pdf.save(`Article_${selectedTask.sujet.replace(/\s+/g, '_')}.pdf`); showToast("Article PDF exporté !"); } catch (err) { showToast("Erreur lors de l'export PDF de l'article"); } finally { setTimeout(() => { setIsExporting(false); setExportProgress(0); }, 1500); } };

  const fetchData = useCallback(async (isInitial = false) => {
    if (!isInitial) setIsRefreshing(true);
    setLoading(true);
    if (bridgeApiUrl && !bridgeApiUrl.includes('VOTRE_URL')) {
      try {
        const response = await fetch(bridgeApiUrl);
        if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);
        const result = await response.json();
        let sheetData; let sheetId = "";
        if (result && Array.isArray(result.data)) { sheetData = result.data; sheetId = result.sheetId || ""; } 
        else if (Array.isArray(result)) { sheetData = result; } 
        else { throw new Error("Format API invalide"); }
        const allTasks: Task[] = sheetData.slice(2).map((row: any[], index: number): Task | null => {
            const sujet = row[3]; if (!sujet || String(sujet).trim() === '') return null;
            const dateLancement: Date | null = parseDate(row[9] || ''); const dateDebut: Date | null = parseDate(row[8] || '');
            const tLan = dateLancement ? dateLancement.getTime() : 0; const tDeb = dateDebut ? dateDebut.getTime() : 0;
            const today = new Date().setHours(0,0,0,0); const status = row[10] || "Programmé";
            return { id: `gs_${index + 3}`, produit: row[1] || '', objectif: row[2] || '', sujet, action: row[4] || '', cible: row[5] || '', auteur: '', angle: row[11] || '', cta: row[12] || '', message: row[13] || '', status, tDeb, tLan, dateLancement: dateLancement ? dateLancement.toLocaleDateString('fr-FR') : "Date invalide", rowIndex: index + 3, isLate: tLan > 0 && (today > tLan && status !== "Terminé"), isToday: tDeb > 0 && tLan > 0 && (today >= tDeb && today <= tLan && status !== "Terminé") };
        }).filter((task): task is Task => task !== null);
        setData({ allTasks, todayTasks: allTasks.filter(t => t.isToday), lateTasks: allTasks.filter(t => t.isLate), sheetId });
        if (!isInitial) showToast("Données synchronisées !");
      } catch (error: any) {
        showToast("Erreur API. Mode démo actif.");
        setData(getMockMarketingData());
      } finally { setLoading(false); setIsRefreshing(false); }
    } else {
        setTimeout(() => { setData(getMockMarketingData()); setLoading(false); setIsRefreshing(false); }, 500);
    }
  }, [bridgeApiUrl]);

  useEffect(() => { fetchData(true); }, [fetchData]);

  const handleBackClick = () => {
    const isLinkedInAdAction = selectedTask?.action.toLowerCase().includes('linkedin ads');

    if (activeToolId) {
      setActiveToolId(null);
    } else if (isLinkedInAdAction && adFormatSelected) {
        setAdFormatSelected(false);
        setSelectedAdFormat(null);
    } else {
        setSelectedTask(null);
        if (window.innerWidth < 768) setIsMobileSidebarOpen(true);
    }
  };

  const handleConfirmTask = async () => {
    if (!selectedTask) return; setShowConfirmModal(false);
    if (bridgeApiUrl) {
      try {
        const response = await fetch(bridgeApiUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'updateStatus', rowIndex: selectedTask.rowIndex, status: 'Terminé' }) });
        const result = await response.json();
        if (result.status !== 'success') throw new Error(result.message);
        showToast("Statut mis à jour !"); await fetchData();
      } catch (error: any) { showToast("Échec de la mise à jour."); }
    } else { showToast("Tâche terminée (local)."); }
    setSelectedTask(null);
  };

  const handleSelectTask = useCallback((t: Task | null) => {
    // When re-clicking the same task
    if (t && selectedTask && t.id === selectedTask.id) {
        // If it's a LinkedIn Ad task, reset the ad format selection to go back to the hub
        if (t.action.toLowerCase().includes('linkedin ads')) {
            setAdFormatSelected(false);
            setSelectedAdFormat(null);
        }
        // For other tasks, a re-click does nothing, preserving state.
        return;
    }
    
    setSelectedTask(t);
    setActiveToolId(null);
    if (!t) return;
    
    if (view === 'calendar' || view === 'toolbox') setView('today');
    setAdFormatSelected(false); 
    setSelectedAdFormat(null);
    setIsMobileSidebarOpen(false); setIsStrategicInfoExpanded(false);
    
    setCarouselSlides([]);
    setGeneratedEmails([]); 
    setActiveEmailTab(0); 
    setPreviewTemplateKey(null); 
    setCampaignLanguage('fr'); 
    setAiImagePrompt(""); 
    setGeneratedImageUrl(null);
    setPollData(null); 
    setWebinarData(null); 
    setWebinarAssets([]);

    if (editorRef.current) editorRef.current.innerHTML = ""; 
    if (promoEditorRef.current) promoEditorRef.current.innerHTML = "";

    const actionLower = t.action.toLowerCase();
    if (actionLower.includes('carrousel')) {
        setCarouselSlides(createDefaultSlides());
    }
    
    // Initialisation du speaker par défaut pour les webinaires
    if (actionLower.includes('webinar') || actionLower.includes('webinaire')) {
        setWebinarData({
          speakers: [{
            id: 'default-wp',
            firstName: 'William',
            lastName: 'PERES',
            role: 'CEO et Fondateur'
          }],
          landingPage: { headline: '', subheadline: '', learningPoints: [] },
          agenda: [],
          slides: []
        });
    }
  }, [selectedTask, view]);

  const onEmailUpdate = useCallback((index: number, newHtml: string) => {
    setGeneratedEmails(prev => {
      const next = [...prev];
      next[index] = newHtml;
      return next;
    });
  }, []);

  const handleTranslateEmail = async () => {
    if (generatedEmails.length === 0) return;
    setIsTranslating(true);
    try {
      const currentHtml = generatedEmails[activeEmailTab];
      const translated = await translateHtmlContent(currentHtml, campaignLanguage);
      onEmailUpdate(activeEmailTab, translated);
      showToast("Email traduit !");
    } catch (err) {
      showToast("Erreur de traduction.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!aiImagePrompt) return;
    setIsGeneratingImage(true);
    try {
      const url = await generateImageFromPrompt(aiImagePrompt);
      setGeneratedImageUrl(url);
      showToast("Image générée !");
    } catch (err: any) {
      showToast(err.message || "Erreur de génération d'image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateFullFlow = async () => {
    if (!selectedTask || generating) return; 
    
    setGenerating(true); 
    setIsGeneratingPrompt(true);
    setPreviewTemplateKey(null); 

    try {
      const actionLower = selectedTask.action.toLowerCase();
      const isAd = actionLower.includes('linkedin ads');
      const isCarouselMode = actionLower.includes('carrousel') || (isAd && selectedAdFormat === 'carousel');
      
      if (isCarouselMode) { 
        const initialSlides = await generateCarouselData(selectedTask, slidesCount, unsplashAccessKey);
        if (initialSlides && initialSlides.length > 0) {
            // Enrichissement Unsplash pour visual-block
            const enrichedSlides = await Promise.all(initialSlides.map(async (s) => {
                if (s.layout === 'visual-block' && s.searchQuery && unsplashAccessKey) {
                    try {
                        const unsplashRes = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(s.searchQuery)}&orientation=landscape&client_id=${unsplashAccessKey}`);
                        if (unsplashRes.ok) {
                            const unData = await unsplashRes.json();
                            return { ...s, imageUrl: unData.urls.regular };
                        }
                    } catch (e) { console.error("Unsplash enrich error", e); }
                }
                return s;
            }));
            
            setCarouselSlides(enrichedSlides); 
            // Post promo asynchrone pour ne pas bloquer l'affichage des slides
            generateContent({ ...selectedTask, action: "Post LinkedIn", angle: "Post promotionnel pour carrousel", cta: "Découvrez le carrousel !" })
                .then(promo => { if (promoEditorRef.current) promoEditorRef.current.innerHTML = markdownToHtml(promo); })
                .catch(e => console.error("Promo error", e));
        }
      } 
      else if (actionLower.includes('email')) { 
        const emails = await generateEmailCampaign(selectedTask, campaignLanguage);
        setGeneratedEmails(emails); 
      } 
      else if (actionLower.includes('sondage')) {
        const data = await generatePollContent(selectedTask);
        setPollData(data);
      }
      else if (actionLower.includes('webinar') || actionLower.includes('webinaire')) {
        // CORRECTION : On passe l'état actuel de webinarData pour préserver les speakers configurés
        const data = await generateWebinarContent(selectedTask, webinarAssets, webinarData || undefined);
        setWebinarData(data);
      }
      else {
        const isVideoMode = actionLower.includes('vidéo') || (isAd && selectedAdFormat === 'video');

        // If it's a video task (either standard or Ad), we need to override the action to get a script
        const generationTask = isVideoMode 
          ? { ...selectedTask, action: 'Vidéo' } 
          : selectedTask;

        const fullContent = await generateContent(generationTask);
        if (editorRef.current) editorRef.current.innerHTML = markdownToHtml(fullContent); 
        
        // For video and article tasks, also generate a promotional post
        if (isVideoMode || actionLower.includes('article')) { 
          const promo = await generateContent({ ...selectedTask, action: "Post LinkedIn", angle: "Accroche pour ce contenu", cta: "En savoir plus" });
          if (promoEditorRef.current) promoEditorRef.current.innerHTML = markdownToHtml(promo); 
        } 
        
        // Generate an image prompt for any non-carousel/email/poll/webinar content
        generateImagePrompts(selectedTask, fullContent)
            .then(data => setAiImagePrompt(data.prompt))
            .catch(() => generateImagePrompts(selectedTask).then(d => setAiImagePrompt(d.prompt)));
      }
      showToast("Génération terminée !");
    } catch (error: any) { 
      console.error("Generate Flow Error:", error);
      showToast("Erreur lors de la génération. Vérifiez vos clés API."); 
    } finally { 
      setGenerating(false); 
      setIsGeneratingPrompt(false); 
    }
  };
  
  const handleSetView = (v: ViewMode) => {
    setView(v);
    setSelectedTask(null);
    setActiveToolId(null);
    if (v === 'calendar' || v === 'toolbox') {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <input type="file" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setCustomLogo(reader.result as string); reader.readAsDataURL(file); } }} className="hidden" accept="image/*" />
      <input type="file" ref={authorPhotoInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setAuthorPhoto(reader.result as string); reader.readAsDataURL(file); } }} className="hidden" accept="image/*" />
      {isExporting && <LoadingOverlay progress={exportProgress} />}
      <div className="pdf-render-zone" ref={exportContainerRef}> 
        {carouselSlides.map((s, idx) => ( 
          <SlideComponent 
            key={idx} 
            data={s} 
            t={THEMES[themeKey]} 
            progress={carouselSlides.length > 1 ? (idx / (carouselSlides.length - 1)) * 100 : 0} 
            authorName={authorName} 
            authorRole={authorRole} 
            customLogo={customLogo} 
            authorPhoto={authorPhoto} 
            themeKey={themeKey} 
          /> 
        ))} 
      </div>
      {showJsonEditor && ( <div className="fixed inset-0 bg-black/80 z-[600] flex items-center justify-center p-8 backdrop-blur-md"> <div className="bg-slate-900 border border-slate-700 rounded-[32px] w-full max-w-4xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"> <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950"> <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3"><Lucide.Edit3 className="text-blue-500" /> ÉDITION JSON</h2> <button onClick={() => setShowJsonEditor(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"><Lucide.X size={20} /></button> </div> <textarea className="flex-1 p-6 bg-black text-emerald-400 font-mono text-xs outline-none scrollbar-thin resize-none" value={jsonInput} onChange={e => setJsonInput(e.target.value)} /> <div className="p-6 border-t border-slate-800 flex justify-end gap-4 bg-slate-950"> <button onClick={() => setShowJsonEditor(false)} className="px-6 py-2 text-[10px] font-black uppercase text-slate-500">Annuler</button> <button onClick={() => { try { const parsed = JSON.parse(jsonInput); setCarouselSlides(parsed); setShowJsonEditor(false); showToast("Contenu mis à jour !"); } catch (e) { alert("Erreur JSON : " + (e as Error).message); } }} className="px-8 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-500/20">Sauvegarder</button> </div> </div> </div> )}

      <div className="flex flex-1 overflow-hidden bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 font-sans relative">
        <Sidebar data={data} view={view} setView={handleSetView} selectedTask={selectedTask} setSelectedTask={handleSelectTask} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} onRefresh={() => fetchData()} isRefreshing={isRefreshing} isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} activeToolId={activeToolId} onSelectTool={setActiveToolId} />
        
        <main className="flex-1 flex flex-col overflow-hidden relative text-slate-800 dark:text-slate-100">
          <div className={`px-2 md:px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0 transition-all duration-200 ${selectedTask || activeToolId ? 'h-16' : 'h-12'}`}>
            <div className="flex items-center gap-2 md:gap-4 overflow-hidden flex-1">
              <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Lucide.Menu className="w-5 h-5 text-slate-500" /></button>
              {(selectedTask || activeToolId) && (
                <>
                  <button onClick={handleBackClick} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"><Lucide.ChevronLeft className="w-5 h-5 text-slate-400" /></button>
                   {selectedTask && <h2 className="text-[10px] md:text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight leading-tight line-clamp-2 min-w-0 flex-1">{selectedTask.sujet}</h2>}
                </>
              )}
            </div>
            <div className="flex items-center gap-1 md:gap-2 pl-4 shrink-0">
               {selectedTask ? (
                <>
                  <button onClick={() => setShowConfigModal(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all border border-slate-200 dark:border-slate-700"><Lucide.Settings className="w-5 h-5" /></button>
                  <button onClick={() => setShowConfirmModal(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20"><Lucide.CheckCircle className="w-5 h-5" /></button>
                </>
              ) : (
                <button onClick={() => setShowConfigModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase transition-all"><Lucide.Settings className="w-4 h-4" /> <span className="hidden xs:inline">PARAMÈTRES</span></button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/50">
                <Lucide.Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500">Chargement des données...</p>
            </div>
          ) : view === 'calendar' ? (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">
              <CalendarView tasks={data.allTasks} onSelect={(t) => handleSelectTask(t)} />
            </div>
          ) : view === 'toolbox' ? (
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
              <ToolboxView bridgeApiUrl={bridgeApiUrl} unsplashAccessKey={unsplashAccessKey} activeToolId={activeToolId} onSelectTool={setActiveToolId} />
            </div>
          ) : selectedTask ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
              <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm relative z-40">
                <button onClick={() => setIsStrategicInfoExpanded(!isStrategicInfoExpanded)} className="w-full px-6 py-4 flex items-center justify-between text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Lucide.Target className="w-4 h-4" /> INFOS STRATÉGIQUES</span>
                  {isStrategicInfoExpanded ? <Lucide.ChevronUp className="w-5 h-5" /> : <Lucide.ChevronDown className="w-5 h-5" />}
                </button>
                {isStrategicInfoExpanded && (
                  <div className="px-6 pb-6 pt-2 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <DetailItem label="Objectif" value={selectedTask.objectif} icon={<Lucide.Target className="w-3.5 h-3.5" />} />
                    <DetailItem label="Produit" value={selectedTask.produit} icon={<Lucide.Sparkles className="w-3.5 h-3.5" />} />
                    <DetailItem label="Cible" value={selectedTask.cible} icon={<Lucide.User className="w-3.5 h-3.5" />} />
                    <DetailItem label="Angle" value={selectedTask.angle} icon={<Lucide.Focus className="w-3.5 h-3.5" />} />
                    <DetailItem label="CTA" value={selectedTask.cta} icon={<Lucide.MousePointerClick className="w-3.5 h-3.5" />} />
                    <DetailItem label="Message" value={selectedTask.message} icon={<Lucide.MessageSquare className="w-3.5 h-3.5" />} />
                  </div>
                )}
              </div>
              <div className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 shrink-0 shadow-sm relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 items-start gap-x-12 gap-y-4">
                   <DetailItem label="Objectif" value={selectedTask.objectif} icon={<Lucide.Target className="w-3.5 h-3.5" />} />
                   <DetailItem label="Produit" value={selectedTask.produit} icon={<Lucide.Sparkles className="w-3.5 h-3.5" />} />
                   <DetailItem label="Cible" value={selectedTask.cible} icon={<Lucide.User className="w-3.5 h-3.5" />} />
                   <DetailItem label="Angle Business" value={selectedTask.angle} icon={<Lucide.Focus className="w-3.5 h-3.5" />} />
                   <DetailItem label="CTA" value={selectedTask.cta} icon={<Lucide.MousePointerClick className="w-3.5 h-3.5" />} />
                   <DetailItem label="Message Clé" value={selectedTask.message} icon={<Lucide.MessageSquare className="w-3.5 h-3.5" />} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin bg-slate-100 dark:bg-slate-950/80">
                <ContentWorkspace
                    selectedTask={selectedTask}
                    generating={generating}
                    onShowToast={showToast}
                    adFormatSelected={adFormatSelected}
                    selectedAdFormat={selectedAdFormat}
                    onSelectAdFormat={(f) => { 
                      setSelectedAdFormat(f); 
                      setAdFormatSelected(true);
                      if (f === 'carousel') {
                          setCarouselSlides(createDefaultSlides());
                      }
                    }}
                    onPublishToBlog={() => {}}
                    isPublishing={isPublishing}
                    isWebhookConfigured={true}
                    editorRef={editorRef}
                    promoEditorRef={promoEditorRef}
                    selectionFormat={selectionFormat}
                    applyLinkedInFormat={applyLinkedInFormat}
                    carouselSlides={carouselSlides}
                    authorName={authorName}
                    setAuthorName={setAuthorName}
                    authorRole={authorRole}
                    setAuthorRole={setAuthorRole}
                    slidesCount={slidesCount}
                    setSlidesCount={setSlidesCount}
                    themeKey={themeKey}
                    setThemeKey={themeSetKey}
                    customLogo={customLogo}
                    authorPhoto={authorPhoto}
                    fileInputRef={fileInputRef}
                    authorPhotoInputRef={authorPhotoInputRef}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    handleExportPDF={handleExportPDF}
                    isExporting={isExporting}
                    handleGenerateFullFlow={handleGenerateFullFlow}
                    setShowJsonEditor={setShowJsonEditor}
                    setJsonInput={setJsonInput}
                    setSelectedTask={setSelectedTask}
                    generatedEmails={generatedEmails}
                    setGeneratedEmails={setGeneratedEmails}
                    activeEmailTab={activeEmailTab}
                    setActiveEmailTab={setActiveEmailTab}
                    previewTemplateKey={previewTemplateKey}
                    setPreviewTemplateKey={setPreviewTemplateKey}
                    onEmailUpdate={onEmailUpdate}
                    campaignLanguage={campaignLanguage}
                    setCampaignLanguage={setCampaignLanguage}
                    isTranslating={isTranslating}
                    handleTranslateEmail={handleTranslateEmail}
                    handleExportArticlePDF={handleExportArticlePDF}
                    handleExportWord={handleExportWord}
                    setShowPrompter={setShowPrompter}
                    isGeneratingPrompt={isGeneratingPrompt}
                    aiImagePrompt={aiImagePrompt}
                    setAiImagePrompt={setAiImagePrompt}
                    isGeneratingImage={isGeneratingImage}
                    handleGenerateImage={handleGenerateImage}
                    generatedImageUrl={generatedImageUrl}
                    pollData={pollData}
                    setPollData={setPollData}
                    webinarData={webinarData}
                    setWebinarData={setWebinarData}
                    webinarAssets={webinarAssets}
                    setWebinarAssets={setWebinarAssets}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950/50 relative">
               <div className="bg-blue-600/10 w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 animate-pulse"><Lucide.Rocket className="w-12 h-12 text-blue-600" /></div>
               <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Sélectionnez une mission ou un outil</p>
               <div className="mt-8 flex gap-4">
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl md:hidden">Ouvrir missions</button>
                    <button onClick={() => handleSetView('toolbox')} className="px-8 py-3 bg-amber-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">Boîte à outils</button>
               </div>
            </div>
          )}
        </main>
        {toast && <div className="fixed bottom-10 right-10 z-[1000] animate-in slide-in-from-bottom-4"><div className="bg-slate-900 text-white px-6 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 border border-white/10"><Lucide.CheckCircle className="w-6 h-6 text-emerald-400" /><span className="text-xs font-black uppercase tracking-widest">{toast}</span></div></div>}
        {prepModalTask && <PrepModal task={prepModalTask} onClose={() => setPrepModalTask(null)} fetchPrepContent={generatePrepContent} onShowToast={showToast} />}
        {showPrompter && selectedTask && <VideoPrompter task={selectedTask} script={editorRef.current?.innerText || ""} onClose={() => setShowPrompter(false)} />}
        <ConfirmationModal isOpen={showConfirmModal} title="Finaliser ?" message={`Confirmer la fin de mission "${selectedTask?.sujet}" ?`} onConfirm={handleConfirmTask} onCancel={() => setShowConfirmModal(false)} />
        <ConfigurationModal 
            key={showConfigModal ? 'config-open' : 'config-closed'}
            isOpen={showConfigModal} 
            onClose={() => setShowConfigModal(false)} 
            webhookUrl={webhookUrl} 
            setWebhookUrl={setWebhookUrl} 
            bridgeApiUrl={bridgeApiUrl} 
            setBridgeApiUrl={setBridgeApiUrl} 
            unsplashAccessKey={unsplashAccessKey}
            setUnsplashAccessKey={setUnsplashAccessKey}
            aiProvider={aiProvider}
            setAiProvider={setAiProvider}
            geminiKey={geminiKey}
            setGeminiKey={setGeminiKey}
            openaiKey={openaiKey}
            setOpenaiKey={setOpenaiKey}
            mistralKey={mistralKey}
            setMistralKey={setMistralKey}
            onShowToast={showToast} />
      </div>
    </div>
  );
};

export default App;
