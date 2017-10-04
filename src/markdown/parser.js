/*jslint node: true */
"use strict";

require("highlight.js");
var markdown = require("markdown-it")({html: true})
    .use(require("markdown-it-anchor"))
    .use(require("markdown-it-highlightjs"), {auto: true})
    .use(require("markdown-it-sanitizer"));

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