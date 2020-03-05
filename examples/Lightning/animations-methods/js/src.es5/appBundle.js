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
      key: "_init",
      value: function _init() {
        this._myAnimation = this.tag('LilLightning').animation({
          duration: 3,
          repeat: -1,
          stopMethod: 'immediate',
          actions: [{
            p: 'y',
            v: {
              0: {
                v: 450,
                sm: 0
              },
              0.5: {
                v: 100,
                sm: 1
              },
              1: {
                v: 450,
                sm: 0
              }
            }
          }]
        });

        this._myAnimation.start();

        this.commandText = 'start';
      }
    }, {
      key: "_handleLeft",
      value: function _handleLeft() {
        this._myAnimation.start();

        this.commandText = 'start';
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        this._myAnimation.stop();

        this.commandText = 'stop';
      }
    }, {
      key: "_handleUp",
      value: function _handleUp() {
        this._myAnimation.pause();

        this.commandText = 'pause';
      }
    }, {
      key: "_handleDown",
      value: function _handleDown() {
        this._myAnimation.play();

        this.commandText = 'play';
      }
    }, {
      key: "commandText",
      set: function set(v) {
        this.tag('CommandText').patch({
          text: {
            text: "Animation Command: ".concat(v)
          }
        });
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          CommandText: {
            x: 50,
            y: 28,
            text: {
              text: '',
              fontSize: 22
            }
          },
          LilLightning: {
            x: 250,
            y: 200,
            src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
          }
        };
      }
    }]);

    return MyApp;
  }(ux.App);

  MyApp.COLORS = {
    BACKGROUND: 0xff282e32
  };
  return MyApp;
});