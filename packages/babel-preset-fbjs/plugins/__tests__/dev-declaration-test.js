/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/* eslint-disable max-len */

let babel = require('babel-core');
let devDeclaration = require('../dev-declaration');

function transform(input) {
  return babel.transform(input, {
    plugins: ['syntax-flow', devDeclaration],
  }).code;
}

function compare(input, output) {
  var compiled = transform(input);
  expect(compiled).toEqual(output);
}

describe('dev-declaration', function() {

  it('should replace calls', () => {
    compare(
`if (__DEV__) console.log();`,
`declare var __DEV__: boolean;
if (__DEV__) console.log();`);
  });

});
