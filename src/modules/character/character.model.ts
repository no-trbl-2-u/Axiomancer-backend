import { Schema, model } from 'mongoose';
import { Character, Race, DetailedStats } from './character.types.js';

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
  heart: { type: Number, required: true, min: 1 },
  hp: { type: Number, required: true, min: 0 },
  maxHp: { type: Number, required: true, min: 1 },
  mp: { type: Number, required: true, min: 0 },
  maxMp: { type: Number, required: true, min: 1 }
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
  age: { type: Number, required: true, default: 15, min: 1 },
  stats: { type: statsSchema, required: true },
  location: { type: locationSchema, required: true },
  availableStatPoints: { type: Number, default: 0, min: 0 },
  skillPoints: { type: Number, default: 0, min: 0 },
  currentLocation: { type: String, default: 'starting-town' },
  unlockedLocations: [{ type: String, default: ['starting-town'] }]
}, { timestamps: true });

// Calculate maxHP based on body stat
statsSchema.pre('validate', function() {
  if (this.body) {
    this.maxHp = this.body * 10;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
  }
});

// Calculate maxMP based on mind stat  
statsSchema.pre('validate', function() {
  if (this.mind) {
    this.maxMp = this.mind * 5;
    if (this.mp > this.maxMp) {
      this.mp = this.maxMp;
    }
  }
});

// Set starting stats based on race
characterSchema.pre('save', async function() {
  if (!this.isNew) return;
  
  const raceStats = {
    'elf': { body: 8, mind: 12, heart: 10 },
    'drake': { body: 12, mind: 8, heart: 10 },
    'arc-mage': { body: 10, mind: 10, heart: 12 }
  };

  const baseStats = raceStats[this.race];
  this.stats = {
    ...baseStats,
    hp: baseStats.body * 10,
    maxHp: baseStats.body * 10,
    mp: baseStats.mind * 5,
    maxMp: baseStats.mind * 5
  };

  // Set starting location
  this.location = {
    area: 'starting-town',
    coordinates: { x: 0, y: 0 }
  };
});

// Handle level up logic
characterSchema.methods.gainExperience = function(amount: number) {
  this.experience += amount;
  
  while (this.experience >= this.experienceToNext) {
    this.experience -= this.experienceToNext;
    this.level += 1;
    
    // Give stat points instead of auto-allocation (frontend-driven)
    this.availableStatPoints += 3;
    this.skillPoints += 1;
    
    // Recalculate max HP/MP
    this.stats.maxHp = this.stats.body * 10;
    this.stats.maxMp = this.stats.mind * 5;
    
    // Set new experience threshold (scaling formula)
    this.experienceToNext = Math.floor(150 * Math.pow(1.5, this.level - 1));
  }
};

// Calculate detailed stats from base stats
characterSchema.methods.calculateDetailedStats = function(): DetailedStats {
  const baseStats = this.stats;
  const level = this.level;
  const age = this.age;
  
  // Age multipliers (from frontend docs)
  const ageMultipliers = age <= 17 ? { body: 1.1, mind: 0.8, heart: 0.7 } :
                        age <= 40 ? { body: 0.9, mind: 1.2, heart: 1.1 } :
                        { body: 0.6, mind: 1.4, heart: 1.3 };
  
  const effectiveBody = Math.floor(baseStats.body * ageMultipliers.body);
  const effectiveMind = Math.floor(baseStats.mind * ageMultipliers.mind);
  const effectiveHeart = Math.floor(baseStats.heart * ageMultipliers.heart);
  
  return {
    physicalAttack: effectiveBody + level,
    physicalDefense: effectiveBody + Math.floor(level / 2),
    accuracy: effectiveBody + effectiveMind,
    speed: Math.floor((effectiveBody + effectiveMind) / 2),
    mentalAttack: effectiveMind + level,
    mentalDefense: effectiveMind + Math.floor(level / 2),
    evasion: Math.floor((effectiveBody + effectiveHeart) / 2),
    perception: effectiveMind + effectiveHeart,
    socialAttack: effectiveHeart + level,
    socialDefense: effectiveHeart + Math.floor(level / 2),
    ailmentAttack: Math.floor((effectiveMind + effectiveHeart) / 2),
    ailmentDefense: Math.floor((effectiveBody + effectiveMind + effectiveHeart) / 3)
  };
};

export const CharacterModel = model<Character>('Character', characterSchema);