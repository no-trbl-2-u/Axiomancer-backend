import { Schema, model } from 'mongoose';
import { GameState, GamePhase, StoryMilestone } from './gamestate.types.js';

const locationSchema = new Schema({
  area: { type: String, required: true },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }
}, { _id: false });

const questProgressSchema = new Schema({}, { strict: false, _id: false });

const storyMilestoneSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, required: true }
}, { _id: false });

const gameStateSchema = new Schema<GameState>({
  uid: { type: String, required: true },
  characterId: { type: String, required: true },
  saveSlot: { 
    type: Number, 
    required: true,
    min: 1,
    max: 3
  },
  phase: {
    type: String,
    required: true,
    enum: ['childhood', 'labyrinth', 'adulthood'] as GamePhase[],
    default: 'childhood'
  },
  currentLocation: { type: locationSchema, required: true },
  unlockedAreas: [{ type: String, required: true }],
  questProgress: { type: questProgressSchema, default: {} },
  storyMilestones: [storyMilestoneSchema],
  lastSaved: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

// Ensure unique save slot per user
gameStateSchema.index({ uid: 1, saveSlot: 1 }, { unique: true });

// Set defaults for new game states
gameStateSchema.pre('save', async function() {
  if (!this.isNew) {
    this.lastSaved = new Date();
    return;
  }
  
  // Set starting location and unlocked areas for new games
  if (!this.currentLocation) {
    this.currentLocation = {
      area: 'starting-town',
      coordinates: { x: 0, y: 0 }
    };
  }
  
  if (!this.unlockedAreas || this.unlockedAreas.length === 0) {
    this.unlockedAreas = ['starting-town'];
  }
  
  if (!this.phase) {
    this.phase = 'childhood';
  }
});

// Method to unlock new area
gameStateSchema.methods.unlockArea = function(areaName: string) {
  if (!this.unlockedAreas.includes(areaName)) {
    this.unlockedAreas.push(areaName);
  }
};

// Method to add story milestone
gameStateSchema.methods.addMilestone = function(milestone: Omit<StoryMilestone, 'timestamp'>) {
  const existingMilestone = this.storyMilestones.find((m: StoryMilestone) => m.id === milestone.id);
  if (!existingMilestone) {
    this.storyMilestones.push({
      ...milestone,
      timestamp: new Date()
    });
  }
};

// Method to update quest progress
gameStateSchema.methods.updateQuestProgress = function(questId: string, progress: number, maxProgress: number) {
  if (!this.questProgress) {
    this.questProgress = {};
  }
  
  this.questProgress[questId] = {
    progress,
    maxProgress,
    completed: progress >= maxProgress
  };
  this.markModified('questProgress');
};

export const GameStateModel = model<GameState>('GameState', gameStateSchema);