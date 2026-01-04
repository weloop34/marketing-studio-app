
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { Task } from '../types';

interface VideoPrompterProps {
  task: Task;
  script: string;
  onClose: () => void;
}

const VideoPrompter: React.FC<VideoPrompterProps> = ({ task, script, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [fontSize, setFontSize] = useState(28);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const renderLoopRef = useRef<number | null>(null);

  // Nettoyage du script pour les sous-titres (retrait des [INDICATIONS])
  const cleanedScriptLines = useRef<string[]>(
    script.replace(/\[.*?\]/g, '').split('\n').map(l => l.trim()).filter(l => l.length > 0)
  );

  const setupCamera = async (newFacingMode?: 'user' | 'environment') => {
    const mode = newFacingMode || facingMode;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      // C'est ici que la demande de permission se produit réellement
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: mode, 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        }, 
        audio: true 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      return s;
    } catch (err) {
      console.error("Erreur caméra:", err);
      alert("Impossible d'accéder à la caméra ou au micro. Vérifiez les permissions.");
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
    };
  }, [stream]);

  const downloadPDF = () => {
    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const title = `Script : ${task.sujet}`;
    const cleanContent = script.replace(/\[.*?\]/g, '');
    
    doc.setFontSize(22);
    doc.text(title, 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Généré par Marketing Studio AI - ${new Date().toLocaleDateString()}`, 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    const splitText = doc.splitTextToSize(cleanContent, 170);
    doc.text(splitText, 20, 45);
    
    doc.save(`Script_${task.sujet.replace(/\s+/g, '_')}.pdf`);
  };

  const startCompositing = useCallback(() => {
    if (!canvasRef.current || !videoRef.current || !scrollRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const renderFrame = () => {
      if (!isRecording && !stream) return;

      ctx.save();
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      if (videoRef.current) ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      if (isRecording && scrollRef.current) {
        const scrollEl = scrollRef.current;
        const totalHeight = scrollEl.scrollHeight;
        const currentScroll = scrollEl.scrollTop;
        
        const progress = currentScroll / (totalHeight || 1);
        const lineIndex = Math.floor(progress * cleanedScriptLines.current.length);
        const activeSubtitle = cleanedScriptLines.current[lineIndex] || "";

        if (activeSubtitle) {
          ctx.font = 'bold 48px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          ctx.fillStyle = 'white';
          
          const maxWidth = canvas.width * 0.8;
          const words = activeSubtitle.split(' ');
          let line = '';
          const lines = [];

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          lines.reverse().forEach((l, i) => {
            ctx.fillText(l.trim(), canvas.width / 2, canvas.height - 80 - (i * 60));
          });
        }
      }

      renderLoopRef.current = requestAnimationFrame(renderFrame);
    };

    renderLoopRef.current = requestAnimationFrame(renderFrame);
  }, [isRecording, stream, facingMode]);

  useEffect(() => {
    let animationFrame: number;
    const scroll = () => {
      if (isRecording && scrollRef.current && isAutoScrolling) {
        scrollRef.current.scrollTop += (scrollSpeed / 4);
      }
      animationFrame = requestAnimationFrame(scroll);
    };
    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [isRecording, scrollSpeed, isAutoScrolling]);

  useEffect(() => {
    if (isRecording) {
      setIsAutoScrolling(true);
      startCompositing();
    } else {
      setIsAutoScrolling(false);
      if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
    }
  }, [isRecording, startCompositing]);

  const toggleCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    // Demande effective au moment de cliquer
    await setupCamera(nextMode);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = async () => {
    let currentStream = stream;
    if (!currentStream) {
      // Demande effective au moment de cliquer
      currentStream = await setupCamera();
    }
    if (!currentStream || !canvasRef.current) return;
    
    const canvasStream = canvasRef.current.captureStream(30); 
    
    const audioTrack = currentStream.getAudioTracks()[0];
    if (audioTrack) {
      canvasStream.addTrack(audioTrack);
    }

    chunksRef.current = [];
    let mimeType = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
    }

    try {
      const recorder = new MediaRecorder(canvasStream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: chunksRef.current[0].type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = chunksRef.current[0].type.includes('mp4') ? 'mp4' : 'webm';
        a.download = `Studio_Subtitled_${task.sujet.replace(/\s+/g, '_')}.${extension}`;
        a.click();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (e) {
      alert("L'enregistrement a échoué sur ce navigateur.");
      console.error(e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAutoScrolling(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-[400] flex flex-col overflow-hidden text-white font-sans">
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
        {!stream && !isRecording && (
            <div className="text-center space-y-4 animate-pulse">
                <Lucide.CameraOff className="w-16 h-16 mx-auto text-white/20" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Caméra inactive • Cliquez pour activer</p>
            </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${stream ? 'opacity-100' : 'opacity-0'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-4xl h-2/3 relative">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 pointer-events-none" />
          
          <div 
            ref={scrollRef}
            className="w-full h-full overflow-y-auto px-10 py-32 text-center scrollbar-hide cursor-ns-resize active:cursor-grabbing select-none"
            style={{ scrollBehavior: 'auto' }}
          >
            <div 
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
              className="font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] whitespace-pre-wrap transition-[font-size] duration-300 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: script.replace(/\n/g, '<br>') }}
            />
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose} 
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/10 transition-all active:scale-95"
            title="Fermer le prompteur"
          >
            <Lucide.X className="w-6 h-6" />
          </button>
          <button 
            onClick={downloadPDF}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/10 transition-all active:scale-95"
            title="Télécharger le script PDF"
          >
            <Lucide.FileText className="w-6 h-6" />
          </button>
          <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-0.5">STUDIO PROMPTEUR</h3>
            <p className="text-sm font-extrabold truncate max-w-[180px]">{task.sujet}</p>
          </div>
        </div>

        {isRecording && (
          <div className="bg-rose-600 px-5 py-2.5 rounded-2xl flex items-center gap-3 animate-pulse shadow-2xl shadow-rose-600/40 border border-white/20">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            <span className="text-sm font-black tabular-nums tracking-tighter">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-50">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-[40px] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all">
          <div className="flex-1 flex items-center justify-around w-full">
            <div className="flex flex-col gap-3 items-center group">
               <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Vitesse</label>
               <div className="flex items-center gap-4 bg-black/30 p-2 px-4 rounded-2xl border border-white/5">
                 <Lucide.Zap className="w-4 h-4 text-amber-400" />
                 <input 
                  type="range" min="0" max="10" step="0.5" 
                  value={scrollSpeed} 
                  onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                  className="w-24 md:w-32 accent-blue-500 h-1"
                 />
               </div>
            </div>

            <div className="flex flex-col gap-3 items-center group">
               <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Taille</label>
               <div className="flex items-center gap-4 bg-black/30 p-2 px-4 rounded-2xl border border-white/5">
                 <Lucide.Type className="w-4 h-4 text-blue-400" />
                 <input 
                  type="range" min="16" max="72" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-24 md:w-32 accent-blue-500 h-1"
                 />
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleCamera}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 active:scale-90"
              title="Changer de caméra"
            >
              <Lucide.RefreshCcw className="w-5 h-5 text-white/80" />
            </button>

            <button 
              onClick={toggleRecording}
              title={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-95 group shadow-2xl ${
                isRecording ? 'bg-white' : 'bg-rose-600 hover:scale-105'
              }`}
            >
              {isRecording ? (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-rose-600 animate-ping opacity-20"></div>
                  <div className="w-8 h-8 bg-rose-600 rounded-lg shadow-inner"></div>
                </>
              ) : (
                <>
                  <Lucide.Video className="w-10 h-10 text-white drop-shadow-lg" />
                  <div className="absolute inset-[-4px] rounded-full border-2 border-white/10 group-hover:border-white/20 transition-all"></div>
                </>
              )}
            </button>

            <button 
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border active:scale-90 ${
                isAutoScrolling ? 'bg-blue-600 border-blue-400' : 'bg-white/10 border-white/10'
              }`}
              title={isAutoScrolling ? "Arrêter le défilement" : "Lancer le défilement"}
            >
              <Lucide.MousePointer2 className={`w-5 h-5 ${isAutoScrolling ? 'text-white' : 'text-white/40'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Marketing Studio AI • Subtitles Engine Active</p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default VideoPrompter;
