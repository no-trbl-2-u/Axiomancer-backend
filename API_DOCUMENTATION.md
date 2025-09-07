# Axiomancer Backend API Documentation

## Overview
This document provides comprehensive documentation for the Axiomancer game backend API. The backend serves as a persistent storage and state management system for a philosophical RPG where players navigate through childhood, labyrinth exploration, and adult political intrigue using logical reasoning and debate mechanics.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API uses simple UID-based authentication. All character and game-related endpoints require a valid `uid` parameter to identify the user.

---

## User Management

### Create User
**POST** `/create-user`

Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string", 
  "email": "string"
}
```

**Response (201 - Success):**
```json
{
  "uid": "uuid-string",
  "username": "string"
}
```

**Response (200 - Username/Email Exists):**
```json
{
  "message": "Username or email already exists"
}
```

### Login User
**POST** `/login-user`

Authenticate user and get UID.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 - Success):**
```json
{
  "uid": "uuid-string"
}
```

**Response (200 - Invalid Credentials):**
```json
{
  "message": "Invalid credentials"
}
```

### Delete User
**POST** `/delete-user`

Delete user account and all associated data.

**Request Body:**
```json
{
  "uid": "string"
}
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Character Management

### Create Character
**POST** `/create-character`

Create a new character for a user. Each user can only have one character.

**Request Body:**
```json
{
  "uid": "string",
  "name": "string",
  "race": "elf" | "drake" | "arc-mage",
  "portrait": "string"
}
```

**Race Stats:**
- **Elf**: High Mind (12), Medium Body (8), Medium Heart (10) - Intellectual approach
- **Drake**: High Body (12), Medium Mind (8), Medium Heart (10) - Physical approach  
- **Arc-mage**: High Heart (12), Medium Body (10), Medium Mind (10) - Charismatic approach

**Response (201):**
```json
{
  "uid": "string",
  "name": "string",
  "race": "elf",
  "portrait": "string",
  "level": 1,
  "experience": 0,
  "experienceToNext": 100,
  "stats": {
    "body": 8,
    "mind": 12,
    "heart": 10,
    "hp": 80,
    "maxHp": 80,
    "mp": 60,
    "maxMp": 60
  },
  "location": {
    "area": "starting-town",
    "coordinates": { "x": 0, "y": 0 }
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Get Character
**GET** `/get-character?uid=string`

Retrieve character data or check if character exists.

**Response (200 - Has Character):**
```json
{
  "hasCharacter": true,
  "character": {
    // Full character object
  }
}
```

**Response (200 - No Character):**
```json
{
  "hasCharacter": false
}
```

### Update Character
**PUT** `/update-character`

Update character stats, location, or experience.

**Request Body:**
```json
{
  "uid": "string",
  "stats": {
    "body": 10,
    "mind": 12,
    "heart": 11
  },
  "location": {
    "area": "forest-north",
    "coordinates": { "x": 5, "y": 10 }
  },
  "experience": 150
}
```

**Note:** Experience updates automatically handle level-ups and stat increases.

### Delete Character
**DELETE** `/delete-character`

Delete character and all associated game data.

**Request Body:**
```json
{
  "uid": "string"
}
```

### Get Character Stats
**GET** `/character-stats?uid=string`

Get detailed character statistics including calculated values.

---

## Game State Management

### Get Game State
**GET** `/get-game-state?uid=string&saveSlot=number`

Retrieve game state for a specific save slot (1-3).

**Response (200):**
```json
{
  "uid": "string",
  "characterId": "string",
  "saveSlot": 1,
  "phase": "childhood" | "labyrinth" | "adulthood",
  "currentLocation": {
    "area": "starting-town",
    "coordinates": { "x": 0, "y": 0 }
  },
  "unlockedAreas": ["starting-town", "forest-north"],
  "questProgress": {
    "boat-building": {
      "progress": 3,
      "maxProgress": 5,
      "completed": false
    }
  },
  "storyMilestones": [
    {
      "id": "first-combat",
      "name": "First Combat",
      "description": "Completed first combat encounter",
      "timestamp": "date"
    }
  ],
  "lastSaved": "date"
}
```

### Update Game State
**POST** `/update-game-state`

Update various aspects of game state.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1,
  "phase": "labyrinth",
  "currentLocation": {
    "area": "forest-north",
    "coordinates": { "x": 10, "y": 15 }
  },
  "unlockedAreas": ["starting-town", "forest-north", "labyrinth-entrance"],
  "questProgress": {
    "boat-building": {
      "progress": 5,
      "maxProgress": 5,
      "completed": true
    }
  }
}
```

