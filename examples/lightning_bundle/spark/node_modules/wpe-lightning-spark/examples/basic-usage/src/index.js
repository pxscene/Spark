import Launcher from 'wpe-lightning-spark/src/utils/Launcher.mjs';
import App from './App'

Launcher.launchApplication(
    App,
    {},
    app => {
        app.splashLoader();
        app.startUp()
            .then(() => app.splashLanding());
    });
