/*jslint node: true */
"use strict";

var fs = require("fs");
var mdParser = require("./markdown/parser.js");
var mdToc = require("./markdown/toc-regex.js");
var path = require("path");
var readingTime = require('reading-time');
var utils = require("./utils.js");

function SiteTree(config) {

    var parser = mdParser();

    /** Walk through all the documentation pages creating the SiteTree */
    function walk(config, pageCfg, parser, parentPage) {
        if (Array.isArray(pageCfg)) {
            pageCfg.forEach(function (p) {
                walk(config, p, parser, parentPage);
            });
        } else {
            var key = Object.keys(pageCfg)[0];
            var title = key;
            var filename = pageCfg[key];
            var templateFile = "main.html"; // TODO This templateFile might come from page metadata
            var page;
            if (Array.isArray(filename)) {
                page = {
                    title: title,
                    children: [],
                    ancestors: []
                };

                walk(config, filename, parser, page);
            } else {
                page = {
                    title: title,
                    sourcePath: config.sourcePath,
                    targetPath: config.targetPath,
                    templatePath: config.templatePath,
                    ancestors: parentPage.ancestors ? parentPage.ancestors.slice() : [],
                    active: false
                };
                if (parentPage.title != "root") {
                    page.ancestors.push(parentPage);
                }
                page.templateFile = page.templatePath + '/' + templateFile;
                page.sourceFile = path.resolve(page.sourcePath + "/" + filename);
                page.targetFile = path.resolve(page.targetPath + "/" + filename.replace(".md", ".html"));
                page.url = utils.pathToUri(page.targetPath, page.targetFile);
                page.edit_url = "https://www.github.com/sesispla/mydocs/edit";
                var sourceContent = fs.readFileSync(page.sourceFile, 'utf8');
                if (page.sourceFile.endsWith(".md")) {
                    page.toc = mdToc(sourceContent); // TODO: Still use the old markdown library to build the TOC. Find a way to replace it with markdown-it
                    page.content = parser.render(sourceContent);
                    page.stats = readingTime(page.content);
                } else {
                    page.content = sourceContent;
                }
            }

            if (parentPage) {
                parentPage.children.push(page);
            }
        }

        return parentPage;
    }

    /** Build the navigation path for footer */
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

    /** Creates the navigation object */
    function createNavPage(page) {
        return {
            title: page.title,
            url: page.url
        }
    }

    /** Starts the SiteTree creation */
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