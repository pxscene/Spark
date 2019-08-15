var lng = (function () {
  'use strict';

  class Demo {

    constructor(options = {}) {
      this.options = options;
      this.gl = sparkgles2.init(this.options.initOptions);

      setInterval(this.drawScene.bind(this), this.options.interval);
    }

    drawScene() {
      this.gl.viewport(0, 0, this.options.initOptions.width, this.options.initOptions.height);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
    }
  }

  return {
    Demo
  };

}());
