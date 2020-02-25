(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        Wrapper: {
          x: 300, y: 300,
          LilLightning:{
            src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
          }
        }
      }
    }

    _init() {
      const myAnimation = this.tag('LilLightning').animation({
        duration: 2,
        repeat: -1,
        actions: [
          {
            p: 'y',
            v: {
              0: { v: -200, sm: 0.8, s:0 },
              0.1 : {v: 0, sm: 0.1, s: 0},
              0.2 : {v: -120, sm: 0.8, s: 0},
              0.3 : {v: 0, sm: 0.1, s: 0},
              0.4 : {v: -60, sm: 0.8, s: 0},
              0.5 : {v: 0, sm: 0.1, s: 0},
              0.6 : {v: -30, sm: 0.8, s: 0},
              0.7 : {v: 0, sm: 0.1, s: 0},
              0.8 : {v: -10, sm: 0.8, s: 0},
              0.9 : {v: 0, sm: 0.1, s: 0},
              1: { v: 0, sm: 0.8 }
            }
          }
        ]
      });
      myAnimation.start();
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
