/*jslint node: true */
"use strict";
var config = require("../src/config.js");
var expect = require("expect");
var fs = require("fs");
var path = require("path");
var render = require("../src/render.js");

describe("Render", function () {
    it("Should create the files", function () {
        var cfg = config();
        var r = render(cfg);
        r.render();
        expect(r).toExist();
        var file1 = path.resolve(__dirname + "/build" + "/index.html");
        var file2 = path.resolve(__dirname + "/build" + "/level1/index.html");
        expect(fs.existsSync(file1)).toBe(true);
        expect(fs.existsSync(file2)).toBe(true);
    });
});