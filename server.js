/*!
 * node-live-chat
 * See messages as they are typed.
 *
 * @author    Raphael Marco
 * @link      http://pinodex.github.io
 * @license   MIT
 */

'use strict';

if (process.env.NODE_ENV === undefined) {
  console.log('NODE_ENV not set. Defaulting to "production".');
  process.env.NODE_ENV = 'production';
}

var express = require('express');
var app = express();
var swig = require('swig');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

if (process.env.NODE_ENV === 'development') {
  swig.setDefaults({
    cache: false
  });
}

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');

app.use(express.static(__dirname + '/app/public'));
app.use(require('./app/controllers'));

require('./app/models/chat')(io);

var listener = server.listen(process.env.PORT || 3000, function() {
  console.log('Server is listening on port %s.', listener.address().address.port);
  console.log('Server is on "%s" environment.', process.env.NODE_ENV);
});