/*jslint node: true */
"use strict";
var expect = require("expect");
var utils = require("../src/utils.js");

describe("Utils", function () {
    it("Should convert absolute folder paths to absolute uri paths with 0 levels", function() {
        var targetPath = "/my/path/to/build";
        var pagePath = "/my/path/to/build/page.html";
        var uri = utils.pathToUri(targetPath, pagePath);
        expect(uri).toBe("/page.html");
    });
    it("Should convert absolute folder paths to absolute uri paths with 1 level", function() {
        var targetPath = "/my/path/to/build";
        var pagePath = "/my/path/to/build/level1/page.html";
        var uri = utils.pathToUri(targetPath, pagePath);
        expect(uri).toBe("/level1/page.html");
    });
    it("Should convert absolute folder paths to absolute uri paths 2 levels", function() {
        var targetPath = "/my/path/to/build";
        var pagePath = "/my/path/to/build/level1/level2/page.html";
        var uri = utils.pathToUri(targetPath, pagePath);
        expect(uri).toBe("/level1/level2/page.html");
    });
    it("Should generate a friendly URI", function() {
        var text = "My super text with söme speciâl carácteres.!?#";
        var slug = utils.getSlug(text);
        expect(slug).toBe("my-super-text-with-soeme-special-caracteres");
    });
});