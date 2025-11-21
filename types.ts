export enum Park {
  DISNEYLAND = "Parc Disneyland",
  STUDIOS = "Walt Disney Studios"
}

export enum Land {
  MAIN_STREET = "Main Street U.S.A.",
  FRONTIERLAND = "Frontierland",
  ADVENTURELAND = "Adventureland",
  FANTASYLAND = "Fantasyland",
  DISCOVERYLAND = "Discoveryland",
  FRONT_LOT = "Front Lot",
  PRODUCTION_COURTYARD = "Production Courtyard",
  AVENGERS_CAMPUS = "Avengers Campus",
  TOON_STUDIO = "Toon Studio",
  WORLDS_OF_PIXAR = "Worlds of Pixar"
}

export type Intensity = 'Calme' | 'Modéré' | 'Sensations fortes';

export interface Attraction {
  id: string;
  name: string;
  park: Park;
  land: Land;
  avgWait?: number; // in minutes
  duration?: number; // in minutes
  x: number; // Map coordinate X (0-100)
  y: number; // Map coordinate Y (0-100)
  imageUrl: string;
  description: string;
  intensity: Intensity;
  officialUrl: string;
  reviewSummary: string;
  youtubeUrl: string; // Nouveau champ
}

export interface User {
  name: string;
}

export interface UserRanking {
  userName: string;
  rankedAttractionIds: string[];
  timestamp: number;
}

export interface OptimizationResult {
  path: string[];
}

export interface QuizAnswers {
  attractionType: string;
  adrenalineLevel: string;
  avoidance: string;
}

export interface AttractionConfig {
  attractionId: string;
  customImageUrl: string;
}