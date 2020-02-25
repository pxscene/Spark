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
      key: "toggleText",
      value: function toggleText(alpha, color) {
        this.tag('Message').patch({
          color: color,
          smooth: {
            alpha: alpha
          }
        });
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.tag('Button');
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          x: 20,
          y: 20,
          Button: {
            type: ExampleButton,
            buttonText: 'Toggle',
            //indicates the signals that your child component will send
            signals: {
              toggleText: true
            }
          },
          Message: {
            y: 80,
            alpha: 0,
            text: {
              text: 'Message'
            }
          }
        };
      }
    }]);

    return MyApp;
  }(ux.App);

  var ExampleButton =
  /*#__PURE__*/
  function (_lng$Component) {
    _inherits(ExampleButton, _lng$Component);

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
        this.toggle = false;
        this.buttonColor = 0xffff00ff;
      }
    }, {
      key: "_handleEnter",
      value: function _handleEnter() {
        this.toggle = !this.toggle;

        if (this.toggle) {
          this.buttonColor = this.buttonColor === 0xffff00ff ? 0xff00ffff : 0xffff00ff;
        }

        this.signal('toggleText', this.toggle, this.buttonColor);
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          color: 0xffffffff,
          texture: lng.Tools.getRoundRect(200, 40, 4),
          Label: {
            x: 100,
            y: 22,
            mount: .5,
            color: 0xff1f1f1f,
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