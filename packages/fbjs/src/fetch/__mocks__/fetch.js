/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @noflow
 */

'use strict';

var Deferred = require.requireActual('Deferred');

const fetch = jest.fn((uri: string, options: Object): Promise => {
  var deferred = new Deferred();
  fetch.mock.deferreds.push(deferred);
  return deferred.getPromise();
});

fetch.mock.deferreds = [];

module.exports = fetch;
