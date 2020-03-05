(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        LilLightning:{
          x: 50, y: 50, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
        }
      }
    }

    _init(){
      this._lilLightningAnimation = this.tag('LilLightning').animation({
        duration: 2,
        delay: 1,
        repeat: 3,
        repeatDelay: 0,
        repeatOffset: 0,
        stopMethod: 'reverse',
        stopDuration: 1,
        stopDelay: 0.2,
        autostop: false,
        actions:[
          {p: 'x', v: {0: 50, 0.25: 250, 0.5: 250, 0.75: 500, 1: 50 }},
          {p: 'y', v: {0: 50, 0.25: 250, 0.5: 500, 0.75: 500, 1: 50 }}
        ]
      });
    }

    _handleLeft(){
      this._lilLightningAnimation.stop();
    }

    _handleRight(){
      this._lilLightningAnimation.start();
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
