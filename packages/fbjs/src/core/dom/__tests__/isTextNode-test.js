/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+ui_infra@fb.com
 */

var isTextNode = require('isTextNode');

describe('isTextNode', () => {
  it('should reject strings', () => {
    expect(isTextNode('')).toBe(false);
    expect(isTextNode('a real string')).toBe(false);
  });
  it('should accept text nodes from DOM', () => {
    var span = document.createElement('span');
    span.innerHTML = '<b>some text</b>';
    document.body.appendChild(span);
    var textnode = document.body.lastChild.firstChild.firstChild;
    try {
      expect(isTextNode(textnode)).toBe(true);
    } finally {
      document.body.removeChild(span);
    }
  });
  it('should accept dynamically created text nodes', () => {
    var textnode = document.createTextNode('some more text');
    expect(isTextNode(textnode)).toBe(true);
  });
});
