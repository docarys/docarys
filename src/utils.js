/*jslint node: true */
"use strict";

var getSlug = require('speakingurl');

/** Gets a browser friendly url from a text */
function getSlut(text) {
    return getSlug(text);
}

module.exports = {
    /** Given a file absolute build folder (target) and an absolute file folder (pagePath), gets the URI equivalent for browsers  */
    pathToUri: function (targetPath, pagePath) {
        var start = pagePath.indexOf(targetPath);
        if (start > -1) {
            return pagePath.substr(targetPath.length);
        }
    
        return pagePath;
    },
    /** Gets a browser friendly url from a text */
    getSlug: function (text) {
        return getSlug(text);
    }
};