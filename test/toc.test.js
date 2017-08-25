/*jslint node: true */
"use strict";
var expect = require("expect");
var fs = require("fs");
var markdown = require("markdown").markdown;
var mdToc = require("../src/markdown/toc.js");


describe("TOC", function () {
    it("Should create a TOC from a basic document tree", function() {
        var content = fs.readFileSync(__dirname + "/docs/index.md", 'utf8');
        var documentTree = markdown.parse(content);
        var toc = new mdToc(documentTree);

        expect(toc).toExist();
        expect(toc.children.length).toBe(1); // Root
        expect(toc.children[0].children.length).toBe(2); // Root/H1
        expect(toc.children[0].children[0].children.length).toBe(1); // Root/H1/H2
        expect(toc.children[0].children[0].children[0].children.length).toBe(0); // Root/H1/H2/H3
        expect(toc.children[0].children[1].children.length).toBe(1); // Root/H1/H2
        expect(toc.children[0].children[1].children[0].children.length).toBe(0); // Root/H1/H2/H3
    });
});