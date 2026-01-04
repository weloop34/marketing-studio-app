
import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Lucide from 'lucide-react';
import { ALL_EMAIL_TEMPLATES } from '../emailTemplates';

interface EmailCampaignGeneratorProps {
  generatedEmails: string[];
  isGenerating: boolean;
  activeTab: number;
  previewTemplateKey: string | null;
  onEmailUpdate: (index: number, newHtml: string) => void;
}

const FONT_LIST = ['Arial', 'Verdana', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Open Sans'];
const FONT_SIZES = [
  { name: '10px', value: '1' }, { name: '13px', value: '2' }, { name: '16px', value: '3' },
  { name: '18px', value: '4' }, { name: '24px', value: '5' }, { name: '32px', value: '6' }, { name: '48px', value: '7' },
];

const FontSizeUpIcon = ({ className } : { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 5L5.5 19h3l1.5-4h5l1.5 4h3L12 5zm-1.25 7l1.25-3.5l1.25 3.5h-2.5z M11 3L13 3L12 1Z" />
    </svg>
);
const FontSizeDownIcon = ({ className } : { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 5L5.5 19h3l1.5-4h5l1.5 4h3L12 5zm-1.25 7l1.25-3.5l1.25 3.5h-2.5z M11 21L13 21L12 23Z" />
    </svg>
);

const CustomSelect = ({ options, value, onChange, title, displayValue, widthClass }: { options: {label: string, value: string}[], value: string, onChange: (v: string) => void, title: string, displayValue: string, widthClass: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 6}px`,
        left: `${rect.left}px`,
        minWidth: `${rect.width}px`,
        zIndex: 500,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  
  return (
    <div className={widthClass}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-white/5 w-full transition-colors"
        title={title}
      >
        <span className="truncate">{displayValue}</span>
        <Lucide.ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="w-48 bg-white dark:bg-[#2B3245] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl overflow-y-auto max-h-60 animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map(option => (
            <button
              key={option.value}
              onMouseDown={e => {
                e.preventDefault();
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-600/30 transition-colors ${value === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};


const generateFakeContent = (templateKey: string | null): string => {
  if (!templateKey) return "";
  const templateInfo = ALL_EMAIL_TEMPLATES[templateKey as keyof typeof ALL_EMAIL_TEMPLATES];
  if (!templateInfo) return "";
  
  let content = templateInfo.template;

  // Generic replacements
  content = content.replace(/{{logoUrl}}/g, 'https://assets.leadfox.co/616ee28b9aec697383ba2641/Logos/LOGO_SF_HORIZONTAL_FOND_BLANC.png');
  content = content.replace(/{{primaryColor}}/g, '#3AAEE0');
  content = content.replace(/{{main_title}}/g, 'Titre Principal de l\'Email');
  content = content.replace(/{{body_paragraph}}|{{intro_paragraph}}|{{summary_paragraph}}|{{paragraph_1}}|{{paragraph_2}}/g, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
  content = content.replace(/{{cta_text}}/g, 'Appel à l\'Action');
  content = content.replace(/{{cta_link}}/g, '#');
  content = content.replace(/{{first_name}}/g, 'Prénom');
  content = content.replace(/{{email}}/g, 'email@example.com');
  content = content.replace(/{{author_name}}/g, 'William Peres');
  content = content.replace(/{{author_role}}/g, 'CEO');

  // Specific replacements
  switch (templateKey) {
    case 'VISIONARY':
      content = content.replace(/{{subtitle_1}}/g, 'Partie 1 : Le Contexte Actuel');
      content = content.replace(/{{subtitle_2}}/g, 'Partie 2 : Notre Vision du Futur');
      content = content.replace(/{{key_quote}}/g, '« Ceci est une citation percutante qui résume notre pensée stratégique. »');
      break;
    case 'PRODUCT_FOCUS':
      content = content.replace(/{{hero_image_url}}/g, 'https://via.placeholder.com/600x300.png/111827/FFFFFF?text=Visuel+Produit');
      content = content.replace(/{{benefit_1}}/g, 'Premier bénéfice clé du produit.');
      content = content.replace(/{{benefit_2}}/g, 'Deuxième avantage concurrentiel.');
      content = content.replace(/{{benefit_3}}/g, 'Troisième point fort à retenir.');
      break;
    case 'SOCIAL_PROOF':
      content = content.replace(/{{customer_quote}}/g, '« Travailler avec eux a transformé notre approche. Les résultats ont dépassé nos attentes. »');
      content = content.replace(/{{customer_name}}/g, 'Jean Dupont');
      content = content.replace(/{{customer_role}}/g, 'Directeur Innovation');
      content = content.replace(/{{kpi_1_value}}/g, '+40%');
      content = content.replace(/{{kpi_1_label}}/g, 'd\'Engagement');
      content = content.replace(/{{kpi_2_value}}/g, '-25%');
      content = content.replace(/{{kpi_2_label}}/g, 'de Coûts');
      content = content.replace(/{{kpi_3_value}}/g, 'x3');
      content = content.replace(/{{kpi_3_label}}/g, 'ROI');
      break;
    case 'INVITATION':
      content = content.replace(/{{event_type}}/g, 'Webinaire Exclusif');
      content = content.replace(/{{event_title}}/g, 'Le Futur de l\'Apprentissage Immersif');
      content = content.replace(/{{event_subtitle}}/g, 'Rejoignez-nous pour une session interactive où nous explorerons les prochaines tendances.');
      content = content.replace(/{{event_date}}/g, '25 Déc. 2025');
      content = content.replace(/{{event_time}}/g, '11h00 CET');
      content = content.replace(/{{event_duration}}/g, '45 Min');
      content = content.replace(/{{benefit_1}}/g, 'Comprendre les enjeux de l\'IA dans la formation.');
      content = content.replace(/{{benefit_2}}/g, 'Découvrir des cas d\'usage concrets.');
      content = content.replace(/{{benefit_3}}/g, 'Poser vos questions à nos experts.');
      break;
  }
  
  return content;
};


const EmailCampaignGenerator: React.FC<EmailCampaignGeneratorProps> = ({ generatedEmails, isGenerating, activeTab, previewTemplateKey, onEmailUpdate }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const targetImageRef = useRef<HTMLImageElement | null>(null);

  const [selectionFormat, setSelectionFormat] = useState({
    bold: false, italic: false, underline: false, strikethrough: false,
    subscript: false, superscript: false, ul: false, ol: false,
    justifyLeft: true, justifyCenter: false, justifyRight: false, justifyFull: false,
    fontName: 'Helvetica', fontSize: '3',
  });
  
  const isEditMode = generatedEmails.length > 0 && !isGenerating && !previewTemplateKey;
  
  const checkFormat = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !isEditMode || doc.designMode !== 'on') return;

    try {
      setSelectionFormat({
        bold: doc.queryCommandState('bold'),
        italic: doc.queryCommandState('italic'),
        underline: doc.queryCommandState('underline'),
        strikethrough: doc.queryCommandState('strikethrough'),
        subscript: doc.queryCommandState('subscript'),
        superscript: doc.queryCommandState('superscript'),
        ul: doc.queryCommandState('insertUnorderedList'),
        ol: doc.queryCommandState('insertOrderedList'),
        justifyLeft: doc.queryCommandState('justifyLeft'),
        justifyCenter: doc.queryCommandState('justifyCenter'),
        justifyRight: doc.queryCommandState('justifyRight'),
        justifyFull: doc.queryCommandState('justifyFull'),
        fontName: doc.queryCommandValue('fontName').replace(/['"]/g, ''),
        fontSize: doc.queryCommandValue('fontSize'),
      });
    } catch (error) {
      console.error("Error checking format:", error);
    }
  }, [isEditMode]);

  const handleFormat = useCallback((command: string, value: string | null = null) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument || !iframe.contentWindow) return;

    iframe.contentWindow.focus();
    const doc = iframe.contentDocument;
    
    if (doc.designMode !== 'on') return;

    if (command === 'increaseFontSize' || command === 'decreaseFontSize') {
        const currentSizeStr = doc.queryCommandValue('fontSize');
        let currentSize = currentSizeStr ? parseInt(currentSizeStr, 10) : 3;
        if (isNaN(currentSize)) {
            currentSize = 3;
        }
        const newSize = command === 'increaseFontSize' ? Math.min(7, currentSize + 1) : Math.max(1, currentSize - 1);
        doc.execCommand('fontSize', false, String(newSize));
    } else {
        doc.execCommand(command, false, value);
    }
    
    checkFormat();
  }, [checkFormat]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetImageRef.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (targetImageRef.current) {
          targetImageRef.current.src = reader.result as string;
          if (iframeRef.current?.contentDocument) {
            onEmailUpdate(activeTab, iframeRef.current.contentDocument.documentElement.outerHTML);
          }
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }, [activeTab, onEmailUpdate]);
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let doc: Document | null = null;
    let win: Window | null = null;

    const handleUpdate = () => {
        if (doc && doc.designMode === 'on') {
            onEmailUpdate(activeTab, doc.documentElement.outerHTML);
        }
    };

    const handleClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLImageElement) {
            e.preventDefault();
            targetImageRef.current = e.target;
            imageUploadInputRef.current?.click();
        }
        checkFormat();
    };

    const setupEditor = () => {
        if (!iframe.contentWindow || !iframe.contentDocument) return;
        doc = iframe.contentDocument;
        win = iframe.contentWindow;

        if (isEditMode) {
            doc.designMode = 'on';
            doc.addEventListener('selectionchange', checkFormat);
            doc.addEventListener('keyup', checkFormat);
            doc.addEventListener('click', handleClick);
            win.addEventListener('blur', handleUpdate);
        } else {
            if (doc.designMode === 'on') {
                doc.designMode = 'off';
            }
        }
    };

    const cleanupEditor = () => {
        if (doc) {
            doc.removeEventListener('selectionchange', checkFormat);
            doc.removeEventListener('keyup', checkFormat);
            doc.removeEventListener('click', handleClick);
        }
        if (win) {
            win.removeEventListener('blur', handleUpdate);
        }
    };

    iframe.addEventListener('load', setupEditor);

    return () => {
        iframe.removeEventListener('load', setupEditor);
        cleanupEditor();
    };
}, [isEditMode, activeTab, onEmailUpdate, checkFormat]);


  const ToolbarButton: React.FC<{ command: string; icon: React.ReactNode; title: string; active?: boolean; disabled?: boolean }> = ({ command, icon, title, active, disabled }) => (
    <button 
      onMouseDown={e => {
        e.preventDefault();
        if (!disabled) handleFormat(command);
      }}
      disabled={disabled}
      className={`p-2.5 rounded-md text-slate-800 dark:text-slate-300 transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-white/10'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      title={title}
    >
      {icon}
    </button>
  );

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <Lucide.Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
          <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-500">GÉNÉRATION DE LA CAMPAGNE EN COURS...</p>
          <p className="text-slate-400 mt-2">L'IA rédige les 3 emails. Cette opération peut prendre une minute.</p>
        </div>
      );
    }
    
    const emailContent = previewTemplateKey ? generateFakeContent(previewTemplateKey) : (generatedEmails[activeTab] || '');

    if (!emailContent) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="w-24 h-24 bg-blue-600/10 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
            <Lucide.Mails className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-[0.4em] max-w-sm mx-auto">Prêt à générer votre campagne d'emailing.</p>
          <p className="text-slate-400 mt-2 max-w-md">Utilisez le menu déroulant pour prévisualiser un template, ou cliquez sur ⚡️ pour lancer la génération des 3 emails.</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col h-full bg-slate-200 dark:bg-[#111827]">
        {isEditMode && (
           <div className="bg-slate-200 dark:bg-[#1e293b] border-b border-slate-300 dark:border-slate-800 shrink-0 z-10 shadow-md overflow-x-auto no-scrollbar">
             <div className="p-2 flex items-center justify-start md:justify-center gap-2 min-w-max">
               <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#2B3245] rounded-xl p-1 border border-slate-200/40 dark:border-slate-700/40">
                  <CustomSelect
                      widthClass='w-32'
                      title="Police de caractères"
                      options={FONT_LIST.map(font => ({ label: font, value: font }))}
                      value={selectionFormat.fontName}
                      displayValue={selectionFormat.fontName || 'Helvetica'}
                      onChange={value => handleFormat('fontName', value)}
                  />
                  <CustomSelect
                      widthClass='w-24'
                      title="Taille de police"
                      options={FONT_SIZES.map(s => ({ label: s.name, value: s.value }))}
                      value={selectionFormat.fontSize}
                      displayValue={FONT_SIZES.find(s => s.value === selectionFormat.fontSize)?.name || '16px'}
                      onChange={value => handleFormat('fontSize', value)}
                  />
                  <ToolbarButton command="increaseFontSize" icon={<FontSizeUpIcon className="w-5 h-5" />} title="Augmenter la taille" />
                  <ToolbarButton command="decreaseFontSize" icon={<FontSizeDownIcon className="w-5 h-5" />} title="Diminuer la taille" />
               </div>
               <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />
               <div className="flex items-center bg-slate-100 dark:bg-[#2B3245] rounded-xl p-1 border border-slate-200/40 dark:border-slate-700/40">
                  <ToolbarButton command="bold" icon={<Lucide.Bold className="w-5 h-5" />} title="Gras (Ctrl+B)" active={selectionFormat.bold} />
                  <ToolbarButton command="italic" icon={<Lucide.Italic className="w-5 h-5" />} title="Italique (Ctrl+I)" active={selectionFormat.italic} />
                  <ToolbarButton command="underline" icon={<Lucide.Underline className="w-5 h-5" />} title="Souligné (Ctrl+U)" active={selectionFormat.underline} />
                  <ToolbarButton command="strikethrough" icon={<Lucide.Strikethrough className="w-5 h-5" />} title="Barré" active={selectionFormat.strikethrough} />
                  <ToolbarButton command="subscript" icon={<Lucide.Subscript className="w-5 h-5" />} title="Indice" active={selectionFormat.subscript} />
                  <ToolbarButton command="superscript" icon={<Lucide.Superscript className="w-5 h-5" />} title="Exposant" active={selectionFormat.superscript} />
               </div>
               <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />
               <div className="flex items-center bg-slate-100 dark:bg-[#2B3245] rounded-xl p-1 border border-slate-200/40 dark:border-slate-700/40">
                  <div className="relative p-2.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/10" title="Couleur de surlignage">
                      <Lucide.Highlighter className="w-5 h-5 text-slate-800 dark:text-slate-300" />
                      <input type="color" onMouseDown={e => e.preventDefault()} onChange={e => handleFormat('hiliteColor', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  <div className="relative p-2.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/10" title="Couleur du texte">
                      <Lucide.Palette className="w-5 h-5 text-slate-800 dark:text-slate-300" />
                      <input type="color" onMouseDown={e => e.preventDefault()} onChange={e => handleFormat('foreColor', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
               </div>
               <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />
               <div className="flex items-center bg-slate-100 dark:bg-[#2B3245] rounded-xl p-1 border border-slate-200/40 dark:border-slate-700/40">
                  <ToolbarButton command="insertUnorderedList" icon={<Lucide.List className="w-5 h-5" />} title="Liste à puces" active={selectionFormat.ul} />
                  <ToolbarButton command="insertOrderedList" icon={<Lucide.ListOrdered className="w-5 h-5" />} title="Liste numérotée" active={selectionFormat.ol} />
               </div>
               <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />
               <div className="flex items-center bg-slate-100 dark:bg-[#2B3245] rounded-xl p-1 border border-slate-200/40 dark:border-slate-700/40">
                  <ToolbarButton command="justifyLeft" icon={<Lucide.AlignLeft className="w-5 h-5" />} title="Aligner à gauche" active={selectionFormat.justifyLeft} />
                  <ToolbarButton command="justifyCenter" icon={<Lucide.AlignCenter className="w-5 h-5" />} title="Centrer" active={selectionFormat.justifyCenter} />
                  <ToolbarButton command="justifyRight" icon={<Lucide.AlignRight className="w-5 h-5" />} title="Aligner à droite" active={selectionFormat.justifyRight} />
                  <ToolbarButton command="justifyFull" icon={<Lucide.AlignJustify className="w-5 h-5" />} title="Justifier" active={selectionFormat.justifyFull} />
               </div>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-4 shrink-0 pr-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Mode Édition
               </p>
             </div>
           </div>
        )}
        {previewTemplateKey && (
             <div className="p-2 text-center bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold shrink-0">
               Mode Prévisualisation (non éditable)
             </div>
        )}
        <div className="flex-1 p-4 min-h-0">
          <iframe
            key={`${activeTab}-${previewTemplateKey}`}
            ref={iframeRef}
            srcDoc={emailContent}
            title={`Aperçu Email ${activeTab + 1}`}
            className="w-full h-full bg-white rounded-lg border border-slate-300 dark:border-slate-700 shadow-lg"
          />
        </div>
        <input type="file" ref={imageUploadInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      {renderContent()}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default EmailCampaignGenerator;
