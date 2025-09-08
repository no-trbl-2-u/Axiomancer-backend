import { InventoryModel } from './inventory.model.js';
import { Inventory, InventoryAddItemRequest, InventoryRemoveItemRequest, EquipItemRequest, UseItemRequest, UpdateGoldRequest, Equipment, BoatProgress, InventoryDocument } from './inventory.types.js';
import { CharacterModel } from '../character/character.model.js';
import { UserModel } from '../user/user.model.js';

export const getInventory = async (uid: string): Promise<Inventory | { message: string }> => {
  const user = await UserModel.findOne({ uid });
  if (!user) {
    return { message: 'User not found' };
  }

  const inventory = await InventoryModel.findOne({ uid }, { _id: 0, __v: 0 }).lean();

  if (!inventory) {
    // Create new inventory for user
    const newInventory = await InventoryModel.create({ uid });
    return newInventory.toObject();
  }

  return inventory;
};

export const addItem = async (data: InventoryAddItemRequest): Promise<Inventory | { message: string }> => {
  let inventory = await InventoryModel.findOne({ uid: data.uid });

  if (!inventory) {
    inventory = await InventoryModel.create({ uid: data.uid });
  }

  const success = (inventory as InventoryDocument).addItem(data.itemId, data.quantity);

  if (!success) {
    return { message: 'Inventory is full' };
  }

  await inventory.save();
  return inventory.toObject();
};

export const removeItem = async (data: InventoryRemoveItemRequest): Promise<Inventory | { message: string }> => {
  const inventory = await InventoryModel.findOne({ uid: data.uid });

  if (!inventory) {
    return { message: 'Inventory not found' };
  }

  const success = (inventory as InventoryDocument).removeItem(data.itemId, data.quantity);

  if (!success) {
    return { message: 'Item not found or insufficient quantity' };
  }

  await inventory.save();
  return inventory.toObject();
};

export const equipItem = async (data: EquipItemRequest): Promise<{ inventory: Inventory; characterStats?: Record<string, unknown> } | { message: string }> => {
  const inventory = await InventoryModel.findOne({ uid: data.uid });

  if (!inventory) {
    return { message: 'Inventory not found' };
  }

  // Validate item exists in inventory
  const item = inventory.items.find(item => item.itemId === data.itemId);
  if (!item) {
    return { message: 'Item not found in inventory' };
  }

  // Validate slot compatibility (simplified validation)
  const itemTypeSlotMap: { [key: string]: string } = {
    'sword': 'weapon',
    'staff': 'weapon',
    'bow': 'weapon',
    'armor': 'armor',
    'robe': 'armor',
    'ring': 'accessory1',
    'necklace': 'accessory2'
  };

  const expectedSlot = Object.keys(itemTypeSlotMap).find(type => data.itemId.includes(type));
  if (expectedSlot && itemTypeSlotMap[expectedSlot] !== data.slot) {
    return { message: 'Invalid equipment slot for item type' };
  }

  const success = (inventory as InventoryDocument).equipItem(data.itemId, data.slot);

  if (!success) {
    return { message: 'Failed to equip item' };
  }

  await inventory.save();

  // Update character stats based on equipped item (simplified)
  const character = await CharacterModel.findOne({ uid: data.uid });
  if (character) {
    // This would normally calculate stat bonuses from equipped items
    await character.save();
  }

  return {
    inventory: inventory.toObject(),
    characterStats: character?.stats
  };
};

export const unequipItem = async (uid: string, slot: string): Promise<Inventory | { message: string }> => {
  const inventory = await InventoryModel.findOne({ uid });

  if (!inventory) {
    return { message: 'Inventory not found' };
  }

  if (!(inventory as InventoryDocument & { hasSpace: () => boolean }).hasSpace()) {
    return { message: 'Inventory is full' };
  }

  const success = (inventory as InventoryDocument).unequipItem(slot);

  if (!success) {
    return { message: 'No item equipped in slot' };
  }

  await inventory.save();
  return inventory.toObject();
};

