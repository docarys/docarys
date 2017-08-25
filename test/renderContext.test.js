/*jslint node: true */
"use strict";
var config = require('../src/config.js');
var expect = require('expect');
var renderContext = require('../src/renderContext.js');

describe('Render Context', function () {
    it("Should initialize properly", function () {
        var cfg = new config();
        var ctx = new renderContext(cfg, "mytemplate", "mysource", "mytarget");
        expect(ctx.config).toExist();
        expect(ctx.page).toExist();
        expect(ctx.templateFile).toBe(cfg.templatePath + '/' + "mytemplate");
        expect(ctx.sourceFile).toBe("mysource");
        expect(ctx.targetFile).toBe("mytarget");
    });
});