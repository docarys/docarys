/*jslint node: true */
"use strict";

var chalk = require("chalk");
var liveServer = require("live-server");
var path = require("path");

function LiveServer(config) {
    this.config = config;
    var params = {
        port: 5000, // Set the server port. Defaults to 5000.
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: config.targetPath, // Set root directory that's being served. Defaults to cwd.
        // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
        // file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
        wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
        // mount: [['/components', './node_modules']], // Mount a directory to a route.
        logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
    };

    console.info(chalk.yellow("Serving '" + config.targetPath +"' on http://127.0.0.1:" + params.port));
    liveServer.start(params);
}

module.exports = LiveServer;