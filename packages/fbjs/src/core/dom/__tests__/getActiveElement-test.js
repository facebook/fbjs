/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

jest.unmock('getActiveElement');

var getActiveElement = require('getActiveElement');

describe('getActiveElement', () => {
  it('returns body when there is no activeElement', () => {
    var element = getActiveElement();
    expect(element.tagName).toEqual('BODY');
  });

  it('uses optional document parameter when provided', () => {
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    var iframeDocument = iframe.contentDocument;
    var element = getActiveElement(iframeDocument);
    try {
      expect(element.ownerDocument).toBe(iframeDocument);
      expect(element.ownerDocument).not.toBe(document);
    } finally {
      document.body.removeChild(iframe);
    }
  });
});
