export type CombatChoiceType = 'body' | 'mind' | 'heart';
export type CombatAction = 'attack' | 'defend' | 'special-attack';

export interface CombatChoice {
  type: CombatChoiceType;
  action: CombatAction;
}

export interface CombatSession {
  id: string;
  uid: string;
  enemyId: string;
  location: string;
  playerHp: number;
  playerMp: number;
  enemyHp: number;
  round: number;
  status: 'active' | 'victory' | 'defeat' | 'agreement';
  log: string[];
  createdAt: Date;
}

export interface DemonContract {
  id: string;
  uid: string;
  demonName: string;
  contractType: 'stat-boost' | 'summoning';
  accepted: boolean;
  terms: {
    sacrifice: string;
    benefit: Record<string, unknown>;
  };
  active: boolean;
  createdAt: Date;
}

export interface CombatStats {
  uid: string;
  wins: number;
  losses: number;
  agreements: number;
  specialAttacksUsed: number;
  fallaciesSpotted: number;
  demonContractsActive: number;
}