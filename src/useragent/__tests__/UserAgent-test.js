/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest
  .dontMock('UserAgent')
  .dontMock('VersionRange');

var UserAgent = require('UserAgent');
var UserAgentData = require('UserAgentData');

describe('UserAgent', () => {
  function stubUserAgentData(object) {
    Object.assign(UserAgentData, object);
  }

  beforeEach(() => {
    jest.resetModuleRegistry();

    stubUserAgentData({
      browserArchitecture: '32',
      browserFullVersion: '7.0',
      browserName: 'Mobile Safari',
      deviceName: 'iPhone',
      engineName: 'WebKit',
      engineVersion: '537.51.2',
      platformArchitecture: '64',
      platformFullVersion: '7.1.2',
      platformName: 'iOS',
    });
  });

  describe('isBrowserArchitecture', () => {
    it('can detect by browser architecture', () => {
      expect(UserAgent.isBrowserArchitecture('32')).toBe(true);

      expect(UserAgent.isBrowserArchitecture('64')).toBe(false);
    });
  });

  describe('isPlatformArchitecture', () => {
    it('can detect by platform architecture', () => {
      expect(UserAgent.isPlatformArchitecture('32')).toBe(false);

      expect(UserAgent.isPlatformArchitecture('64')).toBe(true);
    });
  });

  describe('isBrowser', () => {
    it('can detect by browser name', () => {
      expect(UserAgent.isBrowser('Mobile Safari')).toBe(true);

      expect(UserAgent.isBrowser('Chrome')).toBe(false);
    });

    it('can scope to specific versions', ()=> {
      expect(UserAgent.isBrowser('Mobile Safari *')).toBe(true);
      expect(UserAgent.isBrowser('Mobile Safari 7')).toBe(true);
      expect(UserAgent.isBrowser('Mobile Safari 7.0 - 7.1')).toBe(true);

      expect(UserAgent.isBrowser('Chrome *')).toBe(false);
      expect(UserAgent.isBrowser('Mobile Safari 6.0.1')).toBe(false);
    });

    it('memoizes results', () => {
      expect(UserAgent.isBrowser('Mobile Safari')).toBe(true);

      stubUserAgentData({browserName: 'Chrome'});
      expect(UserAgent.isBrowser('Chrome')).toBe(true);

      // returns previously memoized value even though UA has now "changed"
      expect(UserAgent.isBrowser('Mobile Safari')).toBe(true);
    });
  });

  describe('isDevice', () => {
    it('can detect by device name', () => {
      expect(UserAgent.isDevice('iPhone')).toBe(true);

      expect(UserAgent.isDevice('iPad')).toBe(false);
    });

    it('does not expose version information', () => {
      expect(UserAgent.isDevice('iPhone *')).toBe(false);
      expect(UserAgent.isDevice('iPhone 5s')).toBe(false);
    });

    it('memoizes results', () => {
      expect(UserAgent.isDevice('iPhone')).toBe(true);

      stubUserAgentData({deviceName: 'iPad'});
      expect(UserAgent.isDevice('iPad')).toBe(true);

      // returns previously memoized value even though UA has now "changed"
      expect(UserAgent.isDevice('iPhone')).toBe(true);
    });
  });

  describe('isEngine', () => {
    it('can detect by engine name', () => {
      expect(UserAgent.isEngine('WebKit')).toBe(true);

      expect(UserAgent.isEngine('Gecko')).toBe(false);
    });

    it('can scope to specific versions', () => {
      expect(UserAgent.isEngine('WebKit *')).toBe(true);
      expect(UserAgent.isEngine('WebKit 537.51.2')).toBe(true);
      expect(UserAgent.isEngine('WebKit ~> 537.51.0')).toBe(true);

      expect(UserAgent.isEngine('Gecko *')).toBe(false);
      expect(UserAgent.isEngine('WebKit 536.0.0')).toBe(false);
    });

    it('memoizes results', () => {
      expect(UserAgent.isEngine('WebKit')).toBe(true);

      stubUserAgentData({engineName: 'Gecko'});
      expect(UserAgent.isEngine('Gecko')).toBe(true);

      // returns previously memoized value even though UA has now "changed"
      expect(UserAgent.isEngine('WebKit')).toBe(true);
    });
  });

  describe('isPlatform', () => {
    it('can detect by platform name', () => {
      expect(UserAgent.isPlatform('iOS')).toBe(true);

      expect(UserAgent.isPlatform('Windows')).toBe(false);
    });

    it('can scope to specific versions', () => {
      expect(UserAgent.isPlatform('iOS *')).toBe(true);
      expect(UserAgent.isPlatform('iOS 7.1.2')).toBe(true);
      expect(UserAgent.isPlatform('iOS 7.1.x || 6.1.x')).toBe(true);

      expect(UserAgent.isPlatform('Windows *')).toBe(false);
      expect(UserAgent.isPlatform('iOS 6')).toBe(false);
    });

    it('normalizes Windows version numbers', () => {
      stubUserAgentData({
        platformName: 'Windows',
        platformFullVersion: '4.0',
      });

      expect(UserAgent.isPlatform('Windows')).toBe(true);
      expect(UserAgent.isPlatform('Windows NT4.0')).toBe(true);

      expect(UserAgent.isPlatform('Windows Vista')).toBe(false);
    });

    it('memoizes results', () => {
      expect(UserAgent.isPlatform('iOS')).toBe(true);

      stubUserAgentData({platformName: 'Windows'});
      expect(UserAgent.isPlatform('Windows')).toBe(true);

      // returns previously memoized value even though UA has now "changed"
      expect(UserAgent.isPlatform('iOS')).toBe(true);
    });
  });
});
