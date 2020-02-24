(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
      static _template() {
        var hh = 300; //400
        return {

          Bg: { x: 0, y: 0, w: 400, h: hh, rect: true, color: 0xFF8888ff },
          Ball: {
              x: 275, y: 275, w: 100, h: 100, src: MyApp.getPath("ball.png")
          },
          Text1: { x: 50, y: hh - 10, mountX: 0, mountY: 1, fontFace: 'RobotoRegular',
              text: { fontSize: 16, textColor: 0xFFffffff, text: 'Spark Platform' }
          },
          Spark: {
              x: 40, y: hh - 10, w: 24, h: 24, mount: 1, src: MyApp.getPath("Spark_logo256px.png")
          },
          Text2: { x: 400 - 10, y: hh - 10, mount: 1, fontFace: 'RobotoRegular',
              text: { fontSize: 16, textColor: 0xFFffffff, text: 'Lightning App' }
          },
          Lightning: {
              x: 400 - 100, y: hh + 5, w: 50, h: 50, mount: 1, src: MyApp.getPath("Lightning.png")
          },
        }
    }

    _init()
    {
      var ww = 500 / 2;
      var hh = 250 / 2;
      this._anim = this.tag('Ball').animation({
      duration: 6,
      repeat: -1,
      stopMethod: 'immediate',
          actions:[
            {p: 'scale', v: { 0: {v: 1, s: 1}, 0.5: {v: -1, s: 1}, 1: {v: 1, s: 1}}},
            {p:     'x', v: {0: 50, 0.25: ww * 0.5, 0.5: ww, 0.75: ww * 0.9, 1: 50}},
            {p:     'y', v: {0: 50, 0.25: hh , 0.5: 50, 0.75: 100, 1: 50 }}
          ]
      });

      this._anim.start();
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
