import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: [
    "/node_modules/(?!chai)/"
  ]
};

export default config;
