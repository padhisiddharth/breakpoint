
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    verbose: true,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { useESM: true, isolatedModules: true }]
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
};
