/* global minify */ 
'use strict';

if (typeof minify === 'undefined') {
    global.minify = require('../src/htmlminifier.js').minify;
}

QUnit.module('non-html');

QUnit.test('markups from Angular 2', async function(assert) {
    var input, output;
    input = '<template ngFor #hero [ngForOf]="heroes">\n' +
          '  <hero-detail *ngIf="hero" [hero]="hero"></hero-detail>\n' +
          '</template>\n' +
          '<form (ngSubmit)="onSubmit(theForm)" #theForm="ngForm">\n' +
          '  <div class="form-group">\n' +
          '    <label for="name">Name</label>\n' +
          '    <input class="form-control" required ngControl="firstName"\n' +
          '      [(ngModel)]="currentHero.firstName">\n' +
          '  </div>\n' +
          '  <button type="submit" [disabled]="!theForm.form.valid">Submit</button>\n' +
          '</form>';
    output = '<template ngFor #hero [ngForOf]="heroes">\n' +
           '  <hero-detail *ngIf="hero" [hero]="hero"></hero-detail>\n' +
           '</template>\n' +
           '<form (ngSubmit)="onSubmit(theForm)" #theForm="ngForm">\n' +
           '  <div class="form-group">\n' +
           '    <label for="name">Name</label>\n' +
           '    <input class="form-control" required ngControl="firstName" [(ngModel)]="currentHero.firstName">\n' +
           '  </div>\n' +
           '  <button type="submit" [disabled]="!theForm.form.valid">Submit</button>\n' +
           '</form>';
    assert.equal(await minify(input, { caseSensitive: true }), output);
    output = '<template ngFor #hero [ngForOf]=heroes>' +
           '<hero-detail *ngIf=hero [hero]=hero></hero-detail>' +
           '</template>' +
           '<form (ngSubmit)=onSubmit(theForm) #theForm=ngForm>' +
           '<div class=form-group>' +
           '<label for=name>Name</label>' +
           ' <input class=form-control required ngControl=firstName [(ngModel)]=currentHero.firstName>' +
           '</div>' +
           '<button type=submit [disabled]=!theForm.form.valid>Submit</button>' +
           '</form>';
    assert.equal(await minify(input, {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeTagWhitespace: true,
        useShortDoctype: true
    }), output);
});

