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
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

export interface DetailedStats {
  physicalAttack: number;
  physicalDefense: number;
  accuracy: number;
  speed: number;
  mentalAttack: number;
  mentalDefense: number;
  evasion: number;
  perception: number;
  socialAttack: number;
  socialDefense: number;
  ailmentAttack: number;
  ailmentDefense: number;
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
  stats: CharacterStats;
  detailedStats: DetailedStats;
  location: Location;
  availableStatPoints: number;
  skillPoints: number;
  currentLocation: string;
  unlockedLocations: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CharacterCreateRequest {
  uid: string;
  name: string;
  race: Race;
  portrait: string;
}

export interface CharacterUpdateRequest {
  uid: string;
  stats?: Partial<CharacterStats>;
  location?: Location;
  experience?: number;
}