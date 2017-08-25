/*jslint node: true */
"use strict";

var expect = require('expect');
var linkFilter = require('../src/filters/linkFilter.js');
var markdown = require("markdown").markdown;
var fs = require('fs');

describe('Link Filter', function () {
    it('Should replace .md files with .html', function () {
        var md = "[Link test](./level1/index.md)";
        var parsedContent = markdown.parse(md);
        var filter = new linkFilter();
        filter.apply(parsedContent);
        var linkObject = parsedContent[1][1][1];
        expect(linkObject).toExist();
        expect(linkObject.href).toBe('./level1/index.html');
    });
});