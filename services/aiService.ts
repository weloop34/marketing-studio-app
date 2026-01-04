

import { GoogleGenAI } from "@google/genai";
import { Task, PollData, WebinarData, WebinarAsset, AIConfig } from "../types";
// FIX: Import ALL_EMAIL_TEMPLATES to be used in generateEmailCampaign
import { ALL_EMAIL_TEMPLATES } from '../emailTemplates';

let currentAIConfig: AIConfig = {
  provider: 'gemini',
//  provider: 'openai',
  geminiKey: '',
  openaiKey: '',
  mistralKey: ''
};

export const setAIConfig = (config: AIConfig) => {
  currentAIConfig = config;
};

const getAI = () => {
  const { provider, openaiKey, mistralKey, geminiKey } = currentAIConfig;

  if (provider === 'gemini') {
    const key = geminiKey || process.env.API_KEY || "";
    return new GoogleGenAI({ apiKey: key });
  }

  return {
    models: {
      generateContent: async ({ contents, config }: any) => {
        const prompt = typeof contents === 'string' ? contents : (contents.text || "");
        const systemInstruction = config?.systemInstruction || "";
        const text = await callExternalAI(prompt, systemInstruction);
        return { text };
      }
    }
  } as any;
};

const getGeminiAI = () => {
  const key = currentAIConfig.geminiKey || process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey: key });
};

const parseSafeJSON = (text: string) => {
  try {
    const cleanText = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parsing Error. Raw text:", text);
    const jsonMatch = text.match(/\{.*\}|\[.*\]/s);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("L'IA a retourné un format invalide. Veuillez réessayer.");
  }
};

const callExternalAI = async (prompt: string, systemInstruction: string, jsonMode: boolean = false): Promise<string> => {
  const { provider, openaiKey, mistralKey } = currentAIConfig;

  if (provider === 'openai' && openaiKey) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        response_format: jsonMode ? { type: "json_object" } : undefined
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }

  if (provider === 'mistral' && mistralKey) {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }

  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      systemInstruction,
      responseMimeType: jsonMode ? "application/json" : undefined
    }
  });
  return response.text || "";
};

