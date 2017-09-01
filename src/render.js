/*jslint node: true */
"use strict";

var fs = require("fs");
var fse = require("fs-extra");
var git = require("./git.js")();
var path = require("path");
var mkdirp = require("mkdirp");
var nunjucks = require("nunjucks");
var rimraf = require("rimraf");
var search = require("./search.js");
var siteTree = require("./siteTree.js");

function Render(config) {

    nunjucks.configure(config.templatePath, {
        autoescape: false
    });

    function render () {
        var site = siteTree(config);
        console.info("Cleaning site directory");
        rimraf.sync(config.targetPath);
        console.info("Building documentation to directory: '" + config.targetPath + "'");
        renderTheme(config.templatePath, config.targetPath);
        renderContent(config.sourcePath, config.targetPath);
        renderContent(path.join(config.modulePath, "..", "site"), config.targetPath);
        renderSite(site, site);
        createSarchIndex(site, config.targetPath);
    }

    /** Copy all theme assets to output folder, except html files used as templates */
    function renderTheme (templatePath, targetPath) {
        var opts = {
            filter: function (filename) {
                return !filename.endsWith('.html');
            }
        };

        fse.copySync(templatePath, targetPath, opts, function () {});
    }

    function renderContent(sourcePath, targetPath) {
        var opts = {
            filter: function (filename) {
                return !filename.endsWith('.md');
            }
        };

        fse.copySync(sourcePath, targetPath, opts, function () {});        
    }

    function createSarchIndex(site, targetPath) {
        search(site, targetPath);
    }

    function renderSite (page, site) {
        if (page.url) { // Pages with no URL are SiteTree nodes grouping subitems, and should not be rendered
            page.setActive(true); // Set page as active before render
            var renderContext = {
                config: config.context,
                configExtra: config,
                page: page,
                nav: site
            };
            if (config.enableGit && git.initialized(config.cwdPath)) {
                var gitFolder = git.project(config.cwdPath);
                var gitFile = git.file(page.sourceFile, config.cwdPath);
                renderContext.git = {
                    branch: gitFolder.branch,
                    hash: gitFolder.hash,
                    contributors: gitFile.contributors
                };
            }
            mkdirp.sync(path.dirname(page.targetFile));
            var html = nunjucks.render(page.templateFile, renderContext);
            fs.writeFileSync(page.targetFile, html);
            page.setActive(false); // Unset page as active after render
        }

        if (Array.isArray(page.children)) {
            for (var i = 0; i < page.children.length; i++) {
                renderSite(page.children[i], site);
            }
        }
    }

    return {
        render: render
    }
}

module.exports = Render;