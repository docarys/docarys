/*jslint node: true */
"use strict";

var expect = require('expect');
var headerFilter = require('../src/filters/headerFilter.js');
var markdown = require("markdown").markdown;
var fs = require('fs');

describe('Header Filter', function () {
    it('Should add an slug id to the object', function () {
        var md = "# Hello world";
        var parsedContent = markdown.parse(md);
        var filter = new headerFilter();
        filter.apply(parsedContent);
        expect(parsedContent).toExist();
        expect(parsedContent[1][1].id).toBe("hello-world");
    });
});