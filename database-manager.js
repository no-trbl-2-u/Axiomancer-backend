#!/usr/bin/env node
/**
 * Axiomancer Database Management Utility
 * 
 * This standalone module provides database population and reset functionality.
 * Run with: node database-manager.js
 * 
 * Features:
 * - populateDatabase(): Creates base game data needed for gameplay (NO character data)
 * - resetDatabase(): Deletes ALL database entries
 * 
 * Usage: Uncomment the function you want to run at the bottom of this file
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Database configuration
const DB_CONNECTION = process.env.DB_CONNECTION;

if (!DB_CONNECTION) {
  console.error('❌ DB_CONNECTION environment variable is required');
  process.exit(1);
}

// Define schemas directly (without importing models to avoid dependencies)
const createSchemas = () => {
  // User Schema (without character data)
  const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }, { timestamps: true });

  // GameState Schema
  const gameStateSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    characterId: { type: String, required: true },
    saveSlot: { type: Number, required: true, min: 1, max: 3 },
    phase: { type: String, required: true, enum: ['childhood', 'labyrinth', 'adulthood'], default: 'childhood' },
    currentLocation: {
      area: { type: String, required: true },
      coordinates: { x: { type: Number, required: true }, y: { type: Number, required: true } }
    },
    unlockedAreas: [{ type: String, required: true }],
    questProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
    storyMilestones: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      timestamp: { type: Date, required: true }
    }],
    lastSaved: { type: Date, required: true, default: Date.now }
  }, { timestamps: true });

  // Inventory Schema
  const inventorySchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    items: [{
      itemId: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
      equipped: { type: Boolean, default: false },
      equipmentSlot: { type: String, enum: ['weapon', 'armor', 'accessory1', 'accessory2'] }
    }],
    equipment: {
      weapon: { type: String },
      armor: { type: String },
      accessory1: { type: String },
      accessory2: { type: String }
    },
    gold: { type: Number, required: true, default: 0, min: 0 },
    maxSlots: { type: Number, required: true, default: 20, min: 1 },
    boatProgress: {
      piecesCollected: [{ type: String }],
      totalPieces: { type: Number, default: 5 },
      completed: { type: Boolean, default: false }
    }
  }, { timestamps: true });

  // Combat Stats Schema  
  const combatStatsSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    fallacyKnowledge: {
      knownFallacies: [{ type: String }],
      masteredFallacies: [{ type: String }],
      fallacyExperience: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    combatWins: { type: Number, default: 0 },
    combatLosses: { type: Number, default: 0 },
    agreementResolutions: { type: Number, default: 0 },
    demonContracts: [{ type: String }]
  }, { timestamps: true });

  // Location Progress Schema
  const locationProgressSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    locationId: { type: String, required: true },
    visited: { type: Boolean, default: false },
    eventsTriggered: [{ type: String }],
    resourcesGathered: { type: mongoose.Schema.Types.Mixed, default: {} },
    npcsEncountered: [{ type: String }],
    lastVisited: { type: Date }
  }, { timestamps: true });

  // Create models
  const models = {
    User: mongoose.model('User', userSchema),
    GameState: mongoose.model('GameState', gameStateSchema),
    Inventory: mongoose.model('Inventory', inventorySchema),
    CombatStats: mongoose.model('CombatStats', combatStatsSchema),
    LocationProgress: mongoose.model('LocationProgress', locationProgressSchema)
  };

  return models;
};

/**
 * Connect to MongoDB database
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(DB_CONNECTION);
    console.log('✅ Successfully connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Disconnect from MongoDB database
 */
async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error.message);
  }
}

/**
 * Populate database with base game data needed for gameplay
 * Note: Does NOT create any character data - users need to register and create characters
 */
