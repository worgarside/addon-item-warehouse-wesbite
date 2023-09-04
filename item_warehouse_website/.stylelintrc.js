module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines',
    'stylelint-config-standard-scss',
    "stylelint-config-css-modules"
  ],
  rules: {
    "selector-class-pattern": "^[a-z0-9]+([A-Z][a-z0-9]+)*$",
    "max-nesting-depth": 2,
  }
};