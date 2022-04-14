const config ={
    env: {
      browser: true,
      jest: true,
    },
    extends: ['airbnb-typescript', 'react-app'], // if you're using typescript
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: './tsconfig.json',
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'], // Your TypeScript files extension
        parserOptions: {
          project: ['./tsconfig.json'], // Specify it only for TypeScript files
        },
      },
    ],
};

export default config;