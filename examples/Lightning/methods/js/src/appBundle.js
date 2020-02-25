(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        Description:{ x: 50, y: 28, text:{ text: 'Press left or right to swap transitions.', fontSize: 22, wordWrap: true, wordWrapWidth: 450, lineHeight: 30 }},
        LilLightning:{ x: 50, y: 100, src: 'https://www.sparkui.org/examples/gallery/images/ball.png', transitions:{'x': {duration: 5}}}
      }
    }

    _init(){
      this._index = 0;
      this._animationTypes = ['start','stop','pause','play','finish','startTargetValue','resetTargetValue','updateTargetValue'];
      this._myTransition = this.tag('LilLightning').transition('x');
    }

    _handleLeft(){
      if(this._index > 0){
        this._index --;
        this.setTransitionMethod(this._animationTypes[this._index]);
      }
      console.log('left', this._animationTypes[this._index]);
    }

    _handleRight(){
      if(this._index < this._animationTypes.length -1){
        this._index ++;
        this.setTransitionMethod(this._animationTypes[this._index]);
      }
    }

    setDescription(v){
      this.tag('Description').patch({text:{ text: `Current Method(): ${v}`}});
    }

    //Set transition type
    setTransitionMethod(v){
      this.setDescription(v);
      switch(v){
        case 'start':
          if(this.tag('LilLightning').x >= 500){
            this._myTransition.start(50);
          }else{
            this._myTransition.start(500);
          }
          break;
        case 'stop':
          this._myTransition.stop();
          break;
        case 'pause':
          this._myTransition.pause();
          break;
        case 'play':
          this._myTransition.play();
          break;
        case 'finish':
          this._myTransition.finish();
          break;
        case 'startTargetValue':
          this._myTransition.start(50);
          break;
        case 'resetTargetValue':
          this._myTransition.reset(50, 1);
          break;
        case 'updateTargetValue':
          this._myTransition.updateTargetValue(250);
          break;
      }
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
