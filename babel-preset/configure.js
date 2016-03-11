/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/* eslint-disable indent */

const assign = require('object-assign');

module.exports = function(options) {
  options = assign({
    autoImport: true,
    inlineRequires: process.env.NODE_ENV === 'test',
    rewriteModules: {}, // {map?: ?{[module: string]: string}, prefix?: ?string}
    stripDEV: false,
  }, options);

  // Use two passes to circumvent bug with auto-importer and inline-requires.
  const passPresets = [
    [
      require('babel-plugin-transform-flow-strip-types'),
      require('babel-plugin-syntax-trailing-function-commas'),
      require('babel-plugin-transform-es2015-template-literals'),
      require('babel-plugin-transform-es2015-literals'),
      require('babel-plugin-transform-es2015-arrow-functions'),
      require('babel-plugin-transform-es2015-block-scoped-functions'),
      require('babel-plugin-transform-class-properties'),
      [require('babel-plugin-transform-es2015-classes'), {loose: true}],
      require('babel-plugin-transform-es2015-object-super'),
      require('babel-plugin-transform-es2015-shorthand-properties'),
      require('babel-plugin-transform-es2015-computed-properties'),
      require('babel-plugin-transform-es2015-for-of'),
      require('babel-plugin-check-es2015-constants'),
      [require('babel-plugin-transform-es2015-spread'), {loose: true}],
      require('babel-plugin-transform-es2015-parameters'),
      [require('babel-plugin-transform-es2015-destructuring'), {loose: true}],
      require('babel-plugin-transform-es2015-block-scoping'),
      require('babel-plugin-transform-es2015-modules-commonjs'),
      require('babel-plugin-transform-es3-member-expression-literals'),
      require('babel-plugin-transform-es3-property-literals'),
      require('babel-plugin-transform-object-rest-spread'),

      options.autoImport ? require('./plugins/auto-importer') : null,
      options.rewriteModules ?
        [
          require('./plugins/rewrite-modules'),
          assign(
            {map: require('./config/third-party-module-map.json')},
            options.rewriteModules
          ),
        ] :
        null,
    ],
    [
      options.inlineRequires ? require('./plugins/inline-requires') : null,
      options.stripDEV ? require('./plugins/dev-expression') : null,
    ],
  ].map(function(plugins) {
    return {
      plugins: plugins.filter(function(plugin) {
        return plugin != null;
      }),
    };
  });

  return {
    passPerPreset: true,
    presets: passPresets,
  };
};
