export type Race = 'elf' | 'drake' | 'arc-mage';

export interface Location {
  area: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface CharacterStats {
  body: number;
  mind: number;
  heart: number;
}

export interface DetailedStats {
  // Body stats - frontend field names
  physicalAtk: number;
  physicalDef: number;
  accuracy: number;
  critDamage: number;
  constitution: number;
  // Mind stats
  mentalAtk: number;
  mentalDef: number;
  evasion: number;
  perception: number;
  reflexSave: number;
  // Heart stats
  charisma: number;
  ailmentAtk: number;
  criticalRate: number;
  willpower: number;
  empathy: number;
  luck: number;
}

export interface Character {
  id?: string;
  uid: string;
  name: string;
  race: Race;
  portrait: string;
  level: number;
  experience: number;
  experienceToNext: number;
  age: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  stats: CharacterStats;
  detailedStats?: DetailedStats;
  location: Location;
  availableStatPoints: number;
  skillPoints: number;
  currentLocation: string;
  unlockedLocations: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CharacterCreateRequest {
  uid?: string;
  name: string;
  race?: Race;
  portrait: string;
  age?: number;
}

export interface CharacterUpdateRequest {
  uid: string;
  stats?: Partial<CharacterStats>;
  location?: Location;
  experience?: number;
}

// Character document interface with mongoose methods
export interface CharacterDocument extends Character {
  calculateDetailedStats(): DetailedStats;
  gainExperience(amount: number): void;
  toObject(): Character;
  save(): Promise<CharacterDocument>;
}