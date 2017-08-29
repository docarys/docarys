/*jslint node: true */
"use strict";

var hljs = require("highlight.js");
var markdown = require('markdown-it')()
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-highlightjs'), {auto: true});

require("./rules/rules.js")(markdown);

/** The responsible for text parsing */
function Parser() {

  function render(input) {
    return markdown.render(input);
  }

  function addRule(rule) {
    rule(markdown);
  }

  return {
    render: render,
    addRule: addRule
  };
}

module.exports = Parser;