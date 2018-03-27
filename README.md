

# markdown-it-mfr
# Work in progess

> markdown-it plugin for embedding MFR files.

[![Build Status](https://travis-ci.org/johnetordoff/markdown-it-mfr.svg?branch=master)](https://travis-ci.org/johnetordoff/markdown-it-mfr)

## Usage

#### Enable plugin

```js
  function formatUrl(videoID) {
    return 'https://mfr.osf.io/render?url=https://osf.io/' + videoID + '/?action=download%26mode=render';
  }

  var md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true,
  }).use(require('../'), {
    mfrRegex: /^http(?:s?):\/\/(?:www\.)?mfr\.osf\.io\/render\?url=http(?:s?):\/\/osf\.io\/([a-zA-Z0-9]{5})\/\?action=download|(^[a-zA-Z0-9]{5}$)/,
    formatUrl(videoID) { return 'https://mfr.osf.io/render?url=https://osf.io/' + videoID + '/?action=download%26mode=render'; },
  });
```
#### Inline style

This plugin is made to work in the inline style. If you'd like a block-style, you may be interested in https://github.com/rotorz/markdown-it-block-embed


#### OSF

This plugin allows you to use the OSF's Modualar File Renderer or the MFR to embed video or other files
 into your markdown assuming your page has mfr.js and mfr.css loaded.

```md
@[osf](kuvg9)
```

is interpreted as

```html
<p><div id="randomId" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("randomId", "https://mfr.osf.io/render?url=https://osf.io/kuvg9/?action=download%26mode=render");    }); </script></p>
```

Alternately, you could use the url.

```md
@[osf](https://mfr.osf.io/render?url=https://osf.io/kuvg9/?action=download)
```


## Options

```js

```
