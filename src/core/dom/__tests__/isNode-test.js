/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ui_infra
 */

var isNode = require('isNode');

describe('isNode', () => {
  it('should reject undefined', () => {
    var UNDEFINED;
    expect(isNode()).toBe(false);
    expect(isNode(UNDEFINED)).toBe(false);
  });
  it('should reject null', () => {
    expect(isNode(null)).toBe(false);
  });
  it('should reject primitives', () => {
    expect(isNode(false)).toBe(false);
    expect(isNode(true)).toBe(false);
    expect(isNode(0)).toBe(false);
    expect(isNode(1)).toBe(false);
  });
  it('should reject strings', () => {
    expect(isNode('')).toBe(false);
    expect(isNode('a real string')).toBe(false);
  });
  it('should reject sneaky objects', () => {
    expect(isNode({tagName: 'input'})).toBe(false);
    expect(isNode({nodeName: 'input'})).toBe(false);
  });
  it('should reject the window object', () => {
    expect(isNode(window)).toBe(false);
  });
  it('should accept document fragments', () => {
    expect(isNode(document.createDocumentFragment())).toBe(true);
  });
  it('should accept elements from DOM', () => {
    expect(isNode(document.body)).toBe(true);
    expect(isNode(document.documentElement)).toBe(true);
  });
  it('should accept dynamically created elements', () => {
    expect(isNode(document.createElement('div'))).toBe(true);
    expect(isNode(document.createElement('input'))).toBe(true);
    expect(isNode(document.createElement('a'))).toBe(true);
  });
  it('should accept all types of nodes', () => {
    var body = document.body;
    var div = document.createElement('div');
    var input = document.createElement('input');
    var textnode = document.createTextNode('yet more text');
    expect(isNode(body)).toBe(true);
    expect(isNode(div)).toBe(true);
    expect(isNode(input)).toBe(true);
    expect(isNode(textnode)).toBe(true);
    expect(isNode(document)).toBe(true);
  });
  it('should run isNode', () => {
    expect(isNode(document.createElement('div'))).toBe(true);
    expect(isNode(document.createTextNode('text'))).toBe(true);
    expect(isNode(null)).toBe(false);
    expect(isNode(window)).toBe(false);
    expect(isNode({})).toBe(false);
  });
  it('should detect DOM nodes', function() {
    expect(isNode(document.createElement('object'))).toBe(true);
    expect(isNode({})).toBe(false);
  });
});
