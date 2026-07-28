const browserGlobals = {
  cancelAnimationFrame: "readonly",
  chrome: "readonly",
  clearTimeout: "readonly",
  document: "readonly",
  Element: "readonly",
  getComputedStyle: "readonly",
  globalThis: "readonly",
  HTMLImageElement: "readonly",
  HTMLElement: "readonly",
  MutationObserver: "readonly",
  Node: "readonly",
  requestAnimationFrame: "readonly",
  ResizeObserver: "readonly",
  setTimeout: "readonly",
  window: "readonly",
};

export default [
  {
    ignores: [
      "assets/**",
      "dist/**",
      "node_modules/**",
      "output/**",
      "release/**",
    ],
  },
  {
    files: ["content.js", "landing.js", "popup.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: browserGlobals,
      sourceType: "script",
    },
    rules: {
      "no-constant-condition": "error",
      "no-dupe-keys": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
  {
    files: ["*.config.mjs", "tools/**/*.mjs", "tests/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        Buffer: "readonly",
        console: "readonly",
        document: "readonly",
        InputEvent: "readonly",
        localStorage: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
      },
      sourceType: "module",
    },
    rules: {
      "no-constant-condition": "error",
      "no-dupe-keys": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
];
