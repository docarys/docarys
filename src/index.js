/*jslint node: true */
"use strict";

const chalk = require("chalk");
var config = require("./config.js");
var log = require("logger").createLogger();
var program = require("commander");
var path = require("path");
var render = require("./render.js");
var watch = require('watch');

var commands = {
    cfg: new config(),
    build: function () {
        log.info("Building documentation...");
        var r = new render(this.cfg);
        r.render();        
    },
    serve: function() {
        this.build();
        log.info(chalk.yellow("Monitoring changes '" + this.cfg.sourcePath + "'"));
        watch.watchTree(this.cfg.sourcePath, function() {
            log.info(chalk.yellow("Changes detected, building..."));
            var cfg = new config();
            var r = new render(cfg);
            r.render();
            log.info(chalk.yellow("Build succeed"));
        });
        var server = new liveserver(this.cfg);
    }
};

program.version("0.1.0")
    .option("build", "Build the documentation")
    .option("serve", "Start the server")
    .parse(process.argv);

var liveserver = require('./liveserver.js');
var config = require('./config.js');

if (program.build) {
    commands.build();
}
else if (program.serve) {
    commands.serve();
}