// https://github.com/kangax/html-minifier/issues/10
QUnit.test('Ignore custom fragments', async function(assert) {
    var input, output;
    var reFragments = [/<\?[^?]+\?>/, /<%[^%]+%>/, /\{\{[^}]*\}\}/];

    input = 'This is the start. <% ... %>\r\n<%= ... %>\r\n<? ... ?>\r\n<!-- This is the middle, and a comment. -->\r\nNo comment, but middle.\r\n{{ ... }}\r\n<?php ... ?>\r\n<?xml ... ?>\r\nHello, this is the end!';
    output = 'This is the start. <% ... %> <%= ... %> <? ... ?> No comment, but middle. {{ ... }} <?php ... ?> <?xml ... ?> Hello, this is the end!';
    assert.equal(await minify(input, {}), input);
    assert.equal(await minify(input, { removeComments: true, collapseWhitespace: true }), output);
    assert.equal(await minify(input, {
        removeComments: true,
        collapseWhitespace: true,
        ignoreCustomFragments: reFragments
    }), output);

    output = 'This is the start. <% ... %>\n<%= ... %>\n<? ... ?>\nNo comment, but middle. {{ ... }}\n<?php ... ?>\n<?xml ... ?>\nHello, this is the end!';
    assert.equal(await minify(input, {
        removeComments: true,
        collapseWhitespace: true,
        preserveLineBreaks: true
    }), output);

    output = 'This is the start. <% ... %>\n<%= ... %>\n<? ... ?>\nNo comment, but middle.\n{{ ... }}\n<?php ... ?>\n<?xml ... ?>\nHello, this is the end!';
    assert.equal(await minify(input, {
        removeComments: true,
        collapseWhitespace: true,
        preserveLineBreaks: true,
        ignoreCustomFragments: reFragments
    }), output);

    input = '{{ if foo? }}\r\n  <div class="bar">\r\n    ...\r\n  </div>\r\n{{ end \n}}';
    output = '{{ if foo? }}<div class="bar">...</div>{{ end }}';
    assert.equal(await minify(input, {}), input);
    assert.equal(await minify(input, { collapseWhitespace: true }), output);
    assert.equal(await minify(input, { collapseWhitespace: true, ignoreCustomFragments: [] }), output);

    output = '{{ if foo? }} <div class="bar">...</div> {{ end \n}}';
    assert.equal(await minify(input, { collapseWhitespace: true, ignoreCustomFragments: reFragments }), output);

    output = '{{ if foo? }}\n<div class="bar">\n...\n</div>\n{{ end \n}}';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        ignoreCustomFragments: reFragments
    }), output);

    input = '<a class="<% if foo? %>bar<% end %> {{ ... }}"></a>';
    assert.equal(await minify(input, {}), input);
    assert.equal(await minify(input, { ignoreCustomFragments: reFragments }), input);

    input = '<img src="{% static "images/logo.png" %}">';
    output = '<img src="{% static "images/logo.png" %}">';
    assert.equal(await minify(input, { ignoreCustomFragments: [/\{%[^%]*?%\}/g] }), output);

    input = '<p{% if form.name.errors %}class=\'error\'{% endif %}>' +
            '{{ form.name.label_tag }}' +
            '{{ form.name }}' +
            ' <label>{{ label }}</label> ' +
            '{% if form.name.errors %}' +
            '{% for error in form.name.errors %}' +
            '<span class=\'error_msg\' style=\'color:#ff0000\'>{{ error }}</span>' +
            '{% endfor %}' +
            '{% endif %}' +
          '</p>';
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /\{%[\s\S]*?%\}/g,
            /\{\{[\s\S]*?\}\}/g
        ],
        quoteCharacter: '\''
    }), input);
    output = '<p {% if form.name.errors %} class=\'error\' {% endif %}>' +
             '{{ form.name.label_tag }}' +
             '{{ form.name }}' +
             ' <label>{{ label }}</label> ' +
             '{% if form.name.errors %}' +
             '{% for error in form.name.errors %}' +
             '<span class=\'error_msg\' style=\'color:#ff0000\'>{{ error }}</span>' +
             '{% endfor %}' +
             '{% endif %}' +
           '</p>';
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /\{%[\s\S]*?%\}/g,
            /\{\{[\s\S]*?\}\}/g
        ],
        quoteCharacter: '\'',
        collapseWhitespace: true
    }), output);

    input = '<a href="/legal.htm"<?php echo e(Request::path() == \'/\' ? \' rel="nofollow"\':\'\'); ?>>Legal Notices</a>';
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /<\?php[\s\S]*?\?>/g
        ]
    }), input);

    input = '<input type="checkbox"<%= (model.isChecked ? \'checked="checked"\' : \'\') %>>';
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /<%=[\s\S]*?%>/g
        ]
    }), input);

    input = '<div' +
            '{{IF text}}' +
            'data-yashareDescription="{{shorted(text, 300)}}"' +
            '{{END IF}}></div>';
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /\{\{[\s\S]*?\}\}/g
        ],
        caseSensitive: true
    }), input);

    input = '<img class="{% foo %} {% bar %}">';
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /\{%[^%]*?%\}/g
        ]
    }), input);
    // trimCustomFragments withOUT collapseWhitespace, does
    // not break the "{% foo %} {% bar %}" test
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /\{%[^%]*?%\}/g
        ],
        trimCustomFragments: true
    }), input);
    // trimCustomFragments WITH collapseWhitespace, changes output
    output = '<img class="{% foo %}{% bar %}">';
    assert.equal(await minify(input, {
        ignoreCustomFragments: [
            /\{%[^%]*?%\}/g
        ],
        collapseWhitespace: true,
        trimCustomFragments: true
    }), output);

    input = '<img class="titi.<%=tsItem_[0]%>">';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, {
        collapseWhitespace: true
    }), input);

    input = '<table id="<?php echo $this->escapeHtmlAttr($this->table_id); ?>"></table>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, {
        collapseWhitespace: true
    }), input);

    input = '<!--{{comment}}-->{{if a}}<div>b</div>{{/if}}';
    assert.equal(await minify(input), input);
    output = '{{if a}}<div>b</div>{{/if}}';
    assert.equal(await minify(input, {
        removeComments: true,
        ignoreCustomFragments: [
            /\{\{.*?\}\}/g
        ]
    }), output);

    // https://github.com/kangax/html-minifier/issues/722
    input = '<? echo "foo"; ?> <span>bar</span>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, {
        collapseWhitespace: true
    }), input);
    output = '<? echo "foo"; ?><span>bar</span>';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        trimCustomFragments: true
    }), output);

    input = ' <? echo "foo"; ?> bar';
    assert.equal(await minify(input), input);
    output = '<? echo "foo"; ?> bar';
    assert.equal(await minify(input, {
        collapseWhitespace: true
    }), output);
    output = '<? echo "foo"; ?>bar';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        trimCustomFragments: true
    }), output);

    input = '<span>foo</span> <? echo "bar"; ?> baz';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, {
        collapseWhitespace: true
    }), input);
    output = '<span>foo</span><? echo "bar"; ?>baz';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        trimCustomFragments: true
    }), output);

    input = '<span>foo</span> <? echo "bar"; ?> <? echo "baz"; ?> <span>foo</span>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, {
        collapseWhitespace: true
    }), input);
    output = '<span>foo</span><? echo "bar"; ?><? echo "baz"; ?><span>foo</span>';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        trimCustomFragments: true
    }), output);

    input = 'foo <WC@bar> baz moo </WC@bar> loo';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        ignoreCustomFragments: [
            /<(WC@[\s\S]*?)>(.*?)<\/\1>/
        ]
    }), input);
    output = 'foo<wc @bar>baz moo</wc>loo';
    assert.equal(await minify(input, {
        collapseWhitespace: true
    }), output);

    input = '<link href="<?php echo \'http://foo/\' ?>">';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { removeAttributeQuotes: true }), input);

    input = '<pre>\nfoo\n<? bar ?>\nbaz\n</pre>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { collapseWhitespace: true }), input);

    input = '<script>var value="<?php ?>+<?php ?>0"</script>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyJS: true }), input);

    input = '<style>body{font-size:<%=1%>2pt}</style>';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { minifyCSS: true }), input);
});

