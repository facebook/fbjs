/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const MODULES = [
  // Local Promise implementation.
  'Promise',
];

/**
 * Automatically imports a module if its identifier is in the AST.
 */
module.exports = function autoImporter(babel) {
  const t = babel.types;

  function isAppropriateModule(name, scope, state) {
    const autoImported = state.autoImported;
    return MODULES.indexOf(name) !== -1
        && !autoImported.hasOwnProperty(name)
        && !scope.hasBinding(name, /*skip globals*/true);
  }

  return {
    pre: function() {
      // Cache per file to avoid calling `scope.hasBinding` several
      // times for the same module, which has already been auto-imported.
      this.autoImported = {};
    },

    visitor: {
      ReferencedIdentifier: function(path) {
        const node = path.node;
        const scope = path.scope;

        if (!isAppropriateModule(node.name, scope, this)) {
          return;
        }

        scope.getProgramParent().push({
          id: t.identifier(node.name),
          init: t.callExpression(
            t.identifier('require'),
            [t.stringLiteral(node.name)]
          ),
        });

        this.autoImported[node.name] = true;
      },
    },
  };
};
