
import React from 'react';
import * as Lucide from 'lucide-react';
import { CarouselSlide } from '../types';

export const THEMES = {
  seriousDark: {
    bg: "bg-slate-950",
    headerBg: "bg-black",
    text: "text-white",
    accent: "text-blue-500",
    bgAccent: "bg-blue-600",
    glowColor: "rgba(37, 99, 235, 0.4)",
    borderColor: "border-blue-500",
    problemBox: "bg-red-900/20 border-l-[12px] border-red-500",
    solutionBox: "bg-emerald-900/20 border-l-[12px] border-emerald-500",
    genericBox: "bg-slate-800/40 border-l-[12px] border-blue-500",
    gradient: "from-slate-900 to-black"
  },
  techBlue: {
    bg: "bg-[#0f172a]",
    headerBg: "bg-black",
    text: "text-white",
    accent: "text-cyan-400",
    bgAccent: "bg-cyan-600",
    glowColor: "rgba(8, 145, 178, 0.4)",
    borderColor: "border-cyan-500",
    problemBox: "bg-slate-800/50 border border-slate-600",
    solutionBox: "bg-cyan-950/40 border border-cyan-500/50",
    genericBox: "bg-slate-800/50 border border-cyan-500",
    gradient: "from-blue-950 to-slate-900"
  },
  lightPro: {
    bg: "bg-slate-50",
    headerBg: "bg-black",
    text: "text-slate-900",
    accent: "text-blue-700",
    bgAccent: "bg-blue-700",
    glowColor: "rgba(29, 78, 216, 0.2)",
    borderColor: "border-blue-700",
    problemBox: "bg-white border-2 border-gray-200 shadow-lg",
    solutionBox: "bg-blue-50 border-2 border-blue-200 shadow-lg",
    genericBox: "bg-white border-2 border-blue-200 shadow-lg",
    gradient: "from-gray-100 to-white"
  }
};

const renderSafeText = (val: any): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.text || val.content || val.value || "";
  }
  return String(val);
};

const getDynamicFontSize = (text: string | undefined, baseClass: string, smallClass: string, smallerClass: string, smallestClass: string) => {
    if (!text) return baseClass;
    const len = renderSafeText(text).length;
    if (len < 100) return baseClass;
    if (len < 180) return smallClass;
    if (len < 250) return smallerClass;
    return smallestClass;
};

export const SlideHeader = ({ t, customLogo }: { t: any; customLogo: string | null }) => (
  <div className={`h-[200px] shrink-0 ${t.headerBg} flex items-center justify-between px-[60px] relative overflow-hidden border-b border-white/5`}>
    <div className="z-10 h-[130px] flex items-center">
      {customLogo ? (
        <img src={customLogo} alt="Logo" className="h-full w-auto object-contain" />
      ) : (
        <div className="flex items-center justify-center border-4 border-dashed border-white/30 w-[180px] h-[100px] rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <Lucide.Upload size={24} className="text-white/30" />
            <span className="text-white/30 text-sm font-bold uppercase tracking-wide">Logo</span>
          </div>
        </div>
      )}
    </div>
    <div className="h-[60px] w-2 bg-white/20 rounded-full z-10" />
  </div>
);

export const SlideFooter = ({ textLeft, textRight }: { textLeft: string; textRight: string }) => (
  <div className="h-[100px] shrink-0 flex items-center justify-between px-[60px] opacity-40 border-t border-white/10 text-[24px] uppercase tracking-widest font-bold">
    <span>{textLeft}</span><span>{textRight}</span>
  </div>
);

