/**
 * Copyright 2013-2015, Facebook, Inc.
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

function fetchWithRetries(...args): Promise {
  var deferred = new Deferred();
  fetchWithRetries.mock.calls.push(args);
  fetchWithRetries.mock.deferreds.push(deferred);
  return deferred.getPromise();
}

fetchWithRetries.mock = {
  calls: [],
  deferreds: [],
};

module.exports = fetchWithRetries;
