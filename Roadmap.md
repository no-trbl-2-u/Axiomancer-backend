# Axiomancer Backend Development Roadmap

## Overview
This roadmap outlines all the game mechanics that need to be implemented in the backend. Since calculations will happen on the frontend, the backend focuses on character persistence and game state management.

## 1. Character Management System
**Status:** Not Implemented  
**Priority:** High  
**Description:** Core character creation, stats, and persistence system.

### Features to Implement:
- Character creation with race selection (Elf, Drake, Arc-mage + locked options)
- Character stats management (Body, Mind, Heart, HP, MP, Experience)
- Character progression and leveling system
- Character portrait and appearance data storage
- Character authentication and ownership validation

### Backend Requirements:
- Character model with all stats and metadata
- Character creation endpoint
- Character retrieval endpoint
- Character update endpoint
- Character deletion endpoint

## 2. Game State Management
**Status:** Not Implemented  
**Priority:** High  
**Description:** Persistent game world state and player progress tracking.

### Features to Implement:
- Player location tracking (current map, coordinates)
- Game progression state (childhood → adulthood phases)
- Story progression markers and unlocked areas
- Save/load game functionality
- Multiple save slots per user

### Backend Requirements:
- GameState model with location and progression data
- Get game state endpoint
- Update game state endpoint
- Save game endpoint
- Load game endpoint

## 3. Inventory and Equipment System
**Status:** Not Implemented  
**Priority:** Medium  
**Description:** Item management, equipment, and loot system.

### Features to Implement:
- Item database with stats and effects
- Player inventory management
- Equipment slots (weapons, armor, accessories)
- Item effects on character stats
- Loot generation and rarity system

### Backend Requirements:
- Item model with stats and effects
- Inventory model linked to characters
- Get inventory endpoint
- Update inventory endpoint
- Equipment management endpoints

## 4. Combat System Data
**Status:** Not Implemented  
**Priority:** Medium  
**Description:** Combat-related data persistence (not calculations).

### Features to Implement:
- Combat log storage for important battles
- Special attacks and abilities unlocked
- Fallacy and paradox knowledge tracking
- Combat statistics and win/loss records
- Demon contracts and soul-binding status

### Backend Requirements:
- Combat abilities model
- Combat log model
- Special attacks/fallacies database
- Combat statistics tracking

## 5. Exploration and Location System
**Status:** Not Implemented  
**Priority:** Medium  
**Description:** World map, locations, and exploration progress.

### Features to Implement:
- Location database with descriptions and events
- Exploration progress tracking
- Area unlock conditions
- Random event triggers and history
- Map discovery system

### Backend Requirements:
- Location model with metadata
- Exploration progress model
- Area unlock tracking
- Event history storage

## 6. Faction and Relationship System
**Status:** Not Implemented  
**Priority:** Low  
**Description:** NPC relationships and faction standings.

### Features to Implement:
- Faction reputation tracking
- NPC relationship status
- Moral choice consequences storage
- Alliance and enemy tracking
- Philosophical alignment tracking

### Backend Requirements:
- Faction model with reputation data
- NPC relationship model
- Moral choice history storage
- Alignment tracking system

## 7. Quest and Story System
**Status:** Not Implemented  
**Priority:** Low  
**Description:** Quest progress and story milestone tracking.

### Features to Implement:
- Quest database with conditions and rewards
- Quest progress tracking per character
- Story milestone markers
- Multiple ending path tracking
- Achievement system

### Backend Requirements:
- Quest model with metadata
- Quest progress tracking
- Story milestone storage
- Achievement tracking

## 8. Demon Contract System
**Status:** Not Implemented  
**Priority:** Low  
**Description:** Special demon interaction and soul-binding mechanics.

### Features to Implement:
- Demon contract database
- Soul sacrifice tracking
- Contract terms and conditions storage
- Demon summoning availability
- Contract violation consequences

### Backend Requirements:
- Demon contract model
- Soul status tracking
- Contract violation system
- Demon interaction history

## 9. Boat Building System
**Status:** Not Implemented  
**Priority:** Low  
**Description:** Childhood phase boat crafting mechanics.

### Features to Implement:
- Boat piece collection tracking
- Boat building progress
- Required materials database
- Boat completion status

### Backend Requirements:
- Boat building progress model
- Material collection tracking
- Crafting recipe system

## 10. Labyrinth Progress System
**Status:** Not Implemented  
**Priority:** Low  
**Description:** Labyrinth exploration and aging mechanics.

### Features to Implement:
- Labyrinth chamber progress
- Age progression tracking
- Puzzle completion status
- Labyrinth loot and discovery history

### Backend Requirements:
- Labyrinth progress model
- Age tracking system
- Chamber completion status
- Discovery history storage

## Implementation Priority Order
1. **Phase 1 (Critical):** Character Management + Game State Management
2. **Phase 2 (Core Gameplay):** Inventory System + Combat Data
3. **Phase 3 (World Building):** Exploration + Location System
4. **Phase 4 (Advanced Features):** Faction System + Quest System
5. **Phase 5 (Special Mechanics):** Demon Contracts + Boat Building + Labyrinth

## Technical Notes
- All game calculations will be handled on the frontend
- Backend serves as persistent storage and state management
- RESTful API design with proper error handling
- MongoDB for flexible document storage
- Proper authentication and authorization for all endpoints
- Data validation using Zod schemas