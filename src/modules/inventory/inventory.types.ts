export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'quest';
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory1' | 'accessory2';

export interface ItemStats {
  body?: number;
  mind?: number;
  heart?: number;
  hp?: number;
  mp?: number;
}

export interface ItemEffect {
  type: 'heal' | 'buff' | 'restore';
  value: number;
  duration?: number;
  stat?: keyof ItemStats;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  stackable: boolean;
  maxStack: number;
  value: number;
  stats?: ItemStats;
  effects?: ItemEffect[];
  requirements?: {
    level?: number;
    stats?: Partial<ItemStats>;
  };
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  equipped?: boolean;
  equipmentSlot?: EquipmentSlot;
}

export interface Equipment {
  weapon?: string;
  armor?: string;
  accessory1?: string;
  accessory2?: string;
}

export interface BoatProgress {
  piecesCollected: string[];
  totalPieces: number;
  completed: boolean;
}

export interface Inventory {
  uid: string;
  items: InventoryItem[];
  equipment: Equipment;
  gold: number;
  maxSlots: number;
  boatProgress: BoatProgress;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryAddItemRequest {
  uid: string;
  itemId: string;
  quantity: number;
}

export interface InventoryRemoveItemRequest {
  uid: string;
  itemId: string;
  quantity: number;
}

export interface EquipItemRequest {
  uid: string;
  itemId: string;
  slot: EquipmentSlot;
}

export interface UseItemRequest {
  uid: string;
  itemId: string;
  quantity: number;
}

export interface UpdateGoldRequest {
  uid: string;
  amount: number;
  operation: 'add' | 'spend';
}

// Inventory document interface with mongoose methods
export interface InventoryDocument extends Inventory {
  addItem(itemId: string, quantity: number): boolean;
  removeItem(itemId: string, quantity: number): boolean;
  equipItem(itemId: string, slot: EquipmentSlot): { success: boolean; unequippedItem?: string };
  unequipItem(slot: EquipmentSlot): boolean;
  useItem(itemId: string, quantity: number): { success: boolean; effect?: ItemEffect };
  updateGold(amount: number, operation: 'add' | 'spend'): boolean;
  getBoatProgress(): BoatProgress;
  craftBoat(): boolean;
  toObject(): Inventory;
  save(): Promise<InventoryDocument>;
}