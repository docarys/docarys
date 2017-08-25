/*jslint node: true */
"use strict";

var fs = require("fs");
var fse = require("fs-extra");
var parser = require("./markdown/parser.js");
var path = require("path");
var mkdirp = require("mkdirp");
var nunjucks = require("nunjucks");
var rimraf = require("rimraf");
var siteTree = require("./siteTree.js");

function Render(config) {
    /** The configuration file */
    this.config = config;

    nunjucks.configure(this.config.templatePath, {
        autoescape: false
    });

    this.parser = new parser();

    this.render = function () {
        var site = new siteTree(config);
        console.info("Cleaning site directory");
        rimraf.sync(this.config.targetPath);
        console.info("Building documentation to directory: '" + this.config.targetPath + "'");
        this.renderTheme(this.config.templatePath, this.config.targetPath);
        this.renderSite(site);
    }

    this.renderTheme = function (templatePath, targetPath) {
        var opts = {
            filter: function (filename) {
                return !filename.endsWith('.html');
            }
        };

        fse.copySync(templatePath, targetPath, opts, function () {});
    }

    this.renderSite = function (page) {
        if (page.url) { // Pages with no URL are SiteTree nodes grouping subitems, and should not be rendered
            var ctx = {
                config: config,
                page: page
            };
            mkdirp.sync(path.dirname(page.targetFile));
            var html = nunjucks.render(page.templateFile, ctx);
            fs.writeFileSync(page.targetFile, html);
        }

        if (Array.isArray(page.children)) {
            for (var i = 0; i < page.children.length; i++) {
                this.renderSite(page.children[i]);
            }
        }
    }
}

module.exports = Render;