### Save Game
**POST** `/save-game`

Save current game state to a specific slot.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1,
  "gameState": {
    // Partial game state data to save
  }
}
```

### Load Game
**POST** `/load-game`

Load game state from a specific save slot.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1
}
```

### Get Save Slots
**GET** `/get-save-slots?uid=string`

Get all save slots for a user with metadata.

**Response (200):**
```json
{
  "saveSlots": [
    {
      "slot": 1,
      "occupied": true,
      "metadata": {
        "phase": "childhood",
        "lastSaved": "date",
        "currentLocation": {
          "area": "starting-town",
          "coordinates": { "x": 0, "y": 0 }
        }
      }
    },
    {
      "slot": 2,
      "occupied": false
    },
    {
      "slot": 3,
      "occupied": false
    }
  ]
}
```

### Update Story Milestone
**POST** `/update-story-milestone`

Record a new story milestone.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1,
  "milestone": {
    "id": "first-demon-encounter",
    "name": "First Demon Encounter", 
    "description": "Met first demon after dying in the city"
  }
}
```

---

## Inventory & Equipment System

### Get Inventory
**GET** `/get-inventory?uid=string`

Get complete inventory including items, equipment, and gold.

**Response (200):**
```json
{
  "uid": "string",
  "items": [
    {
      "itemId": "health-potion",
      "quantity": 3,
      "equipped": false
    },
    {
      "itemId": "iron-sword", 
      "quantity": 1,
      "equipped": true,
      "equipmentSlot": "weapon"
    }
  ],
  "equipment": {
    "weapon": "iron-sword",
    "armor": null,
    "accessory1": null,
    "accessory2": null
  },
  "gold": 150,
  "maxSlots": 20,
  "boatProgress": {
    "piecesCollected": ["boat-hull", "boat-sail"],
    "totalPieces": 5,
    "completed": false
  }
}
```

### Add Item
**POST** `/add-item`

Add items to inventory. Stackable items will stack, unique items require inventory space.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "health-potion",
  "quantity": 2
}
```

### Remove Item
**POST** `/remove-item`

Remove items from inventory.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "health-potion", 
  "quantity": 1
}
```

### Equip Item
**POST** `/equip-item`

Equip item to appropriate slot. Unequips current item in slot.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "iron-sword",
  "slot": "weapon" | "armor" | "accessory1" | "accessory2"
}
```

**Response includes updated character stats with equipment bonuses.**

### Unequip Item
**POST** `/unequip-item`

Unequip item from slot and return to inventory.

**Request Body:**
```json
{
  "uid": "string",
  "slot": "weapon"
}
```

### Use Item
**POST** `/use-item`

