/*jslint node: true */
"use strict";

var config = require("./config.js");
var render = require("./render.js");

var cfg = new config();
console.info("Building documentation...");
var r = new render(cfg);
r.render();