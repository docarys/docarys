/*jslint node: true */
"use strict";
var expect = require("expect");
var mdToc = require("../src/markdown/toc.js");

describe("TOC", function () {
    it("Should create a TOC from a basic document tree", function() {
        // var content = fs.readFileSync(__dirname + "/docs/index.md", 'utf8');
        var content = "# Welcome to mydocs\n"
                + "This is a sample. Please continue with [the next level](./level1/index.md)\n"
                + "## H2\n"
                + "This is second level\n"
                + "### H3\n"
                + "This is third level\n"
                + "## H2 Again\n"
                + " This is second level again\n"
                + "### H3 Again\n"
                + "This is third level again";
        var toc = mdToc(content);
        expect(toc).toExist();
        expect(toc.children.length).toBe(1); // Root
        expect(toc.children[0].children.length).toBe(2); // Root/H1
        expect(toc.children[0].children[0].children.length).toBe(1); // Root/H1/H2
        expect(toc.children[0].children[0].children[0].children.length).toBe(0); // Root/H1/H2/H3
        expect(toc.children[0].children[1].children.length).toBe(1); // Root/H1/H2
        expect(toc.children[0].children[1].children[0].children.length).toBe(0); // Root/H1/H2/H3
    });
});