import { Request, Response } from 'express';
import * as characterService from './character.service.js';

export const createCharacterController = async (req: Request, res: Response) => {
  try {
    console.log('createCharacterController called with body:', req.body);
    // Extract UID from authentication (for now, expect it in body - TODO: use JWT middleware)
    const { name, race, portrait, age, uid } = req.body;
    console.log('Extracted uid from request body:', uid);
    console.log('All request body fields:', { name, race, portrait, age, uid });

    if (!uid) {
      console.log('UID is missing from request body');
      return res.status(401).json({ message: 'Authentication required - UID missing' });
    }

    const result = await characterService.createCharacter({
      uid,
      name,
      race,
      portrait,
      age
    });

    if ('message' in result) {
      const status = result.message.includes('already has') ? 409 :
        result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(201).json(result);
  } catch (e) {
    console.error('Error creating character:', e);
    res.status(500).json({ message: 'Error creating character', error: e });
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
  } catch (e) {
    res.status(500).json({ message: 'Error getting character', error: e });
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
      if (statValues.some((val: unknown) => typeof val === 'number' && val < 0)) {
        return res.status(400).json({ message: 'Invalid stat values' });
      }
    }

    const result = await characterService.updateCharacter({ uid, stats, location, experience });
    if ('message' in result) {
      const status = result.message.includes('not found') ? 404 : 400;
      return res.status(status).json(result);
    }
    res.status(200).json(result);
  } catch {
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
  } catch {
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
  } catch {
    res.status(500).json({ message: 'Error getting character stats' });
  }
};