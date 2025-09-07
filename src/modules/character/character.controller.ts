import { Request, Response } from 'express';
import * as characterService from './character.service.js';

export const createCharacterController = async (req: Request, res: Response) => {
  try {
    const result = await characterService.createCharacter(req.body);
    if ('message' in result) {
      const status = result.message.includes('already has') ? 409 : 
                     result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating character' });
  }
};

export const getCharacterController = async (req: Request, res: Response) => {
  try {
    const { uid, characterId } = req.query;
    
    if (characterId && typeof characterId === 'string') {
      // Get character by ID (frontend expectation)
      const result = await characterService.getCharacterById(characterId);
      if ('message' in result) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    }
    
    if (uid && typeof uid === 'string') {
      // Get character by UID (existing implementation)
      const result = await characterService.getCharacter(uid);
      if ('message' in result) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    }
    
    return res.status(400).json({ message: 'Missing uid or characterId parameter' });
  } catch (error) {
    res.status(500).json({ message: 'Error getting character' });
  }
};

export const updateCharacterController = async (req: Request, res: Response) => {
  try {
    const { uid, stats, location, experience } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }

    // Validate stat values if provided
    if (stats) {
      const statValues = Object.values(stats);
      if (statValues.some((val: any) => val < 0)) {
        return res.status(400).json({ message: 'Invalid stat values' });
      }
    }

    const result = await characterService.updateCharacter({ uid, stats, location, experience });
    if ('message' in result) {
      const status = result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating character' });
  }
};

export const deleteCharacterController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }

    const result = await characterService.deleteCharacter(uid);
    if (result.message.includes('not found')) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting character' });
  }
};

export const getCharacterStatsController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid uid parameter' });
    }

    const result = await characterService.getCharacterStats(uid);
    if ('message' in result) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error getting character stats' });
  }
};