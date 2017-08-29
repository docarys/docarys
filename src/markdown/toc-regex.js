/*jslint node: true */
"use strict";

var utils = require("../utils.js");

function RegExToc(content) {

    const regexp = new RegExp(/#{1,10}\s.*/g);

    var levels = [];

    levels[0] = createNode("root", {
        level: 0
    });

    var matches = content.match(regexp);

    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var node = createNode(match);
        setParent(node);
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
    function createNode(text) {
        var level = (text.match(/#/g) || []).length;
        text = level > 0 ? text.substr(level + 1) : text;
        return {
            title: text,
            url: "#" + utils.getSlug(text),
            level: level,
            children: []
        };
    }

    return levels[0]; // Return root level
}

module.exports = RegExToc;