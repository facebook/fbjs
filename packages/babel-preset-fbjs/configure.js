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

module.exports = function(options) {
  options = Object.assign({
    autoImport: true,
    inlineRequires: process.env.NODE_ENV === 'test',
    objectAssign: true,
    rewriteModules: null, // {map: ?{[module: string]: string}, prefix: ?string}
    stripDEV: false,
    target: 'js',
  }, options);

  if (options.target !== 'js' && options.target !== 'flow') {
    throw new Error('options.target must be one of "js" or "flow".');
  }

  // Always enable these. These will overlap with some transforms (which also
  // enable the corresponding syntax, eg Flow), but these are the minimal
  // additional syntaxes that need to be enabled so we can minimally transform
  // to .js.flow files as well.
  let presetSets = [
    [
      require('babel-plugin-syntax-class-properties'),
      require('babel-plugin-syntax-flow'),
      require('babel-plugin-syntax-jsx'),
      require('babel-plugin-syntax-trailing-function-commas'),
      require('babel-plugin-syntax-object-rest-spread'),

      options.autoImport ? require('./plugins/auto-importer') : null,
      options.rewriteModules ?
        [require('./plugins/rewrite-modules'), options.rewriteModules || {}] :
        null,
    ],
    [
      options.inlineRequires ? require('./plugins/inline-requires') : null,
      options.stripDEV ? require('./plugins/dev-expression') : null,
    ]
  ];

  // We only want to add declarations for flow transforms and not for js. So we
  // have to do this separate from above.
  if (options.target === 'flow') {
    presetSets[0].push(require('./plugins/dev-declaration'));
  }

  // Enable everything else for js.
  if (options.target === 'js') {
    presetSets[0] = presetSets[0].concat([
      require('babel-plugin-transform-es2015-template-literals'),
      require('babel-plugin-transform-es2015-literals'),
      require('babel-plugin-transform-es2015-function-name'),
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
      require('babel-plugin-transform-flow-strip-types'),
      require('babel-plugin-transform-object-rest-spread'),
      require('babel-plugin-transform-react-display-name'),
      require('babel-plugin-transform-react-jsx'),
      // Don't enable this plugin unless we're compiling JS, even if the option is true
      options.objectAssign ? require('./plugins/object-assign') : null,
    ]);
  }

  // Use two passes to circumvent bug with auto-importer and inline-requires.
  const passPresets = presetSets.map(function(plugins) {
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