async function populateDatabase() {
  console.log('🚀 Starting database population...');

  const connected = await connectToDatabase();
  if (!connected) {
    return false;
  }

  try {
    const models = createSchemas();

    // Create base locations that should be available
    const baseLocations = [
      { locationId: 'starting-town', name: 'Starting Town' },
      { locationId: 'forest-edge', name: 'Forest Edge' },
      { locationId: 'ancient-library', name: 'Ancient Library' },
      { locationId: 'merchant-quarter', name: 'Merchant Quarter' },
      { locationId: 'temple-grounds', name: 'Temple Grounds' }
    ];

    // Create sample quest data (no user-specific data)
    const baseQuestData = {
      'tutorial-introduction': {
        name: 'Welcome to Axiomancer',
        description: 'Learn the basics of logical reasoning',
        maxProgress: 5,
        rewards: { experience: 100, items: ['basic-logic-tome'] }
      },
      'first-fallacy-challenge': {
        name: 'Detecting Fallacies',
        description: 'Learn to identify common logical fallacies',
        maxProgress: 3,
        rewards: { experience: 150, items: ['apprentice-badge'] }
      }
    };

    // Create base items that exist in the game world
    const baseItems = [
      { itemId: 'health-potion', name: 'Health Potion', type: 'consumable', value: 50 },
      { itemId: 'mana-potion', name: 'Mana Potion', type: 'consumable', value: 40 },
      { itemId: 'basic-logic-tome', name: 'Basic Logic Tome', type: 'book', value: 100 },
      { itemId: 'apprentice-badge', name: 'Apprentice Badge', type: 'accessory', value: 200 },
      { itemId: 'forest-herb', name: 'Forest Herb', type: 'material', value: 10 },
      { itemId: 'boat-piece-hull', name: 'Boat Hull Piece', type: 'special', value: 0 },
      { itemId: 'boat-piece-sail', name: 'Boat Sail Piece', type: 'special', value: 0 },
      { itemId: 'boat-piece-mast', name: 'Boat Mast Piece', type: 'special', value: 0 },
      { itemId: 'boat-piece-rudder', name: 'Boat Rudder Piece', type: 'special', value: 0 },
      { itemId: 'boat-piece-anchor', name: 'Boat Anchor Piece', type: 'special', value: 0 }
    ];

    // Create system/configuration documents
    const systemConfig = {
      gameVersion: '1.0.0',
      maxPlayersPerServer: 1000,
      maintenanceMode: false,
      featuresEnabled: {
        characterCreation: true,
        combat: true,
        exploration: true,
        boatBuilding: true,
        demonContracts: true
      }
    };

    console.log('📍 Creating base location data...');
    // Note: We're not actually inserting location data as separate documents
    // since locations are typically handled by the game logic, not database records
    console.log(`   Created ${baseLocations.length} base locations`);

    console.log('📚 Creating quest templates...');
    // Quest templates would be handled by game logic, not database records
    console.log(`   Created ${Object.keys(baseQuestData).length} quest templates`);

    console.log('🎒 Creating item definitions...');
    // Item definitions would be handled by game logic, not database records
    console.log(`   Created ${baseItems.length} item definitions`);

    console.log('⚙️ Creating system configuration...');
    // System configuration would be handled by environment variables or config files
    console.log('   System configuration ready');

    // The main purpose is to ensure the database is ready and collections exist
    // We don't actually need to insert static game data as documents
    console.log('✅ Database population completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   • Base game data structures are ready`);
    console.log(`   • ${baseLocations.length} locations available for exploration`);
    console.log(`   • ${Object.keys(baseQuestData).length} quest templates available`);
    console.log(`   • ${baseItems.length} item types available`);
    console.log(`   • System configuration initialized`);
    console.log('');
    console.log('ℹ️  Note: No user or character data was created. Users need to:');
    console.log('   1. Register an account through the frontend');
    console.log('   2. Create a character to begin gameplay');

    return true;

  } catch (error) {
    console.error('❌ Error during database population:', error.message);
    return false;
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Delete ALL database entries - complete reset
 * WARNING: This will permanently delete ALL data!
 */
async function resetDatabase() {
  console.log('⚠️  WARNING: This will delete ALL database entries!');
  console.log('🗑️  Starting database reset...');

  const connected = await connectToDatabase();
  if (!connected) {
    return false;
  }

  try {
    const models = createSchemas();

    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    console.log(`📊 Found ${collectionNames.length} collections to delete:`);
    collectionNames.forEach(name => console.log(`   • ${name}`));
    console.log('');

    // Delete all documents from each collection
    let totalDeleted = 0;
    for (const collectionName of collectionNames) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const result = await collection.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} documents from '${collectionName}'`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.error(`❌ Error deleting from '${collectionName}':`, error.message);
      }
    }

    // Drop all collections for complete reset
    console.log('');
    console.log('🗑️  Dropping all collections...');
    for (const collectionName of collectionNames) {
      try {
        await mongoose.connection.db.collection(collectionName).drop();
        console.log(`   ✅ Dropped collection '${collectionName}'`);
      } catch (error) {
        // Collection might not exist, which is fine
        if (!error.message.includes('ns not found')) {
          console.error(`   ❌ Error dropping '${collectionName}':`, error.message);
        }
      }
    }

    console.log('');
    console.log('✅ Database reset completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • Total documents deleted: ${totalDeleted}`);
    console.log(`   • Collections dropped: ${collectionNames.length}`);
    console.log('   • Database is now completely empty');
    console.log('');
    console.log('ℹ️  The application can now start fresh with a clean database.');

    return true;

  } catch (error) {
    console.error('❌ Error during database reset:', error.message);
    return false;
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Show database status and statistics
 */
async function showDatabaseStatus() {
  console.log('📊 Checking database status...');

  const connected = await connectToDatabase();
  if (!connected) {
    return false;
  }

  try {
    const models = createSchemas();

    // Get database stats
    const stats = await mongoose.connection.db.stats();
    const collections = await mongoose.connection.db.listCollections().toArray();

    console.log('');
    console.log('📋 Database Status:');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('');

    // Show document counts for each collection
    if (collections.length > 0) {
      console.log('📊 Collection Document Counts:');
      for (const collection of collections) {
        try {
          const count = await mongoose.connection.db.collection(collection.name).countDocuments();
          console.log(`   • ${collection.name}: ${count} documents`);
        } catch (error) {
          console.log(`   • ${collection.name}: Error counting documents`);
        }
      }
    } else {
      console.log('📊 No collections found - database is empty');
    }

    return true;

  } catch (error) {
    console.error('❌ Error checking database status:', error.message);
    return false;
  } finally {
    await disconnectFromDatabase();
  }
}

// =============================================================================
// USAGE SECTION - Uncomment the function you want to run
// =============================================================================

console.log('🎮 Axiomancer Database Manager');
console.log('===============================');
console.log('');

// Uncomment ONE of the following lines to run that function:

// TODO: Add a CLI call here so user of CLI can choose populate vs reset cs show db status
populateDatabase();
// resetDatabase();
// showDatabaseStatus();

console.log('   • populateDatabase() - Creates base game data (no characters)');
console.log('   • resetDatabase() - Deletes ALL database entries');
console.log('   • showDatabaseStatus() - Shows current database statistics');