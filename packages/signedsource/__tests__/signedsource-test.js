/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const SignedSource = require('../index.js');

test('signFile', () => {
  expect(
    SignedSource.signFile(`# ${SignedSource.getSigningToken()}\ntest 1`)
  ).toEqual(
    `# @generated SignedSource<<d9b7b52f54978f54b84a0fd48145e470>>\ntest 1`
  );

  expect(
    SignedSource.signFile(`# ${SignedSource.getSigningToken()}\ntest 2`)
  ).toEqual(
    `# @generated SignedSource<<4c0c1ae4f5863c72731b2f543e830fd5>>\ntest 2`
  );

  // re-sign a file
  expect(
    SignedSource.signFile(`# @generated SignedSource<<eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee>>\nalready signed test`)
  ).toEqual(
    `# @generated SignedSource<<54e8ffafff15a19f858d95c9a13d5b1d>>\nalready signed test`
  );
});

test('isSigned', () => {
  const signedString = SignedSource.signFile(
    `# ${SignedSource.getSigningToken()}\ntest`
  );

  expect(SignedSource.isSigned(signedString)).toBe(true);
  expect(SignedSource.isSigned(signedString + 'modified')).toBe(true);
  expect(SignedSource.isSigned('unsigned')).toBe(false);
});

test('verifySignature', () => {
  const signedString = SignedSource.signFile(
    `# ${SignedSource.getSigningToken()}\ntest`
  );
  expect(SignedSource.verifySignature(signedString)).toBe(true);
  expect(SignedSource.verifySignature(signedString + 'modified')).toBe(false);
  expect(() => {
    SignedSource.verifySignature('unsigned');
  }).toThrow(
    'SignedSource.verifySignature(...): Cannot verify signature of an unsigned file.'
  );
});
