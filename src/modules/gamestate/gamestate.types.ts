import { Location } from '../character/character.types.js';

export type GamePhase = 'childhood' | 'labyrinth' | 'adulthood';

export interface QuestProgress {
  [questId: string]: {
    progress: number;
    maxProgress: number;
    completed: boolean;
  };
}

export interface StoryMilestone {
  id: string;
  name: string;
  description: string;
  timestamp: Date;
}

export interface GameState {
  uid: string;
  characterId: string;
  saveSlot: number;
  phase: GamePhase;
  currentLocation: Location;
  unlockedAreas: string[];
  questProgress: QuestProgress;
  storyMilestones: StoryMilestone[];
  lastSaved: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GameStateCreateRequest {
  uid: string;
  characterId: string;
  saveSlot: number;
}

export interface GameStateUpdateRequest {
  uid: string;
  saveSlot: number;
  phase?: GamePhase;
  currentLocation?: Location;
  unlockedAreas?: string[];
  questProgress?: QuestProgress;
}