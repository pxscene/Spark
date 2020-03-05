(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        LilLightning:{
          x: 275, y: 275, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
        }
      }
    }

    _init(){
      this._lilLightningAnimation = this.tag('LilLightning').animation({
        duration: 6,
        repeat: -1,
        stopMethod: 'immediate',
        actions:[
          {p: 'scaleX', v: { 0: {v: 1, s: 1}, 0.5: {v: -1, s: 1}, 1: {v: 1, s: 1}}},
          {p: 'x', v: {0: 50, 0.25: 250, 0.5: 500, 0.75: 450, 1: 50}},
          {p: 'y', v: {0: 50, 0.25: 250, 0.5: 50, 0.75: 100, 1: 50 }}
        ]
      });
      this._lilLightningAnimation.start();
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
