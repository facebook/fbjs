/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CircularBuffer
 */

var invariant = require('invariant');

class CircularBuffer {
  constructor(size) {
    invariant(
      size > 0,
      'Buffer size should be a positive integer'
    );
    this._size = size;
    this._head = 0;
    this._buffer = [];
  }

  write(entry) {
    if (this._buffer.length < this._size) {
      this._buffer.push(entry);
    } else {
      this._buffer[this._head] = entry;
      this._head++;
      this._head %= this._size;
    }
    return this;
  }

  read() {
    return this._buffer.slice(this._head).concat(
      this._buffer.slice(0, this._head)
    );
  }

  clear() {
    this._head = 0;
    this._buffer = [];
    return this;
  }
}

module.exports = CircularBuffer;
