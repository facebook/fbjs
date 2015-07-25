/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var babelPluginModules = require('../babel/rewrite-modules');
var babelPluginFlowComments = require('babel-plugin-flow-comments');

module.exports = {
  nonStandard: true,
  blacklist: [
    'spec.functionName'
  ],
  loose: [
    'es6.classes'
  ],
  stage: 1,
  plugins: [babelPluginModules, babelPluginFlowComments],
  _moduleMap: {
    'es6-map': 'es6-map',
    'promise': 'promise',
    'whatwg-fetch': 'whatwg-fetch'
  }
};
