
import React from 'react';
import * as Lucide from 'lucide-react';
import { Task, CarouselSlide, PollData, WebinarData, WebinarAsset } from '../types';
import CarouselGenerator from './CarouselGenerator';
import EmailCampaignGenerator from './EmailCampaignGenerator';
import LinkedInAdHub from './LinkedInAdHub';
import BlogPublisher from './BlogPublisher';
import LinkedInPollGenerator from './LinkedInPollGenerator';
import WebinarGenerator from './WebinarGenerator';
import { THEMES, SlideComponent } from './CarouselSlides';
import { ALL_EMAIL_TEMPLATES } from '../emailTemplates';

interface ContentWorkspaceProps {
  selectedTask: Task;
  // General
  generating: boolean;
  onShowToast: (msg: string) => void;
  // Ad Hub
  adFormatSelected: boolean;
  selectedAdFormat: 'post' | 'carousel' | 'video' | null;
  onSelectAdFormat: (format: 'post' | 'carousel' | 'video') => void;
  // Blog
  onPublishToBlog: () => void;
  isPublishing: boolean;
  isWebhookConfigured: boolean;
  // Editors
  editorRef: React.RefObject<HTMLDivElement>;
  promoEditorRef: React.RefObject<HTMLDivElement>;
  selectionFormat: { bold: boolean; italic: boolean; ul: boolean; ol: boolean };
  applyLinkedInFormat: (ref: React.RefObject<HTMLDivElement>) => void;
  // Carousel
  carouselSlides: CarouselSlide[];
  authorName: string;
  setAuthorName: (name: string) => void;
  authorRole: string;
  setAuthorRole: (role: string) => void;
  slidesCount: number;
  setSlidesCount: (count: number) => void;
  themeKey: 'seriousDark' | 'techBlue' | 'lightPro';
  setThemeKey: (theme: 'seriousDark' | 'techBlue' | 'lightPro') => void;
  customLogo: string | null;
  authorPhoto: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  authorPhotoInputRef: React.RefObject<HTMLInputElement>;
  viewMode: 'single' | 'grid';
  setViewMode: (v: 'single' | 'grid') => void;
  handleExportPDF: () => void;
  isExporting: boolean;
  handleGenerateFullFlow: () => void;
  setShowJsonEditor: (show: boolean) => void;
  setJsonInput: (json: string) => void;
  setSelectedTask: (task: Task | null) => void;
  // Email
  generatedEmails: string[];
  setGeneratedEmails: (emails: string[]) => void;
  activeEmailTab: number;
  setActiveEmailTab: (tab: number) => void;
  previewTemplateKey: string | null;
  setPreviewTemplateKey: (key: string | null) => void;
  onEmailUpdate: (index: number, newHtml: string) => void;
  campaignLanguage: 'fr' | 'en';
  setCampaignLanguage: (lang: 'fr' | 'en') => void;
  isTranslating: boolean;
  handleTranslateEmail: () => void;
  // Article/Video
  handleExportArticlePDF: () => void;
  handleExportWord: () => void;
  setShowPrompter: (show: boolean) => void;
  // Image Generation
  isGeneratingPrompt: boolean;
  aiImagePrompt: string;
  setAiImagePrompt: (prompt: string) => void;
  isGeneratingImage: boolean;
  handleGenerateImage: () => void;
  generatedImageUrl: string | null;
  // Poll & Webinar Data
  pollData: PollData | null;
  setPollData: (data: PollData | null) => void;
  webinarData: WebinarData | null;
  setWebinarData: (data: WebinarData | null) => void;
  webinarAssets: WebinarAsset[];
  setWebinarAssets: (assets: WebinarAsset[]) => void;
}

