// Simplest gl example that creates a gl context and fills it with red
var options = {width: 1280, height: 720, title: "Red", fullscreen: false};
var gl = sparkgles2.init(options);

gl.clearColor(1,0,0,1);
gl.viewport(0, 0, 1280, 720);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);