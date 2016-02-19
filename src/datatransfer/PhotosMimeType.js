/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PhotosMimeType
 */
class PhotosMimeType {
  constructor(mimeString) {
    // Allow this to be used as a function
    if (this instanceof PhotosMimeType === false) {
      return new PhotosMimeType(mimeString);
    }
    this._parts = mimeString.split('/');
  }

  isImage() {
    return this._parts[0] === 'image';
  }

  isJpeg() {
    return this.isImage() &&
      // see http://fburl.com/10972194
      (this._parts[1] === 'jpeg' || this._parts[1] === 'pjpeg');
  }
}
module.exports = PhotosMimeType;
