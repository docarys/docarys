/*jslint node: true */
"use strict";

var git = require("../src/git.js")();
var expect = require("expect");

describe("Git", function () {
    it("Should get project information", function () {
        var gitDir = __dirname + "/../";
        var projectInfo = git.project(gitDir);
        expect(Array.isArray(projectInfo.contributors)).toBeTruthy();
        expect(projectInfo.hash).toExist();
        expect(projectInfo.shortHash).toExist();
    });

    it("Should get file information", function () {
        var fileInfo = git.file("package.json", __dirname + "/../");
        expect(fileInfo).toExist();
        expect(Array.isArray(fileInfo.contributors)).toBeTruthy();
    });    
});