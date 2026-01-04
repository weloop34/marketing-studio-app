
import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { AIProvider } from '../types';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  bridgeApiUrl: string;
  setBridgeApiUrl: (url: string) => void;
  unsplashAccessKey: string;
  setUnsplashAccessKey: (key: string) => void;
  aiProvider: AIProvider;
  setAiProvider: (provider: AIProvider) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  mistralKey: string;
  setMistralKey: (key: string) => void;
  onShowToast: (message: string) => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen, onClose, webhookUrl, setWebhookUrl, bridgeApiUrl, setBridgeApiUrl, unsplashAccessKey, setUnsplashAccessKey,
  aiProvider, setAiProvider, geminiKey, setGeminiKey, openaiKey, setOpenaiKey, mistralKey, setMistralKey, onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai'>('general');
  
  // États locaux isolés pour permettre une saisie sans interruption par le reste de l'app
  const [localWebhookUrl, setLocalWebhookUrl] = useState(webhookUrl);
  const [localBridgeApiUrl, setLocalBridgeApiUrl] = useState(bridgeApiUrl);
  const [localUnsplashKey, setLocalUnsplashKey] = useState(unsplashAccessKey);
  const [localAiProvider, setLocalAiProvider] = useState<AIProvider>(aiProvider);
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiKey);
  const [localOpenaiKey, setLocalOpenaiKey] = useState(openaiKey);
  const [localMistralKey, setLocalMistralKey] = useState(mistralKey);

  if (!isOpen) return null;

  const handleSave = () => {
    setWebhookUrl(localWebhookUrl);
    setBridgeApiUrl(localBridgeApiUrl);
    setUnsplashAccessKey(localUnsplashKey);
    setAiProvider(localAiProvider);
    setGeminiKey(localGeminiKey);
    setOpenaiKey(localOpenaiKey);
    setMistralKey(localMistralKey);
    onShowToast("Configuration sauvegardée !");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 md:p-6" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.2em] mb-1">Configuration</div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Paramètres du Studio</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400">
            <Lucide.X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
           <button 
             onClick={() => setActiveTab('general')} 
             className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             Général & Webhooks
           </button>
           <button 
             onClick={() => setActiveTab('ai')} 
             className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'ai' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             Intelligence Artificielle
           </button>
        </div>
        
        {/* Content */}
        <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin">
          {activeTab === 'general' ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bridge API Google Sheet</label>
                <input 
                  type="text" 
                  value={localBridgeApiUrl} 
                  onChange={(e) => setLocalBridgeApiUrl(e.target.value)} 
                  placeholder="URL du script Google Apps..."
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Webhook Make.com</label>
                <input 
                  type="text" 
                  value={localWebhookUrl} 
                  onChange={(e) => setLocalWebhookUrl(e.target.value)} 
                  placeholder="https://hook.make.com/..."
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clé Unsplash (Visuels Persona)</label>
                <input 
                  type="text" 
                  value={localUnsplashKey} 
                  onChange={(e) => setLocalUnsplashKey(e.target.value)} 
                  placeholder="Access Key Unsplash..."
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fournisseur de Modèle par défaut</label>
                  <div className="grid grid-cols-3 gap-3">
                     {[
                       { id: 'gemini', label: 'Gemini', icon: <Lucide.Sparkles size={14}/> },
                       { id: 'openai', label: 'OpenAI', icon: <Lucide.Zap size={14}/> },
                       { id: 'mistral', label: 'Mistral', icon: <Lucide.Wind size={14}/> }
                     ].map((p) => (
                       <button
                         key={p.id}
                         type="button"
                         onClick={() => setLocalAiProvider(p.id as AIProvider)}
                         className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${localAiProvider === p.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'}`}
                       >
                         {p.icon} {p.label}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Lucide.Key size={12}/> Clé API Gemini
                    </label>
                    <input 
                      type="text" 
                      value={localGeminiKey} 
                      onChange={(e) => setLocalGeminiKey(e.target.value)} 
                      placeholder="Si vide, utilise la clé système..."
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Lucide.Key size={12}/> Clé API OpenAI (GPT-4o)
                    </label>
                    <input 
                      type="text" 
                      value={localOpenaiKey} 
                      onChange={(e) => setLocalOpenaiKey(e.target.value)} 
                      placeholder="sk-..."
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Lucide.Key size={12}/> Clé API Mistral (Large)
                    </label>
                    <input 
                      type="text" 
                      value={localMistralKey} 
                      onChange={(e) => setLocalMistralKey(e.target.value)} 
                      placeholder="Clé Mistral..."
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50" 
                    />
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/30 dark:bg-slate-950/30">
          <button 
            type="button"
            onClick={onClose} 
            className="px-6 py-2 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="button"
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Lucide.Save className="w-4 h-4" /> Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationModal;
