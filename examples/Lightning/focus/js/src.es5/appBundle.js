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
        this.buttonIndex = 0;
        this.tag('List').items = [1, 2, 3, 4].map(function (i) {
          return {
            label: i
          };
        });

        this._setState('Buttons');
      }
    }, {
      key: "_handleUp",
      value: function _handleUp() {
        this._setState('Buttons');
      }
    }, {
      key: "_handleDown",
      value: function _handleDown() {
        this._setState('List');
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          x: 20,
          y: 20,
          Buttons: {
            LeftButton: {
              type: ExampleButton,
              buttonText: 'Left'
            },
            RightButton: {
              x: 200,
              type: ExampleButton,
              buttonText: 'Right'
            }
          },
          List: {
            y: 100,
            type: ExampleList
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this) {
          _inherits(Buttons, _this);

          function Buttons() {
            _classCallCheck(this, Buttons);

            return _possibleConstructorReturn(this, _getPrototypeOf(Buttons).apply(this, arguments));
          }

          _createClass(Buttons, [{
            key: "_handleLeft",
            value: function _handleLeft() {
              this.buttonIndex = 0;
            }
          }, {
            key: "_handleRight",
            value: function _handleRight() {
              this.buttonIndex = 1;
            }
          }, {
            key: "_getFocused",
            value: function _getFocused() {
              return this.tag('Buttons').children[this.buttonIndex];
            }
          }]);

          return Buttons;
        }(this),
        /*#__PURE__*/
        function (_this2) {
          _inherits(List, _this2);

          function List() {
            _classCallCheck(this, List);

            return _possibleConstructorReturn(this, _getPrototypeOf(List).apply(this, arguments));
          }

          _createClass(List, [{
            key: "_getFocused",
            value: function _getFocused() {
              return this.tag('List');
            }
          }]);

          return List;
        }(this)];
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
    }], [{
      key: "_template",
      value: function _template() {
        return {
          color: 0xff1f1f1f,
          texture: lng.Tools.getRoundRect(150, 40, 4),
          Label: {
            x: 75,
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

  var ExampleList =
  /*#__PURE__*/
  function (_lng$Component2) {
    _inherits(ExampleList, _lng$Component2);

    function ExampleList() {
      _classCallCheck(this, ExampleList);

      return _possibleConstructorReturn(this, _getPrototypeOf(ExampleList).apply(this, arguments));
    }

    _createClass(ExampleList, [{
      key: "_init",
      value: function _init() {
        this.index = 0;
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.children[this.index];
      }
    }, {
      key: "_handleLeft",
      value: function _handleLeft() {
        if (this.index > 0) {
          this.index--;
        }
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        // we don't know exactly how many items the list can have
        // so we test it based on this component's child list
        if (this.index < this.children.length - 1) {
          this.index++;
        }
      }
    }, {
      key: "items",
      set: function set(items) {
        this.children = items.map(function (item, index) {
          return {
            ref: 'ListItem-' + index,
            //optional, for debug purposes
            type: ExampleListItem,
            x: index * 70,
            //item width + 20px margin
            item: item //passing the item as an attribute

          };
        });
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {};
      }
    }]);

    return ExampleList;
  }(lng.Component);

  var ExampleListItem =
  /*#__PURE__*/
  function (_lng$Component3) {
    _inherits(ExampleListItem, _lng$Component3);

    function ExampleListItem() {
      _classCallCheck(this, ExampleListItem);

      return _possibleConstructorReturn(this, _getPrototypeOf(ExampleListItem).apply(this, arguments));
    }

    _createClass(ExampleListItem, [{
      key: "_init",
      value: function _init() {
        this.patch({
          Label: {
            text: {
              text: this.item.label
            }
          }
        });
      }
    }, {
      key: "_focus",
      value: function _focus() {
        this.patch({
          smooth: {
            alpha: 1,
            scale: 1.2
          }
        });
      }
    }, {
      key: "_unfocus",
      value: function _unfocus() {
        this.patch({
          smooth: {
            alpha: 0.8,
            scale: 1
          }
        });
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          rect: true,
          w: 50,
          h: 50,
          color: 0xffff00ff,
          alpha: 0.8,
          Label: {
            x: 25,
            y: 30,
            mount: .5
          }
        };
      }
    }]);

    return ExampleListItem;
  }(lng.Component);

  MyApp.COLORS = {
    BACKGROUND: 0xff282e32
  };
  return MyApp;
});