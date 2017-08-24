#!/usr/bin/env node

/*jslint node: true */
"use strict";

var chalk = require("chalk");
var config = require("./config.js");
var liveserver = require("live-server");
var program = require("commander");
var path = require("path");
var render = require("./render.js");
var watch = require('watch');

program.version("0.1.0")    
    .command("build", "Build the documentation")
    .command("serve", "Start the integrate")
    .option("-v --verbose", "Enable verbouse output")
    .parse(process.argv);

if (program.verbose) {
    console.log("Not supported yet!. mydocs is always in verbose mode");
}