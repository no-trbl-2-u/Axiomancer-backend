import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Global test utilities
export const createMockUser = () => ({
  uid: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com'
});

export const createMockCharacter = () => ({
  uid: 'test-user-id',
  name: 'Test Character',
  race: 'elf',
  portrait: 'elf-portrait-1',
  level: 1,
  experience: 0,
  experienceToNext: 100,
  stats: {
    body: 10,
    mind: 10,
    heart: 10,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50
  },
  location: {
    area: 'starting-town',
    coordinates: { x: 0, y: 0 }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

export const createMockGameState = () => ({
  uid: 'test-user-id',
  characterId: 'test-character-id',
  phase: 'childhood',
  currentLocation: {
    area: 'starting-town',
    coordinates: { x: 0, y: 0 }
  },
  unlockedAreas: ['starting-town'],
  questProgress: {},
  storyMilestones: [],
  saveSlot: 1,
  lastSaved: new Date()
});