import { GameStateModel } from './gamestate.model.js';
import { GameState, GameStateCreateRequest, GameStateUpdateRequest, StoryMilestone } from './gamestate.types.js';
import { UserModel } from '../user/user.model.js';
import { CharacterModel } from '../character/character.model.js';

export const createGameState = async (data: GameStateCreateRequest): Promise<GameState | { message: string }> => {
  // Check if user exists
  const user = await UserModel.findOne({ uid: data.uid });
  if (!user) {
    return { message: 'User not found' };
  }

  // Check if character exists
  const character = await CharacterModel.findOne({ uid: data.uid });
  if (!character) {
    return { message: 'Character not found' };
  }

  // Check if save slot already exists
  const existingGameState = await GameStateModel.findOne({ uid: data.uid, saveSlot: data.saveSlot });
  if (existingGameState) {
    return { message: 'Save slot already occupied' };
  }

  const newGameState = await GameStateModel.create(data);
  return newGameState.toObject();
};

export const getGameState = async (uid: string, saveSlot: number): Promise<GameState | { message: string }> => {
  // Check if user exists
  const user = await UserModel.findOne({ uid });
  if (!user) {
    return { message: 'User not found' };
  }

  if (saveSlot < 1 || saveSlot > 3) {
    return { message: 'Invalid save slot' };
  }

  const gameState = await GameStateModel.findOne({ uid, saveSlot }, { _id: 0, __v: 0 }).lean();
  
  if (!gameState) {
    return { message: 'No save found' };
  }

  return gameState;
};

export const updateGameState = async (data: GameStateUpdateRequest): Promise<GameState | { message: string }> => {
  const gameState = await GameStateModel.findOne({ uid: data.uid, saveSlot: data.saveSlot });
  
  if (!gameState) {
    return { message: 'Game state not found' };
  }

  // Validate area access before location update
  if (data.currentLocation && !gameState.unlockedAreas.includes(data.currentLocation.area)) {
    return { message: 'Area not unlocked' };
  }

  // Update fields
  if (data.phase) gameState.phase = data.phase;
  if (data.currentLocation) gameState.currentLocation = data.currentLocation;
  if (data.unlockedAreas) gameState.unlockedAreas = data.unlockedAreas;
  if (data.questProgress) {
    Object.assign(gameState.questProgress, data.questProgress);
    gameState.markModified('questProgress');
  }

  await gameState.save();
  return gameState.toObject();
};

export const saveGame = async (uid: string, saveSlot: number, gameStateData?: Partial<GameState>): Promise<GameState | { message: string }> => {
  if (saveSlot < 1 || saveSlot > 3) {
    return { message: 'Invalid save slot' };
  }

  let gameState = await GameStateModel.findOne({ uid, saveSlot });
  
  if (!gameState) {
    // Create new save if none exists
    const character = await CharacterModel.findOne({ uid });
    if (!character) {
      return { message: 'Character not found' };
    }
    
    gameState = await GameStateModel.create({
      uid,
      characterId: character._id.toString(),
      saveSlot,
      ...gameStateData
    });
  } else {
    // Update existing save
    if (gameStateData) {
      Object.assign(gameState, gameStateData);
    }
    await gameState.save();
  }

  return gameState.toObject();
};

export const loadGame = async (uid: string, saveSlot: number): Promise<GameState | { message: string }> => {
  return getGameState(uid, saveSlot);
};

export const getAllSaveSlots = async (uid: string): Promise<{ saveSlots: Array<{ slot: number; occupied: boolean; metadata?: any }> } | { message: string }> => {
  const user = await UserModel.findOne({ uid });
  if (!user) {
    return { message: 'User not found' };
  }

  const gameStates = await GameStateModel.find({ uid }, { _id: 0, __v: 0 }).lean();
  
  const saveSlots = [1, 2, 3].map(slot => {
    const gameState = gameStates.find(gs => gs.saveSlot === slot);
    return {
      slot,
      occupied: !!gameState,
      metadata: gameState ? {
        phase: gameState.phase,
        lastSaved: gameState.lastSaved,
        currentLocation: gameState.currentLocation
      } : undefined
    };
  });

  return { saveSlots };
};

export const deleteSave = async (uid: string, saveSlot: number): Promise<{ message: string }> => {
  if (saveSlot < 1 || saveSlot > 3) {
    return { message: 'Invalid save slot' };
  }

  const gameState = await GameStateModel.findOne({ uid, saveSlot });
  if (!gameState) {
    return { message: 'Save slot is already empty' };
  }

  await GameStateModel.deleteOne({ uid, saveSlot });
  return { message: 'Save deleted successfully' };
};

export const addStoryMilestone = async (uid: string, saveSlot: number, milestone: Omit<StoryMilestone, 'timestamp'>): Promise<GameState | { message: string }> => {
  const gameState = await GameStateModel.findOne({ uid, saveSlot });
  
  if (!gameState) {
    return { message: 'Game state not found' };
  }

  (gameState as any).addMilestone(milestone);
  await gameState.save();
  
  return gameState.toObject();
};

export const updateQuestProgress = async (uid: string, saveSlot: number, questId: string, progress: number, maxProgress: number): Promise<GameState | { message: string }> => {
  const gameState = await GameStateModel.findOne({ uid, saveSlot });
  
  if (!gameState) {
    return { message: 'Game state not found' };
  }

  (gameState as any).updateQuestProgress(questId, progress, maxProgress);
  await gameState.save();
  
  return gameState.toObject();
};