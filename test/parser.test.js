/*jslint node: true */
"use strict";

var expect = require("expect");
var parser = require("../src/markdown/parser.js");
var fs = require("fs");

describe("Parser", function () {
    it("Should take markdown and parse it to intermediate model", function () {
        var p = parser();
        expect(p).toExist("Parser object do not exist");
        var md = "# Welcome to docarys\nThis is a sample. Please continue with [the next level](./level1/index.md)\n![Cool logo](./img/logo.png)";
        var parsedContent = p.render(md);
        expect(parsedContent).toExist();
    });
    it("Should take markdown and parse it to HTML", function () {
        var p = parser();
        expect(p).toExist("Parser object do not exist");
        var md = "# Welcome to docarys\nThis is a sample. Please continue with [the next level](./level1/index.md)\n![Cool logo](./img/logo.png)";
        var html = p.render(md);
        expect(html).toExist();
    });    
});