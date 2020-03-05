"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.appBundle = factory();
})(void 0, function () {
  'use strict';

  var MyApp =
  /*#__PURE__*/
  function (_ux$App) {
    _inherits(MyApp, _ux$App);

    function MyApp() {
      _classCallCheck(this, MyApp);

      return _possibleConstructorReturn(this, _getPrototypeOf(MyApp).apply(this, arguments));
    }

    _createClass(MyApp, [{
      key: "$changeMessage",
      value: function $changeMessage(buttonNumber, color) {
        this.tag('Message').patch({
          text: {
            text: 'Button ' + buttonNumber + ' pressed!'
          },
          smooth: {
            color: color
          }
        });
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.tag('ButtonList');
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          x: 20,
          y: 20,
          ButtonList: {
            type: ExampleButtonList
          },
          Message: {
            y: 80,
            text: {
              text: 'Left / right to select a button\nEnter to press it'
            }
          }
        };
      }
    }]);

    return MyApp;
  }(ux.App);

  var ExampleButtonList =
  /*#__PURE__*/
  function (_lng$Component) {
    _inherits(ExampleButtonList, _lng$Component);

    function ExampleButtonList() {
      _classCallCheck(this, ExampleButtonList);

      return _possibleConstructorReturn(this, _getPrototypeOf(ExampleButtonList).apply(this, arguments));
    }

    _createClass(ExampleButtonList, [{
      key: "_init",
      value: function _init() {
        this.index = 0;
      }
    }, {
      key: "_handleLeft",
      value: function _handleLeft() {
        this.index = 0;
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        this.index = 1;
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.children[this.index];
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Button1: {
            type: ExampleButton,
            buttonColor: 0xffff00ff,
            buttonText: 'Button 1',
            buttonNumber: '1'
          },
          Button2: {
            x: 250,
            type: ExampleButton,
            buttonColor: 0xff00ffff,
            buttonText: 'Button 2',
            buttonNumber: '2'
          }
        };
      }
    }]);

    return ExampleButtonList;
  }(lng.Component);

  var ExampleButton =
  /*#__PURE__*/
  function (_lng$Component2) {
    _inherits(ExampleButton, _lng$Component2);

    function ExampleButton() {
      _classCallCheck(this, ExampleButton);

      return _possibleConstructorReturn(this, _getPrototypeOf(ExampleButton).apply(this, arguments));
    }

    _createClass(ExampleButton, [{
      key: "_init",
      value: function _init() {
        this.tag('Label').patch({
          text: {
            text: this.buttonText
          }
        });
      }
    }, {
      key: "_focus",
      value: function _focus() {
        this.color = 0xffffffff;
        this.tag('Label').color = 0xff1f1f1f;
      }
    }, {
      key: "_unfocus",
      value: function _unfocus() {
        this.color = 0xff1f1f1f;
        this.tag('Label').color = 0xffffffff;
      }
    }, {
      key: "_handleEnter",
      value: function _handleEnter() {
        this.fireAncestors('$changeMessage', this.buttonNumber, this.buttonColor);
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          color: 0xff1f1f1f,
          texture: lng.Tools.getRoundRect(200, 40, 4),
          Label: {
            x: 100,
            y: 22,
            mount: .5,
            color: 0xffffffff,
            text: {
              fontSize: 20
            }
          }
        };
      }
    }]);

    return ExampleButton;
  }(lng.Component);

  MyApp.COLORS = {
    BACKGROUND: 0xff282e32
  };
  return MyApp;
});