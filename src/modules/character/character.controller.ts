import { Request, Response } from 'express';
import * as characterService from './character.service.js';

export const createCharacterController = async (req: Request, res: Response) => {
  try {
    // Extract UID from authentication (for now, expect it in body - TODO: use JWT middleware)
    const { name, portrait, age } = req.body;
    const uid = req.body.uid || (req as any).user?.uid; // Will work with JWT middleware when added
    
    if (!uid) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const result = await characterService.createCharacter({ 
      uid,
      name, 
      portrait, 
      age 
    });
    
    if ('message' in result) {
      const status = result.message.includes('already has') ? 409 : 
                     result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(201).json(result);
  } catch (_error) {
    res.status(500).json({ message: 'Error creating character' });
  }
};

export const getCharacterController = async (req: Request, res: Response) => {
  try {
    const { uid: paramUid } = req.params;
    const { uid: queryUid, characterId } = req.query;
    
    const uid = paramUid || queryUid;
    
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
  } catch (_error) {
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
  } catch (_error) {
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
  } catch (_error) {
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
  } catch (_error) {
    res.status(500).json({ message: 'Error getting character stats' });
  }
};