Consume a consumable item and apply its effects.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "health-potion",
  "quantity": 1
}
```

**Response includes updated character stats after consumption.**

### Get Equipment
**GET** `/get-equipment?uid=string`

Get currently equipped items and their stat bonuses.

### Update Gold
**POST** `/update-gold`

Add or spend gold.

**Request Body:**
```json
{
  "uid": "string",
  "amount": 100,
  "operation": "add" | "spend"
}
```

### Get Boat Progress
**GET** `/get-boat-progress?uid=string`

Get boat building progress during childhood phase.

### Craft Boat
**POST** `/craft-boat`

Craft boat when all pieces are collected. Unlocks sea travel.

**Request Body:**
```json
{
  "uid": "string"
}
```

---

## Combat System

### Initiate Combat
**POST** `/initiate-combat`

Start combat with an enemy in a specific location.

**Request Body:**
```json
{
  "uid": "string",
  "enemyId": "forest-spirit-1",
  "location": "forest-north"
}
```

**Response (200):**
```json
{
  "id": "combat-session-123",
  "uid": "string",
  "enemyId": "forest-spirit-1",
  "location": "forest-north",
  "playerHp": 100,
  "playerMp": 50,
  "enemyHp": 80,
  "round": 1,
  "status": "active",
  "log": ["Combat initiated"],
  "createdAt": "date"
}
```

### Combat Action
**POST** `/combat-action`

Execute a combat action. Combat uses Body > Mind > Heart > Body advantage system.

**Request Body:**
```json
{
  "uid": "string",
  "combatId": "combat-session-123",
  "choice": {
    "type": "body" | "mind" | "heart",
    "action": "attack" | "defend" | "special-attack"
  }
}
```

**Combat Rules:**
- **Body > Mind**: Physical overpowers intellect
- **Mind > Heart**: Logic defeats emotion  
- **Heart > Body**: Charisma overcomes brute force
- **Advantage/Disadvantage**: Affects damage multipliers (0.5x to 1x)
- **Defend + Enemy Defend**: Gain agreement point (3 points = "agree to disagree")

### Use Special Attack
**POST** `/use-special-attack`

Use fallacy or paradox attacks that consume MP.

**Request Body:**
```json
{
  "uid": "string",
  "combatId": "combat-session-123",
  "attackId": "strawman-fallacy",
  "choice": {
    "type": "mind",
    "action": "special-attack"
  }
}
```

### Fallacy Challenge
**POST** `/fallacy-challenge`

Present fallacy identification mini-game when defending.

**Request Body:**
```json
{
  "uid": "string",
  "combatId": "combat-session-123",
  "fallacyType": "strawman"
}
```

**Response:**
```json
{
  "combatId": "combat-session-123",
  "fallacyType": "strawman",
  "challenge": "Identify the logical fallacy in the enemy's argument",
  "options": ["strawman", "ad-hominem", "false-dilemma", "appeal-to-authority"]
}
```

### Demon Contract
**POST** `/demon-contract`

Handle demon contract offers after player death in empire city.

**Request Body:**
```json
{
  "uid": "string", 
  "demonName": "Belphegor",
  "contractType": "stat-boost" | "summoning",
  "accepted": true,
  "terms": {
    "sacrifice": "core-belief-compassion",
    "benefit": { "body": 3 }
  }
}
```

**Contract Types:**
- **stat-boost**: Immediate stat increase for sacrificing core belief
- **summoning**: Soul sacrifice for demon summoning ability (affects endings)

### Summon Demon
**POST** `/summon-demon`

Summon contracted demon in combat (requires soul sacrifice).

**Request Body:**
```json
{
  "uid": "string",
  "combatId": "combat-session-123", 
  "demonName": "Belphegor"
}
```

### Get Combat Statistics
**GET** `/combat-statistics?uid=string`

Get player's combat performance statistics.

### Get Available Special Attacks
**GET** `/available-special-attacks?uid=string`

Get unlocked special attacks with MP costs and unlock requirements.

---

## Exploration System

### Get Location
**GET** `/get-location?uid=string`

Get current location details including description and available actions.

**Response (200):**
```json
{
  "area": "starting-town",
  "coordinates": { "x": 0, "y": 0 },
  "name": "Peaceful Harbor Town",
  "description": "A humble seaside village where your journey begins...",
  "availableActions": ["explore", "talk-to-villagers", "visit-harbor"],
  "enemies": [],
  "npcs": ["village-elder", "fisherman", "merchant"],
  "items": ["wooden-stick", "fishing-net"]
}
```

### Move to Location
**POST** `/move-to-location`

Move player to a new location (must be unlocked).

**Request Body:**
```json
{
  "uid": "string",
  "targetLocation": {
    "area": "forest-north",
    "coordinates": { "x": 5, "y": 10 }
  }
}
```

### Get Available Areas
**GET** `/get-available-areas?uid=string`

Get all areas with unlock status and descriptions.

**Response (200):**
```json
{
  "areas": [
    {
      "id": "starting-town",
      "name": "Harbor Town", 
      "unlocked": true,
      "description": "Your peaceful starting location"
    },
    {
      "id": "forest-north",
      "name": "Northern Forest",
      "unlocked": true, 
      "description": "A mysterious forest with ancient spirits"
    },
    {
      "id": "labyrinth-entrance",
      "name": "Labyrinth Entrance",
      "unlocked": false,
      "description": "The legendary labyrinth doors (Requires boat)"
    },
    {
      "id": "empire-city", 
      "name": "Empire City",
      "unlocked": false,
      "description": "The advanced civilization beyond the labyrinth"
    },
    {
      "id": "necronia",
      "name": "Necronia", 
      "unlocked": false,
      "description": "The dark city of cultists and demons (Special unlock required)"
    }
  ]
}
```

---

## Game Progression Overview

### Phase 1: Childhood (Boat Building)
- **Location**: Starting town and surrounding areas
- **Goal**: Collect boat pieces to build transportation
- **Mechanics**: Simple exploration, NPC interactions, basic combat with forest spirits
- **Key Quest**: Boat building (requires 5 pieces: hull, sail, rudder, mast, anchor)

### Phase 2: Labyrinth (Age Progression)  
- **Location**: Inside the massive labyrinth
- **Goal**: Navigate chambers and reach the empire
- **Mechanics**: Each chamber ages the character 1 year, puzzle solving, mythical creature combat
- **Progression**: Childhood → Adulthood transformation

### Phase 3: Adulthood (Empire Politics)
- **Location**: Empire city with warring factions
- **Goal**: Become the King's advisor
- **Mechanics**: Advanced philosophical combat, faction alignment, demon contracts
- **Factions**: Based on philosophical schools (Existentialists, Theists, etc.)

### Combat System Details
- **Body/Mind/Heart**: Rock-paper-scissors system with advantages
- **Special Attacks**: Fallacies and paradoxes learned throughout the game
- **Fallacy Mini-game**: Identify logical fallacies to reduce damage when defending
- **Demon Contracts**: Powerful but dangerous - affect game endings
- **Agreement System**: Alternative to violence, gain agreement points instead of dealing damage

### Ending Variations
- **Pure Path**: No demon contracts, achieved through skill and alignment
- **Demon Puppet**: Fully corrupted by demon contracts
- **Balanced Approach**: Strategic demon use with maintained independence
- **Faction Loyalty**: Endings based on chosen philosophical faction

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **201**: Created successfully  
- **400**: Bad request (validation error)
- **403**: Forbidden (unauthorized access)
- **404**: Resource not found
- **409**: Conflict (duplicate resource)
- **500**: Internal server error

Error responses include descriptive messages:
```json
{
  "message": "Descriptive error message"
}
```

---

## Database Models

### Character Stats Calculation
- **MaxHP** = Body × 10
- **MaxMP** = Mind × 5  
- **Level Up** = Experience reaches (Level × 100)
- **Stat Growth** = +1 to all stats per level

### Game State Validation
- **Save Slots**: 1-3 per user
- **Area Access**: Validated against unlocked areas
- **Phase Progression**: childhood → labyrinth → adulthood

### Inventory Constraints
- **Max Slots**: 20 items (configurable)
- **Stackable Items**: Potions, herbs, materials
- **Equipment Slots**: weapon, armor, accessory1, accessory2
- **Gold**: Non-negative integer

This comprehensive API supports the full Axiomancer game experience from character creation through multiple ending scenarios, with robust state management and validation throughout.