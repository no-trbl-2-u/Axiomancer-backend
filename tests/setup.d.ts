export declare const createMockUser: () => {
    uid: string;
    username: string;
    email: string;
};
export declare const createMockCharacter: () => {
    uid: string;
    name: string;
    race: string;
    portrait: string;
    level: number;
    experience: number;
    experienceToNext: number;
    stats: {
        body: number;
        mind: number;
        heart: number;
        hp: number;
        maxHp: number;
        mp: number;
        maxMp: number;
    };
    location: {
        area: string;
        coordinates: {
            x: number;
            y: number;
        };
    };
    createdAt: Date;
    updatedAt: Date;
};
export declare const createMockGameState: () => {
    uid: string;
    characterId: string;
    phase: string;
    currentLocation: {
        area: string;
        coordinates: {
            x: number;
            y: number;
        };
    };
    unlockedAreas: string[];
    questProgress: {};
    storyMilestones: never[];
    saveSlot: number;
    lastSaved: Date;
};
//# sourceMappingURL=setup.d.ts.map