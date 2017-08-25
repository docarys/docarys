/*jslint node: true */
"use strict";

var utils = require("./utils.js");

/** A TOC based on lib/markdown intermediate model structure */
function MdToc(documentTree) {    
    return exploreTree(documentTree);
}

/** Explores all the tree elements */
function exploreTree(tree) {
    var levels = [];
    // All TOC items are stored in a single node: root (Just in case the user adds more than 1 H1 header)
    // markdown "tree" object is an array in reality. We should iterate and find in which level is the header set.
    // The first level is level "0", where root lives
    levels[0] = createNode("root", 0);
    for (var i = 0; i < tree.length; i++) {
        exploreNode(tree[i], levels);
    }

    return levels[0];
}

/** Inspects the markdown intermediate array model, passing the levels array down the function */
function exploreNode(node, levels) {
    if (node[0] === "header") {
        // In a header, node[2] contains the text, and node[1] contains an object with the information of the header        
        var newNode = createNode(node[2], node[1]);
        // We look for parent level
        var parentLevel = levels[newNode.level - 1];
        // Checking if it is an array or a node (in almost all cases, there will be more than one item per level)
        var parent = Array.isArray(parentLevel) ? parentLevel[parentLevel.length - 1] : parentLevel;
        parent.children.push(newNode);
        if (!levels[newNode.level]) {
            levels[newNode.level] = [newNode];
        } else {
            levels[newNode.level].push(newNode);
        }
    }
}

/** Creates a new TOC node */
function createNode(text, obj) {
    return {
        title: text,
        href: "#" + utils.getSlug(text),
        level: obj.level,
        children: []
    };
}

module.exports = MdToc;