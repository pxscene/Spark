import DevLauncher from './DevLauncher.mjs';
import App from "./src/app.mjs";

const launcher = new DevLauncher();

sparkview.on('onKeyDown', function(e) {
    console.log('webgl onKeyDown keyCode:', e.keyCode);
    launcher._handleKey(e);
});

launcher.launch(App, {debug:false, h:sparkscene.h}, {useInspector: false});
