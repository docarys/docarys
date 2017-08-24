/*jslint node: true */
"use strict";

var liveserver = require('./liveserver.js');
var config = require('./config.js');

var cfg = new config();
var server = new liveserver(cfg);
