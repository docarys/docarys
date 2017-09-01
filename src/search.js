/*jslint node: true */
"use strict";

var fs = require("fs");
var path = require("path");

/**
 * Create the search index file
 * @param {*} rootPage Site Root Page node
 * @param {*} targetPath Path where the index should be stored
 */
function SearchIndex(rootPage, targetPath) {

    /** Index content */
    var index = [];

    /**
     * Creates a new entry in the index
     * @param {*} title Title of the index
     * @param {*} text Text of the index
     * @param {*} location URL where the content can be found
     */
    function addEntry(title, text, location) {
        index.push({
            "title": title,
            "text": text,
            "location": location
        });
    }

    /**
     * Creates a page index for all TOC content present in the page
     * @param {*} page page with TOC content to index
     */
    function createTocIndex(page) {
        for (var i = 0; i < page.toc.children.length; i++) {
            var section = page.toc.children[i];
            var url = i === 0 ? page.url : page.url + section.url;
            addEntry(section.title, section.content, url);
        }
    }

    /**
     * creates a full index for the page. Used only for those pages without TOC.
     * @param {*} page Page to index
     */
    function createPageIndex(page) {
        addEntry(page.title, page.content, page.url);
    }

    /** 
     * Creates the index for a page
     * @param {*} page Page to index
     * */
    function createIndex(page) {
        if (page.toc) {
            createTocIndex(page);
        } else if (page.content) {
            createPageIndex(page);
        }

        createChildIndexes(page);
    }    

    /**
     * Iterates over page children, creating more search indexes
     * @param {*} page Page whose children should be indexed
     */
    function createChildIndexes(page) {
        if (page.children) {
            for (var i = 0; i < page.children.length; i++) {
                var child = page.children[i];
                createIndex(child);
            }
        }
    }

    createIndex(rootPage);
    var targetFile = path.join(targetPath, "docarys", "search_index.json");
    var fileContent = JSON.stringify({
        docs: index
    });
    fs.writeFileSync(targetFile, fileContent, "utf-8");
}

module.exports = SearchIndex;