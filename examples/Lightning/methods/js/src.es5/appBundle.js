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
        this._index = 0;
        this._animationTypes = ['start', 'stop', 'pause', 'play', 'finish', 'startTargetValue', 'resetTargetValue', 'updateTargetValue'];
        this._myTransition = this.tag('LilLightning').transition('x');
      }
    }, {
      key: "_handleLeft",
      value: function _handleLeft() {
        if (this._index > 0) {
          this._index--;
          this.setTransitionMethod(this._animationTypes[this._index]);
        }

        console.log('left', this._animationTypes[this._index]);
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        if (this._index < this._animationTypes.length - 1) {
          this._index++;
          this.setTransitionMethod(this._animationTypes[this._index]);
        }
      }
    }, {
      key: "setDescription",
      value: function setDescription(v) {
        this.tag('Description').patch({
          text: {
            text: "Current Method(): ".concat(v)
          }
        });
      } //Set transition type

    }, {
      key: "setTransitionMethod",
      value: function setTransitionMethod(v) {
        this.setDescription(v);

        switch (v) {
          case 'start':
            if (this.tag('LilLightning').x >= 500) {
              this._myTransition.start(50);
            } else {
              this._myTransition.start(500);
            }

            break;

          case 'stop':
            this._myTransition.stop();

            break;

          case 'pause':
            this._myTransition.pause();

            break;

          case 'play':
            this._myTransition.play();

            break;

          case 'finish':
            this._myTransition.finish();

            break;

          case 'startTargetValue':
            this._myTransition.start(50);

            break;

          case 'resetTargetValue':
            this._myTransition.reset(50, 1);

            break;

          case 'updateTargetValue':
            this._myTransition.updateTargetValue(250);

            break;
        }
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Description: {
            x: 50,
            y: 28,
            text: {
              text: 'Press left or right to swap transitions.',
              fontSize: 22,
              wordWrap: true,
              wordWrapWidth: 450,
              lineHeight: 30
            }
          },
          LilLightning: {
            x: 50,
            y: 100,
            src: 'https://www.sparkui.org/examples/gallery/images/ball.png',
            transitions: {
              'x': {
                duration: 5
              }
            }
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