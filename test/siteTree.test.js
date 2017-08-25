/*jslint node: true */
"use strict";

var config = require("../src/config.js");
var expect = require("expect");
var siteTree = require("../src/siteTree.js");

describe("SiteTree", function () {
    it("Should be created from configuration", function () {
        var cfg = new config("mydocs.pagetree.yml");
        var tree = new siteTree(cfg);
        expect(tree).toExist();
    });
});