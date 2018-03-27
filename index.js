// Process @[osf](guid)



const EMBED_REGEX = /@\[([a-zA-Z].+)]\([\s]*(.*?)[\s]*[)]/im;

function videoEmbed(md, options) {
  function videoReturn(state, silent) {
    var serviceEnd;
    var serviceStart;
    var token;
    var videoID;
    var theState = state;
    const oldPos = state.pos;

    if (state.src.charCodeAt(oldPos) !== 0x40/* @ */ ||
        state.src.charCodeAt(oldPos + 1) !== 0x5B/* [ */) {
      return false;
    }

    const match = EMBED_REGEX.exec(state.src.slice(state.pos, state.src.length));

    if (!match || match.length < 3) {
      return false;
    }

    const service = match[1];
    videoID = match[2];
    const serviceLower = service.toLowerCase();
    if (serviceLower === 'osf' && videoID) {
      const mfrRegex = options.mfrRegex;
      const match = videoID.match(mfrRegex);
      videoID = match ? match[1] : videoID;
    } else if (!options[serviceLower]) {
      return false;
    }

    // If the videoID field is empty, regex currently make it the close parenthesis.
    if (videoID === ')') {
      videoID = '';
    }

    serviceStart = oldPos + 2;
    serviceEnd = md.helpers.parseLinkLabel(state, oldPos + 1, false);

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      theState.pos = serviceStart;
      theState.posMax = serviceEnd;
      theState.service = theState.src.slice(serviceStart, serviceEnd);
      const newState = new theState.md.inline.State(service, theState.md, theState.env, []);
      newState.md.inline.tokenize(newState);

      token = theState.push('video', '');
      token.videoID = videoID;
      token.service = service;
      token.level = theState.level;
    }

    theState.pos += theState.src.indexOf(')', theState.pos);
    theState.posMax = theState.tokens.length;
    return true;
  }

  return videoReturn;
}

function tokenizeVideo(md, options) {
  function tokenizeReturn(tokens, idx) {
    const videoID = md.utils.escapeHtml(tokens[idx].videoID);
    var num = Math.random() * 0x10000;

    return '<div id="' + num + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + num + '", "' + options.formatUrl(videoID) + '");    }); </script>';

  }
  return tokenizeReturn;
}


module.exports = function videoPlugin(md, options) {
  var theOptions = options;
  var theMd = md;
  if (theOptions) {
    Object.keys(options).forEach(function checkForKeys(key) {
      if (typeof theOptions[key] === 'undefined') {
        theOptions[key] = options[key];
      }
    });
  } else {
    theOptions = options;
  }
  theMd.renderer.rules.video = tokenizeVideo(theMd, theOptions);
  theMd.inline.ruler.before('emphasis', 'video', videoEmbed(theMd, theOptions));
};
