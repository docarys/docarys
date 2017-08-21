/*jslint node: true */
"use strict";

var fs = require('fs');
var parser = require('./parser.js');
var path = require('path');
var mkdirp = require('mkdirp');
var nunjucks = require('nunjucks');
var page = require('./page.js');
var rimraf = require('rimraf');

function Render (config) {
    /** The configuration file */
    this.config = config;

    nunjucks.configure(this.config.templatePath);

    /** Base path to write the output */
    this.outputPath = '/build';

    this.parser = new parser();

    this.render = function() {
        var pages = this.config.context.pages;
        rimraf.sync(this.config.targetPath);
        this.renderPage(pages);
    }

    this.renderPage = function(targets) {
        targets.forEach(function(target) {
            if (Array.isArray(target)) {
                this.renderPage(target);
            }
            else {
                var key = Object.keys(target)[0];
                var title = key;
                var filename = target[key];
                if (Array.isArray(filename)) {
                    this.renderPage(filename);
                    return;
                }                            
                var sourceFile = path.resolve(this.config.sourcePath + "/" + filename);
                var targetFile = path.resolve(this.config.targetPath + "/" + filename.replace(".md", ".html"));
                var templatePath = "main.html";
                var pg = new page(this.config, templatePath, sourceFile, targetFile);
                var md = fs.readFileSync(pg.sourceFile, 'utf8');
                pg.content = this.parser.toHtml(md);               
                nunjucks.render(pg.templateFile, pg);
                mkdirp.sync(path.dirname(targetFile));
                fs.writeFileSync(targetFile, html);
            }
        }, this);
    }
}

module.exports = Render;