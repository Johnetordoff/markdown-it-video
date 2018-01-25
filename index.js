// Process @[mfr](guid)

const mfrRegex = /^http(?:s?):\/\/(?:www\.)?mfr\.osf\.io\/render\?url=http(?:s?):\/\/osf\.io\/([a-zA-Z0-9]{1,5})\/\?action=download/;
function mfrParser(url) {
  const match = url.match(mfrRegex);
  return match ? match[1] : url;
}


const EMBED_REGEX = /@\[([a-zA-Z].+)]\([\s]*(.*?)[\s]*[)]/im;

function mfrEmbed(md, options) {
  function mfrReturn(state, silent) {
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

    const match = EMBED_REGEX.exec(state.src);

    if (!match || match.length < 3) {
      return false;
    }

    const service = match[1];
    mfrID = match[2];
    const serviceLower = service.toLowerCase();

    if (serviceLower === 'mfr') {
      mfrID = mfrParser(videoID);
    } else if (!options[serviceLower]) {
      return false;
    }

    // If the videoID field is empty, regex currently make it the close parenthesis.
    if (mfrID === ')') {
      mfrID = '';
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

      token = theState.push('iframe', '');
      token.mfrID = mfrID;
      token.service = service;
      token.level = theState.level;
    }

    theState.pos += theState.src.indexOf(')', theState.pos);
    theState.posMax = theState.tokens.length;
    return true;
  }

  return videoReturn;
}

function mfrUrl(service, mfrID, options) {
  switch (service) {
    case 'mfr':
      return "https://mfr.osf.io/render?url=https://osf.io/" + mfrID + "/?action=download"
    default:
      return service;
  }
}

function tokenizeIframe(md, options) {
  function tokenizeReturn(tokens, idx) {
    const mfrID = md.utils.escapeHtml(tokens[idx].mfrID);
    const service = md.utils.escapeHtml(tokens[idx].service).toLowerCase();
    return mfrID === '' ? '' :
      '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item ' +
      service + '-player" type="text/html" width="' + (options[service].width) +
      '" height="' + (options[service].height) +
      '" src="' + options.url(service, mfrID, options) +
      '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
  }

  return tokenizeReturn;
}

const defaults = {
  mfr: { width: 550, height: 400 }
};

module.exports = function videoPlugin(md, options) {
  var theOptions = options;
  var theMd = md;
  if (theOptions) {
    Object.keys(defaults).forEach(function checkForKeys(key) {
      if (typeof theOptions[key] === 'undefined') {
        theOptions[key] = defaults[key];
      }
    });
  } else {
    theOptions = defaults;
  }
  theMd.renderer.rules.iframe = tokenizeIframe(theMd, theOptions);
  theMd.inline.ruler.before('emphasis', 'iframe', mfrEmbed(theMd, theOptions));
};
