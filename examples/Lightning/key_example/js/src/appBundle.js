(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        LilLightningA:{
          x: 30, y: 50, src: MyApp.getPath('keybubble.png'),
          KeyTextA:{ x: 45, y: 40, text:{ text: '', fontSize: 32, textColor:0xFFFF0000}}
        },
        LilLightningB:{
          x: 330, y: 50, src: MyApp.getPath('keybubble.png'),
          KeyTextB:{ x: 45, y: 40, text:{ text: '', fontSize: 32, textColor:0xFFFF0000}}
        },
        LilLightningC:{
          x: 630, y: 50, src: MyApp.getPath('keybubble.png'),
          KeyTextC:{ x: 45, y: 40, text:{ text: '', fontSize: 32, textColor:0xFFFF0000}}
        }
      }
    }

    _init(){
      var x = this.tag('KeyTextA').x + this.tag('LilLightningA').w/2;
      var y = this.tag('KeyTextA').y + this.tag('LilLightningA').h/2;
      this.tag('KeyTextA').patch({ x:x, y:y});
      this._myAnimationA = this.tag('LilLightningA').animation({
        duration: 4, repeat: -1, stopMethod: 'immediate',
        actions: [{ p: 'y', v: { 0: { v: 0, sm: 0 }, 0.25: { v: 150, sm: 1 }, 0.5: {v: 300, sm: 0}, 0.75: { v: 150, sm: 0 }, 1: { v: 0, sm: 0 } } }]
      });
      this._myAnimationA.start();

      x = this.tag('KeyTextB').x + this.tag('LilLightningB').w/2;
      y = this.tag('KeyTextB').y + this.tag('LilLightningB').h/2;
      this.tag('KeyTextB').patch({ x:x, y:y});
      this._myAnimationB = this.tag('LilLightningB').animation({
        duration: 4, repeat: -1, stopMethod: 'immediate',
        actions: [{ p: 'y', v: { 0: { v: 0, sm: 0 }, 0.25: { v: 150, sm: 1 }, 0.5: {v: 300, sm: 0}, 0.75: { v: 150, sm: 0 }, 1: { v: 0, sm: 0 } } }]
      });
      this._myAnimationB.start();

      x = this.tag('KeyTextC').x + this.tag('LilLightningC').w/2;
      y = this.tag('KeyTextC').y + this.tag('LilLightningC').h/2;
      this.tag('KeyTextC').patch({ x:x, y:y});
      this._myAnimationC = this.tag('LilLightningC').animation({
        duration: 4, repeat: -1, stopMethod: 'immediate',
        actions: [{ p: 'y', v: { 0: { v: 0, sm: 0 }, 0.25: { v: 150, sm: 1 }, 0.5: {v: 300, sm: 0}, 0.75: { v: 150, sm: 0 }, 1: { v: 0, sm: 0 } } }]
      });
      this._myAnimationC.start();
    }

    _handleKey(e) {
      this.tag('KeyTextA').patch({ text:{text: e.keyCode} });
      this.tag('KeyTextB').patch({ text:{text: e.keyCode} });
      this.tag('KeyTextC').patch({ text:{text: e.keyCode} });
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
