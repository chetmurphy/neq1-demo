import express from 'express';
import path from 'path';

import './appInit';

import app from './app';

import minimist from 'minimist';
const args = minimist(process.argv.slice(2));

// on server run
// su oldtech
// cd /var/www/neq1.io/server/build/server/src
// sudo pm2 start main.js

const contentType: Map<string, string> = new Map;
contentType.set('css', 'text/css');
contentType.set('html', 'text/html');
contentType.set('ico', 'image/x-icon');
contentType.set('js', 'application/javascript');
contentType.set('json', 'application/json');
contentType.set('png', 'image/png');
contentType.set('woff', 'image/woof');
contentType.set('woff2', 'image/woof2');
contentType.set('eot', 'application/vnd.ms-fontobject');
contentType.set('svg', 'image/svg+xml');
contentType.set('tff', 'font/ttf');
contentType.set('map', 'application/json');

const clientBuild = '../../client/build';

console.log('client path', path.join(__dirname, clientBuild));

// "server:dev": "tsc && babel-node start-server.js --PORT=3001"
app.set('port', args.PORT || 3000);

// app.listen(app.get('port')... is needed to allow raw js to run in pm2
app.listen(app.get('port'), () => {
  console.log('server main.js __dirname', __dirname);
  console.log('client path', path.join(__dirname, clientBuild));
  console.log(`Server running at: http://localhost:${app.get('port')}/`);
});

app.use('/', express.static(path.join(__dirname, clientBuild)));

app.get('/client/build/static/js/*.js', function (req, res, next) {
  // console.log('app.get /client/build/static/js/*.js', JSONPrettify(req['route']));
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.get('/client/build/static/css/*.css', function (req, res, next) {
  // console.log('app.get /client/build/static/css/*.css', JSONPrettify(req['route']));
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.get('/client/*', function (req, res) {
  //console.log('app.get /client/*.css', JSONPrettify(req['route']));
  const resource = path.join(__dirname, '..', '..', req.url);
  // console.log('root /client/*: ' + resource + '\n');
  const parts = req.url.split('.');
  let ext = parts.pop()
  if (ext === 'gz') {
    ext = parts.pop();
  }
  const mime = contentType.get(ext);

  if (!mime) {
    res.json({
      url: req.url,
      error: 'content type not supported'
    })
  } else {
    res.contentType(mime);
    res.sendFile(resource);
  }
});

app.get('/api', function (req, res, next) {
  console.log('get /api \n' + req.url + '\n');
  let data = {
    message: 'Hello World!'
  };
  res.status(200).send(data);
});

app.put('/api', function (req, res, next) {
  console.log('put /api \n' + req.url + '\n');
  let data = req.body;
  // query a database and save data
  res.status(200).send(data);
});

app.get('/confirm-email', function (req, res, next) {
  console.log('get /confirm-email \n' + req.url + '\n');
  let data = {};
  res.status(304).send(data);
});

export default app;
