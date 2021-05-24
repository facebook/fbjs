/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* eslint-disable max-len */

let babel = require('@babel/core');
let assign = require('../object-assign');
const validateOutputAst = require('../test-utils/validateOutputAst');

function transform(input) {
  const result = babel.transform(input, {
    plugins: [assign],
  });
  validateOutputAst(result.ast);
  return result.code;
}

function compare(input, output) {
  var compiled = transform(input);
  expect(compiled).toEqual(output);
}

describe('object-assign', function() {

  it('should replace calls', () => {
    compare(
`Object.assign({}, null);`,
`var _assign = require("object-assign");

_assign({}, null);`
    );
  });

  it('does not make multiple assignments', () => {
    compare(
`Object.assign({}, null);
Object.assign(Object.prototype, null)`,
`var _assign = require("object-assign");

_assign({}, null);

_assign(Object.prototype, null);`
    );
  });

  it('should replace simple access', () => {
    compare(
`var assign = Object.assign;
assign({}, null);`,
`var _assign = require("object-assign");

var assign = _assign;
assign({}, null);`
    );
  });
});
