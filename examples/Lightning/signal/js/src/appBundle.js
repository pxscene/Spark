(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        x: 20, y: 20,
        Button: {
          type: ExampleButton,
          buttonText: 'Toggle',
          //indicates the signals that your child component will send
          signals: {
            toggleText: true,
          }
        },
        Message: {
          y: 80, alpha: 0, text: { text: 'Message' }
        }
      }
    }
    toggleText(alpha, color) {
      this.tag('Message').patch({color, smooth: { alpha }});
    }
    _getFocused() {
      return this.tag('Button')
    }
  }

  class ExampleButton extends lng.Component {
    static _template() {
      return {
        color: 0xffffffff,
        texture: lng.Tools.getRoundRect(200, 40, 4),
        Label: {
          x: 100, y: 22, mount: .5, color: 0xff1f1f1f, text: { fontSize: 20 }
        }
      }
    }
    _init() {
      this.tag('Label').patch({ text: { text: this.buttonText }});
      this.toggle = false;
      this.buttonColor = 0xffff00ff;
    }
    _handleEnter() {
      this.toggle = !this.toggle;
      if(this.toggle) {
        this.buttonColor = this.buttonColor === 0xffff00ff ? 0xff00ffff : 0xffff00ff;
      }
      this.signal('toggleText', this.toggle, this.buttonColor);
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
