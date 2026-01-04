
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { Task, CarouselSlide } from '../types';
import { THEMES, SlideComponent } from './CarouselSlides';

interface CarouselGeneratorProps {
  task: Task;
  initialSlides: CarouselSlide[];
  onClose: () => void;
  onShowToast: (m: string) => void;
  embedded?: boolean;
  authorName?: string;
  authorRole?: string;
  customLogo?: string | null;
  authorPhoto?: string | null;
  themeKey?: 'seriousDark' | 'techBlue' | 'lightPro';
  viewMode?: 'single' | 'grid';
  setViewMode?: (v: 'single' | 'grid') => void;
}

const CarouselGenerator: React.FC<CarouselGeneratorProps> = ({ 
  initialSlides, authorName = "William PERES", authorRole = "CEO Serious Factory", customLogo, authorPhoto,
  themeKey = 'seriousDark', viewMode = 'single', setViewMode
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [baseScale, setBaseScale] = useState(0.4);
  const [userZoom, setUserZoom] = useState(1);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const zoomTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeKey];

  const touchStartDistRef = useRef<number | null>(null);

  const updateScale = useCallback(() => {
    if (viewMode === 'single' && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const margin = 40; 
      const availableWidth = clientWidth - margin;
      const availableHeight = clientHeight - margin;
      
      const scaleW = availableWidth / 1080;
      const scaleH = availableHeight / 1350;
      
      const newScale = Math.min(scaleW, scaleH);
      setBaseScale(Math.max(0.1, Math.min(newScale, 0.98)));
    }
  }, [viewMode]);

  const triggerZoomIndicator = () => {
    setShowZoomIndicator(true);
    if (zoomTimeoutRef.current) window.clearTimeout(zoomTimeoutRef.current);
    zoomTimeoutRef.current = window.setTimeout(() => setShowZoomIndicator(false), 1500);
  };

  const handleZoom = useCallback((delta: number) => {
    setUserZoom(prev => {
      const next = Math.max(0.2, Math.min(prev + delta, 4));
      return next;
    });
    triggerZoomIndicator();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'single') return;
      if (e.key === '+' || e.key === '=') { e.preventDefault(); handleZoom(0.1); }
      if (e.key === '-') { e.preventDefault(); handleZoom(-0.1); }
      if (e.key === '0' && e.ctrlKey) { e.preventDefault(); setUserZoom(1); triggerZoomIndicator(); }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    const handleWheel = (e: WheelEvent) => {
      if (viewMode !== 'single' || !e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta);
    };

    window.addEventListener('keydown', handleKeyDown);
    containerRef.current?.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      containerRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [viewMode, handleZoom]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const delta = (dist - touchStartDistRef.current) / 200;
      handleZoom(delta);
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = null;
  };

  useEffect(() => {
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    updateScale();
    return () => observer.disconnect();
  }, [updateScale, initialSlides, currentSlide, viewMode]);

  const total = initialSlides.length;
  const next = () => { setCurrentSlide(prev => (prev + 1) % total); };
  const prev = () => { setCurrentSlide(prev => (prev - 1 + total) % total); };

  if (!initialSlides || initialSlides.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Lucide.Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
            <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500">Initialisation du moteur de rendu...</p>
        </div>
      );
  }

  const finalScale = baseScale * userZoom;

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden select-none touch-none" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 relative">
        {viewMode === 'single' ? (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {showZoomIndicator && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-[10px] font-black text-white flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                <Lucide.Search size={12} className="text-blue-400" />
                ZOOM: {Math.round(userZoom * 100)}%
              </div>
            )}

            <button onClick={prev} className="absolute left-6 p-3 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-3xl rounded-full z-30 border border-slate-200 dark:border-white/10 transition-all text-slate-600 dark:text-white active:scale-90 shadow-2xl" title="Slide précédente">
              <Lucide.ChevronLeft size={22} />
            </button>

            <div style={{ 
              transform: `scale(${finalScale})`, 
              width: 1080, 
              height: 1350, 
              transformOrigin: 'center center', 
              position: 'absolute',
              transition: touchStartDistRef.current ? 'none' : 'transform 0.2s ease-out'
            }} className="shadow-[0_100px_250px_rgba(0,0,0,0.4)] dark:shadow-[0_100px_250px_rgba(0,0,0,0.9)] border border-slate-200 dark:border-white/10 rounded-[40px] overflow-hidden bg-black transition-shadow duration-300">
              <SlideComponent data={initialSlides[currentSlide]} t={theme} progress={total > 1 ? (currentSlide / (total - 1)) * 100 : 0} authorName={authorName} authorRole={authorRole} customLogo={customLogo} authorPhoto={authorPhoto} themeKey={themeKey} />
            </div>

            <button onClick={next} className="absolute right-6 p-3 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-3xl rounded-full z-30 border border-slate-200 dark:border-white/10 transition-all text-slate-600 dark:text-white active:scale-90 shadow-2xl" title="Slide suivante">
              <Lucide.ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-black/80 backdrop-blur-2xl px-8 py-2 rounded-full border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-white/50 z-40 shadow-xl transition-colors duration-300">
               PAGE {currentSlide + 1} / {total}
            </div>
            
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-400 opacity-30 md:hidden">Pincer pour zoomer</div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 justify-items-center no-scrollbar">
             {initialSlides.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center gap-8 group">
                   <div style={{ transform: "scale(0.24)", width: 1080, height: 1350, transformOrigin: "top center", marginBottom: "-1020px" }} className="shadow-2xl border border-slate-200 dark:border-white/5 transition-all group-hover:scale-[0.25] cursor-pointer bg-black rounded-[40px] overflow-hidden" onClick={() => { setCurrentSlide(idx); setViewMode?.('single'); }}>
                      <SlideComponent data={s} t={theme} progress={total > 1 ? (idx / (total - 1)) * 100 : 0} authorName={authorName} authorRole={authorRole} customLogo={customLogo} authorPhoto={authorPhoto} themeKey={themeKey} />
                   </div>
                   <div className="text-slate-400 dark:text-white/20 font-black text-[10px] uppercase tracking-[0.5em] group-hover:text-blue-500 transition-colors">SLIDE {idx + 1}</div>
                </div>
             ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CarouselGenerator;
