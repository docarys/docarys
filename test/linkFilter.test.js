/*jslint node: true */
"use strict";

var expect = require('expect');
var mdLink = require("../src/markdown/rules/markdownLink.js");
var markdown = require('markdown-it')();
mdLink(markdown);

describe('Link Filter', function () {
    it('Should replace .md files with .html', function () {
        var md = "[Link test](./level1/index.md)";
        var parsedContent = markdown.render(md);
        expect(parsedContent).toContain("level1/index.html");
    });
});