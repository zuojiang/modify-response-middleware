'use strict';

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _brotli = require('brotli');

var _brotli2 = _interopRequireDefault(_brotli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (modify) {
  return function (req, res, next) {
    var _end = res.end;
    var list = [];
    res.write = function (chunk) {
      list.push(chunk);
    };
    res.end = function (chunk) {
      if (chunk) {
        list.push(chunk);
      }
      var content = void 0;
      if (Buffer.isBuffer(list[0])) {
        content = Buffer.concat(list);
      } else {
        content = list.join('');
      }
      var _content = decoding(res, content);
      _content = modify(_content, req, res);
      if (_content) {
        content = encoding(res, _content);
      }
      if (!res.headersSent) {
        res.setHeader('content-length', content.length);
      }
      _end.call(res, content);
    };
    next && next();
  };
};

function encoding(res, content) {
  switch (res.getHeader('content-encoding')) {
    case 'gzip':
      return _zlib2.default.gzipSync(content);
    case 'deflate':
      return _zlib2.default.deflateSync(content);
    case 'br':
      return _brotli2.default.compress(content);
  }
  return content;
}

function decoding(res, content) {
  switch (res.getHeader('content-encoding')) {
    case 'gzip':
      return _zlib2.default.gunzipSync(content);
    case 'deflate':
      return _zlib2.default.inflateSync(content);
    case 'br':
      return _brotli2.default.decompress(content);
  }
  return content;
}