export const generateContent = async (task: Task): Promise<string> => {
  const ai = getAI();
  const actionLower = task.action.toLowerCase();
  const isVideo = actionLower.includes('vidéo');
  const isArticle = actionLower.includes('article');
  const auteurLabel = (task.auteur === "WP") ? "William PERES" : "Serious Factory";

  let systemInstruction = "";
  let prompt = "";

  if (isVideo) {
    systemInstruction = `Tu es un rédacteur professionnel de scripts pour prompteur. 
       Ta mission est de rédiger uniquement le texte qui sera LU face caméra.
       RÈGLES STRICTES :
       1. Ne JAMAIS inclure de descriptions de scènes, de plans ou de décors.
       2. Ne commence JAMAIS par une phrase d'introduction. Commence directement par le script.
       3. Utilise des crochets pour les indications [PAUSE], [SOURIRE].
       4. Saute une ligne après chaque indication entre crochets.`;
    
    prompt = `Rédige le texte du prompteur pour une vidéo sur : ${task.sujet}. 
       Objectif : ${task.objectif}. Angle : ${task.angle}. Message clé : ${task.message}.`;

  } else if (isArticle) {
    
    const exampleArticle = `"L'intelligence artificielle ne doit pas "améliorer" la formation.
Elle doit la restructurer en profondeur.

Alors qu’elle est devenue, avec l’IA, un levier d’exécution stratégique, trop d’entreprises utilisent encore la formation comme un "service RH".

Voici donc, selon moi, ce que les entreprises qui réussiront demain auront compris :

1️⃣L'Adaptive Learning est une architecture, pas un buzzword
Chaque collaborateur a un rythme, un passif, des moyens mnémotechniques et une charge cognitive différente. Le parcours unique est un non-sens.

Contenu de l’article
Penser adaptive learning, c’est penser produit intelligent :
qui détecte les signaux faibles (hésitation, répétition, temps de réflexion)
qui ajuste dynamiquement les parcours
qui transforme la formation en système distribué d’acquisition de compétences.

Ce n’est pas du e-learning + IA. C’est du machine learning appliqué à la progression humaine.

2️⃣Le savoir ne suffit plus. Il faut le transformer en automatismes
On ne "forme" pas, on encode du comportement professionnel.
Quand l’apprentissage devient interactif, immersif et adaptatif, l’IA organise les expositions à la complexité, les retours d’erreurs et la répétition ciblée.

On ne transmet alors plus un savoir, on calibre une capacité d’action, et c’est ce glissement du contenu vers la performance comportementale, qui redéfinit le rôle même de la formation.

3️⃣L'intelligence organisationnelle est un actif... qui s'évapore sans structure.
Chaque départ, chaque réorganisation, fait disparaître un savoir tacite, un raisonnement métier, une intuition professionnelle.

Capitaliser, c'est protéger l'intelligence collective.
Une entreprise visionnaire structure ses connaissances comme un produit :

Collecte du feedback terrain
Analyse de données d’usage
Mise à jour continue des référentiels

On ne stocke pas du savoir. On le fait vivre !

Contenu de l’article
4️⃣La croissance ne vient pas d'une élite formée, mais d'un socle aligné.
Former 5 % de leaders ne suffit plus. Ce sont les 100 % de collaborateurs formés, responsabilisés, outillés, qui rendent une organisation réellement agile.

L’entreprise du futur ne "délivre" pas la formation. Elle orchestre un système apprenant à grande échelle. C’est cette orchestration, pas la technologie seule, qui différenciera les entreprises qui s’adaptent, de celles qui subissent.

5️⃣Ma conviction
La formation est un système vivant. L’IA en est le moteur d’évolution.
Ceux qui sauront penser cette transformation avec une vision produit prendre une avance certaine et irréversible.

En tant que spécialiste des logiciels SaaS, c'est ce que j'ai toujours cherché à construire avec Serious Factory :

des architectures d’apprentissage adaptatives
des technologies scalables
des expériences qui apprennent à apprendre

La formation du futur ne sera pas digitale. Elle sera intelligente, systémique, humaine et évolutive.

#AI #formation #adaptivelearning #productleadership #vision #edtech #transformation"`;

    systemInstruction = `Tu es un CEO visionnaire et Head of Product expert en SaaS et EdTech. Tu rédiges des articles de fond pour LinkedIn qui sont stratégiques, technologiques et percutants, destinés à un public de dirigeants et d'investisseurs. Ton style est incisif et démontre une expertise profonde.`;
    
    prompt = `Voici un article de référence que j'ai rédigé :\n${exampleArticle}\n\n-----\n\nEn t'inspirant de la profondeur et du style de cet article, rédige un NOUVEL article LinkedIn riche, complet et précis sur le sujet suivant : "${task.sujet}" avec le message clé : "${task.message}".

L'article doit être structuré comme un point de vue stratégique d’un CEO visionnaire dans le domaine de la formation et de l’intelligence artificielle.

Voici les exigences :

🎯 CONTENU :
- Le fond de l’article doit être visionnaire, technologique et stratégique, à destination d’un public de dirigeants, investisseurs SaaS, CPO/CEO, responsables L&D.
- Il doit défendre une thèse forte sur l’avenir de la formation, avec une approche systémique, produit et IA.
- Le ton doit faire penser que l’auteur pourrait être embauché comme Head of Product ou CEO d’une entreprise SaaS, tant sa vision est pertinente.
- Le texte doit être découpé clairement en sections titrées et structuré par idées.
- Tu dois inclure des statistiques précises et sourcées (avec lien) pour étayer les propos.
- Tu peux t’inspirer des thèmes suivants :
  - IA comme moteur de transformation pédagogique
  - Architecture d’un système apprenant
  - Adaptive Learning à l’échelle
  - Capitalisation des savoirs critiques
  - Économie cognitive dans la formation
  - Scalabilité produit appliquée à l’apprentissage

🧱 LIVRABLES À FOURNIR (dans cet ordre exact) :
1. L'article complet, formaté en Markdown (titre principal avec #, sections avec ##, et mots-clés importants en gras avec **gras**), sans aucun autre commentaire.
2. Le marqueur de séparation EXACT : [SPLIT_PROMO]
3. Un post de promotion LinkedIn court et percutant pour annoncer la publication de l'article, optimisé pour l'engagement.`;

  } else {
    systemInstruction = `Tu es un expert en copywriting LinkedIn spécialisé dans les posts viraux pour ${auteurLabel}.
       🎯 STRUCTURE DU POST :
       1. ACCROCHE : Une ligne "choc" SANS EMOJI pour stopper le scroll. Cette première phrase doit IMPÉRATIVEMENT être en gras (entourée de **).
       2. ESPACE : Saute une ligne après l'accroche.
       3. CORPS : Paragraphes de 2 lignes max. Utilise des listes à puces (emojis 🚀, ✅, 💡).
       4. FORMATAGE : Utilise des balises de gras (**) pour les mots-clés importants.
       5. CTA : Une question ou une instruction claire à la fin.
       
       ⚠️ RÈGLES DE STYLE :
       - Hashtags en minuscules à la fin.
       - N'utilise JAMAIS d'italique pour tout le texte.
       
       Ne réponds que par le texte du post, sans aucun autre commentaire.`;

    prompt = `Rédige un post LinkedIn ultra-viral sur le sujet : ${task.sujet}. 
       Message clé : "${task.message}". 
       Angle business : ${task.angle}. 
       CTA : ${task.cta}.`;
  }

  const userPrompt = `Détails de la mission :
  Sujet : "${task.sujet}"
  Objectif : ${task.objectif}
  Cible : ${task.cible}
  Angle souhaité : ${task.angle}
  CTA final : ${task.cta}
  Message clé : ${task.message}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: { systemInstruction }
    });
    return response.text || "Erreur lors de la génération.";
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};

export const generateCarouselData = async (task: Task, count: number = 12, unsplashAccessKey: string): Promise<any[]> => { 
  const ai = getAI(); 
  const systemInstruction = `Tu es un expert en Carrousels LinkedIn. Génère un tableau JSON de ${count} objets représentant les slides.
  
  Chaque slide doit avoir un "type" (cover, content, outro) et un "layout" parmi :
  - cover (champs: title_top, title_accent, title_bottom, subtitle, badge)
  - problem-solution-stacked (champs: problemLabel, problem, solutionLabel, solution)
  - statistics (champs: statValue, statLabel, description)
  - checklist (champs: items: string[])
  - steps (champs: steps: {num, title, text}[])
  - myth-reality (champs: myth, reality)
  - visual-block (champs: description, caption, searchQuery: string (EN ANGLAIS - court))
  - timeline (champs: steps: {date, title, text}[])
  - 3-insights (champs: points: {title, text}[])
  - big-quote (champs: quote, author)
  - comparative (champs: colLeft, colRight, comparativeItems: {left, right}[])
  - cycle-5 (champs: items: string[])
  - definition (champs: word, wordType, definition)
  - code-snippet (champs: language, comment, code)
  - outro (champs: title, content, cta)

  RÈGLES DE VALIDATION :
  1. REMPLISSAGE OBLIGATOIRE : Ne laisse JAMAIS un champ "title" ou un champ de contenu (ex: problem, solution, definition, items) vide ou nul.
  2. VISUELS : Pour le layout 'visual-block', fournis impérativement un 'searchQuery' en anglais décrivant l'image conceptuelle souhaitée.
  3. FORMAT : Retourne UNIQUEMENT le JSON array, sans texte explicatif.`;
  
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `Génère ${count} slides pour le sujet : ${task.sujet}. Message : ${task.message}. Angle : ${task.angle}.`, 
      config: { 
        systemInstruction, 
        responseMimeType: "application/json"
      } 
    }); 
    
    const data = parseSafeJSON(response.text || "[]"); 
    const slides = Array.isArray(data) ? data : (data.slides || []);
    return slides.map((s: any, i: number) => ({ ...s, number: i + 1 })); 
  } catch (err) {
    console.error("Carousel generation error:", err);
    throw err;
  }
};

export const generatePersona = async (role: string, industry: string, mainPainPoint: string): Promise<any> => { 
  const res = await callExternalAI(`Génère un persona pour : ${role} en ${industry}. Problème : ${mainPainPoint}.`, `Expert Marketing. JSON: { "name": "", "photoSearchQuery": "", "role": "", "age": 0, "bio": "", "goals": [], "painPoints": [], "communicationChannels": [] }`, true);
  return parseSafeJSON(res);
};

export const generateTopicPlan = async (mainTopic: string): Promise<any> => { 
  const res = await callExternalAI(`Génère un cluster thématique pour : ${mainTopic}.`, `Expert SEO. JSON: { "pillarTitle": "", "pillarDescription": "", "strategyGoal": "", "satellites": [{ "title": "", "format": "", "angle": "", "keywords": [] }] }`, true);
  return parseSafeJSON(res);
};

export const analyzeHeadline = async (headline: string, channel: string): Promise<any> => { 
  const res = await callExternalAI(`Analyse ce titre : "${headline}"`, `Expert Copywriting. JSON: { "globalScore": 0, "emotionalScore": 0, "powerScore": 0, "structureScore": 0, "strengths": [], "weaknesses": [], "suggestions": [{ "title": "", "type": "" }] }`, true);
  return parseSafeJSON(res);
};

export const generateAnalogy = async (concept: string, audience: string): Promise<any> => { 
  const res = await callExternalAI(`Explique "${concept}" à "${audience}".`, `Expert pédagogie. JSON: { "mainAnalogy": { "comparison": "", "explanation": "", "visualSuggestion": "" }, "variations": [{ "universe": "", "text": "" }] }`, true);
  return parseSafeJSON(res);
};

export const generateWebinarContent = async (task: Task, assets: WebinarAsset[] = [], currentData?: WebinarData): Promise<WebinarData> => {
  const systemInstruction = `Tu es un expert en Webinaires Stratégiques. Génère un Masterplan complet au format JSON.
  
  STRUCTURE JSON OBLIGATOIRE :
  {
    "landingPage": {
      "headline": "Titre accrocheur",
      "subheadline": "Promesse de valeur",
      "learningPoints": ["Point 1", "Point 2", "Point 3"]
    },
    "agenda": [
      { "time": "00:00 - 05:00", "title": "Introduction", "description": "Détails" }
    ],
    "slides": [
      {
        "slideTitle": "Titre",
        "mainMessage": "Message clé",
        "speakerNotes": "Ce que l'orateur doit dire",
        "layout": "corporate-intro | expert-duo | vts-screenshot | neon-concept | dotted-practice | statistics | closing"
      }
    ]
  }

  RÈGLE AGENDA : Le champ "time" doit impérativement être un intervalle de temps au format "MM:SS - MM:SS" (ex: 05:00 - 15:00).
  Génère au moins 10 slides avec une progression pédagogique logique.
  Utilise uniquement les layouts listés ci-dessus.`;

  const prompt = `Génère le masterplan pour le webinaire : "${task.sujet}". 
  Objectif : ${task.objectif}. 
  Angle : ${task.angle}. 
  Message : ${task.message}.`;

  const res = await callExternalAI(prompt, systemInstruction, true);
  const parsed = parseSafeJSON(res);
  return { ...parsed, speakers: currentData?.speakers || [] };
};

export const analyzeFeedback = async (rawFeedback: string): Promise<any> => { 
  const res = await callExternalAI(`Analyse ces feedbacks : ${rawFeedback.substring(0, 4000)}`, `Analyste. JSON: { "globalSentiment": 0, "positives": [], "negatives": [], "keyQuotes": [], "recommendations": [{ "action": "", "impact": "Haut" }] }`, true);
  return parseSafeJSON(res);
};

export const extractCompanyInfoFromText = async (text: string): Promise<any> => { 
  const res = await callExternalAI(`Extrais les infos : ${text.substring(0, 6000)}`, `Analyste. JSON: { "pitch": "", "targets": "", "products": "" }`, true);
  return parseSafeJSON(res);
};

export const generateImagePrompts = async (task: Task, content?: string): Promise<{ prompt: string }> => {
  const ai = getAI();
  const textContent = content || task.message || task.sujet;
  
  const prompt = `À partir du texte fourni, rédige en français le prompt idéal, riche et descriptif pour une IA génératrice d'images.
Style : photographie ultra réaliste, corporate, futuriste.
Contraintes : Zéro texte dans l'image.

Voici le texte : ${textContent}

Réponds uniquement au format JSON :
{
  "prompt": "Le prompt principal et unique..."
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const parsed = JSON.parse(response.text || "{}");
    return { prompt: parsed.prompt || "Erreur de génération de prompt." };
  } catch (error) {
    return { prompt: "Erreur de génération de prompt." };
  }
};

