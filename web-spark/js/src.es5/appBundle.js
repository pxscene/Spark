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
        var ww = 500 / 2;
        var hh = 250 / 2;
        this._anim = this.tag('Ball').animation({
          duration: 6,
          repeat: -1,
          stopMethod: 'immediate',
          actions: [{
            p: 'scale',
            v: {
              0: {
                v: 1,
                s: 1
              },
              0.5: {
                v: -1,
                s: 1
              },
              1: {
                v: 1,
                s: 1
              }
            }
          }, {
            p: 'x',
            v: {
              0: 50,
              0.25: ww * 0.5,
              0.5: ww,
              0.75: ww * 0.9,
              1: 50
            }
          }, {
            p: 'y',
            v: {
              0: 50,
              0.25: hh,
              0.5: 50,
              0.75: 100,
              1: 50
            }
          }]
        });

        this._anim.start();
      }
    }], [{
      key: "_template",
      value: function _template() {
        var hh = 300; //400

        return {
          Bg: {
            x: 0,
            y: 0,
            w: 400,
            h: hh,
            rect: true,
            color: 0xFF8888ff
          },
          Ball: {
            x: 275,
            y: 275,
            w: 100,
            h: 100,
            src: MyApp.getPath("ball.png")
          },
          Text1: {
            x: 50,
            y: hh - 10,
            mountX: 0,
            mountY: 1,
            fontFace: 'RobotoRegular',
            text: {
              fontSize: 16,
              textColor: 0xFFffffff,
              text: 'Spark Platform'
            }
          },
          Spark: {
            x: 40,
            y: hh - 10,
            w: 24,
            h: 24,
            mount: 1,
            src: MyApp.getPath("Spark_logo256px.png")
          },
          Text2: {
            x: 400 - 10,
            y: hh - 10,
            mount: 1,
            fontFace: 'RobotoRegular',
            text: {
              fontSize: 16,
              textColor: 0xFFffffff,
              text: 'Lightning App'
            }
          },
          Lightning: {
            x: 400 - 100,
            y: hh + 5,
            w: 50,
            h: 50,
            mount: 1,
            src: MyApp.getPath("Lightning.png")
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