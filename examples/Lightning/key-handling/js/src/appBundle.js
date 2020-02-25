(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        Message: {text: {text: "Press 's' key to show Search"}}
      }
    }

    _handleSearch(){
      this.tag("Message").text.text = "Search";
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
