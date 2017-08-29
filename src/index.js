#!/usr/bin/env node

/*jslint node: true */
"use strict";

var chalk = require("chalk");
var config = require("./config.js");
var liveserver = require("live-server");
var program = require("commander");
var pkg = require('../package.json');
var path = require("path");
var render = require("./render.js");
var watch = require('watch');

program.version(pkg.version)    
    .command("build", "Build the documentation")
    .command("serve", "Start the integrate")
    .option("-v --verbose", "Enable verbouse output")
    .parse(process.argv);

if (program.verbose) {
    console.log("Not supported yet!. docarys is always in verbose mode");
}