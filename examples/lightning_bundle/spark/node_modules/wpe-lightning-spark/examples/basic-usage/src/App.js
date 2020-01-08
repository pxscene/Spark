import lng from "wpe-lightning";

export default class App extends lng.Application {

    static getFonts() {
        return [{family: 'RobotoRegular', url: 'http://localhost:8080/static/fonts/roboto-regular.ttf', descriptors: {}}];
    }

    static _template() {
        return {
            x: 0, y: 0, w: 1920, h: 1080,
            Background: {
                x: 0, y: 0, w: 1920, h: 1080,
                rect: true,
                color: 0xFF191919,
            },
            Loader: {
                x: 55, y: 75, w: 774, h: 40,
                alpha: 0,
                text: {
                    fontFace: 'RobotoRegular',
                    fontSize: 24,
                    text: 'Loading',
                    textColor: 0xFFAAAAAA,
                },
            },
            LandingPage: {
                x: 55, y: 75, w: 774, h: 40,
                alpha: 0,
                text: {
                    fontFace: 'RobotoRegular',
                    fontSize: 24,
                    text: 'Hello World',
                    textColor: 0xFFAAAAAA,
                },
            },
        }
    }

    splashLoader() {
        this.patch({Loader: {alpha: 1}});
    }

    startUp() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    splashLanding() {
        this.patch({Loader: {alpha: 0}, LandingPage: {alpha: 1}})
    }
}
