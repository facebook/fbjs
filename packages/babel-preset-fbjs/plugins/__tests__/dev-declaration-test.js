/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* eslint-disable max-len */

let babel = require('@babel/core');
let devDeclaration = require('../dev-declaration');

function transform(input) {
  return babel.transform(input, {
    plugins: ['@babel/plugin-syntax-flow', devDeclaration],
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
