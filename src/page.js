/*jslint node: true */
"use strict";

var fs = require("fs");
var mdToc = require("./markdown/toc-regex.js");
var path = require("path");
var readingTime = require('reading-time');
var utils = require("./utils.js");

/**
 * A docarys page
 * @title Page title
 * @filename File name
 * @config Global site configuration
 * @parser Markdown parser, used to fill-in the page content property
 */
function Page(title, filename, config, parser) {
    var page;
    var templateFile = "main.html"; // TODO This templateFile might come from page metadata
    var targetFile = path.resolve(path.join(config.targetPath, filename.replace(".md", ".html")));

    page = {
        active: false,
        ancestors: [],
        content: null,
        title: title,
        sourcePath: config.sourcePath,
        sourceFile: path.resolve(path.join(config.sourcePath, filename)),
        targetPath: config.targetPath,
        targetFile: targetFile,
        templatePath: config.templatePath,
        templateFile: path.join(config.templatePath, templateFile),        
        url: utils.pathToUri(config.targetPath, targetFile)
    };

    var sourceContent = fs.readFileSync(page.sourceFile, 'utf8');
    if (page.sourceFile.endsWith(".md")) {
        page.toc = mdToc(sourceContent);
        page.content = parser.render(sourceContent);
        page.stats = readingTime(page.content);
    } else {
        page.content = sourceContent;
    }

    return page;
}


module.exports = Page;