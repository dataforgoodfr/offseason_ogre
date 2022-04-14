const config = {
  env: {
    browser: true,
    jest: true,
  },
  extends: ["airbnb-typescript", "react-app"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
};

export default config;
