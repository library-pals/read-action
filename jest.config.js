const generateMapper = (paths) => {
  const mapper = {};
  paths.forEach((path) => {
    const key = `^\\.{1,2}/${path}\\.js$`;
    const value = `<rootDir>/src/${path}.ts`;
    mapper[key] = value;
  });
  return mapper;
};

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
  transformIgnorePatterns: ["/node_modules/(?!@library-pals/isbn)"],
  snapshotSerializers: ["./.jest/id-serializer.ts"],
  moduleNameMapper: {
    ...generateMapper([
      "utils",
      "write-file",
      "read-file",
      "update-book",
      "validate-payload",
      "summary",
      "summary-markdown",
      "checkout-book",
      "new-book",
      "providers/isbn",
      "providers/libby",
      "providers/librofm",
      "providers/apple-books",
    ]),
    "^\\./isbn\\.js$": "<rootDir>/src/providers/isbn.ts",
  },
};
