// @ts-check
const { defineConfig } = require("eslint/config");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    ignores: ["projects/**/*"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      angular.configs.tsRecommended,
      // eslint.configs.recommended,
      // tseslint.configs.recomended,
      // angular.configs.templateAccessibility
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/prefer-inject": "off",
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "sd",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [angular.configs.templateRecommended],
    rules: {},
  },
]);
