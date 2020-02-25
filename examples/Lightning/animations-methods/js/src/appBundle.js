(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        CommandText:{ x: 50, y: 28, text:{ text: '', fontSize: 22 }},
        LilLightning:{
          x: 250, y: 200, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'
        }
      }
    }

    set commandText(v){
      this.tag('CommandText').patch({ text:{text: `Animation Command: ${v}`} });
    }

    _init(){
      this._myAnimation = this.tag('LilLightning').animation({
        duration: 3, repeat: -1, stopMethod: 'immediate',
        actions: [{ p: 'y', v: { 0: { v: 450, sm: 0 }, 0.5: { v: 100, sm: 1 }, 1: { v: 450, sm: 0 } } }]
      });
      this._myAnimation.start();
      this.commandText = 'start';
    }

    _handleLeft(){
      this._myAnimation.start();
      this.commandText = 'start';
    }

    _handleRight(){
      this._myAnimation.stop();
      this.commandText = 'stop';
    }

    _handleUp(){
      this._myAnimation.pause();
      this.commandText = 'pause';
    }

    _handleDown(){
      this._myAnimation.play();
      this.commandText = 'play';
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
