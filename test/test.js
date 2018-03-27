/* eslint func-names: ["error", "never"] */
var assert = require('assert');

var md;
var renderedHtml;
var id;

function getMfrId(html) {
  return html.split('"')[1];
}

// Because the mfr iframe requires a random id these tests cannot be part of
// the markdown-it-testgen fixture
describe('markdown-it-mfr', function () {
  md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true,
  }).use(require('../'), {
    mfrRegex: /^http(?:s?):\/\/(?:www\.)?mfr\.osf\.io\/render\?url=http(?:s?):\/\/osf\.io\/([a-zA-Z0-9]{5})\/\?action=download|(^[a-zA-Z0-9]{5}$)/,
    formatUrl(videoID) { return 'https://mfr.osf.io/render?url=https://osf.io/' + videoID + '/?action=download%26mode=render'; },
  });

  it('fails with bad guid', function () {
    renderedHtml = md.render('@[osf](2manychars)');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p>@<a href="2manychars">osf</a></p>\n');
  });

  it('fails with bad non osf link', function () {
    renderedHtml = md.render('@[osf](https://google.com )');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p>@<a href="https://google.com">osf</a></p>\n');
  });

  it('generates iframe properly when empty', function () {
    renderedHtml = md.render('@[osf]()');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p>@<a href="">osf</a></p>\n');
  });

  it('generates iframe properly with guid', function () {
    renderedHtml = md.render('@[osf](xxxxx)');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p><div id="' + id + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + id + '", "https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render");    }); </script></p>\n');
  });

  it('generates iframe properly with guid and line break', function () {
    renderedHtml = md.render('@[osf](xxxxx\n)');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p><div id="' + id + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + id + '", "https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render");    }); </script></p>\n');
  });

  it('generates iframe properly with guid and extra space', function () {
    renderedHtml = md.render('@[osf](xxxxx )');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p><div id="' + id + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + id + '", "https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render");    }); </script></p>\n');
  });

  it('generates iframe properly with guid and two extra spaces', function () {
    renderedHtml = md.render('@[osf]( xxxxx )');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p><div id="' + id + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + id + '", "https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render");    }); </script></p>\n');
  });

  it('generates iframe properly with link', function () {
    renderedHtml = md.render('@[osf](https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render)');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p><div id="' + id + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + id + '", "https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render");    }); </script></p>\n');
  });

  it('generates iframe properly with link and extra space', function () {
    renderedHtml = md.render('@[osf](https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render )');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p><div id="' + id + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + id + '", "https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render");    }); </script></p>\n');
  });

  it('generates iframe properly with link and two extra spaces', function () {
    renderedHtml = md.render('@[osf](https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render )');
    id = getMfrId(renderedHtml);
    assert.equal(renderedHtml, '<p><div id="' + id + '" class="mfr mfr-file"></div><script>$(document).ready(function () {new mfr.Render("' + id + '", "https://mfr.osf.io/render?url=https://osf.io/xxxxx/?action=download%26mode=render");    }); </script></p>\n');
  });
});
