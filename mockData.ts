
import { Task, MarketingData } from "./types";

const baseDate = new Date(2025, 11, 21); // Dimanche 21 Décembre 2025
const today = baseDate.getTime();
const oneDay = 24 * 60 * 60 * 1000;

const createMockTask = (id: string, date: Date, action: string, sujet: string, status: 'à faire' | 'en cours' | 'terminé' = "à faire", type: 'prep' | 'launch' = 'launch'): Task => {
  const tLan = date.getTime();
  const tDeb = tLan - (3 * oneDay);

  return {
    id: `t_${id}`,
    produit: "Projets sur mesure",
    objectif: "Lead",
    sujet,
    action,
    cible: "Directions formation",
    auteur: "WP",
    angle: "-",
    cta: "Contactez-nous",
    message: "Contenu stratégique marketing studio.",
    status,
    dateLancement: date.toLocaleDateString('fr-FR'),
    tLan,
    tDeb,
    rowIndex: parseInt(id),
    isLate: (today > tLan && status !== "terminé"),
    isToday: (today >= tDeb && today <= tLan && status !== "terminé"),
    typeDisplay: type
  };
};

const allTasks: Task[] = [
  createMockTask("101", new Date(2025, 11, 15), "LinkedIn", "Les choix apprenant : le vrai moteur", "terminé", "prep"),
  createMockTask("102", new Date(2025, 11, 15), "Webinaire", "Webinaire - Concevoir un module", "à faire", "prep"),
  createMockTask("103", new Date(2025, 11, 16), "LinkedIn", "Les 5 signaux d'un projet complexe", "en cours", "launch"),
  createMockTask("104", new Date(2025, 11, 17), "LinkedIn", "Moteur de mémorisation", "à faire", "launch"),
  createMockTask("105", new Date(2025, 11, 18), "LinkedIn", "Acheter ou produire", "terminé", "launch"),
  createMockTask("10", new Date(2025, 11, 18), "Vidéo", "Externaliser un projet", "en cours", "prep"),
  createMockTask("107", new Date(2025, 11, 19), "LinkedIn", "Erreurs fréquentes", "à faire", "launch"),
  createMockTask("111", new Date(2025, 11, 20), "Carrousel LinkedIn", "Le futur du Digital Learning en 2026", "à faire", "launch"),
  createMockTask("115", new Date(2025, 11, 21), "LinkedIn Ads", "Campagne de notoriété Q4", "à faire", "launch"),
  createMockTask("108", new Date(2025, 11, 22), "LinkedIn", "Matrice de décision", "à faire", "launch"),
  createMockTask("116", new Date(2025, 11, 21), "Sondage LinkedIn", "Votre format e-learning préféré ?", "à faire", "launch"),
  createMockTask("109", new Date(2025, 11, 22), "Article LinkedIn", "L'IA : Moteur de transformation pédagogique", "en cours", "launch"),
  createMockTask("113", new Date(2025, 11, 22), "Article Blog SEO", "Guide complet du SEO pour les formateurs en 2026", "à faire", "launch"),
  createMockTask("114", new Date(2025, 11, 23), "Campagne Emailing", "Lancement de Virtual Training Place", "à faire", "launch"),
  createMockTask("112", new Date(2025, 11, 22), "Carrousel LinkedIn", "L'Adaptive Learning expliqué à mon boss", "à faire", "launch"),
  createMockTask("110", new Date(2025, 11, 31), "LinkedIn", "Problème de déploiement", "à faire", "launch"),
];

export const getMockMarketingData = (): MarketingData => ({
  todayTasks: allTasks.filter(t => t.isToday),
  lateTasks: allTasks.filter(t => t.isLate),
  allTasks,
  sheetId: "1-abc-votre-id-sheet"
});
