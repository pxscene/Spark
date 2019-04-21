/*

pxCore Copyright 2005-2018 John Robinson

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Srini Jagarlamudi

*/

px.import({
  scene: 'px:scene.1.js',
  keys: 'px:tools.keys.js',
}).then(function (imports) {
  var scene = imports.scene;
  var keys = imports.keys;
  var leftMargine = 75;
  const linear = scene.animation.LINEAR
  const op_o = scene.animation.OPTION_OSCILLATE

  function clamp(v, min, max) {
      return Math.min(Math.max(min, v), max);
  }

  let container = scene.create({ t: "object", parent: scene.root, w: scene.w, h: scene.h });

  function ListView(param) {
      this.itemWidth = param.itemWidth;
      this.itemHeight = param.itemHeight;
      this.spacing = 20;
      this.offsetItems = 5;
      this.previousIndex = 0;
      this.currentIndex = 0;
      this.model = param.model;
      this.children = [];
      this.imageObject = [];
      this.totalElements = this.model.length

      this.container = scene.create({ t: "object", parent: param.parent, x: param.x, y: param.y, w: param.w, h: param.h});
      this.scrolledView = scene.create({ t: "object", parent: this.container, interactive: false });
      this.title = scene.create({
          t: "textBox", parent: this.container, w: this.container.w, h: 40, textColor: 0xFFFFFFFF, y: 230,
          pixelSize: 30, alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER, interactive: false
      });
      this.subTitle = scene.create({
          t: "textBox", parent: this.container, w: this.container.w, h: 40, textColor: 0xFFFFFFFF, y: 260,
          pixelSize: 20, alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER, interactive: false
      });

      this.ListViewItem = function (param) {
          this.index = param.index;
          this.title = param.title;
          this.id = param.id;
          this.description = param.description;
          this.url = param.url;
          this.stream = param.stream;

          this.background = scene.create({
              t: "rect", parent: param.parent, w: param.w, h: param.h, x: param.x, y: param.y, fillColor: "#2f3238", lineColor: 0xFF000000, lineWidth: 3, interactive: false
          });
          this.image = scene.create({
              t: "image", parent: this.background, w: param.w / 2, h: param.h / 2, x: param.w / 4, y: param.h / 4,
              url: param.url, stretchX: scene.stretch.STRETCH, stretchY: scene.stretch.STRETCH, interactive: false
          })
          this.onEnter = function () {
              playerLaunched = true
              eventManager.fireEvent(eventManager.LAUNCH_PLAYER, { id: this.id, url: this.url, stream: this.stream });
          }
      };
      var doFocus = (o) => {
          this.layout(keys.RIGHT);
          const row = this.children[this.currentIndex];
          this.title.text = row.title
          this.subTitle.text = row.description
          this.subTitle.w = scene.w // hack hack
          this.title.w = scene.w
          o.target.lineColor = 0xFF0000FF
      };
      var doBlur = (o) => {
          o.target.lineColor = 0xFF000000
      };
      this.populate = function (loadedaAll) {
          var i;
          for (i = 0; i < this.totalElements; i++) {
              var modelData = this.model[i % this.totalElements];
              this.createItem(i, modelData)
          }
      };
      this.setModel = function (_model) {
          if (!_model)
            _model = model
          this.scrolledView.removeAll();
          this.model = _model;
          this.children = [];
          this.totalElements = this.model.length
          this.currentIndex = 0;
          this.populate();
          this.setFocus(true)
          this.subTitle.w = scene.w // hack hack
          this.title.w = scene.w
      }
      this.createItem = function (i, modelData) {
          var id;
          var title;
          var url;
          var description;
          var stream;
          id = modelData.id || modelData.contentId;
          title = modelData.name || modelData.label;
          url = modelData.logo || modelData.imagePath;
          description = modelData.description || modelData.subLabel;
          stream = '';

          var item = new this.ListViewItem({
              this: this, parent: this.scrolledView, index: i, w: this.itemWidth, h: this.itemHeight,
              x: (i > 4 ? 6 : i) * (this.itemWidth + this.spacing), y: 0, title: title, url: url, description: description,
              id: id, stream: stream
          });

          item.background.on('onFocus', doFocus);
          item.background.on('onBlur', doBlur);

          this.children.push(item);
      }
      this.selectItem = function (i, code) {
          const row = this.children[i];
          this.currentIndex = i;
          row.background.focus = true
          this.previousIndex = this.currentIndex;
      };
      this.layout = function (focus = true) {
          let row = this.children[this.currentIndex];
          for (var i = 0; i < this.children.length; i++) {
              var child = this.children[i];
              var diff = i - this.currentIndex;
              var background = child.background;
              var totalWidth = this.itemWidth + this.spacing;
              if (i == this.currentIndex) {
                  background.animate({ x: 0 }, 0.2, linear, op_o);
              }
              else if (i > this.currentIndex && diff <= 5) {
                  if (diff == 5)
                      background.animate({ x: (diff + 1) * totalWidth }, 0.2, linear, op_o);
                  else
                      background.animate({ x: (diff) * totalWidth }, 0.2, linear, op_o);
              }
              else if (i < this.currentIndex && this.currentIndex - i <= 2) {
                  background.animate({ x: -2 * totalWidth }, 0.2, linear, op_o);
              }
          }
      };
      this.setFocus = function (value) {
          if (value) {
              this.children[this.currentIndex].background.focus = true
          }
          else {
              this.children[this.currentIndex].background.focus = false
          }
      };
      this.onEnter = function () {
          this.children[this.currentIndex].onEnter();
      }
  }

  var model = [
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      }]
  var listview = new ListView({ parent: container, x: leftMargine, y: 0, w: container.w - leftMargine * 2, h: 206, model: model, itemWidth: 206, itemHeight: 206 });
  listview.container.on("onKeyDown", (e) => {
      let keycode = e.keyCode;

      if (keycode == keys.LEFT) {
          listview.selectItem(clamp(listview.currentIndex - 1, 0, listview.totalElements - 1), keycode);
          e.stopPropagation();
      }
      else if (keycode == keys.RIGHT) {
          listview.selectItem(clamp(listview.currentIndex + 1, 0, listview.totalElements - 1), keycode);
          e.stopPropagation();
      }
      /*
      else if (keycode == keys.UP) {
          e.stopPropagation();
      }
    */
      else if (keycode == keys.ENTER) {
          listview.onEnter()
          e.stopPropagation();
      }
  });
  listview.populate(true);
  //container.focus = true
  //listview.container.focus=true
  listview.setFocus(true);


  function setModel(model) {
      listview.setModel(model)
  }

  scene.on('onResize', e=>{
    listview.title.w = scene.w
    listview.subTitle.w = scene.w
  })
  module.exports.setModel = setModel;
});