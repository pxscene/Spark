(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        LilLightningEase:{
          x: 150, y: 200, scaleX: -1, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
        },
        LilLightningNoEase:{
          x: 400, y: 200, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
        }
      }
    }

    _init(){
      this._myEasingAnimation = this.tag('LilLightningEase').animation({
        duration: 3, repeat: -1, stopMethod: 'immediate',
        actions: [{ p: 'y', v: { 0: { v: 400, sm: 0 }, 0.5: { v: 50, sm: 1 }, 1: { v: 400, sm: 0 } } }]
      });

      this._myNonEasingAnimation = this.tag('LilLightningNoEase').animation({
        duration: 3, repeat: -1, stopMethod: 'immediate',
        actions: [{ p: 'y', v: { 0: { v: 400, sm: 0 }, 0.5: { v: 50, sm: 0 }, 1: { v: 400, sm: 0 } } }]
      });

      this._myEasingAnimation.start();
      this._myNonEasingAnimation.start();
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
