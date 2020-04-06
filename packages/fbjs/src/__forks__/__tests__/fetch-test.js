/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.unmock('fetch');
jest.mock('cross-fetch');

const fetchImpl = require('cross-fetch');

describe('fetch', function() {
  afterEach(() => {
    // Ensure the cached `fetch` module is cleared to test the other path.
    jest.resetModules();
  });

  it('works with global fetch', () => {
    const fetchMock = jest.fn();

    global.fetch = fetchMock;
    const fetch = require('fetch');
    fetch();

    expect(fetchMock).toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();

    delete global.fetch;
  });

  it('uses ponyfill without global fetch', () => {
    // If node ever gets a global fetch, we'll start failing this case.
    expect(global.fetch).toBeUndefined();

    const fetch = require('fetch');
    fetch();

    expect(fetchImpl).toHaveBeenCalled();
  });
});
