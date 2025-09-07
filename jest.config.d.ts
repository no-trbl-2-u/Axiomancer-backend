declare namespace _default {
    let preset: string;
    let extensionsToTreatAsEsm: string[];
    let testEnvironment: string;
    let roots: string[];
    let testMatch: string[];
    let transform: {
        '^.+\\.ts$': (string | {
            useESM: boolean;
        })[];
    };
    let moduleNameMapping: {
        '^(\\.{1,2}/.*)\\.js$': string;
    };
    let collectCoverageFrom: string[];
    let coverageDirectory: string;
    let coverageReporters: string[];
    let setupFilesAfterEnv: string[];
    let testTimeout: number;
}
export default _default;
//# sourceMappingURL=jest.config.d.ts.map