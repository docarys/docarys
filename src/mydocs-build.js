/*jslint node: true */
"use strict";

var config = require("./config.js");
var render = require("./render.js");

var cfg = config();
console.info("Building documentation...");
var r = render(cfg);
r.render();