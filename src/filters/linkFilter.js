/*jslint node: true */
"use strict";


function LinkFilter() {
    this.apply = function(documentTree) {
        for (var i = 0; i < documentTree.length; i++) {
            var node = documentTree[i];
            var type = node[0];
            var data = node[1];
            if (type === 'link') {
                if (!data.href) continue;
                data.href = data.href.replace('.md', '.html');
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
    
module.exports = LinkFilter;