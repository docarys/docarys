/*jslint node: true */
"use strict";

var fs = require("fs");
var mdToc = require("./markdown/toc-regex.js");
var path = require("path");
var readingTime = require("reading-time");
var utils = require("./utils.js");

/**
 * A docarys page
 * @param {string} title Page title
 */
function TreeNode(title) {
    return {
        active: false,
        ancestors: [],
        children: [],
        title: title,
        setActive: function (active) {
            this.active = active;
            if (this.ancestors && Array.isArray(this.ancestors)) {
                for (var i = 0; i < this.ancestors.length; i++) {
                    this.ancestors[i].setActive(active);
                }
            }
        }
    };
}

module.exports = TreeNode;