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
 *
 * Destructuring also works the same way. For instance:
 *     const {Baz} = require('foo');
 *     h(Baz);
 *
 * Is also successfully inlined into:
 *     g(require('foo').Baz);
 */
module.exports = function fbjsInlineRequiresTransform(babel) {
  return {
    visitor: {
      Program: {
        exit(path, state) {
          var inlineableCalls = {require: true};

          if (state.opts && state.opts.inlineableCalls) {
            state.opts.inlineableCalls.forEach(function(name) {
              inlineableCalls[name] = true;
            });
          }

          path.scope.crawl();
          path.traverse(
            {CallExpression: call.bind(null, babel)},
            {inlineableCalls: inlineableCalls}
          );
        },
      },
    },
  };
};

function call(babel, path, state) {
  var declaratorPath = inlineableAlias(path, state) || inlineableMemberAlias(path, state);
  var declarator = declaratorPath && declaratorPath.node;

  if (declarator) {
    var init = declarator.init;
    var name = declarator.id && declarator.id.name;
    var binding = declaratorPath.scope.getBinding(name);
    var constantViolations = binding.constantViolations;

    if (!constantViolations.length) {
      deleteLocation(init);

      babel.traverse(init, {
        noScope: true,
        enter: path => deleteLocation(path.node)
      });

      binding.referencePaths.forEach(ref => ref.replaceWith(init));
      declaratorPath.remove();
    }
  }
}

function deleteLocation(node) {
  delete node.start;
  delete node.end;
  delete node.loc;
}

function inlineableAlias(path, state) {
  const isValid = (
    isInlineableCall(path.node, state) &&
    path.parent.type === 'VariableDeclarator' &&
    path.parent.id.type === 'Identifier' &&
    path.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parentPath.parent.type === 'Program'
  );

  return isValid ? path.parentPath : null;
}

function inlineableMemberAlias(path, state) {
  const isValid = (
    isInlineableCall(path.node, state) &&
    path.parent.type === 'MemberExpression' &&
    path.parentPath.parent.type === 'VariableDeclarator' &&
    path.parentPath.parent.id.type === 'Identifier' &&
    path.parentPath.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parentPath.parentPath.parent.type === 'Program'
  );

  return isValid ? path.parentPath.parentPath : null;
}

function isInlineableCall(node, state) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    state.inlineableCalls.hasOwnProperty(node.callee.name) &&
    node['arguments'].length === 1 &&
    node['arguments'][0].type === 'StringLiteral'
  );
}
