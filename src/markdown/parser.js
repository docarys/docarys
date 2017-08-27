/*jslint node: true */
"use strict";

var hljs = require("highlight.js");
var markdown = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
}).use(require('markdown-it-anchor'));

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