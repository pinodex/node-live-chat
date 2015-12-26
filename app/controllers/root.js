/*!
 * node-live-chat
 * See messages as they are typed.
 *
 * @author    Raphael Marco
 * @link      http://pinodex.github.io
 * @license   MIT
 */

'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    xhr: req.xhr,
    host: req.get('host')
  });
});

router.get('/chat', function(req, res) {
  res.render('chat', {
    xhr: req.xhr,
    host: req.get('host'),
  });
});

module.exports = router;