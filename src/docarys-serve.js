/*jslint node: true */
"use strict";

var chalk = require("chalk");
var config = require("./config.js");
var liveserver = require("./liveserver.js");
var render = require("./render.js");
var watch = require("watch");

var cfg = config();
console.info("Building documentation...");
var r = render(cfg);
r.render();
console.info(chalk.yellow("Monitoring changes \"" + cfg.sourcePath + "\""));
watch.watchTree(cfg.sourcePath, function () {
    console.info(chalk.yellow("Changes detected, building..."));
    cfg = config();
    r.render();
    console.info(chalk.yellow("Build succeed"));
});

liveserver(cfg);