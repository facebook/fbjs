/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule joinClasses
 * @flow
 * @typechecks static-only
 */

'use strict';

/**
 * Combines multiple className strings into one.
 */
function _joinClasses(className: mixed): string {
  let newClassName = ((className: any): string) || '';
  const argLength = arguments.length;

  if (argLength > 1) {
    for (let index = 1; index < argLength; index++) {
      const nextClass = arguments[index];
      if (nextClass) {
        newClassName = (newClassName ? newClassName + ' ' : '') + nextClass;
      }
    }
  }
  return newClassName;
}

const joinClasses: (...classNames: Array<mixed>) => string = (_joinClasses: any);

module.exports = joinClasses;
