import { CharacterModel } from './character.model.js';
import { Character, CharacterCreateRequest, CharacterUpdateRequest, CharacterDocument } from './character.types.js';
import { UserModel } from '../user/user.model.js';

export const createCharacter = async (data: CharacterCreateRequest): Promise<Character | { message: string }> => {
  console.log('createCharacter service called with data:', data);
  console.log('UID in service data:', data.uid);
  console.log('Type of UID:', typeof data.uid);
  
  if (!data.uid) {
    console.log('ERROR: UID is undefined in service!');
    return { message: 'UID is required but was not provided' };
  }
  
  // Check if user exists - add more debugging
  const user = await UserModel.findOne({ uid: data.uid });
  console.log('User found:', user ? 'Yes' : 'No');
  
  if (!user) {
    // Log all users for debugging
    const allUsers = await UserModel.find({}, { uid: 1, username: 1 }).lean();
    console.log('All users in database:', allUsers);
    return { message: `User not found for UID: ${data.uid}` };
  }

  // Check if user already has a character
  const existingCharacter = await CharacterModel.findOne({ uid: data.uid });
  if (existingCharacter) {
    return { message: 'User already has a character' };
  }

  // Calculate initial stats based on portrait
  const portraitStats = {
    'scout': { body: 8, mind: 10, heart: 6 },
    'archer': { body: 9, mind: 8, heart: 7 },
    'arc-mage': { body: 6, mind: 12, heart: 8 },
    'priestess': { body: 7, mind: 9, heart: 10 },
  };

  const baseStats = portraitStats[data.portrait as keyof typeof portraitStats] || { body: 8, mind: 8, heart: 8 };
  const maxHp = baseStats.body * 10;
  const maxMp = baseStats.mind * 5;

  const newCharacter = await CharacterModel.create({
    uid: data.uid,
    name: data.name,
    portrait: data.portrait,
    age: data.age || 12, // Default age for new characters
    race: data.race || 'elf', // Use provided race or default to elf
    stats: baseStats,
    currentHp: maxHp,
    maxHp: maxHp,
    currentMp: maxMp,
    maxMp: maxMp,
    location: {
      area: 'starting-town',
      coordinates: { x: 0, y: 0 }
    }
  });
  
  // Convert to plain object and add id and calculated detailed stats
  const character = newCharacter.toObject();
  const detailedStats = (newCharacter as any).calculateDetailedStats();
  
  return {
    ...character,
    id: character._id?.toString() || character.uid,
    detailedStats
  };
};

export const getCharacter = async (uid: string): Promise<{ hasCharacter: boolean; character?: Character } | { message: string }> => {
  // Check if user exists
  const user = await UserModel.findOne({ uid });
  if (!user) {
    // For character existence checks, if user doesn't exist, they don't have a character either
    // This handles the case where hasCharacter() is called immediately after registration
    return { hasCharacter: false };
  }

  const characterDoc = await CharacterModel.findOne({ uid });
  
  if (!characterDoc) {
    return { hasCharacter: false };
  }

  // Convert to plain object and add calculated detailed stats
  const character = characterDoc.toObject();
  console.log('🔍 Raw character from DB:', character);
  console.log('🔍 Character stats:', character.stats);
  
  const detailedStats = (characterDoc as any).calculateDetailedStats();
  console.log('🔍 Calculated detailed stats:', detailedStats);
  
  const result = { 
    hasCharacter: true, 
    character: {
      ...character,
      id: character._id?.toString(),
      detailedStats
    }
  };
  
  console.log('🔍 Final result character:', result.character);
  console.log('🔍 Final result character.stats:', result.character.stats);
  
  return result;
};

export const getCharacterById = async (characterId: string): Promise<Character | { message: string }> => {
  const characterDoc = await CharacterModel.findById(characterId);
  
  if (!characterDoc) {
    return { message: 'Character not found' };
  }

  // Convert to plain object and add calculated detailed stats
  const character = characterDoc.toObject();
  const detailedStats = (characterDoc as any).calculateDetailedStats();
  
  return {
    ...character,
    id: character._id?.toString(),
    detailedStats
  };
};

export const updateCharacter = async (data: CharacterUpdateRequest): Promise<Character | { message: string }> => {
  const character = await CharacterModel.findOne({ uid: data.uid });
  
  if (!character) {
    return { message: 'Character not found' };
  }

  // Update stats if provided
  if (data.stats) {
    Object.assign(character.stats, data.stats);
  }

  // Update location if provided
  if (data.location) {
    character.location = data.location;
  }

  // Handle experience updates and level ups
  if (data.experience !== undefined) {
    const experienceGain = data.experience - character.experience;
    if (experienceGain > 0) {
      (character as any).gainExperience(experienceGain);
    } else {
      character.experience = data.experience;
    }
  }

  await character.save();
  return character.toObject();
};

export const deleteCharacter = async (uid: string): Promise<{ message: string }> => {
  const character = await CharacterModel.findOne({ uid });
  
  if (!character) {
    return { message: 'Character not found' };
  }

  await CharacterModel.deleteOne({ uid });
  return { message: 'Character deleted successfully' };
};

export const getCharacterStats = async (uid: string): Promise<Character | { message: string }> => {
  const character = await CharacterModel.findOne({ uid }, { _id: 0, __v: 0 }).lean();
  
  if (!character) {
    return { message: 'Character not found' };
  }

  return character;
};

export const validateCharacterOwnership = async (uid: string, characterUid?: string): Promise<boolean> => {
  const character = await CharacterModel.findOne({ uid: characterUid || uid });
  return character?.uid === uid;
};