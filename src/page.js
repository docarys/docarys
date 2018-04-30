/*jslint node: true */
"use strict";

var fs = require("fs");
var mdToc = require("./markdown/toc-regex.js");
var path = require("path");
var readingTime = require("reading-time");
var utils = require("./utils.js");

/**
 * A docarys page
 * @param {string} title Page title
 * @param {*} filename File name
 * @param {*} config Global site configuration
 * @param {*} parser Markdown parser, used to fill-in the page content property
 */
function Page(title, filename, config, parser) {
    var templateFile = "main.html"; // TODO This templateFile might come from page metadata
    var targetFile = path.resolve(path.join(config.targetPath, filename.replace(".md", ".html")));
    var page = {
        active: false,
        ancestors: [],
        content: null,
        edit_url: config.context.edit_uri ? config.context.edit_uri + "/" + path.relative(config.cwdPath, config.sourcePath) + "/" + filename : null,
        sourcePath: config.sourcePath,
        sourceFile: path.resolve(path.join(config.sourcePath, filename)),
        targetPath: config.targetPath,
        targetFile: targetFile,
        templatePath: config.templatePath,
        templateFile: path.join(config.templatePath, templateFile),
        title: title,
        url: utils.pathToUri(config.targetPath, targetFile),
        setActive: function (active) {
            this.active = active;
            if (this.ancestors && Array.isArray(this.ancestors)) {
                for (var i = 0; i < this.ancestors.length; i++) {
                    this.ancestors[i].setActive(active);
                }
            }
        }
    };

    var sourceContent = fs.readFileSync(page.sourceFile, "utf8");
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