export const generatePollContent = async (task: Task): Promise<PollData> => { 
  const res = await callExternalAI(`Sondage LinkedIn sur : ${task.sujet}.`, `Expert LinkedIn. JSON: { "introPost": "", "question": "", "options": [] }`, true);
  return parseSafeJSON(res);
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => { 
  if (currentAIConfig.provider === 'openai' && currentAIConfig.openaiKey) {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentAIConfig.openaiKey}` },
      body: JSON.stringify({ model: "dall-e-3", prompt, n: 1, size: "1024x1024", response_format: "b64_json" })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return `data:image/png;base64,${data.data[0].b64_json}`;
  }
  const ai = getGeminiAI(); 
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash-image', contents: { parts: [{ text: prompt }] } }); 
  for (const part of response.candidates[0].content.parts) { if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; }
  throw new Error("Erreur image");
};

export const generatePrepContent = async (task: Task): Promise<string> => { return await callExternalAI(`Checklist pour : ${task.sujet}`, "Project Manager."); };

/**
 * Determines the correct branding (logo, colors) for email campaigns based on the product name.
 * It uses case-insensitive matching to provide flexibility.
 * @param product The name of the product from the task.
 * @returns An object with logoUrl, primaryColor, and accentColors.
 */
const getProductBranding = (product: string) => {
  const productLower = product.toLowerCase();

  if (productLower.includes('vts editor') || productLower.includes('formation vts editor')) {
    return {
      logoUrl: 'https://assets.leadfox.co/616ee28b9aec697383ba2641/Logos/VTS_Editor_fond_blanc.png',
      primaryColor: '#f9c714',
      accentColors: ['#f4794a', '#656664']
    };
  }
  
  if (productLower.includes('vtplace')) {
    return {
      logoUrl: 'https://assets.leadfox.co/616ee28b9aec697383ba2641/Logos/VTPlace_fond_blanc.png',
      primaryColor: '#a85ea0',
      accentColors: ['#624795', '#656664']
    };
  }
  
  if (productLower.includes('vts perform')) {
    return {
      logoUrl: 'https://assets.leadfox.co/616ee28b9aec697383ba2641/Logos/VTS_Perform_fond_blanc.png',
      primaryColor: '#28b3a1',
      accentColors: ['#2e7cb8', '#656664']
    };
  }
  
  if (productLower.includes('personnages sur mesure') || productLower.includes('projet sur mesure')) {
    return {
      logoUrl: 'https://assets.leadfox.co/616ee28b9aec697383ba2641/Logos/LOGO_SF_HORIZONTAL_FOND_BLANC.png',
      primaryColor: '#226CAF',
      accentColors: ['#606161']
    };
  }

  // Default fallback to Serious Factory branding
  return {
    logoUrl: 'https://assets.leadfox.co/616ee28b9aec697383ba2641/Logos/LOGO_SF_HORIZONTAL_FOND_BLANC.png',
    primaryColor: '#226CAF',
    accentColors: ['#606161']
  };
};

export const generateEmailCampaign = async (task: Task, language: 'fr' | 'en'): Promise<string[]> => {
  const ai = getAI();
  const branding = getProductBranding(task.produit);
  
  const templatesForAI = Object.entries(ALL_EMAIL_TEMPLATES).map(([key, value]) => {
    // FIX: Destructure properties from value to ensure they exist
    const { name, description, template } = value;
    return `--- TEMPLATE "${name}" (clé: ${key}) ---\nDescription: ${description}\n\n${template}\n\n--- FIN TEMPLATE ${key} ---`;
  }).join('\n\n');

  const languageInstruction = language === 'en' 
    ? "La campagne doit être entièrement rédigée en ANGLAIS." 
    : "La campagne doit être entièrement rédigée en FRANÇAIS.";

  const prompt = `
RÔLE DE L’IA
Tu es un expert senior en marketing B2B, email copywriting et digital learning, spécialisé dans :
- les ventes complexes,
- les cycles longs,
- les grands comptes,
- les produits à forte valeur (SaaS, plateformes, solutions pédagogiques).

Tu écris pour des décideurs expérimentés (RH, L&D, directions commerciales), pas pour du mass-marketing.

CONTEXTE GÉNÉRAL
Je souhaite générer une campagne d’emailing B2B en 3 emails, sur le même sujet, envoyés à J0 / J+3 / J+8.

LANGUE DE LA CAMPAGNE
${languageInstruction}

Cette campagne :
- s’inscrit dans une relation existante ou de proximité (clients, anciens clients, leads qualifiés),
- ne doit jamais ressembler à un emailing de masse,
- doit privilégier la crédibilité, la clarté et la décision, pas la sur-promesse.

DONNÉES STRATÉGIQUES DE LA CAMPAGNE
Sujet de la campagne : ${task.sujet}
Produit à mettre en avant : ${task.produit}
Cible principale : ${task.cible}
Objectif principal : ${task.objectif}
Angle d’attaque dominant : ${task.angle}
Message clé à faire passer : ${task.message}
Appel à l’action final (CTA) : ${task.cta}

DONNÉES GRAPHIQUES DE LA CAMPAGNE
Logo à utiliser : ${branding.logoUrl}
Couleur principale (boutons CTA) : ${branding.primaryColor}
Couleurs d'accent utilisables : ${branding.accentColors.join(', ')}

**NOUVELLE INSTRUCTION : CHOIX DU TEMPLATE**
Tu as à ta disposition une bibliothèque de templates HTML. Ta première mission est d'analyser les "DONNÉES STRATÉGIQUES DE LA CAMPAGNE" et de choisir le template le plus pertinent pour CHACUN des 3 emails.

Règles de sélection :
- Tu n'es pas obligé d'utiliser 3 templates différents. Tu peux réutiliser le même si c'est pertinent (par ex: 3 emails "VISIONNAIRE").
- Le plus souvent, la campagne suivra une progression logique : un template de type "VISIONNAIRE" ou "PRODUIT" pour le premier email, "PREUVE SOCIALE" ou "PRODUIT" pour le second, et un template plus direct pour le dernier.
- Justifie brièvement ton choix de template pour chaque email dans un commentaire HTML au début de chaque bloc de code HTML. Ex: <!-- Choix du template: LE VISIONNAIRE car l'objectif est d'éduquer la cible. -->

Voici la bibliothèque de templates :
${templatesForAI}

STRUCTURE OBLIGATOIRE DE LA CAMPAGNE
Tu dois produire 3 emails distincts, avec un rôle clair pour chacun :

✉️ Email 1 – Prise de conscience / cadrage
Installer le contexte
Mettre en lumière le problème ou l’arbitrage
Aucun discours commercial frontal
CTA doux (lecture, découverte, réflexion)

✉️ Email 2 – Valeur / clarification
Apporter un éclairage concret
Montrer pourquoi les approches classiques ne suffisent plus
Introduire le produit comme réponse logique, pas comme une promo
CTA intermédiaire (cliquer, en savoir plus)

✉️ Email 3 – Décision / passage à l’action
S’adresser explicitement aux décideurs
Clarifier à qui c’est utile (et à qui ce ne l’est pas)
Lever les dernières objections implicites
CTA clair et assumé (RDV, inscription, prise de contact)

TON & STYLE D’ÉCRITURE
Ton professionnel, direct, sobre.
Jamais de formules vagues type :
❌ “Dans la plupart des entreprises…”
❌ “Une solution innovante et révolutionnaire…”

Toujours :
✅ concret
✅ crédible
✅ orienté usage réel
Écriture fluide, phrases courtes, lisibles sur mobile.

CONTRAINTES HTML & DESIGN (MISES À JOUR)
Pour chaque email, tu dois :
1. Choisir le template le plus pertinent dans la bibliothèque.
2. Justifier ton choix dans un commentaire HTML.
3. Remplir ce template avec le contenu que tu rédiges, en ne modifiant que les textes et les variables de branding (logo, couleur) comme indiqué dans les placeholders {{...}}.

Chaque email doit être livré :
- en HTML complet
- prêt à être copié / envoyé
- avec variables de personnalisation conservées ({{first_name}}, {{email}}, etc.)

SORTIE ATTENDUE
Tu dois fournir, dans cet ordre :
EMAIL 1 – HTML COMPLET
<!DOCTYPE html>...</html>

EMAIL 2 – HTML COMPLET
<!DOCTYPE html>...</html>

EMAIL 3 – HTML COMPLET
<!DOCTYPE html>...</html>

Sans commentaire intermédiaire.
Sans explication.
Uniquement le résultat final exploitable.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using a more powerful model for this complex task
      contents: prompt,
      config: {
        temperature: 0.6,
      }
    });
    const responseText = response.text || "";
    // Split the response into 3 emails. The AI is asked to use "EMAIL X – HTML COMPLET" as a header.
    const emails = responseText.split(/EMAIL \d – HTML COMPLET/i).map(e => e.trim()).filter(e => e.startsWith('<!DOCTYPE html>') || e.startsWith('<!--'));
    
    if (emails.length >= 3) {
        return emails.slice(0,3);
    } else {
        // Fallback for unexpected format
        console.warn("AI response format for emails was not as expected. Trying fallback split.", emails);
        const fallbackEmails = responseText.split('<!DOCTYPE html>').map(e => '<!DOCTYPE html>' + e).slice(1);
        if(fallbackEmails.length >= 3) return fallbackEmails.slice(0, 3);
        
        throw new Error(`L'IA n'a retourné que ${emails.length} emails au lieu de 3.`);
    }

  } catch (error) {
    console.error("Gemini Email Campaign Error:", error);
    throw error;
  }
};

