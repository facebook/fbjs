/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This pattern will match these texts:
//   var Foo = require('Foo');
//   var Bar = require('Foo').Bar;
//   var BarFoo = require(Bar + 'Foo');
//   var {Bar, Foo} = require('Foo');
//   import type {Bar, Foo} from 'Foo';
// Also supports 'let' and 'const'.
const variableNamePattern = String.raw`\s*[a-zA-Z_$][a-zA-Z_$\d]*\s*`;
const maxLenIgnorePattern = String.raw`^(?:var|let|const|import type)\s+` +
  '{?' + variableNamePattern + '(?:,' + variableNamePattern + ')*}?' +
  String.raw`\s*(?:=\s*require\(|from)[a-zA-Z_+./"'\s\d\-]+\)?[^;\n]*[;\n]`;


module.exports = {
  maxLenIgnorePattern: maxLenIgnorePattern,
};
