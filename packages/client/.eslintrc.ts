const config = {
  env: {
    browser: true,
    jest: true,
  },
  extends: ["airbnb-typescript", "react-app", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "dot-location": "off",
    "new-parens": "off",
    "no-whitespace-before-property": "off",
    "rest-spread-spacing": "off",
    "unicode-bom": "off",
  },
};

export default config;
