/*jslint node: true */
"use strict";

var utils = require("../utils.js");

function HeaderFilter() {
    this.apply = function(documentTree) {
        for (var i = 0; i < documentTree.length; i++) {
            var node = documentTree[i];
            var type = node[0];
            var data = node[1];
            var title = node[2];
            if (type === 'header') {
                data.id = utils.getSlug(title);
            }
            else if (Array.isArray(node)) {
                this.apply(node);
            }
        }
    }

    return {
        apply: this.apply
    }
}
    
module.exports = HeaderFilter;