export const useItem = async (data: UseItemRequest): Promise<{ inventory: Inventory; characterStats?: Record<string, unknown> } | { message: string }> => {
  const inventory = await InventoryModel.findOne({ uid: data.uid });

  if (!inventory) {
    return { message: 'Inventory not found' };
  }

  // Check if item is consumable (simplified check)
  if (!data.itemId.includes('potion') && !data.itemId.includes('herb')) {
    return { message: 'Item is not consumable' };
  }

  const success = (inventory as InventoryDocument).removeItem(data.itemId, data.quantity);

  if (!success) {
    return { message: 'Item not found or insufficient quantity' };
  }

  // Apply item effects to character
  // const character = await CharacterModel.findOne({ uid: data.uid });
  // if (character && data.itemId.includes('health')) {
  //   character.stats.hp = Math.min(character.stats.hp + 50, character.stats.maxHp);
  //   await character.save();
  // } else if (character && data.itemId.includes('mana')) {
  //   character.stats.mp = Math.min(character.stats.mp + 30, character.stats.maxMp);
  //   await character.save();
  // }
  // Apply item effects to character
  const character = await CharacterModel.findOne({ uid: data.uid });
  if (character && data.itemId.includes('health')) {
    character.currentHp = Math.min(character.currentHp + 50, character.maxHp);
    await character.save();
  } else if (character && data.itemId.includes('mana')) {
    character.currentMp = Math.min(character.currentMp + 30, character.maxMp);
    await character.save();
  }

  await inventory.save();
  return {
    inventory: inventory.toObject(),
    characterStats: character?.stats
  };
};

export const getEquipment = async (uid: string): Promise<{ equipment: Equipment; statBonuses?: Record<string, number> } | { message: string }> => {
  const inventory = await InventoryModel.findOne({ uid });

  if (!inventory) {
    return { message: 'Inventory not found' };
  }

  // Calculate stat bonuses from equipped items (simplified)
  const statBonuses = { body: 0, mind: 0, heart: 0 };

  return {
    equipment: inventory.equipment,
    statBonuses
  };
};

export const updateGold = async (data: UpdateGoldRequest): Promise<Inventory | { message: string }> => {
  let inventory = await InventoryModel.findOne({ uid: data.uid });

  if (!inventory) {
    inventory = await InventoryModel.create({ uid: data.uid });
  }

  if (data.operation === 'spend' && inventory.gold < data.amount) {
    return { message: 'Insufficient gold' };
  }

  if (data.operation === 'add') {
    inventory.gold += data.amount;
  } else {
    inventory.gold -= data.amount;
  }

  await inventory.save();
  return inventory.toObject();
};

export const getBoatProgress = async (uid: string): Promise<BoatProgress | { message: string }> => {
  const inventory = await InventoryModel.findOne({ uid });

  if (!inventory) {
    return { message: 'Inventory not found' };
  }

  return inventory.boatProgress;
};

export const craftBoat = async (uid: string): Promise<{ message: string; boatProgress?: BoatProgress }> => {
  const inventory = await InventoryModel.findOne({ uid });

  if (!inventory) {
    return { message: 'Inventory not found' };
  }

  if (inventory.boatProgress.piecesCollected.length < inventory.boatProgress.totalPieces) {
    return { message: 'Missing required boat pieces' };
  }

  // Remove boat pieces from inventory
  const boatPieces = ['boat-hull', 'boat-sail', 'boat-rudder', 'boat-mast', 'boat-anchor'];
  for (const piece of boatPieces) {
    (inventory as InventoryDocument).removeItem(piece, 1);
  }

  inventory.boatProgress.completed = true;
  await inventory.save();

  // This would also unlock sea travel areas in game state
  return {
    message: 'Boat crafted successfully! Sea travel unlocked.',
    boatProgress: inventory.boatProgress
  };
};