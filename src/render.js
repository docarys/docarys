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

/**
 * Renders all the site content
 * @param {*} config Global configuration
 */
function Render(config) {

    nunjucks.configure(config.templatePath, {
        autoescape: false
    });

    /** 
     * Copy all theme assets to output folder, except html files used as templates 
     * */
    function renderTheme (templatePath, targetPath) {
        var opts = {
            filter: function (filename) {
                return !filename.endsWith(".html");
            }
        };

        fse.copySync(templatePath, targetPath, opts, function () {});
    }

    /**
     * Copies content between paths. .md files are explictly excluded from the operation
     * @param {*} sourcePath Path where files should be copied from
     * @param {*} targetPath Path where files should be copied to
     */
    function renderContent(sourcePath, targetPath) {
        var opts = {
            filter: function (filename) {
                return !filename.endsWith(".md");
            }
        };

        fse.copySync(sourcePath, targetPath, opts, function () {});        
    }

    /**
     * Create the search index for the site
     * @param {*} site Site Tree
     * @param {*} targetPath Path where the files are stored
     */
    function createSearchIndex(site, targetPath) {
        search(site, targetPath);
    }

    /**
     * Renders the site, page by page, navigating through children properties.
     * @param {*} page Page to render
     * @param {*} site Root page
     */
    function renderSite (page, site) {
        if (!site) {
            site = page;
        }

        if (page.url) { // Pages with no URL are SiteTree nodes grouping subitems, and should not be rendered
            page.setActive(true); // IMPORTANT: Set page as active before render.
            var renderContext = { // This render context is what is effectly passed to nunjucks, and what is made available to theme creators
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
            page.setActive(false); // IMPORTANT: Unset page as active after render
        }

        // Go down through the site tree, rendering the children
        if (Array.isArray(page.children)) {
            for (var i = 0; i < page.children.length; i++) {
                renderSite(page.children[i], site);
            }
        }
    }

    /**
     * Where the magic lives
     */
    function render () {
        var site = siteTree(config);
        console.info("Cleaning site directory");
        rimraf.sync(config.targetPath);
        mkdirp.sync(config.targetPath);
        console.info("Building documentation to directory: '" + config.targetPath + "'");
        renderTheme(config.templatePath, config.targetPath);
        renderContent(config.sourcePath, config.targetPath);
        renderContent(path.join(config.modulePath, "..", "site"), config.targetPath);
        renderSite(site);
        createSearchIndex(site, config.targetPath);
    }

    function refresh() {
        var site = siteTree(config);
        console.info("Refreshing: '" + config.targetPath + "'");
        renderTheme(config.templatePath, config.targetPath);
        renderContent(config.sourcePath, config.targetPath);
        renderContent(path.join(config.modulePath, "..", "site"), config.targetPath);
        renderSite(site);
        createSearchIndex(site, config.targetPath);
    }

    return {
        render: render,
        refresh: refresh
    };
}

module.exports = Render;