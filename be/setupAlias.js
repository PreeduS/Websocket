const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");
 
const baseUrl = "./build";

const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});
 
// When path registration is no longer needed
//cleanup();