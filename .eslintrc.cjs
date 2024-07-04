/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // Temporary overrides while developing MVP:
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/prefer-string-starts-ends-with": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    /// re-enable them later
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-implied-eval": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    // "@typescript-eslint/no-unused-vars": [
    //   "warn",
    //   {
    //     argsIgnorePattern: "^_",
    //   },
    // ],
    // "@typescript-eslint/require-await": "off",
    // "@typescript-eslint/no-misused-promises": [
    //   "error",
    //   {
    //     checksVoidReturn: {
    //       attributes: false,
    //     },
    //   },
    // ],
  },
};
module.exports = config;
