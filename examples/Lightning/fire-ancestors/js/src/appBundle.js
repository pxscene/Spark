(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        x: 20, y: 20,
        ButtonList: {
          type: ExampleButtonList,
        },
        Message: {
          y: 80,
          text: { text: 'Left / right to select a button\nEnter to press it' }
        }
      }
    }
    $changeMessage(buttonNumber, color) {
      this.tag('Message').patch({
        text: { text: 'Button ' + buttonNumber + ' pressed!' },
        smooth: { color }

      });
    }
    _getFocused() {
      return this.tag('ButtonList')
    }
  }

  class ExampleButtonList extends lng.Component {
    static _template() {
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
      }
    }
    _init() {
      this.index = 0;
    }
    _handleLeft() {
      this.index = 0;
    }
    _handleRight() {
      this.index = 1;
    }
    _getFocused() {
      return this.children[this.index]
    }
  }

  class ExampleButton extends lng.Component {
    static _template() {
      return {
        color: 0xff1f1f1f,
        texture: lng.Tools.getRoundRect(200, 40, 4),
        Label: {
          x: 100, y: 22, mount: .5, color: 0xffffffff, text: { fontSize: 20 }
        }
      }
    }
    _init() {
      this.tag('Label').patch({ text: { text: this.buttonText }});
    }
    _focus() {
      this.color = 0xffffffff;
      this.tag('Label').color = 0xff1f1f1f;
    }
    _unfocus() {
      this.color = 0xff1f1f1f;
      this.tag('Label').color = 0xffffffff;
    }
    _handleEnter() {
      this.fireAncestors('$changeMessage', this.buttonNumber, this.buttonColor);
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
