module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx|mjs|cjs)$": "babel-jest"  // Ensure Babel transforms JS/ESM files
  },
  transformIgnorePatterns: ["/node_modules/(?!(your-esm-dependency)/)"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"]
};