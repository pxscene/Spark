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
      text: 'The quick brown fox jumps over the lazy dog.',
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
  var values = [false, // attribute will not be set
  'alphabetic', 'top', 'hanging', 'middle', 'ideographic', 'bottom'];
  var def$1 = Defaults.get(),
      text = 'Wqfegl',
      font_size = def$1.text.fontSize || 36,
      text_width_with_space = 6
  /* number of chars */
  * (0.69 * font_size),
      x = def$1.x,
      y = def$1.y,
      template = {
    TopLine: {
      x: 0,
      y: y,
      w: 1100,
      h: 1,
      rect: true
    },
    BottomLine: {
      x: 0,
      y: y + font_size,
      w: 1100,
      h: 1,
      rect: true
    }
  };

  for (var i in values) {
    var tpl = {
      x: x,
      y: y,
      text: {
        fontSize: font_size,
        text: text
      }
    };

    if (values[i] !== false) {
      tpl.text.textBaseline = values[i];
    }

    template['Text_' + i] = Defaults.applyToText(tpl, ['fontFace', 'textColor']);
    x += text_width_with_space;
  }
  /*
  import test_template from './import/text-cut-e-x.js';
  import test_template from './import/text-cut-e-y.js';
  import test_template from './import/text-cut-s-e-x.js';
  import test_template from './import/text-cut-s-e-y.js';
  import test_template from './import/text-cut-s-x.js';
  import test_template from './import/text-cut-s-y.js';
  import test_template from './import/text-font-face.js';
  import test_template from './import/text-font-size.js';
  import test_template from './import/text-font-style.js';
  import test_template from './import/text-line-height.js';
  import test_template from './import/text-max-lines.js';
  import test_template from './import/text-max-lines-suffix.js';
  import test_template from './import/text-offset-x.js';
  import test_template from './import/text-offset-y.js';
  import test_template from './import/text-padding-left.js';
  import test_template from './import/text-padding-offset-cut-max-lines.js';
  import test_template from './import/text-padding-right.js';
  import test_template from './import/text-text-align.js';
  import test_template from './import/text-text-baseline.js';
  import test_template from './import/text-text-color.js';
  import test_template from './import/text-word-wrap-width.js';
  */


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
          family: 'RobotoRegular',
          url: MyApp.getPath('fonts/Roboto-Regular.ttf'),
          descriptors: {}
        }, {
          family: 'RobotoItalic',
          url: MyApp.getPath('fonts/Roboto-Italic.ttf'),
          descriptors: {}
        }, {
          family: 'RobotoBold',
          url: MyApp.getPath('fonts/Roboto-Bold.ttf'),
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
          Test: template
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