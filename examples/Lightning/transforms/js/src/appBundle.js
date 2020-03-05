(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        LilLightning:{
          x: 250, y: 250, w: 256, h: 256, pivotX: 1, pivotY: 1, src: 'https://www.sparkui.org/examples/gallery/images/ball.png',
          ChildObject:{ x: 50, y: 0, mount: 0.5, w: 25, h: 25, rect: true }
        }
      }
    };

    _init(){
      this._lilLightningAnimation = this.tag('LilLightning').animation({
        duration: 6,
        repeat: -1,
        stopMethod: 'immediate',
        actions:[
          {p: 'rotation', v: { 0: 0, 1: 6.29 }},
          {t: 'ChildObject', p: 'rotation', v: {0: 0, 1: 6.29 }}
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
