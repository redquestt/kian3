
export enum BoardStyle {
  CEBRASPE = "Cebraspe",
  FGV = "FGV",
  INEP = "INEP",
  FUVEST = "FUVEST/USP",
}

export interface GeneratedQuestion {
  question_text: string;
  options?: { [key: string]: string };
  correct_answer: string;
  justification_anchor: string;
  userAnswer?: string;
  flashcard?: {
    front: string;
    back: string;
  };
  isGeneratingFlashcard?: boolean;
}

// --- GAMIFICATION TYPES ---

export interface Level {
    name: string;
    minXp: number;
    icon: string; // Emoji
}

export enum BadgeRarity {
    Common = "Comum",
    Rare = "Raro",
    Epic = "Épico",
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji
    rarity: BadgeRarity;
}

export interface GamificationState {
    levelIndex: number;
    xp: number;
    tokens: number; // New currency
    activeTheme: string; // ID of the currently active theme
    unlockedThemes: string[]; // IDs of purchased themes
    lastSessionDate: string | null;
    studyStreak: number;
    unlockedBadges: string[]; // Array of badge IDs
    pagesReadPerPdf: Record<string, number[]>; // pdfIdentifier -> [page numbers] for reading badges
    completedPagesPerPdf: Record<string, number[]>; // pdfIdentifier -> [page numbers] for XP
    totalCorrectAnswers: number;
    totalQuestionsAnswered: number;
}

export interface Toast {
    id: number;
    message: string;
    icon?: string;
}

// New types for the shop
export interface ShopItem {
  id: string; // e.g. "theme-steampunk"
  name: string;
  description: string;
  cost: number;
  icon: string; // Emoji
  requiredLevel: number;
}

export interface ProgressData {
  fileName?: string;
    totalPages: number;
    currentPage: number;
    scale: number;
    questionsByPage: Record<string, GeneratedQuestion[]>;
    sessionErrors: GeneratedQuestion[];
    sessionDate: string;
}
