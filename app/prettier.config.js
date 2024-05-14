/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  tabWidth: 4,
  useTabs: true,
  semi: true,
  singleQuote: false,
  trailingComma: "none", // other options `es5` or `all`
  bracketSpacing: true,
  arrowParens: "avoid", // other option 'always'
  parser: "typescript",
};
module.exports = config;
