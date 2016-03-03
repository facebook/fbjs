/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var assign = require('object-assign');
var babelPluginModules = require('./rewrite-modules');
var babelPluginAutoImporter = require('./auto-importer');
var inlineRequires = require('./inline-requires');
var thirdPartyModuleMap = require('../third-party-module-map.json');

function plugins(moduleOpts) {
  var plugins = [
    "transform-flow-strip-types",
    "syntax-trailing-function-commas",
    "transform-es2015-template-literals",
    "transform-es2015-literals",
    "transform-es2015-arrow-functions",
    "transform-es2015-block-scoped-functions",
    "transform-class-properties",
    ["transform-es2015-classes",  { "loose": true }],
    "transform-es2015-object-super",
    "transform-es2015-shorthand-properties",
    "transform-es2015-computed-properties",
    "transform-es2015-for-of",
    "check-es2015-constants",
    ["transform-es2015-spread",  { "loose": true }],
    "transform-es2015-parameters",
    ["transform-es2015-destructuring",  { "loose": true }],
    "transform-es2015-block-scoping",
    "transform-es2015-modules-commonjs",
    "transform-es3-member-expression-literals",
    "transform-es3-property-literals",
    "transform-object-rest-spread",
    babelPluginAutoImporter,
    [babelPluginModules, assign({map: thirdPartyModuleMap}, moduleOpts)],
  ];

  if (process.env.NODE_ENV === 'test') {
    plugins.push(inlineRequires);
  }

  return plugins;
}

module.exports = function(options) {
  return {
    plugins: plugins(options.moduleOpts).concat(options.plugins || []),
  }
}
