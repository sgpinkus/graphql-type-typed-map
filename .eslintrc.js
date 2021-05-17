module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "2021",
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "rules": {
      'comma-dangle': [
        1,
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
        },
      ],
    },
};
