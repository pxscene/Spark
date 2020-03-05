(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        Progress: {
          x: 50, y: 50, text: {fontSize: 32}
        },
        LilLightning:{
          x: 0, y: 200, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
        }
      }
    }

    _init(){
      const lilLightningAnimation = this.tag('LilLightning').animation({
        duration: 2,
        repeat: -1,
        repeatDelay: 0.5,
        actions: [
          { p: 'x', v: { 0: 100, 0.5: 450, 1: 100 } }
        ]
      });
      lilLightningAnimation.on('progress', (p)=>{
        this.tag("Progress").text = "Progress: " + p;
      });
      lilLightningAnimation.start();
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
