(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        LilLightning:{
          x: 50, y: 250, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
        }
      }
    }

    _init(){
      const lilLightningFlying = this.tag('LilLightning').animation({
        duration: 4, repeat: -1, stopMethod: 'immediate',
        actions: [
          { p: 'x', v: { 0: {v: 50, se: 0}, 0.2: {v: 50, s: 0}, 0.6: {v: 250, s: 0}, 1: 700 } },
          { p: 'y', v: { 0: {v: 250, se: 0}, 0.2: {v: 250, s: 0}, 0.6: {v: 250, s: 0}, 1: -150 } },
          { p: 'scale', v: { 0: {v: 1, se: 0}, 0.2: {v: 1, s: 0}, 0.6: {v: 1, s: 0}, 1: 0.2 } }
        ]
      });
      lilLightningFlying.start();
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