const ContentWorkspace: React.FC<ContentWorkspaceProps> = (props) => {
    const {
        selectedTask, generating, onShowToast, adFormatSelected, selectedAdFormat, onSelectAdFormat, onPublishToBlog, isPublishing, isWebhookConfigured,
        editorRef, promoEditorRef, selectionFormat, applyLinkedInFormat, carouselSlides, authorName, setAuthorName, authorRole, setAuthorRole,
        slidesCount, setSlidesCount, themeKey, setThemeKey, customLogo, authorPhoto, fileInputRef, authorPhotoInputRef, viewMode, setViewMode,
        handleExportPDF, isExporting, handleGenerateFullFlow, setShowJsonEditor, setJsonInput, setSelectedTask, generatedEmails, setGeneratedEmails, activeEmailTab,
        setActiveEmailTab, previewTemplateKey, setPreviewTemplateKey, onEmailUpdate, campaignLanguage, setCampaignLanguage, isTranslating,
        handleTranslateEmail, handleExportArticlePDF, handleExportWord, setShowPrompter, isGeneratingPrompt, aiImagePrompt, setAiImagePrompt,
        isGeneratingImage, handleGenerateImage, generatedImageUrl, pollData, setPollData, webinarData, setWebinarData, webinarAssets, setWebinarAssets
    } = props;

    const isLinkedInAdAction = selectedTask?.action.toLowerCase().includes('linkedin ads');
    const isVideoAction = selectedTask?.action.toLowerCase().includes('vidéo') || (isLinkedInAdAction && adFormatSelected && selectedAdFormat === 'video');
    const isLinkedInArticleAction = selectedTask?.action === 'Article LinkedIn';
    const isBlogAction = selectedTask?.action === 'Article Blog SEO';
    const isCarouselAction = selectedTask?.action.toLowerCase().includes('carrousel') || (isLinkedInAdAction && adFormatSelected && selectedAdFormat === 'carousel');
    const isEmailCampaignAction = selectedTask?.action.toLowerCase().includes('email');
    const isPollAction = selectedTask?.action.toLowerCase().includes('sondage');
    const isWebinarAction = selectedTask?.action.toLowerCase().includes('webinar') || selectedTask?.action.toLowerCase().includes('webinaire');
    
    // Pour les Ads de type 'post', on réutilise le comportement Post standard
    const isAdPost = isLinkedInAdAction && adFormatSelected && selectedAdFormat === 'post';
    const isPostAction = (!isLinkedInArticleAction && !isBlogAction && !isVideoAction && !isCarouselAction && !isEmailCampaignAction && !isLinkedInAdAction && !isPollAction && !isWebinarAction) || isAdPost;

    if (isLinkedInAdAction && !adFormatSelected) {
      return <LinkedInAdHub onSelectFormat={onSelectAdFormat} />;
    }
    if (isBlogAction) { return <BlogPublisher task={selectedTask!} onPublish={onPublishToBlog} isPublishing={isPublishing} isWebhookConfigured={isWebhookConfigured} />; }
    
    return (
      <div className={`flex flex-col ${isCarouselAction || isEmailCampaignAction || isPollAction || isWebinarAction ? 'p-0' : 'p-4 md:p-6'} gap-6`}>
        <div className={`flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${isCarouselAction || isEmailCampaignAction || isPollAction || isWebinarAction ? 'border-0 h-[85vh]' : 'border rounded-[32px] min-h-[85vh]'}`}>
          <div className={`px-3 md:px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 sticky top-0 z-20 shrink-0 min-h-14 py-2`}>
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              {isCarouselAction ? (
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex flex-col w-full gap-2 md:flex-row md:items-center min-w-0 flex-1">
                    <div className="flex items-center justify-between w-full md:w-auto gap-2 shrink-0">
                      <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white shadow-sm"><Lucide.Square className="w-4 h-4" /></div>
                        <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white">SF Carousel</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-300/30 dark:border-slate-700/30">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => setThemeKey('seriousDark')} className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all shrink-0 ${themeKey === 'seriousDark' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>DARK</button>
                          <button onClick={() => setThemeKey('techBlue')} className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all shrink-0 ${themeKey === 'techBlue' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>TECH</button>
                          <button onClick={() => setThemeKey('lightPro')} className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all shrink-0 ${themeKey === 'lightPro' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>LIGHT</button>
                        </div>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
                        <div className="flex items-center bg-white/40 dark:bg-black/20 rounded-lg px-2 py-1" title="Nombre de slides">
                          <Lucide.Layers className="w-3 h-3 text-slate-400 mr-1.5" />
                          <input type="number" min="4" max="30" value={slidesCount} onChange={e => setSlidesCount(parseInt(e.target.value))} className="w-10 bg-transparent border-none outline-none font-black text-[10px] text-center p-0" />
                        </div>
                      </div>
                      <div className="flex md:hidden items-center gap-1.5 ml-auto shrink-0">
                        <button onClick={handleExportPDF} disabled={isExporting} className="w-9 h-9 flex items-center justify-center bg-emerald-600 text-white rounded-xl shadow-lg transition-all active:scale-95"><Lucide.Download className="w-4 h-4" /></button>
                        <button onClick={handleGenerateFullFlow} disabled={generating} className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl shadow-lg active:scale-95">{generating ? <Lucide.Loader2 className="w-4 h-4 animate-spin" /> : <Lucide.Zap className="w-4 h-4" />}</button>
                      </div>
                    </div>
                    <div className="flex items-center w-full md:w-auto gap-2 min-w-0">
                      <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 min-w-0">
                        <input type="text" placeholder="Auteur" value={authorName} onChange={e => setAuthorName(e.target.value)} className="px-2 py-1.5 rounded-lg text-[10px] bg-slate-100 dark:bg-slate-800 border-none flex-1 min-w-0 outline-none font-bold" title="Nom de l'auteur" />
                        <input type="text" placeholder="Fonction" value={authorRole} onChange={e => setAuthorRole(e.target.value)} className="px-2 py-1.5 rounded-lg text-[10px] bg-slate-100 dark:bg-slate-800 border-none flex-1 min-w-0 outline-none font-bold" title="Fonction de l'auteur" />
                      </div>
                      <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors" title="Logo"><Lucide.ImagePlus className="w-4 h-4" /></button>
                        <button onClick={() => authorPhotoInputRef.current?.click()} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors" title="Photo"><Lucide.UserPlus className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-300/30 dark:border-slate-700/30">
                          <button onClick={() => setViewMode('single')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'single' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`} title="Vue Solo"><Lucide.Monitor className="w-4 h-4" /></button>
                          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`} title="Vue Grille"><Lucide.LayoutGrid className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => { setJsonInput(JSON.stringify(carouselSlides, null, 2)); setShowJsonEditor(true); }} className="p-2 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 active:scale-95 transition-all" title="Éditeur JSON"><Lucide.PenLine className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 shrink-0">
                    <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 transition-all shadow-lg" title="Exporter en PDF"><Lucide.Download className="w-4 h-4" /> <span>PDF</span></button>
                    <button onClick={handleGenerateFullFlow} disabled={generating} className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg transition-all active:scale-95" title="Générer">{generating ? <Lucide.Loader2 className="w-4 h-4 animate-spin" /> : <Lucide.Zap className="w-4 h-4" />}</button>
                  </div>
                </div>
              ) : isEmailCampaignAction ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex w-9 h-9 bg-blue-600/10 text-blue-600 rounded-xl items-center justify-center"><Lucide.Mails className="w-5 h-5" /></div>
                   <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    {['E1', 'E2', 'E3'].map((label, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveEmailTab(index)}
                        className={`px-3 md:px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeEmailTab === index ? 'bg-white dark:bg-slate-600 shadow-md text-blue-600 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                      >
                        <span className="hidden sm:inline">Email </span>{index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ) : isPollAction ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600/10 text-blue-600 rounded-xl flex items-center justify-center"><Lucide.BarChart2 className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Studio Sondage</span>
                </div>
              ) : isWebinarAction ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-600/10 text-emerald-600 rounded-xl flex items-center justify-center"><Lucide.Presentation className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Masterplan Webinaire</span>
                </div>
              ) : ( 
              <div className="flex items-center gap-2 md:gap-3"> <div className="hidden sm:flex w-9 h-9 bg-blue-600/10 text-blue-600 rounded-xl items-center justify-center">{isVideoAction ? <Lucide.Video className="w-5 h-5" /> : <Lucide.FileText className="w-5 h-5" />}</div> <div className="flex items-center gap-0.5 md:gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/40 dark:border-slate-700/40"> <button onClick={() => document.execCommand('bold')} className={`p-2 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.bold ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-white dark:hover:bg-slate-700'}`} title="Gras (Ctrl+B)"><Lucide.Bold className="w-4 h-4" /></button> <button onClick={() => document.execCommand('italic')} className={`p-2 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.italic ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-white dark:hover:bg-slate-700'}`} title="Italique (Ctrl+I)"><Lucide.Italic className="w-4 h-4" /></button> <div className="w-px h-5 bg-slate-300 dark:border-slate-700 mx-0.5 md:mx-1" /> <button onClick={() => document.execCommand('insertUnorderedList')} className={`p-2 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.ul ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-white dark:hover:bg-slate-700'}`} title="Puces"><Lucide.List className="w-4 h-4" /></button> <button onClick={() => document.execCommand('insertOrderedList')} className={`p-2 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.ol ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-white dark:hover:bg-slate-700'}`} title="Numéros"><Lucide.ListOrdered className="w-4 h-4" /></button {isPostAction && <button onClick={() => applyLinkedInFormat(editorRef)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400" title="Format LinkedIn"><Lucide.Linkedin className="w-4 h-4" /></button>} </div> </div> )}
            </div>
            {!isCarouselAction && (
              <div className="flex items-center gap-1.5 md:gap-2 pl-4">
                {isEmailCampaignAction ? (
                  <div className="flex items-center gap-1.5 md:gap-3">
                      <select
                        value={previewTemplateKey || ''}
                        onChange={(e) => {
                          const key = e.target.value;
                          setPreviewTemplateKey(key || null);
                          if (key) {
                             setGeneratedEmails([]);
                             setActiveEmailTab(0);
                          }
                        }}
                        className="max-w-[100px] sm:max-w-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 sm:px-3 py-2 text-[9px] font-black uppercase text-slate-600 dark:text-slate-300 outline-none"
                      >
                        <option value="">Templates...</option>
                        {Object.entries(ALL_EMAIL_TEMPLATES).map(([key, { name }]) => (
                          <option key={key} value={key}>{name}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <select
                          value={campaignLanguage}
                          onChange={(e) => setCampaignLanguage(e.target.value as 'fr' | 'en')}
                          className="bg-transparent border-none outline-none text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 pl-1 focus:ring-0"
                        >
                          <option value="fr">FR</option>
                          <option value="en">EN</option>
                        </select>
                        <button 
                          onClick={handleTranslateEmail} 
                          disabled={isTranslating || generatedEmails.length === 0}
                          className="p-1.5 md:px-3 md:py-1.5 text-[10px] font-black rounded-lg transition-all bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white"
                        >
                          {isTranslating ? <Lucide.Loader2 className="w-4 h-4 animate-spin"/> : <><Lucide.Languages className="w-4 h-4 sm:hidden"/><span className="hidden sm:inline">TRADUIRE</span></>}
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                            if (generatedEmails[activeEmailTab]) {
                                navigator.clipboard.writeText(generatedEmails[activeEmailTab]);
                                onShowToast("HTML copié !");
                            } else {
                                onShowToast("Générez d'abord les emails.");
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100" title="Copier HTML"
                      >
                        <Lucide.Copy className="w-4 h-4" /> <span className="hidden md:inline">HTML</span>
                      </button>
                      <button onClick={handleGenerateFullFlow} disabled={generating} className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg disabled:opacity-50 transition-all" title="Générer">{generating ? <Lucide.Loader2 className="w-4 h-4 animate-spin" /> : <Lucide.Zap className="w-4 h-4" />}</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 md:gap-3">
                    <button onClick={() => { if(editorRef.current) { navigator.clipboard.writeText(editorRef.current.innerText); onShowToast("Copié !"); } }} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors" title="Copier"><Lucide.Copy className="w-4 h-4" /> <span className="hidden sm:inline">COPIER</span></button>
                    {(isLinkedInArticleAction || isVideoAction) && (<button onClick={handleExportArticlePDF} disabled={isExporting} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors" title="PDF"><Lucide.FileDown className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span></button>)}
                    {isLinkedInArticleAction && ( <button onClick={handleExportWord} disabled={generating} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-lg" title="Word"> <Lucide.FileText className="w-4 h-4" /> <span className="hidden sm:inline">WORD</span> </button> )}
                    {isVideoAction && (<button onClick={() => setShowPrompter(true)} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-purple-700 transition-all shadow-lg" title="Prompteur"><Lucide.Video className="w-4 h-4" /> <span className="hidden sm:inline">PROMPTEUR</span></button>)}
                    <button onClick={handleGenerateFullFlow} disabled={generating} className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg disabled:opacity-50 transition-all" title="Générer">{generating ? <Lucide.Loader2 className="w-4 h-4 animate-spin" /> : <Lucide.Zap className="w-4 h-4" />}</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            {isCarouselAction ? (
              <CarouselGenerator task={selectedTask} initialSlides={carouselSlides} onClose={() => setSelectedTask(null)} onShowToast={onShowToast} embedded={true} authorName={authorName} authorRole={authorRole} customLogo={customLogo} authorPhoto={authorPhoto} themeKey={themeKey} viewMode={viewMode} setViewMode={setViewMode} />
            ) : isEmailCampaignAction ? (
              <div className="w-full h-full bg-slate-50 dark:bg-slate-950/50">
                  <EmailCampaignGenerator 
                    generatedEmails={generatedEmails} 
                    isGenerating={generating} 
                    activeTab={activeEmailTab} 
                    previewTemplateKey={previewTemplateKey}
                    onEmailUpdate={onEmailUpdate}
                  />
              </div>
            ) : isPollAction ? (
              <div className="w-full h-full">
                {generating ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Lucide.Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-500">CONCEPTION DU SONDAGE...</p>
                    </div>
                ) : pollData ? (
                    <LinkedInPollGenerator 
                        data={pollData} 
                        onChange={setPollData} 
                        onShowToast={onShowToast} 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="w-24 h-24 bg-blue-600/10 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
                            <Lucide.BarChart2 className="w-12 h-12 text-blue-600" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Prêt à concevoir votre sondage interactif.</p>
                        <button onClick={handleGenerateFullFlow} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">Générer maintenant</button>
                    </div>
                )}
              </div>
            ) : isWebinarAction ? (
              <div className="w-full h-full">
                {generating ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Lucide.Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-6" />
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-emerald-500">CONCEPTION DU MASTERPLAN...</p>
                    </div>
                ) : (
                    <WebinarGenerator 
                        task={selectedTask}
                        data={webinarData || { speakers: [], landingPage: { headline: '', subheadline: '', learningPoints: [] }, agenda: [], slides: [] }} 
                        onChange={setWebinarData} 
                        onShowToast={onShowToast} 
                        assets={webinarAssets}
                        onAssetsChange={setWebinarAssets}
                        onRunAnalysis={handleGenerateFullFlow}
                    />
                )}
              </div>
            ) : (
              <div className="absolute inset-0 p-6 md:p-12 bg-white dark:bg-slate-900 overflow-y-auto scrollbar-thin">
                <div ref={editorRef} contentEditable={!generating} style={{ fontSize: '16px' }} className={`w-full min-h-full outline-none leading-relaxed text-slate-800 dark:text-slate-100 editor-content ${generating ? 'opacity-20 blur-sm' : ''}`} />
              </div>
            )}
            {generating && !isEmailCampaignAction && !isPollAction && !isWebinarAction && <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px] z-50"><Lucide.Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>}
          </div>
        </div>
        {(isLinkedInArticleAction || isCarouselAction || isVideoAction) && ( <div className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm shrink-0 border rounded-[28px]`}> <div className="h-14 px-4 md:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50"> <div className="flex items-center gap-3"> <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shadow-inner"><Lucide.Megaphone className="w-4 h-4" /></div> <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Post de Promotion LinkedIn</h3> </div> <div className="flex items-center gap-4"> <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50"> <button onClick={() => document.execCommand('bold')} className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.bold ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`} title="Mettre en gras (Ctrl+B)"><Lucide.Bold className="w-3.5 h-3.5" /></button> <button onClick={() => document.execCommand('italic')} className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.italic ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`} title="Mettre en italique (Ctrl+I)"><Lucide.Italic className="w-3.5 h-3.5" /></button> <div className="w-px h-4 bg-slate-300 dark:border-slate-700 mx-1" /> <button onClick={() => document.execCommand('insertUnorderedList')} className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.ul ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`} title="Liste à puces"><Lucide.List className="w-3.5 h-3.5" /></button> <button onClick={() => document.execCommand('insertOrderedList')} className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 transition-colors ${selectionFormat.ol ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`} title="Liste numérotée"><Lucide.ListOrdered className="w-3.5 h-3.5" /></button> <button onClick={() => applyLinkedInFormat(promoEditorRef)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400" title="Optimiser le formatage pour LinkedIn"><Lucide.Linkedin className="w-3.5 h-3.5" /></button> </div> <button onClick={() => { if(promoEditorRef.current) { const formatted = promoEditorRef.current.innerText; navigator.clipboard.writeText(formatted); onShowToast("Copié !"); } }} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 transition-colors shadow-sm" title="Copier"><Lucide.Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">COPIER</span></button> </div> </div> <div className="px-8 py-6"> <div ref={promoEditorRef} contentEditable={!generating} style={{ fontSize: '15px' }} className={`w-full min-h-[300px] outline-none leading-relaxed opacity-80 editor-content`} /> </div> </div> )}
        {!isCarouselAction && !isBlogAction && !isEmailCampaignAction && !isVideoAction && !isLinkedInAdAction && !isPollAction && !isWebinarAction && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500"><Lucide.Sparkles className="w-5 h-5" /></div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Générateur de Visuels IA</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Prompt Principal (éditable)</label>
                <textarea
                  value={aiImagePrompt}
                  onChange={(e) => setAiImagePrompt(e.target.value)}
                  placeholder={isGeneratingPrompt ? "Génération du prompt..." : "Le prompt généré par l'IA apparaîtra ici..."}
                  className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm italic min-h-[140px] w-full leading-relaxed resize-none scrollbar-thin focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !aiImagePrompt}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all"
                >
                  {isGeneratingImage ? <Lucide.Loader2 className="w-4 h-4 animate-spin" /> : <Lucide.Image className="w-4 h-4" />}
                  {isGeneratingImage ? 'Génération...' : "Générer l'image"}
                </button>
              </div>
              <div className="space-y-3 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Aperçu du Visuel</label>
                <div className="flex-1 bg-slate-100 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 relative aspect-square">
                  {isGeneratingImage ? (
                    <div className="flex flex-col items-center gap-4 text-blue-500">
                      <Lucide.Loader2 className="w-10 h-10 animate-spin" />
                      <span className="text-xs font-bold uppercase tracking-widest">Création...</span>
                    </div>
                  ) : generatedImageUrl ? (
                    <>
                      <img src={generatedImageUrl} alt="Visuel généré par IA" className="w-full h-full object-contain rounded-lg" />
                      <a
                        href={generatedImageUrl}
                        download={`visuel_${selectedTask?.sujet.replace(/\s+/g, '_')}.png`}
                        className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-900/80 text-white rounded-full text-xs font-bold uppercase hover:bg-black backdrop-blur-sm"
                      >
                        <Lucide.Download size={16} />
                        Télécharger
                      </a>
                    </>
                  ) : (
                    <div className="text-center text-slate-400 dark:text-slate-600">
                      <Lucide.ImageIcon size={64} strokeWidth={1.5} />
                      <p className="mt-2 text-xs font-bold">L'image apparaîtra ici</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default ContentWorkspace;
