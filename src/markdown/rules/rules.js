/*jslint node: true */
"use strict";

/** Apply all rules to the given markdown-it object */
function Rules(md) {
    // require("./header.js")(md); // TODO Remove if markdown-it-anchor do the job
    require("./markdownLink.js")(md);
}

module.exports = Rules;