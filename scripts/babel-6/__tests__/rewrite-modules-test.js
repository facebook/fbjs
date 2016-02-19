/**
 * Copyright (c) 2015, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

jest.dontMock('babel-core');
jest.dontMock('../rewrite-modules');

describe('rewrite-modules', function() {
  let babel = require('babel-core');
  let rewriteModules = require('../rewrite-modules');

  function normalizeResults(code) {
    return code && code.replace(/\s/g, '');
  }

  describe('rewriteModules', function() {
    describe('opts._moduleMap', function() {
      it('should replace the prefix on normal requires', function() {
        let result = babel.transform(
          'require(\'test\');',
          {
            plugins: [[rewriteModules, {map: {'test': 'test/test'}}]],
          }
        );

        expect(result.code).toEqual('require(\'test/test\');');
      });

      it('should transform jest and requireActual methods', function() {
        const code = `function test() {
          'use strict';

          jest.mock('foo');
          jest.mock('foo').mock('bar').dontMock('baz');
          var fooMock = jest.genMockFromModule('foo');
          jest.unmock('foo');
          jest.setMock('foo', () => {});

          var foo = require('foo');
          var actualFoo = require.requireActual('foo');
        }`;

        const expected = `function test() {
          'use strict';

          jest.mock('foo/foo');
          jest.mock('foo/foo').mock('bar/bar').dontMock('baz/baz');
          var fooMock = jest.genMockFromModule('foo/foo');
          jest.unmock('foo/foo');
          jest.setMock('foo/foo', () => {});

          var foo = require('foo/foo');
          var actualFoo = require.requireActual('foo/foo');
        }`;

        const rewritePlugin = [
          rewriteModules, {
            map: {
              'foo': 'foo/foo',
              'bar': 'bar/bar',
              'baz': 'baz/baz',
            },
          },
        ];

        let result = babel.transform(
          code,
          {
            plugins: [rewritePlugin],
          }
        );

        expect(normalizeResults(result.code))
          .toEqual(normalizeResults(expected));
      });
    });
  });
});
