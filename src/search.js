/*jslint node: true */
"use strict";

var fs = require("fs");

function SearchIndex(rootPage, targetPath) {

    var index = [];

    function addEntry(title, text, location) {
        index.push({
            "title": title,
            "text": text,
            "location": location
        });
    }

    function createIndex(page) {
        if (page.toc) {
            for (var i = 0; i<page.toc.children.length; i++) {
                var section = page.toc.children[i];
                var url = i == 0 ? page.url :  page.url + section.url;
                addEntry(section.title, section.content, url);
            }
        }
        else if (page.content) {
            addEntry(page.title, page.content, page.url);
        }

        if (page.children) {
            for (var i = 0; i < page.children.length; i++) {
                var child = page.children[i];
                createIndex(child);
            }
        }
    }

    createIndex(rootPage);
    var targetFile = targetPath + "/docarys/search_index.json";
    var fileContent = JSON.stringify({docs: index});
    fs.writeFileSync(targetFile, fileContent, "utf-8");
}

module.exports = SearchIndex;