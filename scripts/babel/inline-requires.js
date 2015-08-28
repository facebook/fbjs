/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Variable names associated with top level required modules.
 */
var topLevelRequires;
var topLevelRequireVarsMap;

/**
 * This transform inlines top-level require calls to enable lazy-mocking
 * in tests.
 */
module.exports = function(babel) {
  var t = babel.types;

  function buildRequireCall(name) {
    return t.callExpression(
      t.identifier('require'), [
        t.literal(topLevelRequireVarsMap[name])
      ]
    );
  }

  return new babel.Transformer('fbjs.inline-requires', {
    Program: {
      enter: function(node, parent, scope, state) {
        resetCollections();
      },
    },

    /**
     * Collects required module names, and for top level modules,
     * actual variable names associated with them.
     */
    CallExpression: {
      enter: function(node, parent, scope, state) {
        if (!isRequireCall(node)) {
          return node;
        }

        var moduleName = node.arguments[0].value;

        // Top level requires with var declarations.
        if (isTopLevelRequireDefinition(this.parentPath)) {
          var varName = this.parentPath.node.id.name;

          topLevelRequires.push(moduleName);
          topLevelRequireVarsMap[varName] = moduleName;

          // Remove the var declaration with require, since module
          // binding will be passed as a parameter to the wrapper function.
          this.parentPath.parentPath.dangerouslyRemove();

          // Also remove associated binding in the scope.
          scope.removeBinding(varName);
        } else if (topLevelRequires.indexOf(moduleName) === -1) {
          return node;
        }
      },
    },

    /**
     * Inline references to modules directly to a require call.
     */
    Identifier: {
      enter: function(node, parent, scope, state) {
        if (!shouldInlineRequire(node, scope, state)) {
          return node;
        }

        if (
          parent.type === 'AssignmentExpression' &&
          this.isBindingIdentifier() &&
          !scope.bindingIdentifierEquals(node.name, node)
        ) {
          throw new Error(
            'Cannot assign to a require(...) alias, ' + node.name +
            '. Line: ' + node.loc.start.line
          );
        }

        return this.isReferenced() ? buildRequireCall(node.name) : node;
      }
    },
  });
};

function shouldInlineRequire(node, scope, state) {
  return (
    topLevelRequireVarsMap.hasOwnProperty(node.name) &&
    !scope.hasBinding(node.name, true /* noGlobals */)
  );
}

function resetCollections() {
  topLevelRequires = [];
  topLevelRequireVarsMap = {};
}

function isTopLevelRequireDefinition(path) {
  var node = path.node;
  var parent = path.parent;

  return (
    path.parentPath.parent.type === 'Program' &&
    parent.type === 'VariableDeclaration' &&
    parent.declarations.length === 1 &&
    node.type === 'VariableDeclarator' &&
    node.id.type === 'Identifier' &&
    node.init &&
    isRequireCall(node.init)
  );
}

function isRequireCall(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node['arguments'].length === 1 &&
    node['arguments'][0].type === 'Literal'
  );
}
