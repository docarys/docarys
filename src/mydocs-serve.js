var chalk = require("chalk");
var config = require('./config.js');
var liveserver = require('./liveserver.js');
var render = require("./render.js");
var watch = require('watch');

var cfg = new config();
console.info("Building documentation...");
var r = new render(cfg);
r.render();
console.info(chalk.yellow("Monitoring changes '" + cfg.sourcePath + "'"));
watch.watchTree(cfg.sourcePath, function() {
    console.info(chalk.yellow("Changes detected, building..."));
    var cfg = new config();
    var r = new render(cfg);
    r.render();
    console.info(chalk.yellow("Build succeed"));
});
var server = new liveserver(cfg);