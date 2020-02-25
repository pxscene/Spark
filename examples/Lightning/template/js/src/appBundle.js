(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        Header: {
          rect: true, w: 1920, h: 50, color: 0xff005500,
          Title: {
            x: 50, y: 30, mountY: 0.5, text: { text: 'Header' }
          }
        },
        Content: {
          y: 60,
          MyImage: {
            x: 100,
            y: 100,
            src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
          }
        }
      }
    };
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
