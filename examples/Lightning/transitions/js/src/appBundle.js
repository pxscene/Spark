(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        FinishLine:{ w: 5, h: 300, colorTop: 0xFFABABAB, colorBottom: 0xFFFFFFFF, rect: true, x: 500, y: 200 },
        LilLightningA:{ x: 50, y: 100, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'},
        LilLightningB:{ x: 50, y: 200, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'},
        LilLightningC:{ x: 50, y: 300, src: 'https://www.sparkui.org/examples/gallery/images/ball.png'}
      }
    }

    _handleLeft(){
      this.resetTransitions();
    }

    _handleRight(){
      this.startTransitions();
    }

    startTransitions(){
      //Face candidates to the right
      this.setCandidatesDirection('right');

      //Start transitions
      this.tag('LilLightningA').setSmooth('x', 500);
      this.tag('LilLightningB').setSmooth('x', 500, {duration: 2});
      this.tag('LilLightningC').patch({ smooth:{ x: [500, { duration: 2.5, delay: 1, timingFunction: 'ease-out' } ]}});
    }

    resetTransitions(){
      //Face candidates to the left
      this.setCandidatesDirection('left');

      //Start transitions
      this.tag('LilLightningA').patch({ smooth:{ x: [50, { duration: 0.5, delay: 0.2, timingFunction: 'ease-in' } ]}});
      this.tag('LilLightningB').patch({ smooth:{ x: [50, { duration: 0.5, delay: 0.4, timingFunction: 'ease-in' } ]}});
      this.tag('LilLightningC').patch({ smooth:{ x: [50, { duration: 0.5, delay: 0.6, timingFunction: 'ease-in' } ]}});
    }

    setCandidatesDirection(direction){
      let dir = (direction === 'left')?-1:1;
      this.tag('LilLightningA').scaleX = dir;
      this.tag('LilLightningB').scaleX = dir;
      this.tag('LilLightningC').scaleX = dir;
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
