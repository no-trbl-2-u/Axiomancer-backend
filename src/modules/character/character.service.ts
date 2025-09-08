import { CharacterModel } from './character.model.js';
import { Character, CharacterCreateRequest, CharacterUpdateRequest, CharacterDocument } from './character.types.js';
import { UserModel } from '../user/user.model.js';

export const createCharacter = async (data: CharacterCreateRequest): Promise<Character | { message: string }> => {
  // Check if user exists
  const user = await UserModel.findOne({ uid: data.uid });
  if (!user) {
    return { message: 'User not found' };
  }

  // Check if user already has a character
  const existingCharacter = await CharacterModel.findOne({ uid: data.uid });
  if (existingCharacter) {
    return { message: 'User already has a character' };
  }

  const newCharacter = await CharacterModel.create({
    uid: data.uid,
    name: data.name,
    portrait: data.portrait,
    age: data.age || 8,
    race: 'elf' // Default race, can be mapped from portrait later
  });
  
  // Calculate detailed stats and format response
  const detailedStats = (newCharacter as any).calculateDetailedStats();
  const character = newCharacter.toObject();
  
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
    return { message: 'User not found' };
  }

  const characterDoc = await CharacterModel.findOne({ uid });
  
  if (!characterDoc) {
    return { hasCharacter: false };
  }

  // Calculate detailed stats
  const detailedStats = (characterDoc as any).calculateDetailedStats();
  const character = characterDoc.toObject();
  
  return { 
    hasCharacter: true, 
    character: {
      ...character,
      id: character._id?.toString(),
      detailedStats
    }
  };
};

export const getCharacterById = async (characterId: string): Promise<Character | { message: string }> => {
  const characterDoc = await CharacterModel.findById(characterId);
  
  if (!characterDoc) {
    return { message: 'Character not found' };
  }

  const detailedStats = (characterDoc as any).calculateDetailedStats();
  const character = characterDoc.toObject();
  
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