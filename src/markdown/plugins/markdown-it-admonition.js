'use strict';


module.exports = function admonitionPlugin(md, options) {

  function renderDefault(tokens, idx, _options, env, self) {

    var token = tokens[idx];

    if (token.type == "admonition_open") {
        tokens[idx].attrPush([ "class", "admonition " + type ]);
    }
    else if (token.type === "admonition_title_open") {
        tokens[idx].attrPush([ "class", "admonition-title"]);
    }

    return self.renderToken(tokens, idx, _options, env, self);
  }

  options = options || {};

  var min_markers = 3,
      markerStr  = options.marker || "!",
      markerChar = markerStr.charCodeAt(0),
      markerLen  = markerStr.length,
      validate    = validateDefault,
      render      = renderDefault,
      type        = "",
      title       = null,
      types       = ["note", "abstract", "info", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"];


    function validateDefault(params) {
      var array = params.trim().split(" ", 2);
      type = array[0];
      if (params.length > type.length + 2) {
          title = params.substring(type.length + 2, params.length);
      }
  
      if (!title) {
          title = type;
      }
  
      return types.includes(type);
    }

  function admonition(state, startLine, endLine, silent) {
    var pos, nextLine, markerCount, markup, params, token,
        oldParent, oldLineMax,
        auto_closed = false,
        start = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    // Check out the first character quickly,
    // this should filter out most of non-containers
    //
    if (markerChar !== state.src.charCodeAt(start)) { return false; }

    // Check out the rest of the marker string
    //
    for (pos = start + 1; pos <= max; pos++) {
      if (markerStr[(pos - start) % markerLen] !== state.src[pos]) {
        break;
      }
    }

    markerCount = Math.floor((pos - start) / markerLen);
    if (markerCount < min_markers) { return false; }
    pos -= (pos - start) % markerLen;

    markup = state.src.slice(start, pos);
    params = state.src.slice(pos, max);
    if (!validate(params)) { return false; }

    // Since start is found, we can report success here in validation mode
    //
    if (silent) { return true; }

    // Search for the end of the block
    //
    nextLine = startLine;

    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }

      start = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (start < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - ```
        //  test
        break;
      }

      if (markerChar !== state.src.charCodeAt(start)) { continue; }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue;
      }

      for (pos = start + 1; pos <= max; pos++) {
        if (markerStr[(pos - start) % markerLen] !== state.src[pos]) {
          break;
        }
      }

      // closing adminition fence must be at least as long as the opening one
      if (Math.floor((pos - start) / markerLen) < markerCount) { continue; }

      // make sure tail has spaces only
      pos -= (pos - start) % markerLen;
      pos = state.skipSpaces(pos);

      if (pos < max) { continue; }

      // found!
      auto_closed = true;
      break;
    }

    oldParent = state.parentType;
    oldLineMax = state.lineMax;
    state.parentType = "admonition";

    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = nextLine;

    token        = state.push("admonition_open", "div", 1);
    token.markup = markup;
    token.block  = true;
    token.info   = type;
    token.map    = [ startLine, nextLine ];

    // admonition title
    token        = state.push("admonition_title_open", "p", 1);
    token.markup = markup + " " + type;
    token.map    = [ startLine, nextLine ];

    token          = state.push("inline", "", 0);
    token.content  = title;
    token.map      = [ startLine, state.line - 1 ];
    token.children = [];

    token        = state.push("admonition_title_close", "p", -1);
    token.markup = markup + " " + type;

    state.md.block.tokenize(state, startLine + 1, nextLine);

    token        = state.push("admonition_close", "div", -1);
    token.markup = state.src.slice(start, pos);
    token.block  = true;

    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.line = nextLine + (auto_closed ? 1 : 0);

    return true;
  }

  md.block.ruler.before("code", "admonition", admonition, {
    alt: ["paragraph", "reference", "blockquote", "list" ]
  });
  md.renderer.rules["admonition_open"] = render;
  md.renderer.rules["admonition_title_open"] = render;
  md.renderer.rules["admonition_title_close"] = render;
  md.renderer.rules["admonition_close"] = render;
};