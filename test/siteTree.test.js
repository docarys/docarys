/*jslint node: true */
"use strict";

var config = require("../src/config.js");
var expect = require("expect");
var siteTree = require("../src/siteTree.js");

describe("SiteTree", function () {
    it("Should be created from configuration", function () {
        var cfg = config("docarys.pagetree.yml");
        var tree = siteTree(cfg);
        expect(tree).toExist();
    });

    it("Should create a site tree from folder structure, if no pages specified in configuration", function () {
        var cfg = config("docarys.notree.yml");
        var tree = siteTree(cfg);
        expect(tree).toExist();
        expect(tree.children).toExist();
        expect(tree.children.length).toBe(3);
        expect(tree.children[0].children.length).toBe(0);
        expect(tree.children[1].title).toBe("index");
        expect(tree.children[2].children.length).toBe(2);
        expect(tree.children[2].children[0].title).toBe("index");
        expect(tree.children[2].children[1].title).toBe("other");
    });    
});

