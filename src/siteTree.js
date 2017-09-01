/*jslint node: true */
"use strict";

var dtreeNode = require("./treeNode.js");
var dpage = require("./page.js");
var fs = require("fs");
var mdParser = require("./markdown/parser.js");
var path = require("path");

function SiteTree(config) {

    var parser = mdParser();

    /**
     * Walk through all the documentation pages creating the SiteTree 
     * @param {*} config Global docarys configuration class
     * @param {*} pageTree The page tree to walk through
     * @param {*} parser Content parser instance, created to parse the page content while walking
     * @param {*} parentPage The parent page whose new pages should be linked against
     * */
    function walk(config, pageTree, parser, parentPage) {
        if (Array.isArray(pageTree)) {
            pageTree.forEach(function (p) {
                walk(config, p, parser, parentPage);
            });
        } else {
            var key = Object.keys(pageTree)[0];
            var title = key;
            var filename = pageTree[key];
            var page;
            if (Array.isArray(filename)) {
                page = dtreeNode(title);
                walk(config, filename, parser, page);
            } else {
                page = dpage(title, filename, config, parser);
                page.ancestors = parentPage.ancestors ? parentPage.ancestors.slice() : [];
                if (parentPage.title !== "root") {
                    page.ancestors.push(parentPage);
                }
            }

            if (parentPage) {
                parentPage.children.push(page);
            }
        }

        return parentPage;
    }

    /**
     * Creates the navigation object
     * @param {page} page Page object we need to create the nav page from
     * */
    function createNavPage(page) {
        return {
            title: page.title,
            url: page.url,
            active: false,
            setActive: function (active) {
                this.active = active;
                if (page.ancestors && Array.isArray(page.ancestors)) {
                    for (var i in page.ancestors) {
                        page.ancestors[i].setPage(active);
                    }
                }
            }
        };
    }    

    /**
     * Build the navigation path for footer
     * @param {*} pages The pages to walk through, creating the precedense
     * @param {*} previous Previous page to current walkthrough
     * */
    function buildNavigationPath(pages, previous) {
        if (!pages.children) {
            return;
        }

        for (var i in pages.children) {
            var page = pages.children[i];
            if (page.url && previous && previous.url) {
                previous.next_page = createNavPage(page);
                page.previous_page = createNavPage(previous);
            }
            if (page.url) {
                previous = page;
            }

            buildNavigationPath(page, previous);
        }
    }

    /**
     * Creates a site tree structure using the current files present at the file system
     * @param {string} sourcePath Path where source files are stored
     */
    function buildPagesFromFs(sourcePath, basePath, pages) {
        if (!basePath) {
            basePath = sourcePath;
        }

        if (!pages) {
            pages = [];
        }

        var files = fs.readdirSync(sourcePath);
        for (var i in files) {
            var file = files[i];
            var fullpath = path.join(sourcePath, file);
            var basePathIndex = basePath.length + 1;
            var relativePath = fullpath.substr(basePathIndex, fullpath.length - basePathIndex);
            var node = {};
            if (fs.statSync(fullpath).isDirectory()) {
                node = {};
                node[file] = [];
                buildPagesFromFs(fullpath, basePath, node[file]);
                pages.push(node);
            }
            else {
                var name = file.substr(0, file.lastIndexOf('.'));
                node[name] = relativePath;
                pages.push(node);
            }
        }
        return pages;
    }

    /** 
     * Creates the site tree, using the given configuration
     * @param {*} config docarys configuration object
     * */
    function buildSiteTree(config) {
        var rootNode = {
            title: "root",
            active: false,
            children: [],
            setActive: function(active) {
                this.active = active;
            }
        };

        var pages = config.context.pages ? config.context.pages : buildPagesFromFs(config.sourcePath);
        walk(config, pages, parser, rootNode);
        buildNavigationPath(rootNode);
        return rootNode;
    }

    return buildSiteTree(config);
}

module.exports = SiteTree;