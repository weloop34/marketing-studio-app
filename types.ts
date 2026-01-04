
export interface Task {
  id: string;
  produit: string;
  objectif: string;
  sujet: string;
  action: string;
  cible: string;
  auteur: string;
  angle: string;
  cta: string;
  message: string;
  status: string;
  dateLancement: string;
  tLan: number;
  tDeb: number;
  rowIndex: number;
  isLate: boolean;
  isToday: boolean;
  typeDisplay?: 'prep' | 'launch';
}

export interface WebinarAsset {
  id: string;
  name: string;
  data: string;
  mimeType: string;
  thumbnail?: string;
}

export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  photo?: string;
}

export interface WebinarData {
  speakers: Speaker[];
  landingPage: {
    headline: string;
    subheadline: string;
    learningPoints: string[];
  };
  agenda: {
    time: string;
    title: string;
    description: string;
  }[];
  slides: {
    slideTitle: string;
    mainMessage: string;
    speakerNotes: string;
    layout: 'corporate-intro' | 'expert-duo' | 'vts-screenshot' | 'neon-concept' | 'dotted-practice' | 'statistics' | 'closing';
    visualHints?: {
      label?: string;
      backgroundTopic?: string;
      accentColor?: string;
    };
  }[];
}

export type AIProvider = 'gemini' | 'openai' | 'mistral';

export interface AIConfig {
  provider: AIProvider;
  geminiKey: string;
  openaiKey: string;
  mistralKey: string;
}

export interface MarketingData { todayTasks: Task[]; lateTasks: Task[]; allTasks: Task[]; sheetId: string; }
export type ViewMode = 'today' | 'late' | 'calendar' | 'all' | 'toolbox';
export type CalendarMode = 'month' | 'week' | 'workweek';
export interface CarouselSlide { 
  type: 'cover' | 'content' | 'outro'; 
  layout?: string; 
  number?: number; 
  title?: string; 
  title_top?: string; 
  title_accent?: string; 
  title_bottom?: string; 
  subtitle?: string; 
  author?: string; 
  role?: string; 
  content?: string; 
  cta?: string; 
  badge?: string; 
  imageUrl?: string; 
  searchQuery?: string; 
  problemLabel?: string; 
  problem?: string; 
  solutionLabel?: string; 
  solution?: string; 
  statValue?: string; 
  statLabel?: string; 
  description?: string; 
  items?: string[]; 
  comparativeItems?: {left: string, right: string}[];
  steps?: {num?: number, title?: string, text?: string, date?: string}[]; 
  myth?: string; 
  reality?: string; 
  caption?: string; 
  points?: {title: string, text: string}[]; 
  quote?: string; 
  colLeft?: string; 
  colRight?: string; 
  boxes?: string[]; 
  dos?: string[]; 
  donts?: string[]; 
  word?: string; 
  wordType?: string; 
  definition?: string; 
  code?: string; 
  language?: string; 
  comment?: string; 
}
export interface Competitor { id: string; name: string; linkedinUrl: string; }
export interface CompanyProfile { name: string; pitch: string; targets: string; products: string; linkedinUrl: string; websiteUrl: string; }
export interface Persona { name: string; photoSearchQuery: string; role: string; age: number; bio: string; goals: string[]; painPoints: string[]; communicationChannels: string[]; }
export interface SatelliteContent { title: string; format: string; angle: string; keywords: string[]; }
export interface TopicPlan { pillarTitle: string; pillarDescription: string; satellites: SatelliteContent[]; strategyGoal: string; }
export interface HeadlineAnalysis { globalScore: number; emotionalScore: number; powerScore: number; structureScore: number; strengths: string[]; weaknesses: string[]; suggestions: { title: string; type: string; }[]; }
export interface AnalogyResult { mainAnalogy: { comparison: string; explanation: string; visualSuggestion: string; }; variations: { universe: string; text: string; }[]; }
export interface FeedbackAnalysis { globalSentiment: number; positives: string[]; negatives: string[]; keyQuotes: string[]; recommendations: { action: string; impact: 'Haut' | 'Moyen' | 'Bas'; }[]; }
export interface PollData { introPost: string; question: string; options: string[]; }
