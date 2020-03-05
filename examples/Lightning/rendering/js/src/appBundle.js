(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        shader: {type: lng.shaders.Grayscale, amount: 0.9},
        LilLightning:{ x: 100, y: 100, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'},
        Header: {
          rect: true, w: window.innerWidth, h: 50, color: 0xff005500
        },
        SubLilLightning: {
          x: 400, y: 100, src: 'https://www.sparkui.org/examples/gallery/images/ball.png',
          shader: null // Reset shader to default.
        },
        SubLilLightning2: {
          x: 400, y: 400, src: 'https://www.sparkui.org/examples/gallery/images/ball.png',
          shader: {type: lng.shaders.Inversion} // Reset shader to other.
        }
      }
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
