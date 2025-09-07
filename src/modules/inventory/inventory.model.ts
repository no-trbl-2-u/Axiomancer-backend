import { Schema, model } from 'mongoose';
import { Inventory, InventoryItem, Equipment, BoatProgress, EquipmentSlot } from './inventory.types.js';

const inventoryItemSchema = new Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  equipped: { type: Boolean, default: false },
  equipmentSlot: { 
    type: String, 
    enum: ['weapon', 'armor', 'accessory1', 'accessory2'] as EquipmentSlot[],
    required: false
  }
}, { _id: false });

const equipmentSchema = new Schema({
  weapon: { type: String },
  armor: { type: String },
  accessory1: { type: String },
  accessory2: { type: String }
}, { _id: false });

const boatProgressSchema = new Schema({
  piecesCollected: [{ type: String }],
  totalPieces: { type: Number, default: 5 },
  completed: { type: Boolean, default: false }
}, { _id: false });

const inventorySchema = new Schema<Inventory>({
  uid: { type: String, required: true, unique: true },
  items: [inventoryItemSchema],
  equipment: { type: equipmentSchema, default: {} },
  gold: { type: Number, required: true, default: 0, min: 0 },
  maxSlots: { type: Number, required: true, default: 20, min: 1 },
  boatProgress: { type: boatProgressSchema, default: () => ({ piecesCollected: [], totalPieces: 5, completed: false }) }
}, { timestamps: true });

// Method to check if inventory has space
inventorySchema.methods.hasSpace = function(): boolean {
  const nonStackableItems = this.items.filter((item: InventoryItem) => !this.isItemStackable(item.itemId));
  return nonStackableItems.length < this.maxSlots;
};

// Method to check if item is stackable (would need to check against item database)
inventorySchema.methods.isItemStackable = function(itemId: string): boolean {
  // For now, assume consumables and materials are stackable
  const stackableItems = ['health-potion', 'mana-potion', 'forest-herb', 'boat-piece'];
  return stackableItems.some(item => itemId.includes(item) || itemId.includes('potion') || itemId.includes('herb'));
};

// Method to add item to inventory
inventorySchema.methods.addItem = function(itemId: string, quantity: number): boolean {
  const existingItem = this.items.find((item: InventoryItem) => item.itemId === itemId);
  
  if (existingItem && this.isItemStackable(itemId)) {
    existingItem.quantity += quantity;
  } else {
    if (!this.hasSpace()) {
      return false;
    }
    this.items.push({ itemId, quantity });
  }
  
  return true;
};

// Method to remove item from inventory
inventorySchema.methods.removeItem = function(itemId: string, quantity: number): boolean {
  const existingItem = this.items.find((item: InventoryItem) => item.itemId === itemId);
  
  if (!existingItem || existingItem.quantity < quantity) {
    return false;
  }
  
  existingItem.quantity -= quantity;
  
  if (existingItem.quantity === 0) {
    this.items = this.items.filter((item: InventoryItem) => item.itemId !== itemId);
  }
  
  return true;
};

// Method to equip item
inventorySchema.methods.equipItem = function(itemId: string, slot: EquipmentSlot): boolean {
  const item = this.items.find((item: InventoryItem) => item.itemId === itemId);
  
  if (!item || item.equipped) {
    return false;
  }
  
  // Unequip current item in slot if any
  if (this.equipment[slot]) {
    this.unequipItem(slot);
  }
  
  // Equip new item
  this.equipment[slot] = itemId;
  item.equipped = true;
  item.equipmentSlot = slot;
  
  return true;
};

// Method to unequip item
inventorySchema.methods.unequipItem = function(slot: EquipmentSlot): boolean {
  const equippedItemId = this.equipment[slot];
  
  if (!equippedItemId) {
    return false;
  }
  
  const item = this.items.find((item: InventoryItem) => item.itemId === equippedItemId);
  if (item) {
    item.equipped = false;
    item.equipmentSlot = undefined;
  }
  
  this.equipment[slot] = undefined;
  return true;
};

// Method to add boat piece
inventorySchema.methods.addBoatPiece = function(pieceId: string): void {
  if (!this.boatProgress.piecesCollected.includes(pieceId)) {
    this.boatProgress.piecesCollected.push(pieceId);
    this.boatProgress.completed = this.boatProgress.piecesCollected.length >= this.boatProgress.totalPieces;
  }
};

export const InventoryModel = model<Inventory>('Inventory', inventorySchema);