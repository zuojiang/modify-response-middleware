import zlib from 'zlib'
import brotli from 'brotli'

module.exports = function(modify, opts = {}) {
  return (req, res, next) => {
    if (opts.noCache) {
      req.headers['cache-control'] = 'no-cache'
    }
    const _end = res.end
    const list = []
    res.write = function(chunk) {
      list.push(chunk)
    }
    res.end = function(chunk) {
      if (chunk) {
        list.push(chunk)
      }
      let content
      if (Buffer.isBuffer(list[0])) {
        content = Buffer.concat(list)
      } else {
        content = list.join('')
      }
      let _content = decoding(res, content)
      _content = modify(_content, req, res)
      if (Buffer.isBuffer(_content) || typeof _content == 'string') {
        content = encoding(res, _content)
        if (!res.headersSent) {
          res.setHeader('content-length', content.length)
        }
      }
      _end.call(res, content)
    }
    next && next()
  }
}

function encoding(res, content) {
  switch (res.getHeader('content-encoding')) {
    case 'gzip':
      return zlib.gzipSync(content)
    case 'deflate':
      return zlib.deflateSync(content)
    case 'br':
      return brotli.compress(content)
  }
  return content
}

function decoding(res, content) {
  switch (res.getHeader('content-encoding')) {
    case 'gzip':
      return zlib.gunzipSync(content)
    case 'deflate':
      return zlib.inflateSync(content)
    case 'br':
      return brotli.decompress(content)
  }
  return content
}
