module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.spec.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: '../coverage',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
}
