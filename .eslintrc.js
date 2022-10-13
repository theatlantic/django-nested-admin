/* eslint-disable */
module.exports = {
  "extends": [
    "plugin:prettier/recommended"
  ],
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2018,
  },
  "env": {
    "es6": true,
    "browser": true
  },
  "overrides": [
    {
      "files": ["webpack.config.js"],
      "env": {
        "node": true
      },
    },
  ],
  "ignorePatterns": [
    "nested_admin/static/nested_admin/dist/",
    "node_modules/",
    ".tox",
    "venv*"
  ],
};
