/*jslint node: true */
"use strict";

var removeMd = require("remove-markdown");
var utils = require("../utils.js");

/**
 * Gets a Table of Content using the Markdown content as reference
 * @param {string} content Markdown content
 */
function RegExToc(content) {
    /**
     * Regular expression to detect markdown headers
     */
    const regexp = new RegExp(/#{1,10}\s.*/g);

    /** Header sorted by levels (H1, H2, H3...) */
    var levels = [];

    /** Creates a new TOC node */
    function createNode(text, content) {
        if (content) {
            content = removeMd(content).toString("utf8");
        }

        var level = (text.match(/#/g) || []).length;
        text = level > 0 ? text.substr(level + 1) : text;
        return {
            title: text,
            url: "#" + utils.getSlug(text),
            content: content,
            level: level,
            children: []
        };
    }

    /**
     * Finds the parent element in the levels array
     * @param {*} node TOC node
     */
    function findParent(node) {
        for (var level = node.level - 1; level >= 0; level--) {
            var parentLevel = levels[level];
            if (parentLevel) {
                return parentLevel;
            }
        }
    }

    /**
     * Set the TOC node parent items
     * @param {*} node TOC Node
     */
    function setParent(node) {
        var parentLevel = findParent(node);
        // Check if it is an array or a node (in almost all cases, there will be more than one item per level)
        var parent = parentLevel[parentLevel.length - 1];
        parent.children.push(node);
        if (!levels[node.level]) {
            levels[node.level] = [node];
        } else {
            levels[node.level].push(node);
        }
    }

    /**
     * Function designed to extract section content for the search engine.
     * Current implementation performs not so go, so it has been disabled
     * @param {*} content
     * @param {*} section
     * @param {*} nextSection
     */
    // function getSectionContent(content, section, nextSection) {
    //     var start = content.indexOf(section) + section.length;
    //     var end;
    //     if (nextSection) {
    //         end  = content.indexOf(nextSection) - nextSection.length;
    //     }
    //     else {
    //         end = content.length;
    //     }

    //     var length = end - start;
    //     return content.substr(start, length);
    // }

    levels[0] = [createNode("root")];

    var matches = content.match(regexp);

    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var nextMatch = i < match.length - 1 ? matches[i + 1] : null;
        // TODO We need to find a new way to fill in the section content for the search engine. 
        // This way has a huge performance impact. Disabled
        // var sectionContent = getSectionContent(content, match, nextMatch);
        var sectionContent = "TODO";
        var node = createNode(match, sectionContent);
        setParent(node);
    }

    return levels[0][0]; // Return root node. (There will be only one).
}

module.exports = RegExToc;