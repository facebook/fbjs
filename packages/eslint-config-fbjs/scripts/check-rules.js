/**
 * Finds rules that are supported by ESLint but not defined in our config.
 */

var ourRules = new Set(Object.keys(require('..').rules));
var supportedRules = new Set(Object.keys(require('eslint/lib/load-rules')()));

var missing = new Set();
var extra = new Set();

ourRules.forEach((rule) => {
  if (!supportedRules.has(rule)) {
    extra.add(rule);
  }
});

supportedRules.forEach((rule) => {
  if (!ourRules.has(rule)) {
    missing.add(rule);
  }
});

console.log('missing', missing);
console.log('extra', extra);
