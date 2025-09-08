export interface MapNodeEvent {
  type: 'combat' | 'event' | 'rest';
  id: string;
  title: string;
  description: string;
  portrait?: string;
  rewards?: {
    experience?: number;
    items?: string[];
    fallacySpells?: string[];
    paradoxes?: string[];
  };
  enemy?: {
    type: 'greater_mythical' | 'lesser_mythical' | 'random';
    name: string;
    level: number;
  };
  choices?: {
    id: string;
    text: string;
    consequences?: {
      mpDrain?: boolean;
      items?: string[];
      fallacySpells?: string[];
    };
  }[];
}

export interface EventOutcome {
  success: boolean;
  message: string;
  characterUpdates?: {
    currentHp?: number;
    currentMp?: number;
    experience?: number;
    location?: {
      area: string;
      coordinates: {
        x: number;
        y: number;
      };
    };
  };
  inventoryUpdates?: {
    addedItems?: {
      itemId: string;
      quantity: number;
    }[];
  };
  newEvent?: MapNodeEvent;
}

export interface MapNode {
  id: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  area: string;
  unlocked: boolean;
}