export const translateHtmlContent = async (html: string, targetLanguage: 'fr' | 'en'): Promise<string> => {
  const ai = getAI();
  const languageName = targetLanguage === 'en' ? 'Anglais' : 'Français';

  const systemInstruction = `Tu es un traducteur expert spécialisé dans la traduction de contenu marketing au format HTML pour des emails.
  RÈGLES STRICTES :
  1. TRADUIS UNIQUEMENT le texte visible par l'utilisateur.
  2. NE MODIFIE JAMAIS la structure HTML (tags, attributs, etc.).
  3. NE TOUCHE JAMAIS aux variables de type {{variable_name}} ou aux liens spéciaux comme [[UNSUB_LINK_FR]].
  4. Conserve le ton marketing et B2B du contenu original.
  5. Ta sortie doit être UNIQUEMENT le code HTML traduit, sans aucun commentaire ou explication.
  `;
  
  const prompt = `Traduis le contenu textuel de cet email HTML en ${languageName}. Respecte impérativement toutes les règles.
  
  HTML À TRADUIRE:
  ${html}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });
    // Ensure the response is valid HTML before returning
    const translatedHtml = response.text || html;
    if (translatedHtml.trim().startsWith('<!DOCTYPE html>')) {
      return translatedHtml;
    }
    // If AI fails and returns plain text, return original html to avoid breaking the view
    console.warn("AI translation did not return valid HTML. Reverting to original.");
    return html; 
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw error;
  }
};

/**
 * Formate un article spécifiquement pour l'import Word LinkedIn
 */
export const formatArticleForWord = async (content: string): Promise<string> => {
  const ai = getAI();
  const systemInstruction = `Rôle: Tu es un moteur de mise en forme, pas un rédacteur.
Objectif: Transformer le texte fourni en une version strictement compatible avec l’import d’un article LinkedIn via fichier Microsoft Word (.docx).

Règles absolues:
- Ne jamais modifier, enrichir, résumer ou reformuler le contenu.
- Ne jamais ajouter ou supprimer une phrase.
- Ne pas changer l’ordre des paragraphes.
- Le texte final doit contenir exactement les mêmes mots que l’entrée.

Format de sortie obligatoire:
Chaque bloc doit être précédé d’un style Word explicite entre crochets :
[Titre]
[Titre 1]
[Titre 2]
[Normal]

Aucun texte sans style.
Aucun Markdown, aucun HTML.

Règles d’interprétation:
- La première ligne = [Titre]
- Les lignes courtes ou séparées par une ligne vide introduisant une idée = [Titre 1]
- Les sous-parties évidentes = [Titre 2]
- Tous les autres paragraphes = [Normal]

Mise en forme interne:
- Conserver le gras et l’italique exactement tels qu’ils apparaissent dans le texte source
- Ne pas en ajouter

Sortie attendue:
Renvoyer uniquement le texte reformaté. Aucun commentaire, aucune explication.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Formate ce texte selon les règles strictes d'import LinkedIn Word :\n\n${content}`,
      config: {
        systemInstruction,
        temperature: 0.1, // Basse température pour plus de fidélité
      }
    });
    return response.text || "Erreur de formatage";
  } catch (error) {
    console.error("Gemini Formatting Error:", error);
    throw error;
  }
};
