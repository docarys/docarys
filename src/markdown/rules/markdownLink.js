/*jslint node: true */
"use strict";

/** Configures the given markdown-it instance to open all links in a new browser window */
function markdownLink(md) {
    // Remember old renderer, if overriden, or proxy to default renderer
    var defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        var hrefIndex = tokens[idx].attrIndex("href");
        if (hrefIndex >= 0) {
            tokens[idx].attrs[hrefIndex][1] = tokens[idx].attrs[hrefIndex][1].replace(".md", ".html"); // Replace any reference to markdown files

            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        }
    };
}

module.exports = markdownLink;