export const SlideComponent: React.FC<{ 
  data: CarouselSlide; 
  t: any; 
  progress: number; 
  authorName: string; 
  authorRole: string; 
  customLogo: string | null; 
  authorPhoto: string | null;
  themeKey: string;
}> = ({ data, t, progress, authorName, authorRole, customLogo, authorPhoto, themeKey }) => {
  if (!data) return null;
  
  const style = { width: 1080, height: 1350 };
  const baseClass = `relative flex flex-col overflow-hidden font-sans ${t.text} ${t.bg} bg-gradient-to-br ${t.gradient} select-none`;
  const getSafeArray = (arr: any, fallback: any[] = []) => Array.isArray(arr) ? arr : fallback;

  if (data.type === 'cover') {
    const fullTitle = renderSafeText(data.title);
    let titleTop = renderSafeText(data.title_top);
    let titleAccent = renderSafeText(data.title_accent);
    let titleBottom = renderSafeText(data.title_bottom);

    if (!titleTop && !titleAccent && fullTitle) {
      const words = fullTitle.split(' ');
      if (words.length === 1) { titleAccent = words[0]; } 
      else if (words.length <= 3) { titleTop = words[0]; titleAccent = words.slice(1).join(' '); } 
      else { const splitPoint = Math.ceil(words.length / 2); titleTop = words.slice(0, splitPoint).join(' '); titleAccent = words.slice(splitPoint).join(' '); }
    }
    
    const accentClass = (titleAccent.length > 12) ? 'text-[80px]' : (titleAccent.length > 8 ? 'text-[100px]' : 'text-[120px]');

    return (
      <div className={baseClass} style={style}>
        <div className="absolute top-[-120px] right-[-320px] w-[1200px] h-[1200px] pointer-events-none opacity-100 z-0" style={{ background: `radial-gradient(circle, ${t.glowColor} 0%, ${t.glowColor.replace('0.4', '0.15')} 50%, rgba(0,0,0,0) 70%)`, borderRadius: '50%' }} />
        <SlideHeader t={t} customLogo={customLogo} />
        <div className="w-full bg-white/10 h-4 shrink-0 z-10"><div className={`h-full ${t.bgAccent}`} style={{ width: `0%` }} /></div>
        <div className="flex-1 p-[80px] flex flex-col justify-center relative z-10">
          <div className="mb-[50px] flex items-start"><div className={`flex items-center justify-center px-8 py-3 border-4 ${t.borderColor} ${t.accent} rounded-full bg-black/40`}><span className="text-2xl font-bold uppercase tracking-[0.25em]">{renderSafeText(data.badge) || "GUIDE EXPERT"}</span></div></div>
          <div className="relative z-10 flex flex-col gap-4 mb-4">
            <div className="text-[90px] font-black uppercase tracking-tight leading-none">{titleTop || "DÉCOUVRIR"}</div>
            <div className={`${accentClass} font-black uppercase tracking-tight ${t.accent} drop-shadow-lg leading-none`}>{titleAccent || "VOTRE SUJET"}</div>
            {titleBottom && <div className="text-[80px] font-black uppercase tracking-tight opacity-90 leading-none">{titleBottom}</div>}
          </div>
          <div className="relative z-10 my-8"><div style={{ width: '220px', height: '8px', backgroundColor: themeKey === 'lightPro' ? '#1d4ed8' : (themeKey === 'techBlue' ? '#0891b2' : '#2563eb') }} /></div>
          <p className="text-[32px] font-medium opacity-80 italic leading-relaxed mb-[60px] relative z-10 max-w-[90%]">{renderSafeText(data.subtitle) || "Le guide stratégique pour vos décisions."}</p>
          <div className="mt-auto flex items-center gap-6 relative z-10">
            <div className={`w-[120px] h-[120px] rounded-3xl overflow-hidden flex-shrink-0 flex items-center justify-center ${!authorPhoto ? 'bg-black/40 border border-white/20' : ''}`}>{authorPhoto ? <img src={authorPhoto} className="w-full h-full object-cover" /> : <Lucide.User size={40} className="text-white/20" />}</div>
            <div className="flex flex-col justify-center"><p className="text-[34px] font-bold uppercase tracking-wide leading-tight mb-1">{authorName || renderSafeText(data.author) || "Serious Factory"}</p><p className="text-[26px] opacity-70 leading-tight">{authorRole || renderSafeText(data.role) || "Expert Marketing"}</p></div>
          </div>
        </div>
        <SlideFooter textLeft="Serious Factory" textRight="Marketing Studio" />
      </div>
    );
  }

  if (data.type === 'outro') {
    return (
      <div className={baseClass} style={style}>
        <SlideHeader t={t} customLogo={customLogo} />
        <div className="w-full bg-white/10 h-4 shrink-0"><div className={`h-full ${t.bgAccent}`} style={{ width: `100%` }} /></div>
        <div className="flex-1 p-[80px] flex flex-col justify-center items-center text-center relative z-10">
          <div className={`mb-[60px] p-[45px] rounded-full ${t.bgAccent} bg-opacity-20 ring-4 ring-white/20`}><Lucide.Zap size={140} className={t.accent} strokeWidth={1.5} /></div>
          <h2 className="text-[70px] font-black mb-[35px] uppercase leading-tight">{renderSafeText(data.title) || "Conclusion"}</h2>
          <p className="text-[38px] leading-relaxed font-medium opacity-80 mb-[55px] max-w-[80%]">{renderSafeText(data.content) || "Prêt à transformer votre stratégie ?"}</p>
          <div className={`w-full py-[45px] ${t.bgAccent} text-white text-[32px] font-bold rounded-3xl shadow-2xl uppercase tracking-[0.2em]`}>{renderSafeText(data.cta) || "PASSEZ À L'ACTION"}</div>
        </div>
        <SlideFooter textLeft="Serious Factory" textRight="Conclusion" />
      </div>
    );
  }

  const renderContentLayout = () => {
    switch(data.layout) {
      case 'problem-solution-stacked':
        return (
          <>
             <div className={`flex-1 p-[50px] rounded-[40px] ${t.problemBox} flex flex-col justify-center`}>
                <span className="text-[28px] font-bold uppercase tracking-wider text-red-400 mb-4">{renderSafeText(data.problemLabel) || "LE PROBLÈME"}</span>
                <p className={`${getDynamicFontSize(data.problem, 'text-[38px]', 'text-[34px]', 'text-[30px]', 'text-[28px]')} font-medium leading-tight ${themeKey === 'lightPro' ? 'text-gray-800' : 'text-gray-100'}`}>{renderSafeText(data.problem) || "Un défi complexe sans solution évidente."}</p>
             </div>
             <div className="flex justify-center -my-[40px] z-20"><div className={`bg-white dark:bg-slate-800 rounded-full p-5 shadow-xl border-4 ${themeKey === 'lightPro' ? 'border-gray-200' : 'border-slate-600'}`}><Lucide.ArrowDown size={50} className={t.accent} /></div></div>
             <div className={`flex-1 p-[50px] rounded-[40px] ${t.solutionBox} flex flex-col justify-center`}>
                <span className={`text-[28px] font-bold uppercase tracking-wider ${t.accent} mb-4`}>{renderSafeText(data.solutionLabel) || "LA SOLUTION"}</span>
                <p className={`${getDynamicFontSize(data.solution, 'text-[38px]', 'text-[34px]', 'text-[30px]', 'text-[28px]')} font-bold leading-tight ${themeKey === 'lightPro' ? 'text-gray-900' : 'text-white'}`}>{renderSafeText(data.solution) || "L'approche innovante de Serious Factory."}</p>
             </div>
          </>
        );
      case 'statistics':
        return (
          <div className="flex-1 flex flex-col items-center justify-center gap-10">
            <div className={`text-[280px] font-black ${t.accent} leading-none tracking-tighter drop-shadow-2xl`}>{renderSafeText(data.statValue) || "50%"}</div>
            <div className={`${getDynamicFontSize(data.statLabel, 'text-[64px]', 'text-[50px]', 'text-[40px]', 'text-[32px]')} text-center font-bold uppercase tracking-widest opacity-80 bg-white/5 px-10 py-3 rounded-full border border-white/10 leading-tight`}>{renderSafeText(data.statLabel) || "D'IMPACT"}</div>
            <p className="text-[44px] text-center max-w-[85%] opacity-80 leading-relaxed mt-8">{renderSafeText(data.description) || "Une performance mesurable sur vos objectifs."}</p>
          </div>
        );
      case 'checklist':
        return (
           <div className={`flex-1 p-[60px] rounded-[50px] ${t.genericBox} flex flex-col justify-center`}>
             <ul className="flex flex-col gap-10">
               {getSafeArray(data.items, ["Point clé 1", "Point clé 2", "Point clé 3"]).map((item, idx) => (
                 <li key={idx} className="flex items-start gap-8">
                   <div className={`mt-2 p-1.5 rounded-full ${t.bgAccent} flex-shrink-0 shadow-lg`}><Lucide.Check size={36} className="text-white"/></div>
                   <span className={`${getDynamicFontSize(renderSafeText(item), 'text-[42px]', 'text-[38px]', 'text-[34px]', 'text-[32px]')} font-medium leading-tight ${themeKey==='lightPro'?'text-slate-800':'text-white'}`}>{renderSafeText(item)}</span>
                 </li>
               ))}
             </ul>
           </div>
        );
      case 'steps':
      case 'timeline':
        const stepsData = getSafeArray(data.steps, [{title: "Étape 1", text: "Début du processus"}]);
        return (
          <div className="flex-1 flex gap-6 items-stretch">
            {stepsData.map((step: any, idx: number) => (
              <div key={idx} className={`flex-1 rounded-[32px] p-8 flex flex-col border ${themeKey==='lightPro'?'border-gray-200 bg-white shadow-lg':'border-white/10 bg-white/5'} relative overflow-hidden`}>
                <div className={`absolute -right-6 -top-6 text-[140px] font-black opacity-[0.07] ${t.text}`}>{renderSafeText(step?.date || step?.num || idx + 1)}</div>
                <div className={`w-16 h-16 rounded-full ${t.bgAccent} flex items-center justify-center text-[28px] font-black mb-10 relative z-10 shadow-xl`}>{renderSafeText(step?.date || step?.num || idx + 1)}</div>
                <h3 className={`text-[36px] font-bold uppercase mb-6 leading-tight ${t.accent}`}>{renderSafeText(step?.title || "Étape")}</h3>
                <p className="text-[26px] opacity-80 leading-snug">{renderSafeText(step?.text || "Description de l'action à mener.")}</p>
              </div>
            ))}
          </div>
        );
      case 'myth-reality':
        return (
          <div className="flex-1 flex flex-col gap-8">
             <div className={`flex-1 p-[50px] rounded-[40px] bg-red-900/10 border-l-[15px] border-red-500 flex flex-col justify-center shadow-lg`}>
                <div className="flex items-center gap-5 mb-6 text-red-500"><Lucide.XCircle size={45} /><span className="text-[34px] font-black uppercase tracking-widest">Mythe</span></div>
                <p className={`${getDynamicFontSize(data.myth, 'text-[40px]', 'text-[36px]', 'text-[32px]', 'text-[28px]')} font-medium leading-tight italic opacity-70 ${themeKey==='lightPro'?'text-gray-800':'text-red-100'}`}>{renderSafeText(data.myth) || "L'idée reçue la plus commune."}</p>
             </div>
             <div className={`flex-1 p-[50px] rounded-[40px] ${t.solutionBox} flex flex-col justify-center shadow-2xl`}>
                <div className={`flex items-center gap-5 mb-6 ${t.accent}`}><Lucide.CheckCircle size={45} /><span className="text-[34px] font-black uppercase tracking-widest">Réalité</span></div>
                <p className={`${getDynamicFontSize(data.reality, 'text-[44px]', 'text-[40px]', 'text-[36px]', 'text-[32px]')} font-black leading-tight ${themeKey==='lightPro'?'text-gray-900':'text-white'}`}>{renderSafeText(data.reality) || "La vérité terrain prouvée."}</p>
             </div>
          </div>
        );
      case 'visual-block':
        return (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-[620px] border-[5px] border-dashed border-white/20 rounded-[50px] flex flex-col items-center justify-center bg-black/20 text-white/40 mb-10 overflow-hidden relative shadow-inner">
              {data.imageUrl ? <img src={data.imageUrl} className="w-full h-full object-cover" /> : <><Lucide.Image size={120} className="opacity-30" /><p className="text-3xl mt-6 font-black uppercase tracking-[0.2em] text-center px-16 opacity-30">{renderSafeText(data.description) || "VISUEL IA"}</p></>}
            </div>
            <div className="px-8 py-3 bg-white/5 rounded-full text-[26px] font-bold tracking-wider opacity-60">{renderSafeText(data.caption) || "Représentation conceptuelle"}</div>
          </div>
        );
      case '3-insights':
        const pointsData = getSafeArray(data.points, [{title: "Insight 1", text: "Premier point clé"}, {title: "Insight 2", text: "Deuxième point clé"}, {title: "Insight 3", text: "Troisième point clé"}]);
        return (
          <div className="flex-1 flex flex-col gap-8">
            {pointsData.map((pt: any, idx: number) => (
              <div key={idx} className={`flex-1 rounded-[40px] p-10 flex items-center gap-10 ${themeKey==='lightPro'?'bg-white shadow-2xl border border-gray-100':'bg-white/5 border border-white/10'} shadow-lg group`}>
                 <div className={`text-[80px] font-black ${t.accent} opacity-30`}>0{idx+1}</div>
                 <div className="flex-1"><h3 className="text-[40px] font-black uppercase mb-2 leading-none">{renderSafeText(pt?.title) || "POINT CLÉ"}</h3><p className="text-[30px] opacity-70 leading-tight">{renderSafeText(pt?.text) || "Description de l'insight stratégique."}</p></div>
              </div>
            ))}
          </div>
        );
      case 'big-quote':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-16 relative">
            <Lucide.Quote className={`absolute top-0 left-10 w-48 h-48 ${t.accent} opacity-10`} />
            <p className={`${getDynamicFontSize(data.quote, 'text-[65px]', 'text-[55px]', 'text-[48px]', 'text-[40px]')} font-serif italic font-bold leading-tight mb-12 relative z-10 ${themeKey==='lightPro'?'text-gray-800':'text-white'} drop-shadow-sm`}>{renderSafeText(data.quote) || "La vision est l'art de voir les choses invisibles."}</p>
            <div className={`w-40 h-2 ${t.bgAccent} mb-8 rounded-full`} />
            <p className="text-[38px] font-black uppercase tracking-[0.3em] opacity-60">{renderSafeText(data.author) || "Expert Serious Factory"}</p>
          </div>
        );
      case 'comparative':
        const compItems = getSafeArray(data.comparativeItems || data.items, [{left: "Avant", right: "Après"}]);
        return (
          <div className="flex-1 flex flex-col mt-6">
            <div className="flex mb-10 px-4">
               <div className="flex-1 text-center text-[34px] font-black opacity-40 uppercase tracking-[0.2em]">{renderSafeText(data.colLeft) || "TRADITIONNEL"}</div>
               <div className={`flex-1 text-center text-[34px] font-black uppercase tracking-[0.2em] ${t.accent}`}>{renderSafeText(data.colRight) || "INNOVANT"}</div>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              {compItems.map((item: any, idx: number) => (
                <div key={idx} className="flex items-stretch min-h-[120px] shadow-lg">
                  <div className={`flex-1 flex items-center justify-center p-8 text-center text-[30px] font-bold ${themeKey==='lightPro'?'bg-gray-200 text-gray-700':'bg-white/5 text-gray-300'} rounded-l-[30px]`}>{renderSafeText(item?.left || item)}</div>
                  <div className={`flex-1 flex items-center justify-center p-8 text-center text-[30px] font-black ${t.bgAccent} text-white rounded-r-[30px] shadow-xl`}>{renderSafeText(item?.right || item)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'definition':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className={`mb-8 p-8 rounded-full ${t.bgAccent} bg-opacity-10 ring-4 ring-white/10`}><Lucide.BookOpen size={90} className={t.accent} /></div>
            <h2 className="text-[95px] font-black leading-none mb-6 tracking-tighter drop-shadow-xl">{renderSafeText(data.word) || "CONCEPT"}</h2>
            <p className="text-[32px] font-serif italic opacity-60 mb-8">({renderSafeText(data.wordType) || "Nom commun"})</p>
            <div className={`w-32 h-2 ${t.bgAccent} mb-8 rounded-full`} />
            <p className={`${getDynamicFontSize(data.definition, 'text-[38px]', 'text-[34px]', 'text-[30px]', 'text-[26px]')} font-bold leading-relaxed max-w-[95%] ${themeKey==='lightPro'?'text-gray-800':'text-gray-100'}`}>{renderSafeText(data.definition) || "Explication précise et claire du terme employé."}</p>
          </div>
        );
      case 'code-snippet':
        return (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-[950px] bg-[#1e1e1e] rounded-[30px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-gray-700">
              <div className="bg-[#2d2d2d] px-10 py-5 flex items-center gap-3 border-b border-gray-700"><div className="w-4 h-4 rounded-full bg-red-500"></div><div className="w-4 h-4 rounded-full bg-yellow-500"></div><div className="w-4 h-4 rounded-full bg-green-500"></div><div className="ml-8 text-xl text-gray-400 font-mono flex items-center gap-3"><Lucide.Terminal size={20}/> {renderSafeText(data.language) || "Logic"}</div></div>
              <div className="p-12 font-mono text-[28px] text-emerald-400 leading-relaxed whitespace-pre-wrap">{data.comment && <div className="text-gray-500 mb-6 italic">{renderSafeText(data.comment)}</div>}{renderSafeText(data.code) || "// Logique applicative"}</div>
            </div>
          </div>
        );
      default:
        const mainContent = renderSafeText(data.content || data.title);
        return (
          <div className={`flex-1 p-[70px] rounded-[50px] ${t.genericBox} flex flex-col justify-center items-center text-center shadow-2xl`}>
             <p className={`${getDynamicFontSize(mainContent, 'text-[48px]', 'text-[42px]', 'text-[36px]', 'text-[30px]')} font-bold leading-tight whitespace-pre-wrap`}>
                {mainContent || "Focus stratégique sur ce point clé pour votre réussite."}
             </p>
          </div>
        );
    }
  };

  return (
    <div className={baseClass} style={style}>
      <SlideHeader t={t} customLogo={customLogo} />
      <div className="w-full bg-white/10 h-4 shrink-0"><div className={`h-full ${t.bgAccent} transition-all duration-700`} style={{ width: `${progress}%` }} /></div>
      <div className="flex-1 p-[80px] flex flex-col relative overflow-hidden">
        <span className="absolute top-[20px] right-[40px] text-[400px] font-black opacity-[0.05] pointer-events-none select-none leading-none">{renderSafeText(data.number)}</span>
        <div className="mb-[60px] mt-[20px] relative z-10">
          <span className="text-[28px] font-black uppercase tracking-[0.3em] opacity-60 bg-black/20 px-6 py-2 rounded-xl border border-white/5">
            {renderSafeText(data.badge) || `POINT #${data.number ? Number(data.number) - 1 : ''}`}
          </span>
          <h2 className="text-[85px] font-black uppercase leading-[0.9] mt-[40px] tracking-tighter">
            {renderSafeText(data.title) || "Vision Stratégique"}
          </h2>
        </div>
        <div className="flex-1 flex flex-col relative z-10">{renderContentLayout()}</div>
      </div>
      <SlideFooter textLeft="Serious Factory" textRight={data.number != null ? `Slide ${data.number}` : ''} />
    </div>
  );
};
