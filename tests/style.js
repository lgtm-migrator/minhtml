/* global minify */ 
'use strict';

if (typeof minify === 'undefined') {
    global.minify = require('../src/htmlminifier.js').minify;
}

QUnit.module('style');

QUnit.test('remove comments from styles', async function(assert) {
    var input, output;
  
    input = '<style><!--\np.a{background:red}\n--></style>';
    assert.equal(await minify(input), input);
    output = '<style>p.a{background:red}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style><!--p.b{background:red}--></style>';
    assert.equal(await minify(input), input);
    output = '<style>p.b{background:red}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style><!--p.c{background:red}\n--></style>';
    assert.equal(await minify(input), input);
    output = '<style>p.c{background:red}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style><!--\np.d{background:red}--></style>';
    assert.equal(await minify(input), input);
    output = '<style>p.d{background:red}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style><!--p.e{background:red}\np.f{background:red}\np.g{background:red}--></style>';
    assert.equal(await minify(input), input);
    output = '<style>p.e{background:red}p.f{background:red}p.g{background:red}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style>p.h{background:red}<!--\np.i{background:red}\n-->p.j{background:red}</style>';
    assert.equal(await minify(input), input);
    output = '<style>p.h{background:red}p.i{background:red}p.j{background:red}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style type="text/css"><!-- p { color: red } --></style>';
    assert.equal(await minify(input), input);
    output = '<style type="text/css">p{color:red}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style type="text/css">p::before { content: "<!--" }</style>';
    assert.equal(await minify(input), input);
    output = '<style type="text/css">p::before{content:"<!--"}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
  
    input = '<style type="text/html">\n<div>\n</div>\n<!-- aa -->\n</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);
});

QUnit.test('removing type="text/css" attributes', async function(assert) {
    var input, output;

    input = '<style type="">.foo { color: red }</style>';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: false }), input);
    output = '<style>.foo { color: red }</style>';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: true }), output);

    input = '<style type="text/css">.foo { color: red }</style>';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: false }), input);
    output = '<style>.foo { color: red }</style>';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: true }), output);

    input = '<STYLE TYPE = "  text/CSS ">body { font-size: 1.75em }</style>';
    output = '<style>body { font-size: 1.75em }</style>';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: true }), output);

    input = '<style type="text/plain">.foo { background: green }</style>';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: true }), input);

    input = '<link rel="stylesheet" type="text/css" href="http://example.com">';
    output = '<link rel="stylesheet" href="http://example.com">';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: true }), output);

    input = '<link rel="alternate" type="application/atom+xml" href="data.xml">';
    assert.equal(await minify(input, { removeStyleLinkTypeAttributes: true }), input);
});

QUnit.test('style minification', async function(assert) {
    var input, output;

    input = '<style></style>div#foo { background-color: red; color: white }';
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>div#foo { background-color: red; color: white }</style>';
    output = '<style>div#foo{background-color:red;color:#fff}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), output);

    input = '<style>div > p.foo + span { border: 10px solid black }</style>';
    output = '<style>div>p.foo+span{border:10px solid #000}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);

    input = '<div style="background: url(images/<% image %>);"></div>';
    assert.equal(await minify(input), input);
    output = '<div style="background:url(images/<% image %>)"></div>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyCSS: true
    }), output);

    input = '<div style="background: url(\'images/<% image %>\')"></div>';
    assert.equal(await minify(input), input);
    output = '<div style="background:url(\'images/<% image %>\')"></div>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyCSS: true
    }), output);

    input = '<style>\np {\n  background: url(images/<% image %>);\n}\n</style>';
    assert.equal(await minify(input), input);
    output = '<style>p{background:url(images/<% image %>)}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyCSS: true
    }), output);

    input = '<style>p { background: url("images/<% image %>") }</style>';
    assert.equal(await minify(input), input);
    output = '<style>p{background:url("images/<% image %>")}</style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyCSS: true
    }), output);

    input = '<link rel="stylesheet" href="css/style-mobile.css" media="(max-width: 737px)">';
    assert.equal(await minify(input), input);
    output = '<link rel="stylesheet" href="css/style-mobile.css" media="(max-width:737px)">';
    assert.equal(await minify(input, { minifyCSS: true }), output);
    output = '<link rel=stylesheet href=css/style-mobile.css media=(max-width:737px)>';
    assert.equal(await minify(input, {
        minifyCSS: true,
        removeAttributeQuotes: true
    }), output);

    input = '<style media="(max-width: 737px)"></style>';
    assert.equal(await minify(input), input);
    output = '<style media="(max-width:737px)"></style>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
    output = '<style media=(max-width:737px)></style>';
    assert.equal(await minify(input, {
        minifyCSS: true,
        removeAttributeQuotes: true
    }), output);
});

QUnit.test('style attribute minification', async function(assert) {
    var input = '<div style="color: red; background-color: yellow; font-family: Verdana, Arial, sans-serif;"></div>';
    var output = '<div style="color:red;background-color:#ff0;font-family:Verdana,Arial,sans-serif"></div>';
    assert.equal(await minify(input, { minifyCSS: true }), output);
});

QUnit.test('minification of style with custom fragments', async function(assert) {
    var input;

    input = '<style><?foo?></style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>\t<?foo?>\t</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style><?foo?>{color:red}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>\t<?foo?>\t{color:red}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{<?foo?>}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{\t<?foo?>\t}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style><?foo?>body{color:red}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>\t<?foo?>\tbody{color:red}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{<?foo?>color:red}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{\t<?foo?>\tcolor:red}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{color:red<?foo?>}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{color:red\t<?foo?>\t}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{color:red;<?foo?>}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{color:red;\t<?foo?>\t}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{color:red}<?foo?></style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);

    input = '<style>body{color:red}\t<?foo?>\t</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);
});
