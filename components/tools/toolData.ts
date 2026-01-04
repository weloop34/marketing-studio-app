
import React from 'react';
import * as Lucide from 'lucide-react';

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: React.ReactElement<{ size?: number | string }>;
    color: string;
    category: string;
    isComingSoon: boolean;
}

export const TOOLS: Tool[] = [
    {
        id: 'lead-calc',
        name: 'Calculateur de Leads',
        description: 'Estimez le volume de prospects nécessaires pour atteindre vos objectifs de CA.',
        icon: React.createElement(Lucide.Calculator, { size: 24 }),
        color: 'text-amber-500 bg-amber-500/10',
        category: 'STRATÉGIE',
        isComingSoon: false,
    },
    {
        id: 'competitor-monitor',
        name: 'Veille Concurrentielle',
        description: 'Analysez les publications de vos concurrents et découvrez des opportunités.',
        icon: React.createElement(Lucide.Globe, { size: 24 }),
        color: 'text-sky-500 bg-sky-500/10',
        category: 'VEILLE',
        isComingSoon: false,
    },
    {
        id: 'persona-generator',
        name: 'Générateur de Persona IA',
        description: "Transformez une idée de cible en une fiche persona détaillée pour mieux communiquer.",
        icon: React.createElement(Lucide.Users, { size: 24 }),
        color: 'text-teal-500 bg-teal-500/10',
        category: 'STRATÉGIE',
        isComingSoon: false,
    },
    {
        id: 'topic-planner',
        name: 'Planificateur de Contenus',
        description: "À partir d'un sujet pilier, générez des idées d'articles satellites pour une stratégie SEO forte.",
        icon: React.createElement(Lucide.Network, { size: 24 }),
        color: 'text-violet-500 bg-violet-500/10',
        category: 'PLANIFICATION',
        isComingSoon: false,
    },
    {
        id: 'headline-analyzer',
        name: 'Analyseur de Titres',
        description: "Obtenez un score d'impact pour vos accroches et recevez des suggestions optimisées.",
        icon: React.createElement(Lucide.ScanText, { size: 24 }),
        color: 'text-rose-500 bg-rose-500/10',
        category: 'COPYWRITING',
        isComingSoon: false,
    },
    {
        id: 'analogy-generator',
        name: 'Générateur d\'Analogies',
        description: "Simplifiez des concepts complexes en trouvant des métaphores percutantes.",
        icon: React.createElement(Lucide.Lightbulb, { size: 24 }),
        color: 'text-lime-500 bg-lime-500/10',
        category: 'CRÉATIVITÉ',
        isComingSoon: false,
    },
    {
        id: 'feedback-synthesizer',
        name: 'Synthétiseur de Feedback',
        description: "Collez des avis clients bruts et extrayez-en les thèmes clés, positifs et négatifs.",
        icon: React.createElement(Lucide.MessageSquareQuote, { size: 24 }),
        color: 'text-fuchsia-500 bg-fuchsia-500/10',
        category: 'ANALYSE',
        isComingSoon: false,
    }
];
