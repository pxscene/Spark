export default class MyApp extends ux.App {
    static _template() {
        return {
            Image1: { src: MyApp.getPath("pebbles.jpg"), w:450, h:450},
            Image2: {src: MyApp.getPath("pebbles.jpg"), color: 0xFFAAAAAA, mode: 0, pivot: 0, scale: 1, w:450, h:450, x: 500},
            Image3: {src: MyApp.getPath("pebbles.jpg"), color: 0xFFAAAAAA, mode: 1, pivot: 0, scale: 1, w:450, h:450, y: 500},
            Text1: {color: 0xff00B74F, text: {text: "Hello World"}},
            Text2: {color: 0xff00B74F, text: {text: "Hello World with mode 1"}, mode: 0, x:500},
            Text3: {color: 0xff00B74F, text: {text: "Hello World with mode 0"}, mode: 1, y:500},
        };
    }
}

MyApp.COLORS = {
    BACKGROUND: 0xff282e32
};
