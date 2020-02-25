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
      key: "_handleLeft",
      value: function _handleLeft() {
        this.resetTransitions();
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        this.startTransitions();
      }
    }, {
      key: "startTransitions",
      value: function startTransitions() {
        //Face candidates to the right
        this.setCandidatesDirection('right'); //Start transitions

        this.tag('LilLightningA').setSmooth('x', 500);
        this.tag('LilLightningB').setSmooth('x', 500, {
          duration: 2
        });
        this.tag('LilLightningC').patch({
          smooth: {
            x: [500, {
              duration: 2.5,
              delay: 1,
              timingFunction: 'ease-out'
            }]
          }
        });
      }
    }, {
      key: "resetTransitions",
      value: function resetTransitions() {
        //Face candidates to the left
        this.setCandidatesDirection('left'); //Start transitions

        this.tag('LilLightningA').patch({
          smooth: {
            x: [50, {
              duration: 0.5,
              delay: 0.2,
              timingFunction: 'ease-in'
            }]
          }
        });
        this.tag('LilLightningB').patch({
          smooth: {
            x: [50, {
              duration: 0.5,
              delay: 0.4,
              timingFunction: 'ease-in'
            }]
          }
        });
        this.tag('LilLightningC').patch({
          smooth: {
            x: [50, {
              duration: 0.5,
              delay: 0.6,
              timingFunction: 'ease-in'
            }]
          }
        });
      }
    }, {
      key: "setCandidatesDirection",
      value: function setCandidatesDirection(direction) {
        var dir = direction === 'left' ? -1 : 1;
        this.tag('LilLightningA').scaleX = dir;
        this.tag('LilLightningB').scaleX = dir;
        this.tag('LilLightningC').scaleX = dir;
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          FinishLine: {
            w: 5,
            h: 300,
            colorTop: 0xFFABABAB,
            colorBottom: 0xFFFFFFFF,
            rect: true,
            x: 500,
            y: 200
          },
          LilLightningA: {
            x: 50,
            y: 100,
            src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
          },
          LilLightningB: {
            x: 50,
            y: 200,
            src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
          },
          LilLightningC: {
            x: 50,
            y: 300,
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