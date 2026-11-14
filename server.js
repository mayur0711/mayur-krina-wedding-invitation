const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    const etag = `W/"${stats.size}-${stats.mtime.getTime()}"`;

    // Cache control: 1 year immutable for images/assets, 1 hour for html/css/js
    const isAsset = ['.webp', '.png', '.jpg', '.jpeg', '.ico', '.svg', '.woff2'].includes(ext);
    const cacheControl = isAsset 
      ? 'public, max-age=31536000, immutable' 
      : 'public, max-age=3600';

    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, { 'ETag': etag, 'Cache-Control': cacheControl });
      res.end();
      return;
    }

    const headers = {
      'Content-Type': contentType,
      'ETag': etag,
      'Cache-Control': cacheControl,
      'Vary': 'Accept-Encoding'
    };

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const compressible = ['.html', '.css', '.js', '.svg'].includes(ext);

    if (compressible && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else if (compressible && acceptEncoding.includes('deflate')) {
      headers['Content-Encoding'] = 'deflate';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createDeflate()).pipe(res);
    } else {
      headers['Content-Length'] = stats.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
