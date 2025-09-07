import { Request, Response } from 'express';
import * as inventoryService from './inventory.service.js';

export const getInventoryController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid uid parameter' });
    }

    const result = await inventoryService.getInventory(uid);
    if ('message' in result) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error getting inventory' });
  }
};

export const addItemController = async (req: Request, res: Response) => {
  try {
    const { uid, itemId, quantity } = req.body;
    
    if (!uid || !itemId || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const result = await inventoryService.addItem({ uid, itemId, quantity });
    if ('message' in result) {
      const status = result.message.includes('full') ? 400 : 404;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error adding item' });
  }
};

export const removeItemController = async (req: Request, res: Response) => {
  try {
    const { uid, itemId, quantity } = req.body;
    
    if (!uid || !itemId || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const result = await inventoryService.removeItem({ uid, itemId, quantity });
    if ('message' in result) {
      const status = result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error removing item' });
  }
};

export const equipItemController = async (req: Request, res: Response) => {
  try {
    const { uid, itemId, slot } = req.body;
    
    if (!uid || !itemId || !slot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validSlots = ['weapon', 'armor', 'accessory1', 'accessory2'];
    if (!validSlots.includes(slot)) {
      return res.status(400).json({ message: 'Invalid equipment slot' });
    }

    const result = await inventoryService.equipItem({ uid, itemId, slot });
    if ('message' in result) {
      const status = result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error equipping item' });
  }
};

export const unequipItemController = async (req: Request, res: Response) => {
  try {
    const { uid, slot } = req.body;
    
    if (!uid || !slot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await inventoryService.unequipItem(uid, slot);
    if ('message' in result) {
      const status = result.message.includes('full') ? 400 : 
                     result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error unequipping item' });
  }
};

export const useItemController = async (req: Request, res: Response) => {
  try {
    const { uid, itemId, quantity } = req.body;
    
    if (!uid || !itemId || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await inventoryService.useItem({ uid, itemId, quantity });
    if ('message' in result) {
      const status = result.message.includes('not consumable') ? 400 :
                     result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error using item' });
  }
};

export const getEquipmentController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid uid parameter' });
    }

    const result = await inventoryService.getEquipment(uid);
    if ('message' in result) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error getting equipment' });
  }
};

export const updateGoldController = async (req: Request, res: Response) => {
  try {
    const { uid, amount, operation } = req.body;
    
    if (!uid || amount === undefined || !operation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!['add', 'spend'].includes(operation)) {
      return res.status(400).json({ message: 'Invalid operation' });
    }

    const result = await inventoryService.updateGold({ uid, amount, operation });
    if ('message' in result) {
      const status = result.message.includes('Insufficient') ? 400 : 404;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error updating gold' });
  }
};

export const getBoatProgressController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid uid parameter' });
    }

    const result = await inventoryService.getBoatProgress(uid);
    if ('message' in result) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error getting boat progress' });
  }
};

export const craftBoatController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }

    const result = await inventoryService.craftBoat(uid);
    if (result.message.includes('Missing')) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error crafting boat' });
  }
};