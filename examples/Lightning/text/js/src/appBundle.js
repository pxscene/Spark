(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    class MyApp extends ux.App {
        static _template() {
            return {
              Text1: {
                x: 50,
                text: {
                  fontSize: 36,
                  textAlign: 'center',
                  maxLines: 2,
                  text: 'Text a little too long so this part won\'t be visible',
                  wordWrapWidth: 180,
                  textColor: 0xffff00ff,
                },
              },
              Text2: {
                x: 20,
                y: 100,
                text: {
                  fontSize: 60,
                  text: 'STYLE IT UP! ',
                  fontStyle: 'italic bold',
                  textColor: 0xff00ffff,
                  shadow: true,
                  shadowColor: 0xffff00ff,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2,
                  shadowBlur: 2,
                },
              },
              Text3: {
                mountX: 1,
                x: 500,
                y: 220,
                text: {
                  fontSize: 48,
                  textAlign: 'right',
                  text: 'you can also add\nline breaks\nusing\n\\n!',
                  lineHeight: 80,
                },
              },
            };
        }
    }

    MyApp.COLORS = {
        BACKGROUND: 0xff282e32
    };

    return MyApp;

})));
