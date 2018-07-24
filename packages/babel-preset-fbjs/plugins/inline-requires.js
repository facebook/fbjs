/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * This transform inlines top-level require(...) aliases with to enable lazy
 * loading of dependencies. It is able to inline both single references and
 * child property references.
 *
 * For instance:
 *     var Foo = require('foo');
 *     f(Foo);
 *
 * Will be transformed into:
 *     f(require('foo'));
 *
 * When the assigment expression has a property access, it will be inlined too,
 * keeping the property. For instance:
 *     var Bar = require('foo').bar;
 *     g(Bar);
 *
 * Will be transformed into:
 *     g(require('foo').bar);
 */
module.exports = function fbjsInlineRequiresTransform() {
  return {
    visitor: {
      CallExpression: function(path) {
        var declaratorPath = requireAlias(path) || requireMemberAlias(path);
        var declarator = declaratorPath && declaratorPath.node;

        if (declarator) {
          declaratorPath.scope.crawl();

          var init = declarator.init;
          var name = declarator.id && declarator.id.name;
          var binding = declaratorPath.scope.getBinding(name);
          var constantViolations = binding.constantViolations;

          if (constantViolations.length) {
            var line = constantViolations[0].node.loc.start.line;

            throw new ReferenceError(
              'Cannot re-assign a require; name: ' + name + ', line: ' + line
            );
          }

          binding.referencePaths.forEach(ref => ref.replaceWith(init));
          declaratorPath.remove();
        }
      },
    },
  };
};

function requireAlias(path) {
  const isValid = (
    isRequireCall(path.node) &&
    path.parent.type === 'VariableDeclarator' &&
    path.parent.id.type === 'Identifier' &&
    path.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parentPath.parent.type === 'Program'
  );

  return isValid ? path.parentPath : null;
}

function requireMemberAlias(path) {
  const isValid = (
    isRequireCall(path.node) &&
    path.parent.type === 'MemberExpression' &&
    path.parentPath.parent.type === 'VariableDeclarator' &&
    path.parentPath.parent.id.type === 'Identifier' &&
    path.parentPath.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parentPath.parentPath.parent.type === 'Program'
  );

  return isValid ? path.parentPath.parentPath : null;
}

function isRequireCall(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node['arguments'].length === 1 &&
    node['arguments'][0].type === 'StringLiteral'
  );
}
