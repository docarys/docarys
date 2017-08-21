/*jslint node: true */
"use strict";

var markdown = require("markdown").markdown;
var linkFilter = require("./filters/linkFilter.js");

/** The responsible for text parsing */
function Parser() {

    /** Filters applied to the documentTree */
    this.filters = [new linkFilter()];

    /** Takes an input string, parses and filters it, returning the result */
    this.parse = function(input, context) {
        var documentTree = markdown.parse(input);
        this.filters.forEach(function(filter){
            filter.apply(documentTree);
        });

        return documentTree;
    }

    /** Parses and filters an input string, returning the result in HTML */
    this.toHtml = function(input, context) {
        var documentTree = this.parse(input);
        return markdown.toHTML(documentTree);
    }

    return {
        parse: this.parse,
        toHtml: this.toHtml,
        filters: this.filters
    }
}

module.exports = Parser;