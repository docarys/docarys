/*jslint node: true */
"use strict";

var dpage = require("./page.js");
var mdParser = require("./markdown/parser.js");

function SiteTree(config) {

    var parser = mdParser();

    /**
     * Walk through all the documentation pages creating the SiteTree 
     * @config Global docarys configuration class
     * @pageTree The page tree to walk through
     * @parser Content parser instance, created to parse the page content while walking
     * @parentPage The parent page whose new pages should be linked against
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
                page = {
                    title: title,
                    children: [],
                    ancestors: []
                };

                walk(config, filename, parser, page);
            } else {
                page = dpage(title, filename, config, parser);
                page.ancestors = parentPage.ancestors ? parentPage.ancestors.slice() : [];
                if (parentPage.title != "root") {
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
     * Build the navigation path for footer
     * @pages The pages to walk through, creating the precedense
     * @previous Previous page to current walkthrough
     * */
    function buildNavigationPath(pages, previous) {
        if (!pages.children) {
            return;
        }

        for (var i = 0; i < pages.children.length; i++) {
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
     * Creates the navigation object
     * @page Page object we need to create the nav page from
     * */
    function createNavPage(page) {
        return {
            title: page.title,
            url: page.url
        };
    }

    /** 
     * Creates the site tree, using the given configuration
     * @config docarys configuration object
     * */
    function buildSiteTree(config) { 
        var rootNode = {
            title: "root",
            children: []
        };
        walk(config, config.context.pages, parser, rootNode);
        buildNavigationPath(rootNode);
        return rootNode;
    }

    return buildSiteTree(config);
}

module.exports = SiteTree;