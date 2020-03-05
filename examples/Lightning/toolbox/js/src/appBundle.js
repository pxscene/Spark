(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    class MyApp extends ux.App {
        static _template() {
            return {
              Toolbox: {
                x: 60,
                y: 120,
                RoundRectangle: {
                  zIndex: 2,
                  texture: lng.Tools.getRoundRect(
                    150,
                    40,
                    4,
                    3,
                    0xffff00ff,
                    true,
                    0xff00ffff
                  ),
                },
                Shadow: {
                  x: 10,
                  y: 10,
                  zIndex: 1,
                  color: 0x66ffffff,
                  texture: lng.Tools.getShadowRect(150, 40, 4, 10, 15),
                },
              }
            };
        }
    }

    MyApp.COLORS = {
        BACKGROUND: 0xff282e32
    };

    return MyApp;

})));
