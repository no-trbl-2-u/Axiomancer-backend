import { Request, Response } from 'express';
import * as gameStateService from './gamestate.service.js';

export const getGameStateController = async (req: Request, res: Response) => {
  try {
    const { uid, saveSlot } = req.query;
    
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid uid parameter' });
    }
    
    if (!saveSlot || isNaN(Number(saveSlot))) {
      return res.status(400).json({ message: 'Missing or invalid saveSlot parameter' });
    }

    const result = await gameStateService.getGameState(uid, Number(saveSlot));
    if ('message' in result) {
      const status = result.message.includes('not found') || result.message.includes('No save') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Error getting game state' });
  }
};

export const updateGameStateController = async (req: Request, res: Response) => {
  try {
    const { uid, saveSlot, phase, currentLocation, unlockedAreas, questProgress } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }
    
    if (!saveSlot || saveSlot < 1 || saveSlot > 3) {
      return res.status(400).json({ message: 'Invalid save slot' });
    }

    const result = await gameStateService.updateGameState({
      uid,
      saveSlot,
      phase,
      currentLocation,
      unlockedAreas,
      questProgress
    });
    
    if ('message' in result) {
      const status = result.message.includes('not found') ? 404 : 
                     result.message.includes('not unlocked') ? 400 : 403;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Error updating game state' });
  }
};

export const saveGameController = async (req: Request, res: Response) => {
  try {
    const { uid, saveSlot, gameState } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }
    
    if (!saveSlot || saveSlot < 1 || saveSlot > 3) {
      return res.status(400).json({ message: 'Invalid save slot' });
    }

    const result = await gameStateService.saveGame(uid, saveSlot, gameState);
    if ('message' in result) {
      const status = result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(201).json(result);
  } catch {
    res.status(500).json({ message: 'Error saving game' });
  }
};

export const loadGameController = async (req: Request, res: Response) => {
  try {
    const { uid, saveSlot } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }
    
    if (!saveSlot || saveSlot < 1 || saveSlot > 3) {
      return res.status(400).json({ message: 'Invalid save slot' });
    }

    const result = await gameStateService.loadGame(uid, saveSlot);
    if ('message' in result) {
      const status = result.message.includes('not found') || result.message.includes('No save') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Error loading game' });
  }
};

export const getSaveSlotsController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid uid parameter' });
    }

    const result = await gameStateService.getAllSaveSlots(uid);
    if ('message' in result) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Error getting save slots' });
  }
};

export const deleteSaveController = async (req: Request, res: Response) => {
  try {
    const { uid, saveSlot } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }
    
    if (!saveSlot || saveSlot < 1 || saveSlot > 3) {
      return res.status(400).json({ message: 'Invalid save slot' });
    }

    const result = await gameStateService.deleteSave(uid, saveSlot);
    if (result.message.includes('empty')) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Error deleting save' });
  }
};

export const updateStoryMilestoneController = async (req: Request, res: Response) => {
  try {
    const { uid, saveSlot, milestone } = req.body;
    
    if (!uid || !saveSlot || !milestone) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    if (saveSlot < 1 || saveSlot > 3) {
      return res.status(400).json({ message: 'Invalid save slot' });
    }

    if (!milestone.id || !milestone.name || !milestone.description) {
      return res.status(400).json({ message: 'Invalid milestone data' });
    }

    const result = await gameStateService.addStoryMilestone(uid, saveSlot, milestone);
    if ('message' in result) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Error updating story milestone' });
  }
};