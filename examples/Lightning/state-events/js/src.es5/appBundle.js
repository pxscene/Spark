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
        this._setState('FirstState');
      }
    }, {
      key: "setMessage",
      value: function setMessage(tag, source, event) {
        this.tag(tag).patch({
          text: {
            text: "$".concat(tag.toLowerCase(), " ").concat(source, ":\n \n") + JSON.stringify(event).replace(/[,{}]/g, '\n').replace(/:/g, ': ').replace(/"/g, '')
          }
        });
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Enter: {
            x: 50,
            y: 50,
            text: {
              fontSize: 20,
              text: '$enter:'
            }
          },
          Exit: {
            x: 50,
            y: 180,
            text: {
              fontSize: 20,
              text: '$exit:'
            }
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this) {
          _inherits(FirstState, _this);

          function FirstState() {
            _classCallCheck(this, FirstState);

            return _possibleConstructorReturn(this, _getPrototypeOf(FirstState).apply(this, arguments));
          }

          _createClass(FirstState, [{
            key: "$enter",
            value: function $enter(event) {
              var _this2 = this;

              this.setMessage('Enter', 'FirstState', event);
              setTimeout(function () {
                _this2._setState('SecondState');
              }, 3000);
            }
          }, {
            key: "$exit",
            value: function $exit(event) {
              this.setMessage('Exit', 'FirstState', event);
            }
          }]);

          return FirstState;
        }(this),
        /*#__PURE__*/
        function (_this3) {
          _inherits(SecondState, _this3);

          function SecondState() {
            _classCallCheck(this, SecondState);

            return _possibleConstructorReturn(this, _getPrototypeOf(SecondState).apply(this, arguments));
          }

          _createClass(SecondState, [{
            key: "$enter",
            value: function $enter(event) {
              var _this4 = this;

              this.setMessage('Enter', 'SecondState', event);
              setTimeout(function () {
                _this4._setState('FirstState');
              }, 3000);
            }
          }, {
            key: "$exit",
            value: function $exit(event) {
              this.setMessage('Exit', 'SecondState', event);
            }
          }]);

          return SecondState;
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