QUnit.test('minification of scripts with custom fragments', async function(assert) {
    var input, output;

    input = '<script><?php ?></script>';
    assert.equal(await minify(input, { minifyJS: true }), input);
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), input);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), input);

    input = '<script>\n<?php ?></script>';
    assert.equal(await minify(input, { minifyJS: true }), input);
    output = '<script> <?php ?></script>';
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), input);

    input = '<script><?php ?>\n</script>';
    assert.equal(await minify(input, { minifyJS: true }), input);
    output = '<script><?php ?> </script>';
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), input);

    input = '<script>\n<?php ?>\n</script>';
    assert.equal(await minify(input, { minifyJS: true }), input);
    output = '<script> <?php ?> </script>';
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), input);

    input = '<script>// <% ... %></script>';
    output = '<script></script>';
    assert.equal(await minify(input, { minifyJS: true }), output);
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), output);

    input = '<script>// \n<% ... %></script>';
    output = '<script> \n<% ... %></script>';
    assert.equal(await minify(input, { minifyJS: true }), output);
    output = '<script> <% ... %></script>';
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
    output = '<script>\n<% ... %></script>';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), output);

    input = '<script>// <% ... %>\n</script>';
    output = '<script></script>';
    assert.equal(await minify(input, { minifyJS: true }), output);
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), output);

    input = '<script>// \n<% ... %>\n</script>';
    output = '<script> \n<% ... %>\n</script>';
    assert.equal(await minify(input, { minifyJS: true }), output);
    output = '<script> <% ... %> </script>';
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
    output = '<script>\n<% ... %>\n</script>';
    assert.equal(await minify(input, {
        collapseWhitespace: true,
        minifyJS: true,
        preserveLineBreaks: true
    }), output);

    input = '<script>function f(){  return <?php ?>  }</script>';
    output = '<script>function f(){return <?php ?>  }</script>';
    assert.equal(await minify(input, { minifyJS: true }), output);
    output = '<script>function f(){return <?php ?> }</script>';
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);

    input = '<script>function f(){  return "<?php ?>"  }</script>';
    output = '<script>function f(){return"<?php ?>"}</script>';
    assert.equal(await minify(input, { minifyJS: true }), output);
    assert.equal(await minify(input, { collapseWhitespace: true, minifyJS: true }), output);
});

