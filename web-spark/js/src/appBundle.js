(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    class MyApp extends ux.App {
        static _template() {
            var ww = 400 * 2;
            var hh = 230 * 2;
            return {

               Bg: { x: 0, y: 0, w: ww, h: hh, rect: true, color: 0xFF8888ff },
               Ball: {
                  x: ww * 0.5, y: hh * 0.5, w: 100, h: 100, src: MyApp.getPath("ball.png")
               },
               Text1: { x: ww * 0.065, y: hh * 0.95, mountX: 0, mountY: 1, fontFace: 'RobotoRegular',
                  text: { fontSize: 16, textColor: 0xFFffffff, text: 'Spark Platform' }
               },
               Spark: {
                  x: ww * 0.05, y: hh * 0.94, w: 26, h: 26, mount: 1, src: MyApp.getPath("Spark_logo256px.png")
               },
               Text2: { x: ww * 0.975, y: hh * 0.95, mount: 1, fontFace: 'RobotoRegular',
                  text: { fontSize: 16, textColor: 0xFFffffff, text: 'Lightning App' }
               },
               Lightning: {
                  x: ww * 0.86, y: hh * 0.967, w: 50, h: 50, mount: 1, src: MyApp.getPath("Lightning.png")
               },
            }
         }

         _init()
         {
            var ww = 400 * 2;
            var hh = 230 * 2;
            var w1 = ww * 0.75;
            var y1 = hh * 0.50;

            this._anim = this.tag('Ball').animation({
            duration: 6,
            repeat: -1,
            stopMethod: 'immediate',
               actions:[
                  {p: 'scale', v: { 0: {v: 1, s: 1}, 0.5: {v: -1, s: 1}, 1: {v: 1, s: 1}}},
                  {p:     'x', v: { 0: 50, 0.25: w1 * 0.5, 0.5: w1, 0.75: w1 * 0.735, 1: 50}},
                  {p:     'y', v: { 0: 10, 0.25: y1,       0.5: 50, 0.75: y1,         1: 10 }}
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
