/*jslint node: true */
"use strict";

var removeMd = require("remove-markdown");
var utils = require("../utils.js");

function RegExToc(content) {

    const regexp = new RegExp(/#{1,10}\s.*/g);

    var levels = [];

    levels[0] = createNode("root");

    var matches = content.match(regexp);

    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var nextMatch = i < match.length - 1 ? matches[i+1] : null;
        // var sectionContent = getSectionContent(content, match, nextMatch);
        var sectionContent = "TODO";
        var node = createNode(match, sectionContent);
        setParent(node);
    }

    function getSectionContent(content, section, nextSection) {
        var start = content.indexOf(section) + section.length;
        var end;
        if (nextSection) {
            end  = content.indexOf(nextSection) - nextSection.length;
        }
        else {
            end = content.length;
        }

        var length = end - start;
        return content.substr(start, length);
    }

    function setParent(node) {
        var parentLevel;
        for (var level = node.level - 1; level >= 0; level--) {
            parentLevel = levels[level];
            if (parentLevel) {
                break;
            }
        }
        // Checking if it is an array or a node (in almost all cases, there will be more than one item per level)
        var parent = Array.isArray(parentLevel) ? parentLevel[parentLevel.length - 1] : parentLevel;
        parent.children.push(node);
        if (!levels[node.level]) {
            levels[node.level] = [node];
        } else {
            levels[node.level].push(node);
        }
    }

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

    return levels[0]; // Return root level
}

module.exports = RegExToc;