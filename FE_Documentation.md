# Axiomancer: Complete Game Implementation Overview

## Table of Contents
1. [Game Concept & Vision](#game-concept--vision)
2. [Current Implementation Status](#current-implementation-status)
3. [Frontend Architecture](#frontend-architecture)
4. [Game Systems Deep Dive](#game-systems-deep-dive)
5. [User Interface Components](#user-interface-components)
6. [Backend API Requirements](#backend-api-requirements)
7. [Data Models & Relationships](#data-models--relationships)
8. [Technical Specifications](#technical-specifications)

---

## Game Concept & Vision

### What Is Axiomancer?
Axiomancer is a philosophical RPG that combines dark fantasy aesthetics (inspired by Mork Borg, Elden Ring, and BuriedBornes) with unique intellectual combat mechanics. Instead of traditional sword-and-sorcery combat, players engage in **philosophical warfare** using logical fallacies, paradoxes, and rhetorical strategies.

### Core Game Loop
1. **Character Creation**: Choose portrait/race with stat bonuses
2. **Exploration**: Navigate dark fantasy locations with atmospheric descriptions
3. **Combat**: Turn-based philosophical battles using Body/Mind/Heart system
4. **Progression**: Level up, allocate stats, learn new fallacies and paradoxes
5. **Aging**: Characters age through labyrinth progression, gaining wisdom
6. **Choice-Based Story**: Multiple endings based on moral decisions and demon contracts

### Three-Phase Journey
1. **Childhood (Boat Building)**: Collect boat pieces in starting town and forest
2. **Labyrinth (Aging)**: Navigate chambers that age you 1 year each, gain wisdom
3. **Adulthood (Empire Politics)**: Use accumulated knowledge to become King's advisor

---

## Current Implementation Status

### ✅ Fully Implemented & Tested (59 passing tests)

#### Core Game Systems
- **Combat System**: Complete D20 mechanics with advantage system
- **Character Progression**: Leveling, stat allocation, aging mechanics
- **Location System**: Starting town + northern forest with encounters
- **Fallacy System**: 8 philosophical fallacies/paradoxes with combat integration
- **Equipment System**: Items with stat bonuses, rarity, level requirements

#### Frontend Components
- **Authentication Flow**: Registration, login, logout with JWT simulation
- **Character Management**: Creation, selection, stat viewing
- **Exploration Interface**: Location descriptions, actions, character stats
- **Combat Interface**: Turn-based combat with fallacy mini-games
- **Responsive Design**: Mobile-first approach with dark fantasy theming

#### Backend API Structure
- **Mock Services**: Complete API interfaces for all game systems
- **Type Safety**: Full TypeScript implementation with proper error handling
- **Service Organization**: Modular APIs (gameAPI, questAPI, specialMechanicsAPI)

### 🚧 Partially Implemented
- **Inventory Management**: Basic structure, needs full implementation
- **Quest System**: Framework ready, content needs expansion
- **Save/Load System**: API designed, persistence layer needed

### ⏳ Not Yet Implemented
- **Real Backend**: All APIs are currently mocks
- **Advanced Locations**: Labyrinth, Empire City, Necronia
- **Demon Contract System**: API structure ready, integration needed
- **Skill Trees**: Body/Mind/Heart specialization paths

---

## Frontend Architecture

### Technology Stack
- **React 18** with TypeScript
- **Emotion/React** for styling
- **Context API** for state management
- **Jest** for testing
- **Create React App** foundation

### Project Structure
```
src/
├── Pages/                    # Main application screens
│   ├── LandingPage/         # Game introduction and navigation
│   ├── RegisterPage/        # User registration
│   ├── LoginPage/           # User authentication  
│   ├── LoadingPage/         # Atmospheric loading screen
│   ├── CharacterPage/       # Character selection/creation
│   ├── ExplorationPage/     # World navigation and location interaction
│   └── CombatPage/          # Turn-based philosophical combat
├── context/                 # React Context providers
│   ├── AuthContext.tsx      # User authentication state
│   └── CharacterContext.tsx # Character data management
├── systems/                 # Core game logic
│   ├── CombatSystem.ts      # D20 combat mechanics
│   ├── CharacterProgression.ts # Leveling and stats
│   ├── LocationSystem.ts    # World exploration
│   └── FallacyParadoxSystem.ts # Philosophical knowledge
├── services/                # Backend API interfaces
│   ├── gameAPI.ts          # Core game data
│   ├── questAPI.ts         # Quests and achievements
│   └── specialMechanicsAPI.ts # Advanced features
└── __tests__/              # Comprehensive test suite
```

### State Management Architecture

#### AuthContext
```typescript
interface AuthContextType {
  isLoggedIn: boolean;
  uid: string | null;
  runLoginUser: (credentials: LoginCredentials) => Promise<void>;
  runCreateUser: (userData: CreateUserData) => Promise<void>;
  logout: () => void;
  // Status tracking for UI feedback
  loginStatus: 'idle' | 'pending' | 'success' | 'error';
  createUserStatus: 'idle' | 'pending' | 'success' | 'error';
  loginError: string | null;
  createUserError: string | null;
}
```

#### CharacterContext  
```typescript
interface CharacterContextType {
  character: Character | null;
  availablePortraits: PortraitData[];
  hasCharacter: boolean;
  createCharacter: (data: CharacterCreationData) => Promise<void>;
  loadCharacter: () => Promise<void>;
  // Additional character management functions
}
```

---

## Game Systems Deep Dive

### 1. Combat System (`src/systems/CombatSystem.ts`)

#### D20 Mechanics
```typescript
// Core combat calculation
function calculateCombat(
  playerAction: CombatAction,    // Body/Mind/Heart + Attack/SpecialAttack/Defend
  enemyAction: CombatAction,
  playerStats: CombatantStats,
  enemyStats: CombatantStats,
  buffs: BuffDebuff[],
  agreementPoints: number
): CombatResult
```

#### Hit System
- **Hit Calculation**: 1d20 + accuracy vs evasion
- **Success**: Deal damage if hit roll beats evasion

#### Damage System
- **Normal Combat**: 1d6 base damage
- **Advantage**: 1d8 damage (Body>Mind, Mind>Heart, Heart>Body)
- **Disadvantage**: 1d4 damage
- **Defending**: 1d4 damage (reduced)

#### Special Mechanics
- **Fallacy Defense**: When defending, player faces fallacy mini-game
  - Correct identification: 75% damage reduction
  - Wrong answer: Full damage
- **Agreement Points**: Both players defending = +1 point (3 = peaceful victory)
- **Buff/Debuff System**: Turn-based effects with duration

#### Example Combat Flow
```typescript
// 1. Player chooses: Body Attack, Enemy chooses: Mind Defend
// 2. Advantage calculation: Body > Mind = Advantage
// 3. Hit roll: 1d20 + player.accuracy vs enemy.evasion
// 4. If hit: 1d8 damage (advantage) vs 1d4 (defending)
// 5. Enemy gets fallacy challenge to reduce damage
// 6. Apply damage, check for victory conditions
```

### 2. Character Progression (`src/systems/CharacterProgression.ts`)

#### Base Stats System
- **Body**: Physical prowess, affects health and physical combat
- **Mind**: Intellectual capacity, affects mana and mental combat  
- **Heart**: Social/emotional intelligence, affects social combat

#### Experience & Leveling
```typescript
// Scaling experience formula
function calculateExperienceRequired(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Level up rewards
const levelUp = {
  statPoints: 3,    // Distribute among Body/Mind/Heart
  skillPoints: 1,   // For future skill trees
  healthIncrease: 5 + Math.floor(body / 2),
  manaIncrease: 3 + Math.floor(mind / 2)
};
```

#### Aging System (Unique Feature)
Characters age through labyrinth progression, with age affecting stat effectiveness:

```typescript
// Age multipliers affect detailed stats
const ageMultipliers = {
  youth: { body: 1.1, mind: 0.8, heart: 0.7 },      // Strong but naive
  adult: { body: 0.9, mind: 1.2, heart: 1.1 },      // Balanced wisdom
  elder: { body: 0.6, mind: 1.4, heart: 1.3 }       // Wise but frail
};
```

#### Equipment System
```typescript
interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  levelRequirement: number;
  statBonuses: Partial<DetailedStats>;
  specialEffects?: string[];
}

// Set bonuses for wearing multiple pieces
function calculateSetBonuses(items: Item[]): string[]
```

### 3. Fallacy & Paradox System (`src/systems/FallacyParadoxSystem.ts`)

#### Knowledge Progression
```typescript
interface PlayerKnowledge {
  knownFallacies: string[];      // Learned fallacies
  masteredFallacies: string[];   // 5+ successful identifications
  fallacyExperience: Record<string, number>; // Usage tracking
}
```

#### Famous Fallacies Implemented
- **Zeno's Paradox**: "Motion requires infinite steps, therefore impossible"
- **Ship of Theseus**: Identity paradox when all parts replaced
- **Ad Hominem**: Attack the person, not the argument
- **Straw Man**: Misrepresent opponent's position
- **False Dichotomy**: Present only two options when more exist
- **Liar's Paradox**: "This statement is false"
- **Appeal to Emotion**: Use feelings instead of logic
- **Bandwagon Fallacy**: Appeal to popularity

#### Combat Integration
```typescript
// Fallacy challenges appear when defending
interface FallacyChallenge {
  fallacyName: string;
  description: string;
  question: string;        // Philosophical scenario
  options: string[4];      // Multiple choice answers
  correctAnswer: number;   // Index of correct answer
}

// Damage reduction for correct identification
function calculateFallacyDefenseReduction(
  fallacy: Fallacy, 
  isCorrect: boolean, 
  knowledge: PlayerKnowledge
): number // 0.1 (90% reduction) to 1.0 (no reduction)
```

### 4. Location System (`src/systems/LocationSystem.ts`)

#### Current Locations

**Seafarer's Haven (Starting Town)**
- Peaceful fishing village with shops and rest
- NPCs: village elder, fisherman, merchant, tavern keeper
- Resources: fish, seaweed, driftwood
- Danger level: 0 (safe zone)

**Whispering Woods (Northern Forest)**  
- Dangerous wilderness with encounters
- NPCs: hermit philosopher, traveling merchant, legendary elk
- Resources: herbs, mushrooms, wood, berries
- Danger level: 3 (combat likely)

#### Dynamic Systems
```typescript
// Weather affects outdoor locations
interface Weather {
  current: WeatherType;
  visibility: number;     // 0-100
  temperature: number;
  effects: WeatherEffect[]; // Movement/combat modifiers
}

// Encounter tables with conditions
interface EncounterEntry {
  id: string;
  probability: number;
  conditions?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: WeatherType;
}
```

#### Resource Gathering
- Locations have harvestable resources
- Success based on character stealth level
- Different resources available by location type

---

## User Interface Components

### 1. Landing Page (`LandingPage.tsx`)
- **Purpose**: Game introduction and main navigation
- **Features**: Dark fantasy theming, atmospheric welcome
- **Navigation**: Routes to login, register, or game

### 2. Authentication Pages

#### Register Page (`RegisterPage.tsx`)
```typescript
// Registration form with validation
interface RegistrationData {
  username: string;
  email: string; 
  password: string;
  confirmPassword: string;
}

// Uses AuthContext.runCreateUser()
const handleSubmit = async (data: RegistrationData) => {
  await runCreateUser(data);
  // Handle success/error states
};
```

#### Login Page (`LoginPage.tsx`)
```typescript
// Login form
interface LoginCredentials {
  username: string;
  password: string;
}

// Uses AuthContext.runLoginUser()
const handleLogin = async (credentials: LoginCredentials) => {
  await runLoginUser(credentials);
  // Redirect on success
};
```

### 3. Character Management (`CharacterPage.tsx`)

#### Character Selection
- Display existing character or creation option
- Portrait gallery with stat bonuses
- Character stats overview with expandable details

#### Character Creation Modal (`CharacterCreationModal.tsx`)
```typescript
interface CharacterCreationData {
  name: string;
  portrait: 'elf' | 'Drake' | 'Arc-mage' | 'Air-lord' | 'Angel' | 'Arch-demon';
  age: number;
}

// Portrait bonuses (from implementation)
const portraitBonuses = {
  'elf': { body: 0, mind: 1, heart: 1 },
  'Drake': { body: 2, mind: 0, heart: 0 },
  'Arc-mage': { body: 0, mind: 2, heart: 0 },
  // Locked portraits with stronger bonuses
  'Air-lord': { body: 0, mind: 2, heart: 2 },
  'Angel': { body: 1, mind: 1, heart: 3 },
  'Arch-demon': { body: 3, mind: 2, heart: 1 }
};
```

### 4. Exploration Page (`ExplorationPage.tsx`)

#### Three-Panel Layout
1. **Location Description** (Left): Atmospheric text, available actions
2. **Map/Visual** (Center): Location representation, movement options  
3. **Character Stats** (Right): Expandable stats panel

#### Responsive Design
- **Desktop**: Three columns with full information
- **Tablet**: Stacked layout with collapsible sections
- **Mobile**: Single column with expandable character stats

### 5. Combat Page (`CombatPage.tsx`)

#### Combat Interface
- **Action Selection**: Body/Mind/Heart buttons
- **Action Type**: Attack/Special Attack/Defend options
- **Status Display**: Player and enemy health/mana
- **Combat Log**: Turn-by-turn narrative
- **Advantage Indicators**: Visual feedback for advantageous matchups

#### Fallacy Mini-Game
- Triggered when defending
- Multiple choice format
- Philosophical scenarios with explanations
- Immediate feedback on correctness

### 6. Loading Page (`LoadingPage.tsx`)
- **Atmospheric Loading**: Dark fantasy animations
- **State Transitions**: Between major game sections
- **Responsive**: Works across all device sizes

---

## Backend API Requirements

### Authentication Endpoints

```typescript
// User management
POST /api/create-user
POST /api/login-user  
POST /api/delete-user

// JWT token-based authentication
Headers: { Authorization: "Bearer <token>" }
```

### Character Management

```typescript
// Character CRUD
POST /api/create-character
GET  /api/get-character?characterId=string
PUT  /api/update-character
DELETE /api/delete-character

// Character creation request
interface CreateCharacterRequest {
  name: string;
  portrait: string;
  age: number;
}

// Character response (matches CharacterProgression.ts)
interface CharacterResponse {
  id: string;
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  age: number;
  stats: CharacterStats;
  detailedStats: DetailedStats;
  availableStatPoints: number;
  skillPoints: number;
  currentLocation: string;
  unlockedLocations: string[];
}
```

### Game State Management

```typescript
// Game state persistence
GET  /api/get-game-state?characterId=string&saveSlot=number
POST /api/update-game-state
POST /api/save-game
POST /api/load-game

interface GameStateResponse {
  characterId: string;
  currentLocation: string;
  unlockedLocations: string[];
  gamePhase: 'childhood' | 'adulthood' | 'labyrinth';
  storyProgress: Record<string, boolean>;
  visitHistory: Record<string, boolean>;
  saveSlot: number;
  lastSaved: string;
}
```

### Combat System

```typescript
// Combat session management
POST /api/initiate-combat
POST /api/combat-action
POST /api/fallacy-challenge
GET  /api/combat-statistics?characterId=string

interface CombatActionRequest {
  characterId: string;
  combatId: string;
  action: {
    type: 'Body' | 'Mind' | 'Heart';
    action: 'Attack' | 'SpecialAttack' | 'Defend';
  };
}

// Combat result calculation (server-side)
interface CombatResult {
  playerDamage: number;
  enemyDamage: number;
  playerBuffs: BuffDebuff[];
  enemyBuffs: BuffDebuff[];
  agreementPoints: number;
  fallacyChallenge?: FallacyChallenge;
  combatEnded: boolean;
  victor?: 'player' | 'enemy' | 'agreement';
}
```

### Inventory & Equipment

```typescript
// Inventory management
GET  /api/get-inventory?characterId=string
POST /api/add-item
POST /api/remove-item
POST /api/equip-item
POST /api/unequip-item

interface InventoryResponse {
  characterId: string;
  items: InventoryItem[];
  equipment: Equipment;
  maxCapacity: number;
}

interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessories: Item[];
}
```

### Exploration System

```typescript
// World exploration
GET  /api/get-location?characterId=string
POST /api/move-to-location
GET  /api/available-areas?characterId=string
POST /api/gather-resources
POST /api/rest-at-location

interface LocationResponse {
  area: string;
  coordinates: { x: number; y: number };
  name: string;
  description: string;
  type: 'town' | 'wilderness' | 'dungeon' | 'labyrinth';
  properties: LocationProperties;
  encounters: EncounterTable;
  resources: string[];
}
```

### Quest & Achievement System

```typescript
// Quest management
GET  /api/quest-progress?characterId=string
POST /api/update-quest
POST /api/unlock-achievement

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'hidden';
  status: 'available' | 'active' | 'completed' | 'failed';
  objectives: QuestObjective[];
  rewards: QuestRewards;
}
```

### Special Mechanics

```typescript
// Advanced features
GET  /api/demon-contracts?characterId=string
POST /api/sign-demon-contract
GET  /api/boat-progress?characterId=string
POST /api/craft-boat
GET  /api/labyrinth-progress?characterId=string
POST /api/enter-labyrinth-chamber
```

---

## Data Models & Relationships

### Core Entity Relationships

```
User (1) -> (1) Character
Character (1) -> (1) GameState
Character (1) -> (1) Inventory
Character (1) -> (*) CombatSessions
Character (1) -> (1) PlayerKnowledge
Character (1) -> (*) QuestProgress
Character (1) -> (*) Achievements
```

### Database Schema Requirements

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Characters Table
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  experience_to_next INTEGER DEFAULT 150,
  age INTEGER DEFAULT 15,
  portrait VARCHAR(50) NOT NULL,
  
  -- Base stats
  body INTEGER DEFAULT 8,
  mind INTEGER DEFAULT 6,
  heart INTEGER DEFAULT 5,
  health INTEGER DEFAULT 50,
  mana INTEGER DEFAULT 25,
  
  -- Progression
  available_stat_points INTEGER DEFAULT 0,
  skill_points INTEGER DEFAULT 0,
  
  -- Location
  current_location VARCHAR(100) DEFAULT 'starting_town',
  unlocked_locations TEXT[], -- JSON array
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Game States Table
```sql
CREATE TABLE game_states (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  save_slot INTEGER CHECK (save_slot >= 1 AND save_slot <= 3),
  game_phase VARCHAR(20) DEFAULT 'childhood',
  story_progress JSONB DEFAULT '{}',
  visit_history JSONB DEFAULT '{}',
  last_saved TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(character_id, save_slot)
);
```

#### Fallacy Knowledge Table
```sql
CREATE TABLE player_knowledge (
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  known_fallacies TEXT[],
  mastered_fallacies TEXT[],
  fallacy_experience JSONB DEFAULT '{}',
  
  PRIMARY KEY (character_id)
);
```

#### Inventory Table
```sql
CREATE TABLE inventories (
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  equipment JSONB DEFAULT '{"accessories": []}',
  max_capacity INTEGER DEFAULT 50,
  
  PRIMARY KEY (character_id)
);
```

### JSON Document Examples

#### Character Stats (Detailed)
```json
{
  "physicalAttack": 17,
  "physicalDefense": 13,
  "accuracy": 14,
  "speed": 13,
  "mentalAttack": 15,
  "mentalDefense": 11,
  "evasion": 10,
  "perception": 12,
  "socialAttack": 13,
  "socialDefense": 10,
  "ailmentAttack": 9,
  "ailmentDefense": 10
}
```

#### Fallacy Experience Tracking
```json
{
  "ad_hominem": 3,
  "straw_man": 1,
  "zenos_paradox": 0,
  "false_dichotomy": 2,
  "liar_paradox": 5
}
```

#### Equipment Setup
```json
{
  "weapon": {
    "id": "iron_sword",
    "name": "Iron Sword",
    "type": "weapon",
    "rarity": "common",
    "levelRequirement": 1,
    "statBonuses": {
      "physicalAttack": 5,
      "accuracy": 2
    }
  },
  "armor": null,
  "accessories": []
}
```

---

## Technical Specifications

### Performance Requirements
- **Load Times**: Pages should load within 2 seconds
- **Combat Response**: Combat calculations within 500ms
- **API Calls**: All API responses within 1 second
- **Mobile Performance**: Smooth experience on mid-range devices

### Security Considerations
- **JWT Authentication**: Secure token-based auth with expiration
- **Input Validation**: All user inputs validated server-side
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Sanitized output, CSP headers
- **Rate Limiting**: Prevent API abuse and spam

### Scalability Planning
- **Database Indexing**: Index frequently queried fields
- **Caching Strategy**: Redis for session data and frequently accessed game data
- **CDN Integration**: Static assets served via CDN
- **Horizontal Scaling**: API servers can be load balanced

### Testing Requirements
- **Unit Tests**: All game logic functions tested (current: 59 passing)
- **Integration Tests**: API endpoint testing with database
- **E2E Tests**: Complete user journey testing
- **Load Testing**: API performance under concurrent users

### Deployment Environment
- **Development**: Local development with mock APIs
- **Staging**: Full backend with test database
- **Production**: Scalable cloud deployment with monitoring

---

## Implementation Priorities

### Phase 1: Core Backend (2-3 weeks)
1. **Database Setup**: PostgreSQL with initial schema
2. **Authentication**: JWT-based user management  
3. **Character System**: Character CRUD with progression
4. **Combat Backend**: Server-side combat calculations
5. **Basic Location System**: Movement and state tracking

### Phase 2: Game Features (3-4 weeks)  
1. **Inventory System**: Full item and equipment management
2. **Quest Framework**: Quest progression and achievement tracking
3. **Save/Load System**: Multiple save slots with game state
4. **Fallacy Integration**: Server-side fallacy challenge generation
5. **Enhanced Locations**: Additional areas and encounters

### Phase 3: Advanced Features (4-5 weeks)
1. **Demon Contract System**: Soul sacrifice mechanics
2. **Labyrinth Progression**: Chamber-by-chamber aging system  
3. **Boat Building**: Resource collection and crafting
4. **Skill Trees**: Body/Mind/Heart specialization paths
5. **Multiple Endings**: Story branching and choice consequences

---

## Conclusion

Axiomancer represents a unique blend of philosophical depth and engaging gameplay mechanics. The frontend implementation provides a solid foundation with working game systems, comprehensive test coverage, and a clear architectural vision.

The backend developer should focus on implementing the API endpoints that match the existing TypeScript interfaces, ensuring data consistency with the established game logic, and maintaining the philosophical theme that makes this game special.

The current implementation proves the core concepts work - now it needs a robust backend to bring the full vision to life.

**Key Success Metrics:**
- All 233 tests passing (currently 59/233)
- Sub-second API response times
- Seamless character progression and save/load
- Stable combat system with fallacy integration
- Mobile-responsive gameplay experience

This foundation provides everything needed to create a compelling philosophical RPG that stands out in the gaming landscape.