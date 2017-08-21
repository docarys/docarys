/*jslint node: true */
"use strict";

var path = require('path');

function Page(cfg, template, sourceFile, targetFile) {
    this.config = cfg.context;
    this.sourceFile = sourceFile;
    this.targetFile = targetFile;
    this.templateFile = cfg.templatePath + '/' + template;
}

module.exports = Page;