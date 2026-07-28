module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleNameMapper: {
    "\\.(scss|sass|css)$": "identity-obj-proxy",
    // @pnp/sp and @pnp/queryable v4 ship pure ESM; Jest's default CJS require() can't load them — mocked here since no task unit-tests real PnPjs I/O chains (see repo tasks' "Manual verification" steps)
    "^@pnp/sp$": "<rootDir>/jest-mocks/pnpsp.js",
    "^@pnp/sp/(.*)$": "<rootDir>/jest-mocks/pnpsp.js",
    "^@pnp/queryable$": "<rootDir>/jest-mocks/pnpqueryable.js",
    "^@pnp/queryable/(.*)$": "<rootDir>/jest-mocks/pnpqueryable.js",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true, tsconfig: { module: "commonjs", jsx: "react" } }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
