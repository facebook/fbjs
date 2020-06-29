/**
 * Copyright 2015-present Facebook. All Rights Reserved.
 *
 * @providesModule partitionObjectByKey
 * @typechecks
 * @flow
 */

'use strict';

import type Set from 'Set';

var partitionObject = require('partitionObject');

/**
 * Partitions the enumerable properties of an object into two objects, given a
 * allowlist `Set` for the first object. This is comparable to
 * `whitelistObjectKeys`, but eventually keeping all the keys. Returns a tuple
 * of objects `[first, second]`.
 */
function partitionObjectByKey(
  source: Object,
  allowlist: Set<string>
): [Object, Object] {
  return partitionObject(source, (_, key) => allowlist.has(key));
}

module.exports = partitionObjectByKey;
