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
        this._setState('MyBlueState');
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        this._setState('MyGreenState');
      }
    }, {
      key: "_init",
      value: function _init() {
        this._blueCubeAnimation = this.tag('MyBlueCube').animation({
          duration: 3,
          repeat: -1,
          stopMethod: 'immediate',
          actions: [{
            p: 'rotation',
            v: {
              0: {
                v: 0,
                sm: 0
              },
              1: {
                v: -Math.PI * 2,
                sm: 0
              }
            }
          }]
        });
        this._greenCubeAnimation = this.tag('MyGreenCube').animation({
          duration: 3,
          repeat: -1,
          stopMethod: 'immediate',
          actions: [{
            p: 'rotation',
            v: {
              0: {
                v: 0,
                sm: 0
              },
              1: {
                v: Math.PI * 2,
                sm: 0
              }
            }
          }]
        });
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          ExamplanationText: {
            x: 50,
            y: 28,
            text: {
              text: 'Press left for MyBlueState,\n press right for MyGreenState \n',
              fontSize: 22,
              wordWrap: true,
              wordWrapWidth: 450,
              lineHeight: 30
            }
          },
          MyBlueCube: {
            x: 100,
            y: 200,
            w: 100,
            h: 100,
            rect: true,
            color: 0xFF0034DD
          },
          MyGreenCube: {
            x: 400,
            y: 200,
            w: 100,
            h: 100,
            rect: true,
            color: 0xFF24DD00
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this) {
          _inherits(MyBlueState, _this);

          function MyBlueState() {
            _classCallCheck(this, MyBlueState);

            return _possibleConstructorReturn(this, _getPrototypeOf(MyBlueState).apply(this, arguments));
          }

          _createClass(MyBlueState, [{
            key: "$enter",
            value: function $enter(event) {
              this._blueCubeAnimation.play();
            }
          }, {
            key: "$exit",
            value: function $exit() {
              this._blueCubeAnimation.pause();
            }
          }]);

          return MyBlueState;
        }(this),
        /*#__PURE__*/
        function (_this2) {
          _inherits(MyGreenState, _this2);

          function MyGreenState() {
            _classCallCheck(this, MyGreenState);

            return _possibleConstructorReturn(this, _getPrototypeOf(MyGreenState).apply(this, arguments));
          }

          _createClass(MyGreenState, [{
            key: "$enter",
            value: function $enter() {
              this._greenCubeAnimation.play();
            }
          }, {
            key: "$exit",
            value: function $exit() {
              this._greenCubeAnimation.pause();
            }
          }]);

          return MyGreenState;
        }(this)];
      }
    }]);

    return MyApp;
  }(ux.App);

  MyApp.COLORS = {
    BACKGROUND: 0xff282e32
  };
  return MyApp;
});