(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        Enter: {
          x: 50,
          y: 50,
          text: {
            fontSize: 20,
            text: '$enter:',
          }
        },
        Exit: {
          x: 50,
          y: 180,
          text: {
            fontSize: 20,
            text: '$exit:'
          }
        }
      }
    }

    _init(){
      this._setState('FirstState');
    }

    static _states() {
      return [
        class FirstState extends this {
          $enter(event) {
            this.setMessage('Enter', 'FirstState', event);
            setTimeout(() => {
              this._setState('SecondState');
            }, 3000);
          }
          $exit(event) {
            this.setMessage('Exit', 'FirstState', event);
          }
        },
        class SecondState extends this {
          $enter(event) {
            this.setMessage('Enter', 'SecondState', event);
            setTimeout(() => {
              this._setState('FirstState');
            }, 3000);
          }
          $exit(event) {
            this.setMessage('Exit', 'SecondState', event);
          }
        },
      ]
    }

    setMessage(tag, source, event) {
      this.tag(tag).patch({
        text: {
          text: `$${tag.toLowerCase()} ${source}:\n \n`
            + JSON.stringify(event)
              .replace(/[,{}]/g, '\n')
              .replace(/:/g, ': ')
              .replace(/"/g, '')
        }
      });
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