QUnit.test('preserving custom attribute-wrapping markup', async function(assert) {
    var input, customAttrOptions;

    // With a single rule
    customAttrOptions = {
        customAttrSurround: [[/\{\{#if\s+\w+\}\}/, /\{\{\/if\}\}/]]
    };

    input = '<input {{#if value}}checked="checked"{{/if}}>';
    assert.equal(await minify(input, customAttrOptions), input);

    input = '<input checked="checked">';
    assert.equal(await minify(input, customAttrOptions), input);

    // With multiple rules
    customAttrOptions = {
        customAttrSurround: [
            [/\{\{#if\s+\w+\}\}/, /\{\{\/if\}\}/],
            [/\{\{#unless\s+\w+\}\}/, /\{\{\/unless\}\}/]
        ]
    };

    input = '<input {{#if value}}checked="checked"{{/if}}>';
    assert.equal(await minify(input, customAttrOptions), input);

    input = '<input {{#unless value}}checked="checked"{{/unless}}>';
    assert.equal(await minify(input, customAttrOptions), input);

    input = '<input {{#if value1}}data-attr="example" {{/if}}{{#unless value2}}checked="checked"{{/unless}}>';
    assert.equal(await minify(input, customAttrOptions), input);

    input = '<input checked="checked">';
    assert.equal(await minify(input, customAttrOptions), input);

    // With multiple rules and richer options
    customAttrOptions = {
        customAttrSurround: [
            [/\{\{#if\s+\w+\}\}/, /\{\{\/if\}\}/],
            [/\{\{#unless\s+\w+\}\}/, /\{\{\/unless\}\}/]
        ],
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true
    };

    input = '<input {{#if value}}checked="checked"{{/if}}>';
    assert.equal(await minify(input, customAttrOptions), '<input {{#if value}}checked{{/if}}>');

    input = '<input {{#if value1}}checked="checked"{{/if}} {{#if value2}}data-attr="foo"{{/if}}/>';
    assert.equal(await minify(input, customAttrOptions), '<input {{#if value1}}checked {{/if}}{{#if value2}}data-attr=foo{{/if}}>');

    customAttrOptions.keepClosingSlash = true;
    assert.equal(await minify(input, customAttrOptions), '<input {{#if value1}}checked {{/if}}{{#if value2}}data-attr=foo {{/if}}/>');
});

QUnit.test('preserving custom attribute-joining markup', async function(assert) {
    var input;
    var polymerConditionalAttributeJoin = /\?=/;
    var customAttrOptions = {
        customAttrAssign: [polymerConditionalAttributeJoin]
    };
    input = '<div flex?="{{mode != cover}}"></div>';
    assert.equal(await minify(input, customAttrOptions), input);
    input = '<div flex?="{{mode != cover}}" class="foo"></div>';
    assert.equal(await minify(input, customAttrOptions), input);
});

QUnit.test('HTML4: anchor with inline elements', async function(assert) {
    var input = '<a href="#"><span>Well, look at me! I\'m a span!</span></a>';
    assert.equal(await minify(input, { html5: false }), input);
});

QUnit.test('HTML4: anchor with block elements', async function(assert) {
    var input = '<a href="#"><div>Well, look at me! I\'m a div!</div></a>';
    var output = '<a href="#"></a><div>Well, look at me! I\'m a div!</div>';
    assert.equal(await minify(input, { html5: false }), output);
});

QUnit.test('custom attribute collapse', async function(assert) {
    var input, output;

    input = '<div data-bind="\n' +
            'css: {\n' +
              'fadeIn: selected(),\n' +
              'fadeOut: !selected()\n' +
            '},\n' +
            'visible: function () {\n' +
              'return pageWeAreOn() == \'home\';\n' +
            '}\n' +
          '">foo</div>';
    output = '<div data-bind="css: {fadeIn: selected(),fadeOut: !selected()},visible: function () {return pageWeAreOn() == \'home\';}">foo</div>';

    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { customAttrCollapse: /data-bind/ }), output);

    input = '<div style="' +
            'color: red;' +
            'font-size: 100em;' +
          '">bar</div>';
    output = '<div style="color: red;font-size: 100em;">bar</div>';
    assert.equal(await minify(input, { customAttrCollapse: /style/ }), output);

    input = '<div ' +
    'class="fragment square" ' +
    'ng-hide="square1.hide" ' +
    'ng-class="{ \n\n' +
      '\'bounceInDown\': !square1.hide, ' +
      '\'bounceOutDown\': square1.hide ' +
    '}" ' +
  '> ' +
  '</div>';
    output = '<div class="fragment square" ng-hide="square1.hide" ng-class="{\'bounceInDown\': !square1.hide, \'bounceOutDown\': square1.hide }"> </div>';
    assert.equal(await minify(input, { customAttrCollapse: /ng-class/ }), output);
});

QUnit.test('custom attribute collapse with empty attribute value', async function(assert) {
    var input = '<div ng-some\n\n></div>';
    var output = '<div ng-some></div>';
    assert.equal(await minify(input, { customAttrCollapse: /.+/ }), output);
});

QUnit.test('custom attribute collapse with newlines, whitespace, and carriage returns', async function(assert) {
    var input = '<div ng-class="{ \n\r' +
          '               value:true, \n\r' +
          '               value2:false \n\r' +
          '               }"></div>';
    var output = '<div ng-class="{value:true,value2:false}"></div>';
    assert.equal(await minify(input, { customAttrCollapse: /ng-class/ }), output);
});

QUnit.test('custom components', async function(assert) {
    var input = '<custom-component>Oh, my.</custom-component>';
    var output = '<custom-component>Oh, my.</custom-component>';
    assert.equal(await minify(input), output);
});

QUnit.test('ignore custom comments', async function(assert) {
    var input, output;

    input = '<!--! test -->';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { removeComments: true }), input);
    assert.equal(await minify(input, { ignoreCustomComments: false }), input);
    assert.equal(await minify(input, {
        removeComments: true,
        ignoreCustomComments: []
    }), '');
    assert.equal(await minify(input, {
        removeComments: true,
        ignoreCustomComments: false
    }), '');

    input = '<!-- htmlmin:ignore -->test<!-- htmlmin:ignore -->';
    output = 'test';
    assert.equal(await minify(input), output);
    assert.equal(await minify(input, { removeComments: true }), output);
    assert.equal(await minify(input, { ignoreCustomComments: false }), output);
    assert.equal(await minify(input, {
        removeComments: true,
        ignoreCustomComments: []
    }), output);
    assert.equal(await minify(input, {
        removeComments: true,
        ignoreCustomComments: false
    }), output);

    input = '<!-- ko if: someExpressionGoesHere --><li>test</li><!-- /ko -->';
    assert.equal(await minify(input, {
        removeComments: true,
        // ignore knockout comments
        ignoreCustomComments: [
            /^\s+ko/,
            /\/ko\s+$/
        ]
    }), input);

    input = '<!--#include virtual="/cgi-bin/counter.pl" -->';
    assert.equal(await minify(input), input);
    assert.equal(await minify(input, { removeComments: true }), input);
    assert.equal(await minify(input, { removeComments: true, ignoreCustomComments: false }), '');
    assert.equal(await minify(input, { removeComments: true, ignoreCustomComments: [] }), '');
});

QUnit.test('phrasing content with Web Components', async function(assert) {
    var input = '<span><phrasing-element></phrasing-element></span>';
    var output = '<span><phrasing-element></phrasing-element></span>';
    assert.equal(await minify(input, { html5: true }), output);
});

QUnit.test('bootstrap\'s span > button > span', async function(assert) {
    var input = '<span class="input-group-btn">' +
                '\n  <button class="btn btn-default" type="button">' +
                  '\n    <span class="glyphicon glyphicon-search"></span>' +
                '\n  </button>' +
              '</span>';
    var output = '<span class=input-group-btn><button class="btn btn-default" type=button><span class="glyphicon glyphicon-search"></span></button></span>';
    assert.equal(await minify(input, { collapseWhitespace: true, removeAttributeQuotes: true }), output);
});
