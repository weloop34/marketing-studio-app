
import { CarouselSlide } from './types';

export const createDefaultSlides = (): CarouselSlide[] => {
  return [
    { 
      type: 'cover', 
      number: 1, 
      title_top: "GUIDE COMPLET", 
      title_accent: "TEMPLATES", 
      title_bottom: "POUR VOS FORMATIONS", 
      subtitle: "Découvrez tous les types de slides disponibles dans Marketing Studio", 
      badge: "GUIDE EXPERT" 
    },
    { 
      type: 'content', 
      layout: 'problem-solution-stacked', 
      number: 2, 
      title: "PROBLÈME / SOLUTION", 
      problem: "Le contenu linéaire classique ennuie les apprenants et fait chuter le taux de mémorisation.", 
      solution: "Utilisez l'IA pour générer des scénarios immersifs et des feedbacks immédiats." 
    },
    { 
      type: 'content', 
      layout: 'statistics', 
      number: 3, 
      title: "DONNÉES CHIFFRÉES", 
      statValue: "85%", 
      statLabel: "Engagement", 
      description: "Augmentation moyenne constatée sur les modules utilisant l'Adaptive Learning." 
    },
    { 
      type: 'content', 
      layout: 'checklist', 
      number: 4, 
      title: "LES INCONTOURNABLES", 
      items: [
        "Scénarisation immersive (VTS Editor)",
        "Feedbacks pédagogiques instantanés",
        "Score en temps réel et badges",
        "Multi-dispositif (Web, VR, Mobile)"
      ] 
    },
    { 
      type: 'content', 
      layout: 'steps', 
      number: 5, 
      title: "MÉTHODOLOGIE", 
      steps: [
        { num: 1, title: "Analyse", text: "Identifier les gaps de compétences réels." },
        { num: 2, title: "Design", text: "Créer le graph de connaissances adaptatif." },
        { num: 3, title: "Déploiement", text: "Lancer le module intelligent sur le LMS." }
      ] 
    },
    { 
      type: 'content', 
      layout: 'myth-reality', 
      number: 6, 
      title: "IDÉES REÇUES", 
      myth: "L'intelligence artificielle va remplacer les formateurs humains.", 
      reality: "L'IA libère du temps pour le coaching en automatisant la transmission théorique." 
    },
    { 
      type: 'content', 
      layout: 'visual-block', 
      number: 7, 
      title: "EMPHASE VISUELLE", 
      description: "VISUEL GÉNÉRÉ PAR IA", 
      caption: "Utilisez DALL-E 3 pour illustrer vos concepts complexes" 
    },
    { 
      type: 'content', 
      layout: 'timeline', 
      number: 8, 
      title: "PLAN DE LANCEMENT", 
      steps: [
        { date: "J-30", title: "Kick-off", text: "Lancement du projet et analyse." },
        { date: "J-15", title: "V1 Beta", text: "Première version testable en interne." },
        { date: "J-1", title: "Go Live", text: "Validation finale et déploiement." }
      ] 
    },
    { 
      type: 'content', 
      layout: '3-insights', 
      number: 9, 
      title: "LES 3 PILIERS", 
      points: [
        { title: "Scalabilité", text: "Produisez 10x plus vite vos contenus." },
        { title: "Qualité", text: "Maintenez des standards pédagogiques élevés." },
        { title: "Coût", text: "Réduction massive des frais de production." }
      ] 
    },
    { 
      type: 'content', 
      layout: 'big-quote', 
      number: 10, 
      title: "CITATION CLÉ", 
      quote: "La technologie ne remplace pas l'empathie, elle l'augmente pour créer des expériences apprenantes inoubliables.", 
      author: "William Peres" 
    },
    { 
      type: 'content', 
      layout: 'process', 
      number: 11, 
      title: "FLUX DE TRAVAIL", 
      items: ["Analyse des besoins", "Conception IA", "Production VTS", "Validation Client"] 
    },
    { 
      type: 'content', 
      layout: 'comparative', 
      number: 12, 
      title: "AVANT / APRÈS", 
      colLeft: "TRADITIONNEL", 
      colRight: "ADAPTIVE", 
      /* Fix: items is string[], comparativeItems is used for {left, right} objects */
      comparativeItems: [
        { left: "Linéaire", right: "Personnalisé" },
        { left: "Statique", right: "Évolutif" },
        { left: "Passif", right: "Actif / Immersif" }
      ] 
    },
    { 
      type: 'content', 
      layout: 'schema-boxed', 
      number: 13, 
      title: "ÉCOSYSTÈME", 
      boxes: ["IA Générative", "Data Analytics", "UX Design", "Pédagogie"] 
    },
    { 
      type: 'content', 
      layout: 'cycle-5', 
      number: 14, 
      title: "BOUCLE D'AMÉLIORATION", 
      items: ["Input", "Traitement", "Output", "Feedback", "Optimisation"] 
    },
    { 
      type: 'content', 
      layout: 'dos-donts', 
      number: 15, 
      title: "BONNES PRATIQUES", 
      dos: ["Être concis", "Utiliser des visuels", "Favoriser l'action"], 
      donts: ["Surcharger les slides", "Ignorer le feedback", "Être trop théorique"] 
    },
    { 
      type: 'content', 
      layout: 'definition', 
      number: 16, 
      title: "LE LEXIQUE", 
      word: "ADAPTIVE", 
      wordType: "Nom commun / Concept", 
      definition: "Capacité d'un système à modifier dynamiquement son comportement en fonction des données récoltées sur l'utilisateur." 
    },
    { 
      type: 'content', 
      layout: 'code-snippet', 
      number: 17, 
      title: "INTÉGRATION TECH", 
      language: "typescript", 
      comment: "// Exemple de logique adaptative", 
      code: "if (user.hasDifficulty) {\n  provideContextualHint();\n  adjustDifficultyLevel('junior');\n}" 
    },
    { 
      type: 'outro', 
      number: 18, 
      title: "PRÊT À RÉVOLUTIONNER VOTRE FORMATION ?", 
      content: "Nos experts vous accompagnent dans votre transformation digitale avec des outils de pointe.", 
      cta: "PRENDRE RENDEZ-VOUS" 
    }
  ];
};
