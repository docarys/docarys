/*jslint node: true */
"use strict";

var config = require('./config.js');
var render = require('./render.js');
var program = require("commander");

var commands = {
    cfg: new config(),
    build: function() {    
        var cfg = new config();
        var r = new render(this.cfg);
        r.render();        
    },
    serve: function() {
        var server = new liveserver(this.cfg);
    }
}

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
