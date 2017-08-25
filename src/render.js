/*jslint node: true */
"use strict";

var fs = require("fs");
var fse = require("fs-extra");
var parser = require("./parser.js");
var path = require("path");
var mkdirp = require("mkdirp");
var nunjucks = require("nunjucks");
var renderContext = require("./renderContext.js");
var rimraf = require("rimraf");
var mdToc = require("./mdToc.js");
var utils = require("./utils.js");

function Render (config) {
    /** The configuration file */
    this.config = config;

    nunjucks.configure(this.config.templatePath, {autoescape: false});

    this.parser = new parser();

    this.render = function() {
        var pages = this.config.context.pages;
        console.info("Cleaning site directory");
        rimraf.sync(this.config.targetPath);
        console.info("Building documentation to directory: '" + this.config.targetPath + "'");
        this.renderTheme(this.config.templatePath, this.config.targetPath);
        this.renderPage(pages);
    }

    this.renderTheme = function(templatePath, targetPath) {    
        var opts = {
            // filter: new RegExp('^((?!\.html).)*$')
            filter: function (filename) {
                return !filename.endsWith('.html');
            }
        };
        fse.copySync(templatePath, targetPath, opts, function() {});
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
                var templateFile = "docs.html";
                var ctx = new renderContext(this.config, templateFile, sourceFile, targetFile);
                var sourceContent = fs.readFileSync(ctx.sourceFile, 'utf8');
                if (ctx.sourceFile.endsWith(".md")) {
                    ctx.page.url = utils.pathToUri(this.config.targetPath, targetFile);                    
                    ctx.page.documentTree = this.parser.parse(sourceContent);
                    ctx.page.content = this.parser.toHtml(ctx.page.documentTree, ctx);
                    ctx.page.toc = new mdToc(ctx.page);
                }
                else {
                    ctx.page.content = sourceContent;
                }
                mkdirp.sync(path.dirname(targetFile));
                var html = nunjucks.render(ctx.templateFile, ctx);
                fs.writeFileSync(targetFile, html);
            }
        }, this);
    }
}

module.exports = Render;