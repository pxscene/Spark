"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var appBundle = function () {
  'use strict';

  var def = {
    x: 50,
    y: 50,
    vertical_space: 30,
    text: {
      fontFace: 'RobotoRegular',
      fontSize: 36,
      text: 'Text a little too long so this part won\'t be visible',
      longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      textColor: 0xffff00ff,
      wordWrapWidth: 800,
      maxLines: 2
    }
  };
  var Defaults = {
    get: function get(prop) {
      var val = JSON.parse(JSON.stringify(def));

      if (!prop) {
        return val;
      }

      var keys = prop.split('.');

      for (var i in keys) {
        if (typeof val[keys[i]] == 'undefined') {
          return undefined;
        }

        val = val[keys[i]];
      }

      return val;
    },
    applyToText: function applyToText(obj, props) {
      for (var i in props) {
        var prop = props[i];

        if (typeof def.text[prop] != 'undefined' && def.text[prop] !== false) {
          obj.text[prop] = def.text[prop];
        }
      }

      return obj;
    }
  };
  var values = [-150, 0, 150];
  var def$1 = Defaults.get(),
      space = def$1.vertical_space || 30,
      x = def$1.x,
      y = def$1.y,
      template = {};

  for (var i in values) {
    template['Text_1_' + i] = Defaults.applyToText({
      x: x,
      y: y,
      text: {
        text: def$1.text.text,
        maxLines: 1,
        cutEx: values[i]
      }
    }, ['fontFace', 'fontSize', 'textColor']);
    y += (def$1.text.fontSize || space) + space;
  }

  var max_lines = 3;

  for (var _i in values) {
    template['Text_2_' + _i] = Defaults.applyToText({
      x: x,
      y: y,
      text: {
        text: def$1.text.longText,
        maxLines: max_lines,
        cutEx: values[_i]
      }
    }, ['fontFace', 'fontSize', 'textColor', 'wordWrapWidth']);
    y += (def$1.text.fontSize || space) * max_lines + space;
  }

  var values$1 = [-50, 0, 50];
  var def$2 = Defaults.get(),
      space$1 = def$2.vertical_space || 30,
      x$1 = def$2.x,
      y$1 = def$2.y,
      template$1 = {};

  for (var _i2 in values$1) {
    template$1['Text_1_' + _i2] = Defaults.applyToText({
      x: x$1,
      y: y$1,
      text: {
        text: def$2.text.text,
        maxLines: 1,
        cutEy: values$1[_i2]
      }
    }, ['fontFace', 'fontSize', 'textColor']);
    y$1 += (def$2.text.fontSize || space$1) + space$1;
  }

  var max_lines$1 = 3;

  for (var _i3 in values$1) {
    template$1['Text_2_' + _i3] = Defaults.applyToText({
      x: x$1,
      y: y$1,
      text: {
        text: def$2.text.longText,
        maxLines: max_lines$1,
        cutEy: values$1[_i3]
      }
    }, ['fontFace', 'fontSize', 'textColor', 'wordWrapWidth']);
    y$1 += (def$2.text.fontSize || space$1) * max_lines$1 + space$1;
  }

  var values$2 = [{
    s: 0,
    e: 100
  }, {
    s: 100,
    e: 200
  }, {
    s: 100,
    e: 0
  }];
  var def$3 = Defaults.get(),
      space$2 = def$3.vertical_space || 30,
      x$2 = def$3.x,
      y$2 = def$3.y,
      template$2 = {};

  for (var _i4 in values$2) {
    template$2['Text_1_' + _i4] = Defaults.applyToText({
      x: x$2,
      y: y$2,
      text: {
        text: def$3.text.text,
        maxLines: 1,
        cutSx: values$2[_i4].s,
        cutEx: values$2[_i4].e
      }
    }, ['fontFace', 'fontSize', 'textColor']);
    y$2 += (def$3.text.fontSize || space$2) + space$2;
  }

  var max_lines$2 = 3;

  for (var _i5 in values$2) {
    template$2['Text_2_' + _i5] = Defaults.applyToText({
      x: x$2,
      y: y$2,
      text: {
        text: def$3.text.longText,
        maxLines: max_lines$2,
        cutSx: values$2[_i5].s,
        cutEx: values$2[_i5].e
      }
    }, ['fontFace', 'fontSize', 'textColor', 'wordWrapWidth']);
    y$2 += (def$3.text.fontSize || space$2) * max_lines$2 + space$2;
  }

  var def$4 = Defaults.get(),
      font_size = def$4.text.fontSize || 36;
  var values$3 = [{
    s: font_size / 2,
    e: 0
  }, {
    s: font_size / 2,
    e: font_size / 1.1
  }, {
    s: 0,
    e: font_size / 1.2
  }];
  var space$3 = def$4.vertical_space || 30,
      x$3 = def$4.x,
      y$3 = def$4.y,
      template$3 = {};

  for (var _i6 in values$3) {
    template$3['Text_1_' + _i6] = Defaults.applyToText({
      x: x$3,
      y: y$3,
      text: {
        fontSize: font_size,
        text: def$4.text.text,
        maxLines: 1,
        cutSy: values$3[_i6].s,
        cutEy: values$3[_i6].e
      }
    }, ['fontFace', 'textColor']);
    y$3 += font_size + space$3;
  }

  var max_lines$3 = 3;

  for (var _i7 in values$3) {
    template$3['Text_2_' + _i7] = Defaults.applyToText({
      x: x$3,
      y: y$3,
      text: {
        fontSize: font_size,
        text: def$4.text.longText,
        maxLines: max_lines$3,
        cutSy: values$3[_i7].s,
        cutEy: values$3[_i7].e
      }
    }, ['fontFace', 'textColor', 'wordWrapWidth']);
    y$3 += font_size * max_lines$3 + space$3;
  }

  var values$4 = [-150, 0, 150];
  var def$5 = Defaults.get(),
      space$4 = def$5.vertical_space || 30,
      x$4 = def$5.x,
      y$4 = def$5.y,
      template$4 = {};

  for (var _i8 in values$4) {
    template$4['Text_1_' + _i8] = Defaults.applyToText({
      x: x$4,
      y: y$4,
      text: {
        text: def$5.text.text,
        maxLines: 1,
        cutSx: values$4[_i8]
      }
    }, ['fontFace', 'fontSize', 'textColor']);
    y$4 += (def$5.text.fontSize || space$4) + space$4;
  }

  var max_lines$4 = 3;

  for (var _i9 in values$4) {
    template$4['Text_2_' + _i9] = Defaults.applyToText({
      x: x$4,
      y: y$4,
      text: {
        text: def$5.text.longText,
        maxLines: max_lines$4,
        cutSx: values$4[_i9]
      }
    }, ['fontFace', 'fontSize', 'textColor', 'wordWrapWidth']);
    y$4 += (def$5.text.fontSize || space$4) * max_lines$4 + space$4;
  }

  var def$6 = Defaults.get(),
      font_size$1 = def$6.text.fontSize || 36;
  var values$5 = [-font_size$1 / 1.5, 0, font_size$1 / 1.5];
  var space$5 = def$6.vertical_space || 30,
      x$5 = def$6.x,
      y$5 = def$6.y,
      template$5 = {};

  for (var _i10 in values$5) {
    template$5['Text_1_' + _i10] = Defaults.applyToText({
      x: x$5,
      y: y$5,
      text: {
        fontSize: font_size$1,
        text: def$6.text.text,
        maxLines: 1,
        cutSy: values$5[_i10]
      }
    }, ['fontFace', 'textColor']);
    y$5 += font_size$1 + space$5;
  }

  var max_lines$5 = 3;

  for (var _i11 in values$5) {
    template$5['Text_2_' + _i11] = Defaults.applyToText({
      x: x$5,
      y: y$5,
      text: {
        fontSize: font_size$1,
        text: def$6.text.longText,
        maxLines: max_lines$5,
        cutSy: values$5[_i11]
      }
    }, ['fontFace', 'textColor', 'wordWrapWidth']);
    y$5 += font_size$1 * max_lines$5 + space$5;
  }

  var font_faces = ['RobotoBold', 'RobotoRegular', 'DancingScriptRegular', 'XFINITYSansTTMedium', 'IndieFlower'];
  var def$7 = Defaults.get(),
      x$6 = def$7.x,
      y$6 = def$7.y,
      template$6 = {};

  for (var _i12 in font_faces) {
    template$6['Text_' + _i12] = Defaults.applyToText({
      x: x$6,
      y: y$6,
      text: {
        fontFace: font_faces[_i12],
        text: def$7.text.text
      }
    }, ['fontSize', 'textColor']);
    y$6 += (def$7.text.fontSize || def$7.vertical_space) + def$7.vertical_space;
  }

  var font_sizes = [6, 8, 10, 16, 30, 50, 100, 150];
  var def$8 = Defaults.get(),
      space$6 = def$8.vertical_space || 30,
      x$7 = def$8.x,
      y$7 = def$8.y,
      template$7 = {};

  for (var _i13 in font_sizes) {
    template$7['Text_' + _i13] = Defaults.applyToText({
      x: x$7,
      y: y$7,
      text: {
        fontSize: font_sizes[_i13],
        text: def$8.text.text,
        maxLines: 1
      }
    }, ['fontFace', 'textColor']);
    y$7 += font_sizes[_i13] + (font_sizes[_i13] > space$6 ? space$6 : font_sizes[_i13]);
  }

  var font_styles = [false, // attribute will not set
  'normal', 'italic', 'bold', 'italic bold'];
  var def$9 = Defaults.get(),
      x$8 = def$9.x,
      y$8 = def$9.y,
      template$8 = {};

  for (var _i14 in font_styles) {
    var tpl = {
      x: x$8,
      y: y$8,
      text: {
        text: def$9.text.text
      }
    };

    if (font_styles[_i14] !== false) {
      tpl.text.fontStyle = font_styles[_i14];
    }

    template$8['Text_' + _i14] = Defaults.applyToText(tpl, ['fontFace', 'fontSize', 'textColor']);
    y$8 += (def$9.text.fontSize || def$9.vertical_space) + def$9.vertical_space;
  }

  var def$a = Defaults.get(),
      font_size$2 = def$a.text.fontSize || 36;
  var line_heights = [0.5 * font_size$2, 1 * font_size$2, 2 * font_size$2, 3 * font_size$2, 4 * font_size$2];
  var space$7 = def$a.vertical_space || 30,
      x$9 = def$a.x,
      y$9 = def$a.y,
      template$9 = {};

  for (var _i15 in line_heights) {
    template$9['Text_' + _i15] = Defaults.applyToText({
      x: x$9,
      y: y$9,
      text: {
        fontSize: font_size$2,
        text: def$a.text.longText,
        lineHeight: line_heights[_i15]
      }
    }, ['fontFace', 'textColor', 'wordWrapWidth', 'maxLines']);
    y$9 += (def$a.text.maxLines || 5) * line_heights[_i15] + space$7;
  }

  var max_lines$6 = [1, 2, 3, 0];
  var def$b = Defaults.get(),
      space$8 = def$b.vertical_space || 30,
      x$a = def$b.x,
      y$a = def$b.y,
      template$a = {};

  for (var _i16 in max_lines$6) {
    template$a['Text_' + _i16] = Defaults.applyToText({
      x: x$a,
      y: y$a,
      text: {
        text: def$b.text.longText,
        maxLines: max_lines$6[_i16]
      }
    }, ['fontFace', 'fontSize', 'textColor', 'wordWrapWidth']);
    y$a += (def$b.text.fontSize || space$8) * max_lines$6[_i16] + space$8;
  }

  var max_lines_suffix = [false, // attribute will not set
  null, // attribute will set to "null"
  '', '...', '>>>'];
  var def$c = Defaults.get(),
      space$9 = def$c.vertical_space || 30,
      x$b = def$c.x,
      y$b = def$c.y,
      template$b = {};

  for (var _i17 in max_lines_suffix) {
    var _tpl = {
      x: x$b,
      y: y$b,
      text: {
        text: def$c.text.longText
      }
    };

    if (max_lines_suffix[_i17] !== false) {
      _tpl.text.maxLinesSuffix = max_lines_suffix[_i17];
    }

    template$b['Text_' + _i17] = Defaults.applyToText(_tpl, ['fontFace', 'fontSize', 'textColor', 'wordWrapWidth', 'maxLines']);
    y$b += (def$c.text.fontSize || space$9) * (def$c.text.maxLines || 5) + space$9;
  }

  var offsets = [-50, 0, 50];
  var def$d = Defaults.get(),
      space$a = def$d.vertical_space || 30,
      x$c = def$d.x,
      y$c = def$d.y,
      template$c = {};

  for (var _i18 in offsets) {
    template$c['Text_' + _i18] = Defaults.applyToText({
      x: x$c,
      y: y$c,
      text: {
        text: def$d.text.text,
        offsetX: offsets[_i18]
      }
    }, ['fontFace', 'fontSize', 'textColor']);
    y$c += (def$d.text.fontSize || space$a) + space$a;
  }

  var def$e = Defaults.get(),
      font_size$3 = def$e.text.fontSize || 36;
  var offsets$1 = [-font_size$3 / 2, 0, 2 * font_size$3];
  var space$b = def$e.vertical_space || 30,
      x$d = def$e.x,
      y$d = def$e.y,
      max_lines$7 = 3,
      template$d = {};

  for (var _i19 in offsets$1) {
    template$d['Text_' + _i19] = Defaults.applyToText({
      x: x$d,
      y: y$d,
      text: {
        fontSize: font_size$3,
        text: def$e.text.longText,
        maxLines: max_lines$7,
        offsetY: offsets$1[_i19]
      }
    }, ['fontFace', 'textColor', 'wordWrapWidth']);
    y$d += font_size$3 * max_lines$7 + space$b;
  }

  var paddings = [-50, 0, 50];
  var def$f = Defaults.get(),
      space$c = def$f.vertical_space || 30,
      x$e = def$f.x,
      y$e = def$f.y,
      template$e = {};

  for (var _i20 in paddings) {
    template$e['Text_' + _i20] = Defaults.applyToText({
      x: x$e,
      y: y$e,
      text: {
        text: def$f.text.text,
        paddingLeft: paddings[_i20]
      }
    }, ['fontFace', 'fontSize', 'textColor']);
    y$e += (def$f.text.fontSize || space$c) + space$c;
  }

  var paddings$1 = [-50, 0, 50];
  var def$g = Defaults.get(),
      space$d = def$g.vertical_space || 30,
      x$f = def$g.x,
      y$f = def$g.y,
      template$f = {};

  for (var _i21 in paddings$1) {
    template$f['Text_' + _i21] = Defaults.applyToText({
      x: x$f,
      y: y$f,
      text: {
        text: def$g.text.text,
        paddingRight: paddings$1[_i21]
      }
    }, ['fontFace', 'fontSize', 'textColor']);
    y$f += (def$g.text.fontSize || space$d) + space$d;
  }

  var text_align = [false, // attribute will not set
  'left', 'center', 'right'];
  var def$h = Defaults.get(),
      space$e = def$h.vertical_space || 30,
      x$g = def$h.x,
      y$g = def$h.y,
      template$g = {};

  for (var _i22 in text_align) {
    var _tpl2 = {
      x: x$g,
      y: y$g,
      text: {
        text: def$h.text.text,
        maxLines: 1
      }
    };

    if (text_align[_i22] !== false) {
      _tpl2.text.textAlign = text_align[_i22];
    }

    template$g['Text_1_' + _i22] = Defaults.applyToText(_tpl2, ['fontFace', 'fontSize', 'textColor']);
    y$g += (def$h.text.fontSize || space$e) + space$e;
  }

  var max_lines$8 = 3;

  for (var _i23 in text_align) {
    var _tpl3 = {
      x: x$g,
      y: y$g,
      text: {
        text: def$h.text.longText,
        maxLines: max_lines$8
      }
    };

    if (text_align[_i23] !== false) {
      _tpl3.text.textAlign = text_align[_i23];
    }

    template$g['Text_2_' + _i23] = Defaults.applyToText(_tpl3, ['fontFace', 'fontSize', 'textColor', 'wordWrapWidth']);
    y$g += (def$h.text.fontSize || space$e) * max_lines$8 + space$e;
  }

  var values$6 = [false, // attribute will not set
  'alphabetic', 'top', 'hanging', 'middle', 'ideographic', 'bottom'];
  var def$i = Defaults.get(),
      text = 'Wqfegl',
      font_size$4 = def$i.text.fontSize || 36,
      text_width_with_space = 6
  /* quantity of chars */
  * (0.69 * font_size$4),
      x$h = def$i.x,
      y$h = def$i.y,
      template$h = {
    TopLine: {
      x: 0,
      y: y$h,
      w: 1100,
      h: 1,
      rect: true
    },
    BottomLine: {
      x: 0,
      y: y$h + font_size$4,
      w: 1100,
      h: 1,
      rect: true
    }
  };

  for (var _i24 in values$6) {
    var _tpl4 = {
      x: x$h,
      y: y$h,
      text: {
        fontSize: font_size$4,
        text: text
      }
    };

    if (values$6[_i24] !== false) {
      _tpl4.text.textBaseline = values$6[_i24];
    }

    template$h['Text_' + _i24] = Defaults.applyToText(_tpl4, ['fontFace', 'textColor']);
    x$h += text_width_with_space;
  }

  var text_colors = [false, // attribute will not set
  0xff0000ff, 0xff00ff00, 0xffffff00];
  var def$j = Defaults.get(),
      space$f = def$j.vertical_space || 30,
      x$i = def$j.x,
      y$i = def$j.y,
      template$i = {};

  for (var _i25 in text_colors) {
    var _tpl5 = {
      x: x$i,
      y: y$i,
      text: {
        text: def$j.text.text
      }
    };

    if (text_colors[_i25] !== false) {
      _tpl5.text.textColor = text_colors[_i25];
    }

    template$i['Text_' + _i25] = Defaults.applyToText(_tpl5, ['fontFace', 'fontSize']);
    y$i += (def$j.text.fontSize || space$f) + space$f;
  }

  var word_wrap_widths = [0, 200, 400, 800];
  var def$k = Defaults.get(),
      space$g = def$k.vertical_space || 30,
      x$j = def$k.x,
      y$j = def$k.y,
      template$j = {};

  for (var _i26 in word_wrap_widths) {
    template$j['Text_' + _i26] = Defaults.applyToText({
      x: x$j,
      y: y$j,
      text: {
        text: def$k.text.longText,
        wordWrapWidth: word_wrap_widths[_i26]
      }
    }, ['fontFace', 'fontSize', 'textColor', 'maxLines']);
    y$j += (def$k.text.maxLines || 5) * (def$k.text.fontSize || space$g) + space$g;
  }

  var def$l = Defaults.get(),
      x$k = def$l.x,
      y$k = def$l.y,
      template$k = {};
  var values$7 = [{
    textAlign: 'left'
  }, {
    textAlign: 'center',
    cutSx: 20,
    cutSy: 60
  }, {
    textAlign: 'right',
    cutSx: 20,
    cutSy: 60,
    cutEx: 220,
    cutEy: 250
  }];
  /*
   * Set common values
   */

  for (var _i27 in values$7) {
    values$7[_i27].text = def$l.text.longText;
    values$7[_i27].wordWrapWidth = 400;
    values$7[_i27].lineHeight = 60;
    values$7[_i27].offsetY = -45;
    values$7[_i27].paddingLeft = -15;
    values$7[_i27].paddingRight = 500;
  }
  /*
   * Test with maxLines
   */


  for (var _i28 in values$7) {
    var _tpl6 = {
      x: x$k,
      y: y$k,
      text: JSON.parse(JSON.stringify(values$7[_i28]))
    };
    _tpl6.text.maxLines = 4;
    template$k['Text_1_' + _i28] = Defaults.applyToText(_tpl6, ['fontFace', 'fontSize', 'textColor']);
    x$k += 450;
  }
  /*
   * Test without maxLines
   */


  x$k = def$l.x;
  y$k += 300;

  for (var _i29 in values$7) {
    var _tpl7 = {
      x: x$k,
      y: y$k,
      text: JSON.parse(JSON.stringify(values$7[_i29]))
    };
    template$k['Text_2_' + _i29] = Defaults.applyToText(_tpl7, ['fontFace', 'fontSize', 'textColor']);
    x$k += 450;
  } // import test_text_old from './tests/text-old.js';


  var test_template = template$e;

  var MyApp =
  /*#__PURE__*/
  function (_ux$App) {
    _inherits(MyApp, _ux$App);

    function MyApp() {
      _classCallCheck(this, MyApp);

      return _possibleConstructorReturn(this, _getPrototypeOf(MyApp).apply(this, arguments));
    }

    _createClass(MyApp, null, [{
      key: "getFonts",
      value: function getFonts() {
        return [{
          family: 'RobotoBold',
          url: MyApp.getPath('fonts/Roboto-Bold.ttf'),
          descriptors: {}
        }, {
          family: 'RobotoBoldItalic',
          url: MyApp.getPath('fonts/Roboto-BoldItalic.ttf'),
          descriptors: {}
        }, {
          family: 'RobotoBlack',
          url: MyApp.getPath('fonts/Roboto-Black.ttf'),
          descriptors: {}
        }, {
          family: 'RobotoItalic',
          url: MyApp.getPath('fonts/Roboto-Italic.ttf'),
          descriptors: {}
        }, {
          family: 'RobotoLight',
          url: MyApp.getPath('fonts/Roboto-Light.ttf'),
          descriptors: {}
        }, {
          family: 'RobotoRegular',
          url: MyApp.getPath('fonts/Roboto-Regular.ttf'),
          descriptors: {}
        }, {
          family: 'DancingScriptRegular',
          url: MyApp.getPath('fonts/DancingScript-Regular.ttf'),
          descriptors: {}
        }, {
          family: 'XFINITYSansTTMedium',
          url: MyApp.getPath('fonts/XFINITYSansTT-Medium.ttf'),
          descriptors: {}
        }, {
          family: 'IndieFlower',
          url: MyApp.getPath('fonts/IndieFlower.ttf'),
          descriptors: {}
        }];
      }
    }, {
      key: "_template",
      value: function _template() {
        return {
          BackgroundImage: {
            src: MyApp.getPath('bg-grayscale-1080p.png')
          },
          Test: test_template
        };
      }
    }]);

    return MyApp;
  }(ux.App);

  MyApp.COLORS = {
    BACKGROUND: 0xff282e32
  };
  return MyApp;
}();