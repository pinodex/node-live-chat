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

router.use('/', require('./root'));

module.exports = router;