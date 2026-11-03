// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/material-symbol.tsx"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: [{
          name: "expo-symbols",
          importNames: ["SymbolView"],
          message: "Use MaterialSymbol de @/components/material-symbol para manter os ícones no Android e na web.",
        }],
      }],
    },
  },
]);
