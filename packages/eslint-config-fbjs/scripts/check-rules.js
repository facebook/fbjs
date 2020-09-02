/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Finds rules that are supported by ESLint but not defined in our config.
 */

var ourRules = new Set(Object.keys(require('..').rules));
var supportedRules = new Set(Object.keys(require('eslint/lib/load-rules')()));

// Get plugins from package.json. Assume they're all in peerDependencies.
var plugins =
  Object.keys(require('../package.json').peerDependencies)
    .filter((dep) => dep.startsWith('eslint-plugin'))
    .map((dep) => dep.replace('eslint-plugin-', ''));

plugins.forEach((plugin) => {
  Object.keys(require(`eslint-plugin-${plugin}`).rules).forEach((rule) => {
    supportedRules.add(`${plugin}/${rule}`);
  });
});

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
