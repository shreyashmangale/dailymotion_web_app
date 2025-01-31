export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",  // Use Babel for .js and .jsx files
  },
  extensionsToTreatAsEsm: [".jsx"], // Remove ".js"
  testEnvironment: 'jsdom',  // Ensure jsdom is set up as the environment for tests
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Ensure Jest understands ".js" and ".jsx" imports
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],  // Or jest.setup.js
};
