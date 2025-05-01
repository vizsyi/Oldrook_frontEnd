export default {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-scss"],
  rules: {
    "indentation": 4,
    "string-quotes": "double",
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "selector-class-pattern": "^[a-z0-9_-]+$",
    "scss/dollar-variable-pattern": "^[_a-z][a-z0-9-]*$",
    "no-empty-source": null
  }
};
