(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.appBundle = factory());
}(this, (function () { 'use strict';

  class MyApp extends ux.App {
    static _template() {
      return {
        x: 20, y: 20,
        List: { type: ExampleList }
      }
    }
    _init() {
      // let's generate dinamically some list items
      // and give it to our list
      this.tag('List').items = [1,2,3,4].map((i) => ({label: i }));
    }
  }

  class ExampleList extends lng.Component {
    set items(items) {
      this.children = items.map((item, index) => {
        return {
          type: ExampleListItem,
          x: index * 70, //item width + 20px margin
          item //passing the item as an attribute
        }
      });
    }
  }

  class ExampleListItem extends lng.Component {
    static _template() {
      return {
        rect: true, w: 50, h: 50, color: 0xffff00ff, alpha: 0.8,
        Label: {
          x: 25, y: 30, mount: .5
        }
      }
    }
    _init() {
      this.patch({ Label: { text: { text: this.item.label }}});
    }
  }

  MyApp.COLORS = {
      BACKGROUND: 0xff282e32
  };

  return MyApp;

})));
