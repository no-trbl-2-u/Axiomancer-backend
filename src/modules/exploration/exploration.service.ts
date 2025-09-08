import fs from 'fs/promises';
import path from 'path';
import { MapNodeEvent, EventOutcome } from './exploration.types.js';

interface Paradox {
  paradoxName: string;
  paradoxDescription: string;
}

class ExplorationService {
  private paradoxes: Paradox[] = [];
  private portraits = [
    'Air-lord', 'Angel', 'Arc-mage', 'Arch-demon', 'Archer', 'Ashigaru',
    'Biwa-houshi', 'Black-bishop', 'Cenobite', 'Cleric', 'Cursed-samurai',
    'Deva', 'Foot-soldier', 'Kensei', 'Knight'
  ];

  constructor() {
    this.loadParadoxes();
  }

  private async loadParadoxes(): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'paradoxes.json');
      const data = await fs.readFile(filePath, 'utf-8');
      this.paradoxes = JSON.parse(data);
    } catch (error) {
      console.error('Error loading paradoxes:', error);
      this.paradoxes = [];
    }
  }

  private getRandomPortrait(): string {
    const portrait = this.portraits[Math.floor(Math.random() * this.portraits.length)];
    return portrait || 'Angel';
  }

  private getRandomParadox(): Paradox | null {
    if (this.paradoxes.length === 0) return null;
    const paradox = this.paradoxes[Math.floor(Math.random() * this.paradoxes.length)];
    return paradox || null;
  }

  generateRandomEvent(characterLevel: number, currentLocation: string): MapNodeEvent {
    const rand = Math.random();
    
    // 50% combat, 35% rest, 15% event
    if (rand < 0.5) {
      return this.generateCombatEvent(characterLevel, currentLocation);
    } else if (rand < 0.85) {
      return this.generateRestEvent(currentLocation);
    } else {
      return this.generateSpecialEvent(characterLevel, currentLocation);
    }
  }

  private generateCombatEvent(characterLevel: number, location: string): MapNodeEvent {
    const enemies = [
      { name: 'Forest Wolf', type: 'random' as const },
      { name: 'Bandit', type: 'random' as const },
      { name: 'Wild Boar', type: 'random' as const },
      { name: 'Goblin Scout', type: 'random' as const },
    ];

    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (!enemy) {
      // Fallback enemy
      const fallbackEnemy = { name: 'Wild Beast', type: 'random' as const };
      const adjustedLevel = Math.max(1, characterLevel);
      
      return {
        type: 'combat',
        id: `combat_${Date.now()}`,
        title: `${fallbackEnemy.name} Encounter`,
        description: `A ${fallbackEnemy.name.toLowerCase()} blocks your path! Battle is inevitable.`,
        enemy: {
          type: fallbackEnemy.type,
          name: fallbackEnemy.name,
          level: adjustedLevel
        },
        rewards: {
          experience: adjustedLevel * 10 + Math.floor(Math.random() * 20)
        }
      };
    }
    
    const adjustedLevel = Math.max(1, characterLevel + Math.floor(Math.random() * 3) - 1);

    return {
      type: 'combat',
      id: `combat_${Date.now()}`,
      title: `${enemy.name} Encounter`,
      description: `A ${enemy.name.toLowerCase()} blocks your path! Battle is inevitable.`,
      enemy: {
        type: enemy.type,
        name: enemy.name,
        level: adjustedLevel
      },
      rewards: {
        experience: adjustedLevel * 10 + Math.floor(Math.random() * 20)
      }
    };
  }

  private generateRestEvent(location: string): MapNodeEvent {
    const restSpots = [
      'You find a peaceful clearing with a small stream.',
      'An abandoned campsite offers shelter and safety.',
      'A grove of ancient trees provides mystical rejuvenation.',
      'A natural hot spring emanates healing energy.',
      'An old shrine offers divine restoration.',
    ];

    const description = restSpots[Math.floor(Math.random() * restSpots.length)];

    return {
      type: 'rest',
      id: `rest_${Date.now()}`,
      title: 'Safe Haven',
      description: `${description} You can rest here to recover your strength.`,
    };
  }

  private generateSpecialEvent(characterLevel: number, location: string): MapNodeEvent {
    const rand = Math.random();
    
    // 60% Greater Mythical, 40% Lesser Mythical
    if (rand < 0.6) {
      return this.generateGreaterMythicalEvent(characterLevel, location);
    } else {
      return this.generateLesserMythicalEvent(characterLevel, location);
    }
  }

  private generateGreaterMythicalEvent(characterLevel: number, location: string): MapNodeEvent {
    const creatures = [
      'Ancient Phoenix', 'Ethereal Dragon', 'Celestial Guardian', 
      'Primordial Beast', 'Void Walker', 'Time Weaver'
    ];

    const creature = creatures[Math.floor(Math.random() * creatures.length)] || 'Ancient Beast';
    const portrait = this.getRandomPortrait();

    return {
      type: 'event',
      id: `greater_mythical_${Date.now()}`,
      title: `${creature} Encounter`,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. The ${creature.toLowerCase()} regards you with ancient wisdom, its presence both magnificent and terrifying.`,
      portrait,
      enemy: {
        type: 'greater_mythical',
        name: creature,
        level: characterLevel + 2 + Math.floor(Math.random() * 3)
      },
      choices: [
        {
          id: 'challenge',
          text: 'Challenge the creature to combat',
          consequences: {
            fallacySpells: ['New Fallacy Spell'] // Will trigger ethical thought experiment on win
          }
        },
        {
          id: 'retreat',
          text: 'Retreat respectfully',
          consequences: {}
        }
      ]
    };
  }

  private generateLesserMythicalEvent(characterLevel: number, location: string): MapNodeEvent {
    const creatures = [
      'Spirit Wolf', 'Shadow Cat', 'Mist Elemental', 
      'Forest Nymph', 'Stone Gargoyle', 'Wind Wisp'
    ];

    const creature = creatures[Math.floor(Math.random() * creatures.length)] || 'Lesser Spirit';
    const portrait = this.getRandomPortrait();
    const paradox = this.getRandomParadox();

    return {
      type: 'event',
      id: `lesser_mythical_${Date.now()}`,
      title: `${creature} Encounter`,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. The ${creature.toLowerCase()} appears before you, its form shimmering with otherworldly energy.`,
      portrait,
      enemy: {
        type: 'lesser_mythical',
        name: creature,
        level: characterLevel + Math.floor(Math.random() * 2)
      },
      choices: [
        {
          id: 'engage',
          text: 'Engage in combat',
          consequences: {
            mpDrain: true, // Will trigger paradox event and MP drain on win
            ...(paradox && { items: [paradox.paradoxName] })
          }
        },
        {
          id: 'avoid',
          text: 'Try to avoid the encounter',
          consequences: {}
        }
      ]
    };
  }

  async processEventChoice(eventId: string, choiceId: string, characterId: string): Promise<EventOutcome> {
    // This would normally update the character and gamestate based on the choice
    // For now, return a mock response
    return {
      success: true,
      message: 'Event choice processed successfully',
      characterUpdates: {},
      inventoryUpdates: {}
    };
  }

  async processRestEvent(characterId: string): Promise<EventOutcome> {
    // This would normally update the character's HP and MP to max
    return {
      success: true,
      message: 'You rest peacefully, restoring your health and mana to full.',
      characterUpdates: {
        // These would be set to the character's max values
        // currentHp: character.maxHp,
        // currentMp: character.maxMp
      }
    };
  }

  async travelToNode(characterId: string, nodeId: string, coordinates: { x: number; y: number }): Promise<EventOutcome> {
    // Update character location and generate random event
    const characterLevel = 1; // This should be fetched from the character
    const location = 'Unknown'; // This should be derived from coordinates
    
    const event = this.generateRandomEvent(characterLevel, location);
    
    return {
      success: true,
      message: 'Travel completed',
      characterUpdates: {
        location: {
          area: location,
          coordinates
        }
      },
      newEvent: event
    };
  }
}

export const explorationService = new ExplorationService();
export default explorationService;