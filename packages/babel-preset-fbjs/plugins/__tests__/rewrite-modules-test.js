/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

jest.dontMock('@babel/core');
jest.dontMock('../rewrite-modules');

describe('rewrite-modules', function() {
  let babel = require('@babel/core');
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

        expect(result.code).toEqual('require("test/test");');
      });

      it('should replace the prefix on type imports', function() {
        let result = babel.transform(
          'import type Test from "test";',
          {
            plugins: [
              '@babel/plugin-syntax-flow',
              [rewriteModules, {map: {'test': 'test/test'}}]
            ],
          }
        );

        expect(result.code).toEqual('import type Test from "test/test";');
      });

      it('should transform typeof imports', function() {
        const code = `import typeof Type from 'test';`;
        const expected = `import typeof Type from "test/test";`;
        const result = babel.transform(
          code,
          {
            plugins: [
              '@babel/plugin-syntax-flow',
              [rewriteModules, {map: {test: 'test/test'}}],
            ],
          }
        );

        expect(result.code).toEqual(expected);
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

          jest.mock("foo/foo");
          jest.mock("foo/foo").mock("bar/bar").dontMock("baz/baz");
          var fooMock = jest.genMockFromModule("foo/foo");
          jest.unmock("foo/foo");
          jest.setMock("foo/foo", () => {});

          var foo = require("foo/foo");
          var actualFoo = require.requireActual("foo/foo");
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
