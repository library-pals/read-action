export default {
  resetMocks: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  prettierPath: "<rootDir>/node_modules/prettier-2/index.js",
  resolver: "./.jest/resolver.cjs",
  transformIgnorePatterns: ["/node_modules/(?!@library-pals/isbn|entities)"],
  snapshotSerializers: ["./.jest/id-serializer.ts"],
  moduleNameMapper: {},
};
