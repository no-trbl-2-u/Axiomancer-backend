import { Schema, model } from 'mongoose';
import { Character, Race, DetailedStats, CharacterStats } from './character.types.js';

const locationSchema = new Schema({
  area: { type: String, required: true },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }
}, { _id: false });

const statsSchema = new Schema({
  body: { type: Number, required: true, min: 1 },
  mind: { type: Number, required: true, min: 1 },
  heart: { type: Number, required: true, min: 1 }
}, { _id: false });

const characterSchema = new Schema<Character>({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  race: {
    type: String,
    required: true,
    enum: ['elf', 'drake', 'arc-mage'] as Race[]
  },
  portrait: { type: String, required: true },
  level: { type: Number, required: true, default: 1, min: 1 },
  experience: { type: Number, required: true, default: 0, min: 0 },
  experienceToNext: { type: Number, required: true, default: 150, min: 1 },
  age: { type: Number, required: true, default: 12, min: 1 },
  currentHp: { type: Number, required: true, min: 0 },
  maxHp: { type: Number, required: true, min: 1 },
  currentMp: { type: Number, required: true, min: 0 },
  maxMp: { type: Number, required: true, min: 1 },
  stats: { type: statsSchema, required: true },
  location: { type: locationSchema, required: true },
  availableStatPoints: { type: Number, default: 0, min: 0 },
  skillPoints: { type: Number, default: 0, min: 0 },
  currentLocation: { type: String, default: 'starting-town' },
  unlockedLocations: [{ type: String, default: ['starting-town'] }]
}, { timestamps: true });

// Set starting stats based on race/portrait
characterSchema.pre('save', async function () {
  if (!this.isNew) return;

  // Default stats based on portrait/race
  type PortraitKey = 'scout' | 'archer' | 'arc-mage' | 'priestess' | 'default';
  const portraitStats: { [K in PortraitKey]: CharacterStats } = {
    'scout': { body: 8, mind: 10, heart: 6 },
    'archer': { body: 9, mind: 8, heart: 7 },
    'arc-mage': { body: 6, mind: 12, heart: 8 },
    'priestess': { body: 7, mind: 9, heart: 10 },
    // Fallback for other portraits
    'default': { body: 8, mind: 8, heart: 8 }
  };

  const portraitKey: PortraitKey = (typeof this.portrait === 'string' && this.portrait.trim() && (this.portrait in portraitStats))
    ? this.portrait as PortraitKey
    : 'default';
  const baseStats: CharacterStats = portraitStats[portraitKey];

  // Set base stats
  this.stats = baseStats;

  // Calculate HP/MP based on stats
  this.maxHp = baseStats.body * 10;
  this.currentHp = this.maxHp;
  this.maxMp = baseStats.mind * 5;
  this.currentMp = this.maxMp;

  // Set starting location
  this.location = {
    area: 'starting-town',
    coordinates: { x: 0, y: 0 }
  };
});

// Handle level up logic
characterSchema.methods.gainExperience = function (amount: number) {
  this.experience += amount;

  while (this.experience >= this.experienceToNext) {
    this.experience -= this.experienceToNext;
    this.level += 1;

    // Give stat points instead of auto-allocation (frontend-driven)
    this.availableStatPoints += 3;
    this.skillPoints += 1;

    // Recalculate max HP/MP
    this.maxHp = this.stats.body * 10;
    this.maxMp = this.stats.mind * 5;

    // Set new experience threshold (scaling formula)
    this.experienceToNext = Math.floor(150 * Math.pow(1.5, this.level - 1));
  }
};

// Calculate detailed stats from base stats (frontend field names)
characterSchema.methods.calculateDetailedStats = function (): DetailedStats {
  const baseStats = this.stats;
  const level = this.level;
  const age = this.age;

  // Age multipliers (childhood = stronger body, weaker mind/heart)
  const ageMultipliers = age <= 17 ? { body: 1.1, mind: 0.8, heart: 0.7 } :
    age <= 40 ? { body: 0.9, mind: 1.2, heart: 1.1 } :
      { body: 0.6, mind: 1.4, heart: 1.3 };

  const effectiveBody = Math.floor(baseStats.body * ageMultipliers.body);
  const effectiveMind = Math.floor(baseStats.mind * ageMultipliers.mind);
  const effectiveHeart = Math.floor(baseStats.heart * ageMultipliers.heart);

  return {
    // Body stats - using frontend field names
    physicalAtk: effectiveBody + level,
    physicalDef: effectiveBody + Math.floor(level / 2),
    accuracy: 50 + effectiveBody * 5,
    critDamage: 100 + effectiveBody * 10,
    constitution: 10 + effectiveBody * 2,

    // Mind stats
    mentalAtk: effectiveMind + level,
    mentalDef: effectiveMind + Math.floor(level / 2),
    evasion: 5 + effectiveMind * 2,
    perception: 10 + effectiveMind * 2,
    reflexSave: 8 + effectiveMind,

    // Heart stats
    charisma: 5 + effectiveHeart * 2,
    ailmentAtk: 2 + effectiveHeart,
    criticalRate: 5 + effectiveHeart * 2,
    willpower: 10 + effectiveHeart * 2,
    empathy: 8 + effectiveHeart,
    luck: 10 + effectiveHeart
  };
};

export const CharacterModel = model<Character>('Character', characterSchema);