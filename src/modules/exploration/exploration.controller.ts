import { Request, Response } from 'express';

export const getLocationController = async (req: Request, res: Response) => {
  try {
    const { uid, characterId } = req.query;
    
    if (!uid && !characterId) {
      return res.status(400).json({ message: 'Missing uid or characterId parameter' });
    }

    // Enhanced location data matching frontend expectations
    const locations = {
      'starting-town': {
        area: 'starting-town',
        coordinates: { x: 0, y: 0 },
        name: 'Seafarer\'s Haven',
        description: 'A humble fishing village with weathered docks and salt-stained buildings. The smell of brine mingles with smoke from the tavern chimney. This peaceful harbor serves as home to simple folk who know little of the world\'s darker mysteries.',
        type: 'town' as const,
        properties: {
          restArea: true,
          merchant: true,
          dangerLevel: 0,
          weather: 'clear'
        },
        encounters: {
          common: ['village-elder-conversation', 'fisherman-tale'],
          uncommon: ['traveling-merchant'],
          rare: []
        },
        resources: ['fish', 'seaweed', 'driftwood', 'rope'],
        npcs: ['village-elder', 'fisherman', 'merchant', 'tavern-keeper'],
        availableActions: ['explore', 'talk-to-villagers', 'visit-harbor', 'rest', 'shop']
      },
      'forest-north': {
        area: 'forest-north',
        coordinates: { x: 0, y: 5 },
        name: 'Whispering Woods',
        description: 'Ancient trees loom overhead, their gnarled branches filtering the light into dancing shadows. Strange whispers seem to emanate from the undergrowth, and you catch glimpses of movement that might be woodland spirits... or something more sinister.',
        type: 'wilderness' as const,
        properties: {
          restArea: false,
          merchant: false,
          dangerLevel: 3,
          weather: 'overcast'
        },
        encounters: {
          common: ['forest-spirit-encounter', 'herb-gathering'],
          uncommon: ['hermit-philosopher', 'legendary-elk'],
          rare: ['ancient-tree-spirit']
        },
        resources: ['herbs', 'mushrooms', 'wood', 'berries', 'crystals'],
        npcs: ['hermit-philosopher', 'legendary-elk'],
        availableActions: ['explore', 'gather-resources', 'seek-spirits', 'rest-carefully']
      }
    };

    // Default to starting town if no specific location
    const location = locations['starting-town'];

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error getting location' });
  }
};

export const moveToLocationController = async (req: Request, res: Response) => {
  try {
    const { uid, targetLocation } = req.body;
    
    if (!uid || !targetLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!targetLocation.area || !targetLocation.coordinates) {
      return res.status(400).json({ message: 'Invalid location data' });
    }

    // Mock location validation - check if area is unlocked
    const unlockedAreas = ['starting-town', 'forest-north'];
    if (!unlockedAreas.includes(targetLocation.area)) {
      return res.status(403).json({ message: 'Area not accessible' });
    }

    // Mock successful movement
    const result = {
      success: true,
      newLocation: targetLocation,
      message: `Successfully moved to ${targetLocation.area}`
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error moving to location' });
  }
};

export const getAvailableAreasController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid uid parameter' });
    }

    // Mock available areas based on game progression
    const areas = [
      { 
        id: 'starting-town', 
        name: 'Harbor Town', 
        unlocked: true,
        description: 'Your peaceful starting location'
      },
      { 
        id: 'forest-north', 
        name: 'Northern Forest', 
        unlocked: true,
        description: 'A mysterious forest with ancient spirits'
      },
      { 
        id: 'labyrinth-entrance', 
        name: 'Labyrinth Entrance', 
        unlocked: false,
        description: 'The legendary labyrinth doors (Requires boat)'
      },
      { 
        id: 'empire-city', 
        name: 'Empire City', 
        unlocked: false,
        description: 'The advanced civilization beyond the labyrinth'
      },
      { 
        id: 'necronia', 
        name: 'Necronia', 
        unlocked: false,
        description: 'The dark city of cultists and demons (Special unlock required)'
      }
    ];

    res.status(200).json({ areas });
  } catch (error) {
    res.status(500).json({ message: 'Error getting available areas' });
  }
};