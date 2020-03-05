(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        LilLightning: {
          x: 300, y: 300, src: 'https://www.sparkui.org/examples/gallery/images/ball.png',
          transitions: {x: {duration: 1}, y: {duration: 1, timingFunction: 'linear'}}
        },
        Message: {
          x: 50, y: 50, text: {fontSize: 32}
        }
      };
    }

    _handleLeft(){
      const subject = this.tag("LilLightning");
      const targetX = subject.getSmooth('x') - 100;
      subject.setSmooth('x', targetX);
    }

    _handleRight(){
      const subject = this.tag("LilLightning");
      const targetX = subject.getSmooth('x') + 100;
      subject.setSmooth('x', targetX);
    }

    _handleUp(){
      const subject = this.tag("LilLightning");
      const targetY = subject.getSmooth('y') - 100;
      subject.setSmooth('y', targetY);
    }

    _handleDown(){
      const subject = this.tag("LilLightning");
      const targetY = subject.getSmooth('y') + 100;
      subject.setSmooth('y', targetY);
    }

    _init(){
      this.tag("LilLightning").transition('x').on('start', () => {
        this.tag("Message").text.text = "Started X transition to " + this.tag("LilLightning").getSmooth('x');
      });
      this.tag("LilLightning").transition('x').on('finish', () => {
        this.tag("Message").text.text = "Finished X transition";
      });
      this.tag("LilLightning").transition('y').on('start', () => {
        this.tag("Message").text.text = "Started Y transition to " + this.tag("LilLightning").getSmooth('y');
      });
      this.tag("LilLightning").transition('y').on('finish', () => {
        this.tag("Message").text.text = "Finished Y transition";
      });
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
